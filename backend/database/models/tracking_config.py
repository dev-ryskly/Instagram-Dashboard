from sqlalchemy import Boolean
from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String

from database.postgres import Base


class TrackingConfigDB(Base):
    __tablename__ = "tracking_config"

    id = Column(Integer, primary_key=True)

    # The reel currently being tracked. Null means no reel selected.
    active_reel_id = Column(String, nullable=True)

    # When False, /r/studojo still redirects but does NOT record a click.
    tracking_enabled = Column(Boolean, nullable=False, default=False)

    # Where /r/studojo always redirects.
    destination_url = Column(String, nullable=False, default="")
