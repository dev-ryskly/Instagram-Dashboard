from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String

from database.postgres import Base


class ReelLinkDB(Base):
    __tablename__ = "reel_links"

    id = Column(Integer, primary_key=True)

    reel_id = Column(String, nullable=False)

    campaign_name = Column(String, nullable=False)

    slug = Column(String, unique=True, nullable=False)

    destination_url = Column(String, nullable=False)