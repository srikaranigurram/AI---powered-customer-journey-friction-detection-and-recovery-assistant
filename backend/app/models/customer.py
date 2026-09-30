from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from app.core.database import Base


class Customer(Base):
    __tablename__ = "customers"

    id = Column(Integer, primary_key=True, index=True)
    customer_code = Column(String(50), unique=True, index=True, nullable=False)
    name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=True)
    segment = Column(String(50), default="Standard")  # VIP, Standard, High-Value, New
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    journey_events = relationship("JourneyEvent", back_populates="customer", cascade="all, delete-orphan")
    predictions = relationship("PredictionResult", back_populates="customer", cascade="all, delete-orphan")
    recovery_actions = relationship("RecoveryAction", back_populates="customer", cascade="all, delete-orphan")
