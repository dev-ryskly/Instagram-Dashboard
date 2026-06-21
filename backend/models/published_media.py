from pydantic import BaseModel
from pydantic import Field


class PublishedInstagramMedia(BaseModel):
    id: str = Field(
        ...,
        description="Published Instagram media ID",
    )