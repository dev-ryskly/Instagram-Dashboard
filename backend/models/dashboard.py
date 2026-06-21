from datetime import datetime

from pydantic import BaseModel
from pydantic import Field


class DashboardReelSummary(BaseModel):
    reel_id: str = Field(..., description="Instagram reel ID")
    campaign_name: str = Field(..., description="Campaign name for the tracking link")
    slug: str = Field(..., description="URL slug for the tracking link")
    total_clicks: int = Field(..., description="Total number of tracked clicks")
    total_conversions: int = Field(..., description="Total number of conversions")
    conversion_rate: float = Field(..., description="Conversions divided by clicks")


class RecentClick(BaseModel):
    reel_id: str = Field(..., description="Instagram reel ID")
    slug: str = Field(..., description="URL slug that was clicked")
    visited_at: datetime = Field(..., description="Timestamp of the visit")


class DashboardResponse(BaseModel):
    total_reels: int = Field(..., description="Total number of tracked reels")
    total_clicks: int = Field(..., description="Total clicks across all reels")
    total_conversions: int = Field(..., description="Total conversions across all reels")
    conversion_rate: float = Field(..., description="Overall conversions divided by clicks")
    top_reels: list[DashboardReelSummary] = Field(
        ...,
        description="Top performing reels sorted by total clicks descending",
    )
    recent_clicks: list[RecentClick] = Field(
        ...,
        description="Most recent clicks across all reels",
    )
