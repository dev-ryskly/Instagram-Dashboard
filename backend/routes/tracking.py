from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException
from fastapi import Request
from sqlalchemy.orm import Session
from starlette.responses import RedirectResponse

from database.models.reel_visit import ReelVisitDB
from database.postgres import get_db
from models.conversion import CreateConversionRequest
from models.reel_link import CreateReelLinkRequest
from models.tracking_config import TrackingConfigResponse
from models.tracking_config import UpdateTrackingConfigRequest
from repositories.conversion_repository import create_conversion
from repositories.conversion_repository import get_conversions_by_reel
from repositories.reel_analytics_repository import get_reel_stats
from repositories.reel_link_repository import create_reel_link
from repositories.reel_link_repository import get_all_reel_links
from repositories.reel_link_repository import delete_reel_link
from repositories.reel_repository import get_reel_link_by_slug
from repositories.reel_timeline_repository import get_reel_timeline
from repositories.reel_visit_repository import create_visit
from repositories.tracking_config_repository import get_or_create_config
from repositories.tracking_config_repository import update_config

router = APIRouter(tags=["Tracking"])

# ──────────────────────────────────────────────────────────────
# Permanent bio-link redirect
# ──────────────────────────────────────────────────────────────

@router.get("/r/studojo")
def permanent_bio_link(
    request: Request,
    db: Session = Depends(get_db),
):
    """The one permanent tracking URL placed in the Instagram bio.
    Always redirects to destination_url.
    Records a click against active_reel_id only when tracking_enabled=True.
    """
    config = get_or_create_config(db)

    if not config.destination_url:
        raise HTTPException(status_code=404, detail="No destination URL configured")

    if config.tracking_enabled and config.active_reel_id:
        create_visit(
            db=db,
            reel_id=config.active_reel_id,
            slug="studojo",
            user_agent=request.headers.get("user-agent"),
            ip_address=request.client.host if request.client else None,
        )

    return RedirectResponse(url=config.destination_url, status_code=302)


# ──────────────────────────────────────────────────────────────
# Tracking config
# ──────────────────────────────────────────────────────────────

@router.get("/tracking-config", response_model=TrackingConfigResponse)
def get_tracking_config(
    db: Session = Depends(get_db),
):
    return get_or_create_config(db)


@router.put("/tracking-config", response_model=TrackingConfigResponse)
def put_tracking_config(
    body: UpdateTrackingConfigRequest,
    db: Session = Depends(get_db),
):
    return update_config(
        db=db,
        active_reel_id=body.active_reel_id,
        tracking_enabled=body.tracking_enabled,
        destination_url=body.destination_url,
    )




@router.post("/reel-links")
def create_tracking_link(
    request: CreateReelLinkRequest,
    db: Session = Depends(get_db),
):
    return create_reel_link(
        db=db,
        reel_id=request.reel_id,
        campaign_name=request.campaign_name,
        slug=request.slug,
        destination_url=request.destination_url,
    )


@router.get("/reel-links")
def get_tracking_links(
    db: Session = Depends(get_db),
):
    return get_all_reel_links(db)


@router.delete("/reel-links/{reel_id}")
def remove_tracking_link(
    reel_id: str,
    db: Session = Depends(get_db),
):
    from fastapi import HTTPException
    success = delete_reel_link(db, reel_id)
    if not success:
        raise HTTPException(status_code=404, detail="Tracking link not found")
    
    return {
        "status": "success",
        "message": "Tracking link deleted"
    }


@router.post("/conversions")
def create_reel_conversion(
    request: CreateConversionRequest,
    db: Session = Depends(get_db),
):
    return create_conversion(
        db=db,
        reel_id=request.reel_id,
        name=request.name,
        email=request.email,
        phone=request.phone,
    )


@router.get("/reel-links/{reel_id}/conversions")
def get_reel_conversions(
    reel_id: str,
    db: Session = Depends(get_db),
):
    return get_conversions_by_reel(
        db=db,
        reel_id=reel_id,
    )


# TODO: remove before production
@router.get("/visits")
def get_visits(
    db: Session = Depends(get_db),
):
    return db.query(ReelVisitDB).all()


@router.get("/reel-links/{reel_id}/analytics")
def get_reel_analytics(
    reel_id: str,
    db: Session = Depends(get_db),
):
    return get_reel_stats(
        db=db,
        reel_id=reel_id,
    )


@router.get("/reel-links/{reel_id}/timeline")
def get_reel_click_timeline(
    reel_id: str,
    db: Session = Depends(get_db),
):
    return get_reel_timeline(
        db=db,
        reel_id=reel_id,
    )


@router.get("/r/{slug}")
def track_reel_click(
    slug: str,
    request: Request,
    db: Session = Depends(get_db),
):
    reel_link = get_reel_link_by_slug(
        db=db,
        slug=slug,
    )

    if not reel_link:
        return {
            "error": "Reel link not found",
        }

    create_visit(
        db=db,
        reel_id=reel_link.reel_id,
        slug=reel_link.slug,
        user_agent=request.headers.get("user-agent"),
        ip_address=request.client.host if request.client else None,
    )

    return RedirectResponse(
        url=reel_link.destination_url,
        status_code=302,
    )