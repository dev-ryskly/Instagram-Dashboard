from pydantic import BaseModel
from pydantic import Field


class CreateInstagramMediaRequest(BaseModel):
    image_url: str | None = Field(
        default=None,
        description="Public image URL",
    )

    video_url: str | None = Field(
        default=None,
        description="Public video URL",
    )

    caption: str | None = Field(
        default=None,
        description="Instagram caption",
    )

    media_type: str | None = Field(
        default=None,
        description="REELS, CAROUSEL, STORIES",
    )