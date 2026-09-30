from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.core.database import get_db
from app.models.customer import Customer
from app.models.journey_event import JourneyEvent
from app.models.prediction import PredictionResult
from app.models.recovery import RecoveryAction
from app.schemas.customer import CustomerResponse
from app.schemas.journey_event import JourneyEventResponse
from app.schemas.prediction import PredictionResponse
from app.schemas.recovery import RecoveryActionResponse
from app.schemas.dashboard import CustomerJourneyDetailResponse, DashboardStatsResponse
from app.crud import crud_customer, crud_journey, crud_prediction, crud_recovery

router = APIRouter()


@router.get("/stats", response_model=DashboardStatsResponse, summary="Get summary metrics for React dashboard")
def get_dashboard_stats(db: Session = Depends(get_db)):
    total_customers = db.query(func.count(Customer.id)).scalar() or 0
    total_events = db.query(func.count(JourneyEvent.id)).scalar() or 0
    total_sessions = db.query(func.count(func.distinct(JourneyEvent.session_id))).scalar() or 0
    total_predictions = db.query(func.count(PredictionResult.id)).scalar() or 0
    high_risk_count = (
        db.query(func.count(PredictionResult.id))
        .filter(PredictionResult.risk_level.in_(["HIGH", "CRITICAL"]))
        .scalar()
        or 0
    )
    recovery_interventions_count = db.query(func.count(RecoveryAction.id)).scalar() or 0
    accepted_recoveries_count = (
        db.query(func.count(RecoveryAction.id))
        .filter(RecoveryAction.action_status == "ACCEPTED")
        .scalar()
        or 0
    )

    return DashboardStatsResponse(
        total_customers=total_customers,
        total_sessions=total_sessions,
        total_events=total_events,
        total_predictions=total_predictions,
        high_risk_count=high_risk_count,
        recovery_interventions_count=recovery_interventions_count,
        accepted_recoveries_count=accepted_recoveries_count
    )


@router.get("/customer-journey/{session_id}", response_model=CustomerJourneyDetailResponse, summary="Get end-to-end journey detail for a session")
def get_session_journey_detail(session_id: str, db: Session = Depends(get_db)):
    events = crud_journey.get_events_by_session(db, session_id=session_id)
    if not events:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No journey events found for session '{session_id}'"
        )

    customer_resp = None
    if events[0].customer_id:
        cust = crud_customer.get_customer(db, customer_id=events[0].customer_id)
        if cust:
            customer_resp = CustomerResponse.model_validate(cust)

    latest_pred = crud_prediction.get_latest_prediction_by_session(db, session_id=session_id)
    recovery_actions = crud_recovery.get_recovery_actions_by_session(db, session_id=session_id)

    return CustomerJourneyDetailResponse(
        customer=customer_resp,
        session_id=session_id,
        events=[JourneyEventResponse.model_validate(e) for e in events],
        latest_prediction=PredictionResponse.model_validate(latest_pred) if latest_pred else None,
        recovery_actions=[RecoveryActionResponse.model_validate(r) for r in recovery_actions]
    )
