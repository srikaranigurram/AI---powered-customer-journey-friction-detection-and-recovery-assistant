from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.prediction import PredictionResult
from app.schemas.prediction import PredictionCreate


def create_prediction(db: Session, pred_in: PredictionCreate) -> PredictionResult:
    db_obj = PredictionResult(
        session_id=pred_in.session_id,
        customer_id=pred_in.customer_id,
        abandonment_probability=pred_in.abandonment_probability,
        risk_level=pred_in.risk_level.upper(),
        predicted_friction=pred_in.predicted_friction,
        confidence=pred_in.confidence,
        contributing_factors=pred_in.contributing_factors or [],
        model_version=pred_in.model_version
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj


def get_prediction(db: Session, prediction_id: int) -> Optional[PredictionResult]:
    return db.query(PredictionResult).filter(PredictionResult.id == prediction_id).first()


def get_predictions(db: Session, skip: int = 0, limit: int = 100, risk_level: Optional[str] = None) -> List[PredictionResult]:
    query = db.query(PredictionResult)
    if risk_level:
        query = query.filter(PredictionResult.risk_level == risk_level.upper())
    return query.order_by(PredictionResult.created_at.desc()).offset(skip).limit(limit).all()


def get_latest_prediction_by_session(db: Session, session_id: str) -> Optional[PredictionResult]:
    return (
        db.query(PredictionResult)
        .filter(PredictionResult.session_id == session_id)
        .order_by(PredictionResult.created_at.desc())
        .first()
    )


def get_predictions_by_customer(db: Session, customer_id: int) -> List[PredictionResult]:
    return (
        db.query(PredictionResult)
        .filter(PredictionResult.customer_id == customer_id)
        .order_by(PredictionResult.created_at.desc())
        .all()
    )
