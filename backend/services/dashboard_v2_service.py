from collections import defaultdict
from concurrent.futures import ThreadPoolExecutor, as_completed

from sqlalchemy.orm import Session

from models.dashboard_v2 import DashboardV2Response
from models.dashboard_v2 import ReelDashboardItem
from repositories.conversion_repository import get_all_conversions
from repositories.reel_link_repository import get_all_reel_links
from repositories.reel_visit_repository import get_all_visits
from services.composio_client import ComposioClient
from services.instagram_service import get_posts

_INSIGHT_METRICS = [
    "views",
    "reach",
    "likes",
    "comments",
    "shares",
    "saved",
]


def _extract_metric(insights_data: list[dict], name: str) -> int:
    """
    Walk the Composio insights list and return the first value
    for the named metric, defaulting to 0 if absent or empty.
    """
    for item in insights_data:
        if item.get("name") == name:
            values = item.get("values", [])
            if values:
                return int(values[0].get("value", 0))
    return 0


def _fetch_insights(client: ComposioClient, media_id: str) -> list[dict]:
    """
    Fetch raw insights for a single media ID.
    Returns the inner data list, or [] on any error.
    """
    try:
        raw = client.get_instagram_post_insights(
            media_id=media_id,
            metrics=_INSIGHT_METRICS,
        )
        return raw.get("data", {}).get("data", [])
    except Exception as exc:
        print(f"[dashboard_v2] insights fetch failed for {media_id}: {exc}")
        return []


def get_dashboard_v2(db: Session) -> DashboardV2Response:
    # ── 1. Fetch all Instagram posts ──────────────────────────────────────
    posts: list[dict] = get_posts()

    # ── 2. Load local tracking data in bulk (no N+1) ─────────────────────
    all_visits = get_all_visits(db)
    all_conversions = get_all_conversions(db)
    all_links = get_all_reel_links(db)

    visits_by_reel: dict[str, int] = defaultdict(int)
    for visit in all_visits:
        visits_by_reel[visit.reel_id] += 1

    conversions_by_reel: dict[str, int] = defaultdict(int)
    for conversion in all_conversions:
        conversions_by_reel[conversion.reel_id] += 1

    tracked_reel_ids: set[str] = {link.reel_id for link in all_links}

    # ── 3. Fetch Instagram insights in PARALLEL (fixes N+1 serial slowness) ──
    client = ComposioClient()

    valid_posts = [p for p in posts if p.get("id")]

    # Fetch all insights concurrently — turns N serial requests into 1 batch wait
    insights_by_id: dict[str, list[dict]] = {}
    max_workers = min(len(valid_posts), 10)  # cap at 10 concurrent threads
    if valid_posts:
        with ThreadPoolExecutor(max_workers=max_workers) as executor:
            future_to_id = {
                executor.submit(_fetch_insights, client, post["id"]): post["id"]
                for post in valid_posts
            }
            for future in as_completed(future_to_id):
                media_id = future_to_id[future]
                try:
                    insights_by_id[media_id] = future.result()
                except Exception as exc:
                    print(f"[dashboard_v2] parallel fetch error for {media_id}: {exc}")
                    insights_by_id[media_id] = []

    # ── 4. Build items from cached insights ───────────────────────────────
    items: list[ReelDashboardItem] = []

    for post in valid_posts:
        media_id: str = post["id"]
        insights_list = insights_by_id.get(media_id, [])

        clicks = visits_by_reel[media_id]
        convs = conversions_by_reel[media_id]
        rate = round(convs / clicks, 4) if clicks > 0 else 0.0

        items.append(
            ReelDashboardItem(
                reel_id=media_id,
                thumbnail_url=post.get("thumbnail_url"),
                caption=post.get("caption"),
                timestamp=post.get("timestamp"),
                media_type=post.get("media_type", "UNKNOWN"),
                views=_extract_metric(insights_list, "views"),
                reach=_extract_metric(insights_list, "reach"),
                likes=_extract_metric(insights_list, "likes"),
                comments=_extract_metric(insights_list, "comments"),
                shares=_extract_metric(insights_list, "shares"),
                saves=_extract_metric(insights_list, "saved"),
                click_count=clicks,
                conversion_count=convs,
                conversion_rate=rate,
                has_tracking=media_id in tracked_reel_ids,
            )
        )

    # ── 5. Compute aggregates ─────────────────────────────────────────────
    total_clicks = sum(item.click_count for item in items)
    total_conversions = sum(item.conversion_count for item in items)
    overall_rate = (
        round(total_conversions / total_clicks, 4) if total_clicks > 0 else 0.0
    )

    return DashboardV2Response(
        total_reels=len(items),
        total_clicks=total_clicks,
        total_conversions=total_conversions,
        conversion_rate=overall_rate,
        reels=items,
    )
