from typing import Optional

from sqlalchemy.orm import Session

from database.models.profile import InstagramProfileDB


def create_profile_snapshot(
    db: Session,
    followers: int,
    following: int,
    engagement_rate: float,
    profile_visits: int,
) -> InstagramProfileDB:
    profile = InstagramProfileDB(
        followers=followers,
        following=following,
        engagement_rate=engagement_rate,
        profile_visits=profile_visits,
    )
    db.add(profile)
    db.commit()
    db.refresh(profile)
    return profile


def get_latest_profile_snapshot(db: Session) -> Optional[InstagramProfileDB]:
    return db.query(InstagramProfileDB).order_by(InstagramProfileDB.created_at.desc()).first()