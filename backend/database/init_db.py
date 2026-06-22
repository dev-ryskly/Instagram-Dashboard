from database.postgres import Base
from database.postgres import engine

from database.models.analytics import InstagramAnalyticsDB
from database.models.conversion import ConversionDB
from database.models.post import InstagramPostDB
from database.models.profile import InstagramProfileDB
from database.models.reel_link import ReelLinkDB
from database.models.reel_visit import ReelVisitDB
from database.models.tracking_config import TrackingConfigDB


def init_db() -> None:
    Base.metadata.create_all(bind=engine)