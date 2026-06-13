from datetime import datetime, timezone

from sqlalchemy import DateTime, Float, Integer
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column

from database.postgres import Base


class InstagramAnalyticsDB(Base):
    __tablename__ = "instagram_analytics"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    followers: Mapped[int] = mapped_column(Integer, nullable=False)
    engagement_rate: Mapped[float] = mapped_column(Float, nullable=False)
    profile_visits: Mapped[int] = mapped_column(Integer, nullable=False)
    recorded_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )