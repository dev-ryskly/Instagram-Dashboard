from sqlalchemy.orm import Session

from database.models.post import InstagramPostDB


def create_post_snapshot(
    db: Session,
    post_id: str,
    caption: str,
    likes: int,
    comments: int,
    shares: int,
    saves: int,
    reach: int,
    hourly_like_updates: list[dict[str, object]] | None = None,
) -> InstagramPostDB:
    post = InstagramPostDB(
        post_id=post_id,
        caption=caption,
        likes=likes,
        comments=comments,
        shares=shares,
        saves=saves,
        reach=reach,
        hourly_like_updates=hourly_like_updates or [],
    )
    db.add(post)
    db.commit()
    db.refresh(post)
    return post


def get_latest_posts(db: Session, limit: int = 20) -> list[InstagramPostDB]:
    return (
        db.query(InstagramPostDB)
        .order_by(InstagramPostDB.created_at.desc())
        .limit(limit)
        .all()
    )
