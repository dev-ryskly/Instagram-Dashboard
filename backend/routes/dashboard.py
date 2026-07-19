from fastapi import APIRouter
from fastapi import Depends
from fastapi import Response
from sqlalchemy.orm import Session

from database.postgres import get_db
from models.dashboard import DashboardResponse
from models.dashboard_v2 import DashboardV2Response
from services.dashboard_service import get_dashboard_summary
from services.dashboard_v2_service import get_dashboard_v2

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("", response_model=DashboardResponse)
def get_dashboard(
    db: Session = Depends(get_db),
):
    return get_dashboard_summary(db)


@router.get("/v2", response_model=DashboardV2Response)
def get_dashboard_v2_endpoint(
    response: Response,
    db: Session = Depends(get_db),
):
    # Cache for 60s in browser / CDN — avoids hammering Instagram API on every load
    response.headers["Cache-Control"] = "public, max-age=60, stale-while-revalidate=30"
    return get_dashboard_v2(db)
