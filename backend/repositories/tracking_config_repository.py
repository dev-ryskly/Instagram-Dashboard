from sqlalchemy.orm import Session

from database.models.tracking_config import TrackingConfigDB


def get_or_create_config(db: Session) -> TrackingConfigDB:
    """
    Returns the single tracking config row, creating it with safe
    defaults if it does not yet exist.
    """
    config = db.query(TrackingConfigDB).first()
    if not config:
        config = TrackingConfigDB(
            active_reel_id=None,
            tracking_enabled=False,
            destination_url="",
        )
        db.add(config)
        db.commit()
        db.refresh(config)
    return config


def update_config(
    db: Session,
    active_reel_id: str | None = None,
    tracking_enabled: bool | None = None,
    destination_url: str | None = None,
) -> TrackingConfigDB:
    config = get_or_create_config(db)

    if active_reel_id is not None:
        config.active_reel_id = active_reel_id
    if tracking_enabled is not None:
        config.tracking_enabled = tracking_enabled
    if destination_url is not None:
        config.destination_url = destination_url

    db.commit()
    db.refresh(config)
    return config
