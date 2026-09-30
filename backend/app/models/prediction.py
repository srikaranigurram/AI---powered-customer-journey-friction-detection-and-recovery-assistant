from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.core.database import Base


class PredictionResult(Base):
    __tablename__ = "prediction_results"

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("customers.id", ondelete="CASCADE"), nullable=True, index=True)
    session_id = Column(String(100), index=True, nullable=False)

    # ML Specific Fields
    abandonment_probability = Column(Float, nullable=False)  # 0.0 to 1.0
    risk_level = Column(String(20), nullable=False)  # LOW, MEDIUM, HIGH, CRITICAL
    predicted_friction = Column(String(150), nullable=False)  # e.g., "Rage Click on Payment Step", "Checkout Hesitation"
    confidence = Column(Float, nullable=False, default=1.0)  # 0.0 to 1.0
    contributing_factors = Column(JSON, nullable=True, default=list)  # List of top features/reasons identified by ML

    model_version = Column(String(50), default="xgboost_v1.0")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), index=True)

    # Relationships
    customer = relationship("Customer", back_populates="predictions")
    recovery_actions = relationship("RecoveryAction", back_populates="prediction", cascade="all, delete-orphan")
