from datetime import datetime
from typing import Optional, Dict, Any, List
from pydantic import BaseModel, ConfigDict


class JourneyEventBase(BaseModel):
    session_id: str
    customer_id: Optional[int] = None
    stage: str = "browse"
    event_type: str
    page_url: str
    component_id: Optional[str] = None
    latency_ms: Optional[int] = None
    dwell_time_seconds: Optional[float] = None
    event_metadata: Optional[Dict[str, Any]] = None


class JourneyEventCreate(JourneyEventBase):
    pass


class JourneyEventBatchCreate(BaseModel):
    events: List[JourneyEventCreate]


class JourneyEventResponse(JourneyEventBase):
    id: int
    timestamp: datetime

    model_config = ConfigDict(from_attributes=True)
