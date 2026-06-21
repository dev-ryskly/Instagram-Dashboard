from collections import defaultdict

from sqlalchemy.orm import Session

from models.dashboard import DashboardReelSummary
from models.dashboard import DashboardResponse
from models.dashboard import RecentClick
from repositories.conversion_repository import get_all_conversions
from repositories.reel_link_repository import get_all_reel_links
from repositories.reel_visit_repository import get_all_visits
from repositories.reel_visit_repository import get_recent_visits


def _compute_conversion_rate(
    total_clicks: int,
    total_conversions: int,
) -> float:
    if total_clicks == 0:
        return 0.0

    return round(total_conversions / total_clicks, 4)


def _rank_reels(
    links,
    visits_by_reel,
    conversions_by_reel,
) -> list[DashboardReelSummary]:
    summaries = []

    for link in links:
        clicks = len(visits_by_reel[link.reel_id])
        conversions = len(conversions_by_reel[link.reel_id])

        summaries.append(
            DashboardReelSummary(
                reel_id=link.reel_id,
                campaign_name=link.campaign_name,
                slug=link.slug,
                total_clicks=clicks,
                total_conversions=conversions,
                conversion_rate=_compute_conversion_rate(clicks, conversions),
            )
        )

    summaries.sort(key=lambda s: s.total_clicks, reverse=True)

    return summaries[:5]


def get_dashboard_summary(db: Session) -> DashboardResponse:
    links = get_all_reel_links(db)
    visits = get_all_visits(db)
    conversions = get_all_conversions(db)
    recent = get_recent_visits(db, limit=10)

    visits_by_reel = defaultdict(list)
    for visit in visits:
        visits_by_reel[visit.reel_id].append(visit)

    conversions_by_reel = defaultdict(list)
    for conversion in conversions:
        conversions_by_reel[conversion.reel_id].append(conversion)

    total_reels = len(links)
    total_clicks = len(visits)
    total_conversions = len(conversions)

    return DashboardResponse(
        total_reels=total_reels,
        total_clicks=total_clicks,
        total_conversions=total_conversions,
        conversion_rate=_compute_conversion_rate(total_clicks, total_conversions),
        top_reels=_rank_reels(links, visits_by_reel, conversions_by_reel),
        recent_clicks=[
            RecentClick(
                reel_id=visit.reel_id,
                slug=visit.slug,
                visited_at=visit.visited_at,
            )
            for visit in recent
        ],
    )
