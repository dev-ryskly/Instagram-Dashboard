from fastapi import APIRouter
from fastapi import Depends
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
    db: Session = Depends(get_db),
):
    return get_dashboard_v2(db)
