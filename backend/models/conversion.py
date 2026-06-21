from pydantic import BaseModel
from pydantic import Field


class CreateConversionRequest(BaseModel):
    reel_id: str = Field(...)

    name: str | None = Field(default=None)

    email: str | None = Field(default=None)

    phone: str | None = Field(default=None)