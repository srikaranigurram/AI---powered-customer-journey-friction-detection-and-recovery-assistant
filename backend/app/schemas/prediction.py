from datetime import datetime
from typing import Optional, List, Any
from pydantic import BaseModel, ConfigDict, Field


class PredictionBase(BaseModel):
    session_id: str
    customer_id: Optional[int] = None
    abandonment_probability: float = Field(..., ge=0.0, le=1.0, description="Predicted abandonment probability between 0.0 and 1.0")
    risk_level: str = Field(..., description="Risk category: LOW, MEDIUM, HIGH, CRITICAL")
    predicted_friction: str = Field(..., description="Name or description of predicted friction point")
    confidence: float = Field(1.0, ge=0.0, le=1.0, description="Model prediction confidence score")
    contributing_factors: Optional[List[Any]] = Field(default_factory=list, description="Key features contributing to friction/abandonment")
    model_version: Optional[str] = "xgboost_v1.0"


class PredictionCreate(PredictionBase):
    pass


class PredictionResponse(PredictionBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
