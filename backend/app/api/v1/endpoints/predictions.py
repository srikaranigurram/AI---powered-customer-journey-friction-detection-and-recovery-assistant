from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.prediction import PredictionCreate, PredictionResponse
from app.crud import crud_prediction

router = APIRouter()


@router.post("/", response_model=PredictionResponse, status_code=status.HTTP_201_CREATED, summary="Store ML friction & abandonment prediction")
def record_prediction(pred_in: PredictionCreate, db: Session = Depends(get_db)):
    """
    Endpoint for ML module to push friction & abandonment predictions:
    - abandonment_probability
    - risk_level (LOW, MEDIUM, HIGH, CRITICAL)
    - predicted_friction
    - confidence
    - contributing_factors
    """
    return crud_prediction.create_prediction(db, pred_in=pred_in)


@router.get("/", response_model=List[PredictionResponse], summary="List predictions")
def list_predictions(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    risk_level: Optional[str] = Query(None, description="Filter by LOW, MEDIUM, HIGH, CRITICAL"),
    db: Session = Depends(get_db)
):
    return crud_prediction.get_predictions(db, skip=skip, limit=limit, risk_level=risk_level)


@router.get("/session/{session_id}", response_model=PredictionResponse, summary="Get latest prediction for a session")
def get_session_prediction(session_id: str, db: Session = Depends(get_db)):
    pred = crud_prediction.get_latest_prediction_by_session(db, session_id=session_id)
    if not pred:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No prediction found for session '{session_id}'"
        )
    return pred


@router.get("/customer/{customer_id}", response_model=List[PredictionResponse], summary="Get predictions for a customer")
def get_customer_predictions(customer_id: int, db: Session = Depends(get_db)):
    return crud_prediction.get_predictions_by_customer(db, customer_id=customer_id)
