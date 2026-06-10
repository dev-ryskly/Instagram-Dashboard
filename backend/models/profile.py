from pydantic import BaseModel, Field


class InstagramProfile(BaseModel):
    followers: int = Field(..., description="Total Instagram followers")
    following: int = Field(..., description="Total Instagram accounts followed")
    engagement_rate: float = Field(..., description="Average engagement rate")
    profile_visits: int = Field(..., description="Total profile visits")