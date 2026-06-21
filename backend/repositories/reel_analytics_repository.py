from sqlalchemy.orm import Session

from database.models.reel_visit import ReelVisitDB


def get_reel_stats(
    db: Session,
    reel_id: str,
):
    visits = (
        db.query(ReelVisitDB)
        .filter(ReelVisitDB.reel_id == reel_id)
        .all()
    )

    total_clicks = len(visits)

    unique_visitors = len(
        set(
            visit.ip_address
            for visit in visits
            if visit.ip_address
        )
    )

    last_click = None

    if visits:
        last_click = max(
            visit.visited_at
            for visit in visits
        )

    return {
        "reel_id": reel_id,
        "total_clicks": total_clicks,
        "unique_visitors": unique_visitors,
        "last_click": last_click,
    }