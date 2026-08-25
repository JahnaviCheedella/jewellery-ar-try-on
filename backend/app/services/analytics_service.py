from sqlalchemy.orm import Session

from ..models.analytics import AnalyticsEvent
from ..schemas.analytics import AnalyticsEventIn


def create_event(db: Session, payload: AnalyticsEventIn):
    data = payload.model_dump()

    data["event_metadata"] = data.pop("metadata", {})

    event = AnalyticsEvent(**data)

    db.add(event)
    db.commit()
    db.refresh(event)

    return event