from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.recovery import (
    RecoveryActionCreate,
    RecoveryActionUpdate,
    RecoveryActionResponse
)
from app.crud import crud_recovery

router = APIRouter()


@router.post("/", response_model=RecoveryActionResponse, status_code=status.HTTP_201_CREATED, summary="Store Gemini explanation and recovery action")
def record_recovery_action(recovery_in: RecoveryActionCreate, db: Session = Depends(get_db)):
    """
    Endpoint for Gemini module to store AI-generated explanation & recovery plan:
    - friction_explanation
    - evidence
    - recommended_action
    - generated_message
    """
    return crud_recovery.create_recovery_action(db, recovery_in=recovery_in)


@router.get("/", response_model=List[RecoveryActionResponse], summary="List recovery actions")
def list_recovery_actions(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    status: Optional[str] = Query(None, description="Filter by PENDING, PRESENTED, ACCEPTED, DECLINED, DISMISSED"),
    db: Session = Depends(get_db)
):
    return crud_recovery.get_recovery_actions(db, skip=skip, limit=limit, status=status)


@router.get("/session/{session_id}", response_model=List[RecoveryActionResponse], summary="Get recovery actions for a session")
def get_session_recovery_actions(session_id: str, db: Session = Depends(get_db)):
    return crud_recovery.get_recovery_actions_by_session(db, session_id=session_id)


@router.get("/{recovery_id}", response_model=RecoveryActionResponse, summary="Get single recovery action by ID")
def get_recovery_action(recovery_id: int, db: Session = Depends(get_db)):
    action = crud_recovery.get_recovery_action(db, recovery_id=recovery_id)
    if not action:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Recovery action not found")
    return action


@router.patch("/{recovery_id}/status", response_model=RecoveryActionResponse, summary="Update recovery action status (e.g. ACCEPTED/DECLINED)")
def update_action_status(recovery_id: int, update_in: RecoveryActionUpdate, db: Session = Depends(get_db)):
    action = crud_recovery.update_recovery_action_status(db, recovery_id=recovery_id, update_in=update_in)
    if not action:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Recovery action not found")
    return action
