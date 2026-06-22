from typing import Any

from pydantic import BaseModel
from pydantic import Field


class PublishAndTrackRequest(BaseModel):
    image_url: str | None = Field(
        default=None,
        description="Public image URL",
    )

    video_url: str | None = Field(
        default=None,
        description="Public video URL",
    )

    media_urls: list[str] | None = Field(
        default=None,
        description="List of public media URLs for carousel posts",
    )

    caption: str | None = Field(
        default=None,
        description="Instagram caption",
    )

    media_type: str | None = Field(
        default=None,
        description="Media type: REELS, CAROUSEL, STORIES",
    )

    campaign_name: str = Field(
        ...,
        description="Campaign name for the tracking link",
    )

    destination_url: str = Field(
        ...,
        description="Redirect destination URL for the tracking link",
    )


class PublishAndTrackResponse(BaseModel):
    reel_id: str = Field(
        ...,
        description="Published Instagram media ID",
    )

    slug: str = Field(
        ...,
        description="Generated tracking slug",
    )

    tracking_url: str = Field(
        ...,
        description="Full tracking URL path e.g. /r/{slug}",
    )

    instagram_publish_result: dict[str, Any] = Field(
        ...,
        description="Raw result returned by the Instagram publish API",
    )
