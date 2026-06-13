from typing import Optional

from sqlalchemy.orm import Session

from database.models.analytics import InstagramAnalyticsDB


def create_analytics_snapshot(
    db: Session,
    followers: int,
    engagement_rate: float,
    profile_visits: int,
) -> InstagramAnalyticsDB:
    analytics = InstagramAnalyticsDB(
        followers=followers,
        engagement_rate=engagement_rate,
        profile_visits=profile_visits,
    )
    db.add(analytics)
    db.commit()
    db.refresh(analytics)
    return analytics


def get_latest_analytics_snapshot(db: Session) -> Optional[InstagramAnalyticsDB]:
    return (
        db.query(InstagramAnalyticsDB)
        .order_by(InstagramAnalyticsDB.recorded_at.desc())
        .first()
    )
