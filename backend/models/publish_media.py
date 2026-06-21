from pydantic import BaseModel
from pydantic import Field


class PublishInstagramMediaRequest(BaseModel):
    creation_id: str = Field(
        ...,
        description="Instagram media container ID",
    )