from datetime import datetime

from sqlalchemy import Column
from sqlalchemy import DateTime
from sqlalchemy import Integer
from sqlalchemy import String

from database.postgres import Base


class ReelVisitDB(Base):
    __tablename__ = "reel_visits"

    id = Column(Integer, primary_key=True)

    reel_id = Column(String, nullable=False)

    slug = Column(String, nullable=False)

    visited_at = Column(
        DateTime,
        default=datetime.utcnow,
    )

    user_agent = Column(String)

    ip_address = Column(String)