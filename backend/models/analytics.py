from pydantic import BaseModel, Field


class AnalyticsPoint(BaseModel):
    date: str = Field(..., description="Date for the analytics point")
    value: int = Field(..., description="Value recorded at the given date")


class InstagramAnalytics(BaseModel):
    follower_growth: list[AnalyticsPoint] = Field(..., description="Follower growth trend over time")
    engagement_trend: list[AnalyticsPoint] = Field(..., description="Engagement trend over time")
    profile_visits_trend: list[AnalyticsPoint] = Field(..., description="Profile visits trend over time")