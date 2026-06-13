from fastapi import APIRouter
from fastapi import Depends
from fastapi import Query
from sqlalchemy.orm import Session

from database.postgres import get_db
from models.analytics import InstagramAnalytics
from models.audit import InstagramAudit
from models.post import InstagramPost
from models.profile import InstagramProfile
from repositories.profile_repository import create_profile_snapshot
from repositories.profile_repository import get_latest_profile_snapshot
from services.analytics_service import get_analytics
from services.audit_service import get_audit
from services.composio_client import ComposioClient
from services.instagram_service import get_posts
from services.instagram_service import get_profile

router = APIRouter(prefix="/instagram", tags=["Instagram"])


@router.get("/profile", response_model=InstagramProfile)
def get_instagram_profile():
    return get_profile()


@router.get("/posts", response_model=list[InstagramPost])
def get_instagram_posts():
    return get_posts()


@router.get("/posts/{media_id}/insights")
def get_instagram_post_insights(
    media_id: str,
    metric: list[str] = Query(
        ...,
        description="Instagram insight metrics",
    ),
):
    client = ComposioClient()

    return client.get_instagram_post_insights(
        media_id,
        metric,
    )


@router.get("/analytics", response_model=InstagramAnalytics)
def get_instagram_analytics():
    return get_analytics()


@router.get("/audit", response_model=InstagramAudit)
def get_instagram_audit():
    return get_audit()


@router.post("/profile/seed")
def seed_profile_snapshot(db: Session = Depends(get_db)):
    return create_profile_snapshot(
        db=db,
        followers=1250,
        following=350,
        engagement_rate=6.2,
        profile_visits=420,
    )


@router.get("/profile/latest")
def get_latest_profile(db: Session = Depends(get_db)):
    return get_latest_profile_snapshot(db)