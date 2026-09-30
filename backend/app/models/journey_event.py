from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.core.database import Base


class JourneyEvent(Base):
    __tablename__ = "journey_events"

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("customers.id", ondelete="CASCADE"), nullable=True, index=True)
    session_id = Column(String(100), index=True, nullable=False)
    
    stage = Column(String(50), nullable=False, default="browse")  # browse, cart, checkout, payment, review
    event_type = Column(String(50), nullable=False)  # page_view, click, rage_click, form_field_error, api_latency, payment_failed
    page_url = Column(String(500), nullable=False)
    component_id = Column(String(100), nullable=True)  # e.g. "checkout-submit-btn", "coupon-input"
    latency_ms = Column(Integer, nullable=True)
    dwell_time_seconds = Column(Float, nullable=True)
    event_metadata = Column(JSON, nullable=True, default=dict)  # arbitrary context, cart total, error code, etc.
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc), index=True)

    # Relationship
    customer = relationship("Customer", back_populates="journey_events")
