from pydantic import BaseModel, Field

from models.analytics import InstagramAnalytics
from models.profile import InstagramProfile
from models.post import InstagramPost


class InstagramAudit(BaseModel):
    profile: InstagramProfile = Field(..., description="Instagram profile summary")
    posts: list[InstagramPost] = Field(..., description="Instagram posts included in the audit")
    analytics: InstagramAnalytics = Field(..., description="Instagram analytics included in the audit")
    summary: str = Field(..., description="Overall audit summary")