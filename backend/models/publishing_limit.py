from pydantic import BaseModel
from pydantic import Field


class InstagramPublishingLimit(BaseModel):
    quota_total: int = Field(
        ...,
        description="Maximum posts allowed in the quota window",
    )
    quota_usage: int = Field(
        ...,
        description="Posts already published in the quota window",
    )
    quota_remaining: int = Field(
        ...,
        description="Posts remaining in the quota window",
    )
    quota_duration: int = Field(
        ...,
        description="Quota window duration in seconds",
    )