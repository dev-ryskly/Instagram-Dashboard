from sqlalchemy.orm import Session

from repositories.conversion_repository import get_conversions_by_reel
from repositories.reel_analytics_repository import get_reel_stats
from services.composio_client import ComposioClient

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
    Composio returns insights as a list of objects:
      [{ "name": "views", "values": [{ "value": 123 }], ... }, ...]

    Extract the first value for the named metric, defaulting to 0.
    """
    for item in insights_data:
        if item.get("name") == name:
            values = item.get("values", [])
            if values:
                return int(values[0].get("value", 0))
    return 0


def get_reel_detail(db: Session, media_id: str) -> dict:
    client = ComposioClient()

    raw = client.get_instagram_post_insights(
        media_id=media_id,
        metrics=_INSIGHT_METRICS,
    )

    insights_list: list[dict] = raw.get("data", {}).get("data", [])

    views       = _extract_metric(insights_list, "views")
    reach       = _extract_metric(insights_list, "reach")
    likes       = _extract_metric(insights_list, "likes")
    comments    = _extract_metric(insights_list, "comments")
    shares      = _extract_metric(insights_list, "shares")
    saves       = _extract_metric(insights_list, "saved")

    stats = get_reel_stats(db=db, reel_id=media_id)
    click_count: int = stats.get("total_clicks", 0)

    conversions = get_conversions_by_reel(db=db, reel_id=media_id)
    conversion_count = len(conversions)

    conversion_rate = (
        conversion_count / click_count if click_count > 0 else 0.0
    )

    return {
        "reel_id":          media_id,
        "views":            views,
        "reach":            reach,
        "likes":            likes,
        "comments":         comments,
        "shares":           shares,
        "saves":            saves,
        "click_count":      click_count,
        "conversion_count": conversion_count,
        "conversion_rate":  conversion_rate,
    }
