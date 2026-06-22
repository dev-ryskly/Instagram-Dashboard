from fastapi import APIRouter
from fastapi import Depends
from fastapi import Query
from fastapi import Request
from fastapi import UploadFile
from fastapi import File
from sqlalchemy.orm import Session
import os
import uuid
import shutil
from models.publish_media import PublishInstagramMediaRequest
from services.publish_media_service import publish_media
from database.postgres import get_db
from models.analytics import InstagramAnalytics
from models.audit import InstagramAudit
from models.create_media import CreateInstagramMediaRequest
from models.post import InstagramPost
from models.profile import InstagramProfile
from models.publishing_limit import InstagramPublishingLimit
from repositories.profile_repository import create_profile_snapshot
from repositories.profile_repository import get_latest_profile_snapshot
from services.analytics_service import get_analytics
from services.audit_service import get_audit
from services.composio_client import ComposioClient
from services.instagram_service import get_posts
from services.instagram_service import get_profile
from services.media_service import create_media
from services.publishing_limit_service import get_publishing_limit
from models.publish_and_track import PublishAndTrackRequest
from models.publish_and_track import PublishAndTrackResponse
from services.publish_and_track_service import publish_and_track
from models.reel_detail import ReelDetailResponse
from services.reel_detail_service import get_reel_detail

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
def seed_profile_snapshot(
    db: Session = Depends(get_db),
):
    return create_profile_snapshot(
        db=db,
        followers=1250,
        following=350,
        engagement_rate=6.2,
        profile_visits=420,
    )


@router.get("/profile/latest")
def get_latest_profile(
    db: Session = Depends(get_db),
):
    return get_latest_profile_snapshot(db)


@router.get(
    "/publishing-limit",
    response_model=InstagramPublishingLimit,
)
def get_instagram_publishing_limit():
    return get_publishing_limit()


@router.post("/media")
def create_instagram_media(
    request: CreateInstagramMediaRequest,
):
    return create_media(
        image_url=request.image_url,
        video_url=request.video_url,
        caption=request.caption,
        media_type=request.media_type,
    )
@router.post("/publish")
def publish_instagram_media(
    request: PublishInstagramMediaRequest,
):
    return publish_media(
        creation_id=request.creation_id,
    )


@router.post(
    "/publish-and-track",
    response_model=PublishAndTrackResponse,
)
def publish_and_track_reel(
    request: PublishAndTrackRequest,
    db: Session = Depends(get_db),
):
    return publish_and_track(
        db=db,
        image_url=request.image_url,
        video_url=request.video_url,
        caption=request.caption,
        media_type=request.media_type,
        campaign_name=request.campaign_name,
        destination_url=request.destination_url,
        media_urls=request.media_urls,
    )


@router.post("/upload")
def upload_media_files(
    request: Request,
    files: list[UploadFile] = File(...),
):
    os.makedirs("static/uploads", exist_ok=True)
    urls = []
    for file in files:
        file_ext = os.path.splitext(file.filename or "")[1]
        unique_filename = f"{uuid.uuid4().hex}{file_ext}"
        file_path = os.path.join("static/uploads", unique_filename)
        
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        base_url = str(request.base_url)
        if not base_url.endswith("/"):
            base_url += "/"
        url = f"{base_url}static/uploads/{unique_filename}"
        urls.append(url)
        
    return {"urls": urls}


@router.get(
    "/reels/{media_id}/detail",
    response_model=ReelDetailResponse,
)
def get_instagram_reel_detail(
    media_id: str,
    db: Session = Depends(get_db),
):
    return get_reel_detail(db=db, media_id=media_id)