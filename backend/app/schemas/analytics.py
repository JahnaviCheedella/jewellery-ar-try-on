from typing import Any
from pydantic import BaseModel, Field


class AnalyticsEventIn(BaseModel):
    event_name: str = Field(min_length=1, max_length=100)
    jewellery_id: int | None = None
    category: str | None = Field(default=None, max_length=100)
    session_id: str = Field(min_length=8, max_length=100)
    metadata: dict[str, Any] = Field(default_factory=dict)


class AnalyticsEventOut(BaseModel):
    status: str
