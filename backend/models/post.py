from pydantic import BaseModel
from pydantic import Field


class InstagramPost(BaseModel):
    id: str = Field(..., description="Instagram media id")
    caption: str | None = Field(None, description="Post caption")
    media_type: str = Field(..., description="IMAGE, VIDEO, CAROUSEL_ALBUM")
    media_url: str | None = Field(None, description="Media URL")
    permalink: str | None = Field(None, description="Instagram permalink")
    thumbnail_url: str | None = Field(None, description="Thumbnail URL")
    timestamp: str | None = Field(None, description="Post timestamp")
    username: str | None = Field(None, description="Instagram username")


class InsightPoint(BaseModel):
    value: int | float | str
    end_time: str | None = None


class InstagramPostInsight(BaseModel):
    name: str
    title: str
    description: str
    values: list[InsightPoint] = Field(default_factory=list)