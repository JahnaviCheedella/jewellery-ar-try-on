from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from schemas.analytics import AnalyticsEventIn, AnalyticsEventOut
from services.analytics_service import create_event

router = APIRouter(prefix="/api/analytics", tags=["analytics"])


@router.post("/events", response_model=AnalyticsEventOut, status_code=201)
def track_event(payload: AnalyticsEventIn, db: Session = Depends(get_db)):
    create_event(db, payload)
    return {"status": "accepted"}
