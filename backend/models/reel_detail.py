from pydantic import BaseModel
from pydantic import Field


class ReelDetailResponse(BaseModel):
    reel_id: str = Field(
        ...,
        description="Instagram media ID",
    )

    views: int = Field(
        ...,
        description="Total video views",
    )

    reach: int = Field(
        ...,
        description="Unique accounts reached",
    )

    likes: int = Field(
        ...,
        description="Total likes",
    )

    comments: int = Field(
        ...,
        description="Total comments",
    )

    shares: int = Field(
        ...,
        description="Total shares",
    )

    saves: int = Field(
        ...,
        description="Total saves",
    )

    click_count: int = Field(
        ...,
        description="Total tracking link clicks from local DB",
    )

    conversion_count: int = Field(
        ...,
        description="Total conversions from local DB",
    )

    conversion_rate: float = Field(
        ...,
        description="Conversions divided by clicks (0.0 if no clicks)",
    )
