from fastapi import APIRouter

from models.audit import InstagramAudit
from models.analytics import InstagramAnalytics
from models.profile import InstagramProfile
from models.post import InstagramPost
from services.audit_service import get_audit
from services.analytics_service import get_analytics
from services.instagram_service import get_profile
from services.instagram_service import get_posts

router = APIRouter(prefix="/instagram", tags=["Instagram"])

@router.get("/profile", response_model=InstagramProfile)
def get_instagram_profile():
    return get_profile()

@router.get("/posts", response_model=list[InstagramPost])
def get_instagram_posts():
    return get_posts()

@router.get("/analytics", response_model=InstagramAnalytics)
def get_instagram_analytics():
    return get_analytics()

@router.get("/audit", response_model=InstagramAudit)
def get_instagram_audit():
    return get_audit()
