from pydantic import BaseModel


class TrackingConfigResponse(BaseModel):
    active_reel_id: str | None
    tracking_enabled: bool
    destination_url: str

    class Config:
        from_attributes = True


class UpdateTrackingConfigRequest(BaseModel):
    active_reel_id: str | None = None
    tracking_enabled: bool | None = None
    destination_url: str | None = None
