from datetime import datetime, timezone
from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.recovery import RecoveryAction
from app.schemas.recovery import RecoveryActionCreate, RecoveryActionUpdate


def create_recovery_action(db: Session, recovery_in: RecoveryActionCreate) -> RecoveryAction:
    db_obj = RecoveryAction(
        session_id=recovery_in.session_id,
        prediction_id=recovery_in.prediction_id,
        customer_id=recovery_in.customer_id,
        friction_explanation=recovery_in.friction_explanation,
        evidence=recovery_in.evidence or {},
        recommended_action=recovery_in.recommended_action,
        generated_message=recovery_in.generated_message,
        discount_code=recovery_in.discount_code,
        action_status=recovery_in.action_status.upper() if recovery_in.action_status else "PENDING"
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj


def get_recovery_action(db: Session, recovery_id: int) -> Optional[RecoveryAction]:
    return db.query(RecoveryAction).filter(RecoveryAction.id == recovery_id).first()


def get_recovery_actions(db: Session, skip: int = 0, limit: int = 100, status: Optional[str] = None) -> List[RecoveryAction]:
    query = db.query(RecoveryAction)
    if status:
        query = query.filter(RecoveryAction.action_status == status.upper())
    return query.order_by(RecoveryAction.created_at.desc()).offset(skip).limit(limit).all()


def get_recovery_actions_by_session(db: Session, session_id: str) -> List[RecoveryAction]:
    return (
        db.query(RecoveryAction)
        .filter(RecoveryAction.session_id == session_id)
        .order_by(RecoveryAction.created_at.desc())
        .all()
    )


def update_recovery_action_status(db: Session, recovery_id: int, update_in: RecoveryActionUpdate) -> Optional[RecoveryAction]:
    db_obj = get_recovery_action(db, recovery_id)
    if not db_obj:
        return None
    db_obj.action_status = update_in.action_status.upper()
    db_obj.responded_at = update_in.responded_at or datetime.now(timezone.utc)
    db.commit()
    db.refresh(db_obj)
    return db_obj
