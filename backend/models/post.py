from pydantic import BaseModel, Field


class InstagramPost(BaseModel):
    id: int = Field(..., description="Post identifier")
    caption: str = Field(..., description="Post caption")
    likes: int = Field(..., description="Total likes")
    comments: int = Field(..., description="Total comments")
    shares: int = Field(..., description="Total shares")
    saves: int = Field(..., description="Total saves")
    reach: int = Field(..., description="Total reach")