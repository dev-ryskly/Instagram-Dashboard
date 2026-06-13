from database.postgres import Base
from database.postgres import engine
from database.models.analytics import InstagramAnalyticsDB
from database.models.post import InstagramPostDB
from database.models.profile import InstagramProfileDB


def init_db() -> None:
    Base.metadata.create_all(bind=engine)
