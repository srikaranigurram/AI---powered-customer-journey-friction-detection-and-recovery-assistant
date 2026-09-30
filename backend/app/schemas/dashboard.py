from typing import List, Optional
from pydantic import BaseModel
from app.schemas.customer import CustomerResponse
from app.schemas.journey_event import JourneyEventResponse
from app.schemas.prediction import PredictionResponse
from app.schemas.recovery import RecoveryActionResponse


class CustomerJourneyDetailResponse(BaseModel):
    customer: Optional[CustomerResponse] = None
    session_id: str
    events: List[JourneyEventResponse]
    latest_prediction: Optional[PredictionResponse] = None
    recovery_actions: List[RecoveryActionResponse]


class DashboardStatsResponse(BaseModel):
    total_customers: int
    total_sessions: int
    total_events: int
    total_predictions: int
    high_risk_count: int
    recovery_interventions_count: int
    accepted_recoveries_count: int
