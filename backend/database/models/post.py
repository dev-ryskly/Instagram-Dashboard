from datetime import datetime, timezone
from typing import Any

from sqlalchemy import DateTime, Integer, JSON, String
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column

from database.postgres import Base


class InstagramPostDB(Base):
    __tablename__ = "instagram_posts"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    post_id: Mapped[str] = mapped_column(String, nullable=False, index=True)
    caption: Mapped[str] = mapped_column(String, nullable=False)
    likes: Mapped[int] = mapped_column(Integer, nullable=False)
    comments: Mapped[int] = mapped_column(Integer, nullable=False)
    shares: Mapped[int] = mapped_column(Integer, nullable=False)
    saves: Mapped[int] = mapped_column(Integer, nullable=False)
    reach: Mapped[int] = mapped_column(Integer, nullable=False)
    hourly_like_updates: Mapped[list[dict[str, Any]]] = mapped_column(
        JSON,
        nullable=False,
        default=list,
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
    
