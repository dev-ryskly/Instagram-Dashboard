from collections import defaultdict

from sqlalchemy.orm import Session

from database.models.reel_visit import ReelVisitDB


def get_reel_timeline(
    db: Session,
    reel_id: str,
):
    visits = (
        db.query(ReelVisitDB)
        .filter(ReelVisitDB.reel_id == reel_id)
        .all()
    )

    clicks_by_day = defaultdict(int)

    for visit in visits:
        day = visit.visited_at.strftime("%Y-%m-%d")
        clicks_by_day[day] += 1

    return [
        {
            "date": date,
            "clicks": clicks,
        }
        for date, clicks in sorted(clicks_by_day.items())
    ]