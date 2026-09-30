from typing import List
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.journey_event import (
    JourneyEventCreate,
    JourneyEventBatchCreate,
    JourneyEventResponse
)
from app.crud import crud_journey

router = APIRouter()


@router.post("/", response_model=JourneyEventResponse, status_code=status.HTTP_201_CREATED, summary="Ingest single journey event")
def log_event(event_in: JourneyEventCreate, db: Session = Depends(get_db)):
    return crud_journey.create_journey_event(db, event_in=event_in)


@router.post("/batch", response_model=List[JourneyEventResponse], status_code=status.HTTP_201_CREATED, summary="Ingest batch of journey events")
def log_batch_events(batch_in: JourneyEventBatchCreate, db: Session = Depends(get_db)):
    return crud_journey.create_batch_journey_events(db, events_in=batch_in.events)


@router.get("/session/{session_id}", response_model=List[JourneyEventResponse], summary="Get chronological journey events for a session")
def get_session_events(session_id: str, db: Session = Depends(get_db)):
    return crud_journey.get_events_by_session(db, session_id=session_id)


@router.get("/customer/{customer_id}", response_model=List[JourneyEventResponse], summary="Get journey events for a customer")
def get_customer_events(customer_id: int, db: Session = Depends(get_db)):
    return crud_journey.get_events_by_customer(db, customer_id=customer_id)


@router.get("/", response_model=List[JourneyEventResponse], summary="List recent events across all sessions")
def list_recent_events(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    db: Session = Depends(get_db)
):
    return crud_journey.get_all_events(db, skip=skip, limit=limit)
