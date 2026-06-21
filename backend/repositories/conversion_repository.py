from sqlalchemy.orm import Session

from database.models.conversion import ConversionDB


def create_conversion(
    db: Session,
    reel_id: str,
    name: str | None,
    email: str | None,
    phone: str | None,
):
    conversion = ConversionDB(
        reel_id=reel_id,
        name=name,
        email=email,
        phone=phone,
    )

    db.add(conversion)
    db.commit()
    db.refresh(conversion)

    return conversion


def get_conversions_by_reel(
    db: Session,
    reel_id: str,
):
    return (
        db.query(ConversionDB)
        .filter(ConversionDB.reel_id == reel_id)
        .all()
    )


def get_all_conversions(
    db: Session,
) -> list[ConversionDB]:
    return (
        db.query(ConversionDB)
        .order_by(ConversionDB.created_at.desc())
        .all()
    )