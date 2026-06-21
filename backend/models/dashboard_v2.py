from pydantic import BaseModel
from pydantic import Field


class ReelDashboardItem(BaseModel):
    reel_id: str = Field(
        ...,
        description="Instagram media ID (join key)",
    )

    thumbnail_url: str | None = Field(
        None,
        description="Thumbnail URL from Instagram",
    )

    caption: str | None = Field(
        None,
        description="Post caption",
    )

    timestamp: str | None = Field(
        None,
        description="Instagram post timestamp",
    )

    media_type: str = Field(
        ...,
        description="Media type: REELS, IMAGE, VIDEO, CAROUSEL_ALBUM",
    )

    # Instagram engagement metrics
    views: int = Field(0, description="Total video views")
    reach: int = Field(0, description="Unique accounts reached")
    likes: int = Field(0, description="Total likes")
    comments: int = Field(0, description="Total comments")
    shares: int = Field(0, description="Total shares")
    saves: int = Field(0, description="Total saves")

    # Local tracking metrics
    click_count: int = Field(0, description="Total tracking link clicks")
    conversion_count: int = Field(0, description="Total conversions")
    conversion_rate: float = Field(0.0, description="Conversions divided by clicks")
    has_tracking: bool = Field(
        False,
        description="True if a reel_link exists for this reel_id",
    )


class DashboardV2Response(BaseModel):
    total_reels: int = Field(..., description="Total number of Instagram posts returned")
    total_clicks: int = Field(..., description="Total tracking link clicks across all reels")
    total_conversions: int = Field(..., description="Total conversions across all reels")
    conversion_rate: float = Field(..., description="Overall conversion rate")
    reels: list[ReelDashboardItem] = Field(
        ...,
        description="All Instagram reels with merged engagement + tracking data",
    )
