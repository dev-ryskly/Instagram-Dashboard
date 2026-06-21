from sqlalchemy.orm import Session

from database.models.reel_visit import ReelVisitDB


def create_visit(
    db: Session,
    reel_id: str,
    slug: str,
    user_agent: str | None,
    ip_address: str | None,
) -> ReelVisitDB:
    visit = ReelVisitDB(
        reel_id=reel_id,
        slug=slug,
        user_agent=user_agent,
        ip_address=ip_address,
    )

    db.add(visit)
    db.commit()
    db.refresh(visit)

    return visit


def get_all_visits(
    db: Session,
) -> list[ReelVisitDB]:
    return (
        db.query(ReelVisitDB)
        .order_by(ReelVisitDB.visited_at.desc())
        .all()
    )


def get_recent_visits(
    db: Session,
    limit: int = 10,
) -> list[ReelVisitDB]:
    return (
        db.query(ReelVisitDB)
        .order_by(ReelVisitDB.visited_at.desc())
        .limit(limit)
        .all()
    )