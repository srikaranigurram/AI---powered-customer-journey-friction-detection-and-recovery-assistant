from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.core.database import Base


class RecoveryAction(Base):
    __tablename__ = "recovery_actions"

    id = Column(Integer, primary_key=True, index=True)
    prediction_id = Column(Integer, ForeignKey("prediction_results.id", ondelete="CASCADE"), nullable=True, index=True)
    customer_id = Column(Integer, ForeignKey("customers.id", ondelete="CASCADE"), nullable=True, index=True)
    session_id = Column(String(100), index=True, nullable=False)

    # Gemini / AI Fields
    friction_explanation = Column(Text, nullable=False)
    evidence = Column(JSON, nullable=True, default=dict)  # Context/event sequence used by Gemini
    recommended_action = Column(String(150), nullable=False)  # e.g., "Proactive Chat Support", "Instant 10% Discount"
    generated_message = Column(Text, nullable=False)  # Empathetic, recovery message created by Gemini

    # Execution & Frontend Tracking
    action_status = Column(String(30), default="PENDING", index=True)  # PENDING, PRESENTED, ACCEPTED, DECLINED, DISMISSED
    discount_code = Column(String(50), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), index=True)
    responded_at = Column(DateTime, nullable=True)

    # Relationships
    prediction = relationship("PredictionResult", back_populates="recovery_actions")
    customer = relationship("Customer", back_populates="recovery_actions")
