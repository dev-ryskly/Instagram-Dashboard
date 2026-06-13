from typing import Optional

from pydantic import BaseModel, Field


class InstagramProfile(BaseModel):
    username: str = Field(..., description="Instagram username")
    account_type: str = Field(..., description="Instagram account type")
    biography: Optional[str] = Field(
        None,
        description="Instagram biography",
    )
    followers_count: int = Field(
        ...,
        description="Total Instagram followers",
    )
    follows_count: int = Field(
        ...,
        description="Total Instagram accounts followed",
    )
    media_count: int = Field(
        ...,
        description="Total number of Instagram posts",
    )
    instagram_id: str = Field(
        ...,
        description="Instagram account identifier",
    )