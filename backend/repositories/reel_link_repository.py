from sqlalchemy.orm import Session

from database.models.reel_link import ReelLinkDB


def create_reel_link(
    db: Session,
    reel_id: str,
    campaign_name: str,
    slug: str,
    destination_url: str,
):
    reel_link = ReelLinkDB(
        reel_id=reel_id,
        campaign_name=campaign_name,
        slug=slug,
        destination_url=destination_url,
    )

    db.add(reel_link)
    db.commit()
    db.refresh(reel_link)

    return reel_link


def get_all_reel_links(
    db: Session,
):
    return (
        db.query(ReelLinkDB)
        .order_by(ReelLinkDB.id.desc())
        .all()
    )


def delete_reel_link(
    db: Session,
    reel_id: str,
):
    reel_link = (
        db.query(ReelLinkDB)
        .filter(ReelLinkDB.reel_id == reel_id)
        .first()
    )

    if reel_link:
        db.delete(reel_link)
        db.commit()
        return True

    return False