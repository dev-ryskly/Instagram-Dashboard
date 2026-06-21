from datetime import datetime

from sqlalchemy import Column
from sqlalchemy import DateTime
from sqlalchemy import Integer
from sqlalchemy import String

from database.postgres import Base


class ConversionDB(Base):
    __tablename__ = "conversions"

    id = Column(Integer, primary_key=True)

    reel_id = Column(String, nullable=False)

    name = Column(String)

    email = Column(String)

    phone = Column(String)

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
    )