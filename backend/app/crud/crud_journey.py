from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.journey_event import JourneyEvent
from app.schemas.journey_event import JourneyEventCreate


def create_journey_event(db: Session, event_in: JourneyEventCreate) -> JourneyEvent:
    db_obj = JourneyEvent(
        customer_id=event_in.customer_id,
        session_id=event_in.session_id,
        stage=event_in.stage,
        event_type=event_in.event_type,
        page_url=event_in.page_url,
        component_id=event_in.component_id,
        latency_ms=event_in.latency_ms,
        dwell_time_seconds=event_in.dwell_time_seconds,
        event_metadata=event_in.event_metadata or {}
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj


def create_batch_journey_events(db: Session, events_in: List[JourneyEventCreate]) -> List[JourneyEvent]:
    db_objects = [
        JourneyEvent(
            customer_id=e.customer_id,
            session_id=e.session_id,
            stage=e.stage,
            event_type=e.event_type,
            page_url=e.page_url,
            component_id=e.component_id,
            latency_ms=e.latency_ms,
            dwell_time_seconds=e.dwell_time_seconds,
            event_metadata=e.event_metadata or {}
        )
        for e in events_in
    ]
    db.add_all(db_objects)
    db.commit()
    for obj in db_objects:
        db.refresh(obj)
    return db_objects


def get_events_by_session(db: Session, session_id: str) -> List[JourneyEvent]:
    return (
        db.query(JourneyEvent)
        .filter(JourneyEvent.session_id == session_id)
        .order_by(JourneyEvent.timestamp.asc())
        .all()
    )


def get_events_by_customer(db: Session, customer_id: int) -> List[JourneyEvent]:
    return (
        db.query(JourneyEvent)
        .filter(JourneyEvent.customer_id == customer_id)
        .order_by(JourneyEvent.timestamp.asc())
        .all()
    )


def get_all_events(db: Session, skip: int = 0, limit: int = 200) -> List[JourneyEvent]:
    return (
        db.query(JourneyEvent)
        .order_by(JourneyEvent.timestamp.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
