from pydantic import BaseModel
from pydantic import Field


class CreateReelLinkRequest(BaseModel):
    reel_id: str = Field(...)
    campaign_name: str = Field(...)
    slug: str = Field(...)
    destination_url: str = Field(...)