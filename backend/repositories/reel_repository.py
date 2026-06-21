from sqlalchemy.orm import Session

from database.models.reel_link import ReelLinkDB


def get_reel_link_by_slug(
    db: Session,
    slug: str,
) -> ReelLinkDB | None:
    return (
        db.query(ReelLinkDB)
        .filter(ReelLinkDB.slug == slug)
        .first()
    )