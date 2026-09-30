"""
Sample data seed script for AI-Powered Customer Journey Friction Assistant.
Populates initial customers, sample journeys with friction points, ML predictions, and recovery actions.
Run with: python seed_data.py
"""

from datetime import datetime, timezone, timedelta
from app.core.database import SessionLocal, init_db
from app.models.customer import Customer
from app.models.journey_event import JourneyEvent
from app.models.prediction import PredictionResult
from app.models.recovery import RecoveryAction


def seed():
    init_db()
    db = SessionLocal()

    # Check if data already exists
    if db.query(Customer).count() > 0:
        print("Database already contains data. Skipping seed.")
        db.close()
        return

    print("Seeding sample data for hackathon prototype...")

    # 1. Customers
    cust1 = Customer(
        customer_code="CUST-1001",
        name="Alex Morgan",
        email="alex.morgan@example.com",
        segment="VIP"
    )
    cust2 = Customer(
        customer_code="CUST-1002",
        name="Samantha Lee",
        email="samantha.lee@example.com",
        segment="High-Value"
    )
    cust3 = Customer(
        customer_code="CUST-1003",
        name="David Kumar",
        email="david.kumar@example.com",
        segment="New"
    )
    db.add_all([cust1, cust2, cust3])
    db.commit()
    db.refresh(cust1)
    db.refresh(cust2)
    db.refresh(cust3)

    base_time = datetime.now(timezone.utc) - timedelta(minutes=25)

    # 2. Journey Events for Alex Morgan (Session SES-8891 - Rage clicking on checkout coupon)
    session_alex = "SES-8891"
    alex_events = [
        JourneyEvent(
            customer_id=cust1.id,
            session_id=session_alex,
            stage="browse",
            event_type="page_view",
            page_url="/products/laptop-pro-16",
            latency_ms=120,
            dwell_time_seconds=45.0,
            timestamp=base_time
        ),
        JourneyEvent(
            customer_id=cust1.id,
            session_id=session_alex,
            stage="cart",
            event_type="button_click",
            page_url="/cart",
            component_id="add-to-cart-btn",
            latency_ms=90,
            event_metadata={"item": "Laptop Pro 16", "price": 1899.99},
            timestamp=base_time + timedelta(seconds=50)
        ),
        JourneyEvent(
            customer_id=cust1.id,
            session_id=session_alex,
            stage="checkout",
            event_type="form_field_error",
            page_url="/checkout/payment",
            component_id="promo-code-input",
            latency_ms=150,
            event_metadata={"attempted_code": "FALL25", "error": "Code expired"},
            timestamp=base_time + timedelta(seconds=110)
        ),
        JourneyEvent(
            customer_id=cust1.id,
            session_id=session_alex,
            stage="checkout",
            event_type="rage_click",
            page_url="/checkout/payment",
            component_id="apply-coupon-btn",
            latency_ms=310,
            dwell_time_seconds=65.0,
            event_metadata={"click_burst_count": 6, "interval_ms": 420},
            timestamp=base_time + timedelta(seconds=130)
        ),
    ]
    db.add_all(alex_events)
    db.commit()

    # 3. ML Prediction for Alex's Session (Simulated XGBoost output)
    pred_alex = PredictionResult(
        customer_id=cust1.id,
        session_id=session_alex,
        abandonment_probability=0.88,
        risk_level="HIGH",
        predicted_friction="Repeated Promo Code Failure & Rage Click Burst",
        confidence=0.94,
        contributing_factors=[
            "Rage click burst count = 6 on checkout coupon",
            "Dwell time > 60s on payment screen",
            "Coupon error count = 2"
        ],
        model_version="xgboost_v1.0"
    )
    db.add(pred_alex)
    db.commit()
    db.refresh(pred_alex)

    # 4. Gemini Recovery Action for Alex's Session (Simulated Gemini output)
    recovery_alex = RecoveryAction(
        prediction_id=pred_alex.id,
        customer_id=cust1.id,
        session_id=session_alex,
        friction_explanation="Customer encountered an expired promo code error and exhibited rage-clicking behavior on the apply button, indicating extreme checkout frustration and high churn risk.",
        evidence={
            "session_id": session_alex,
            "failed_code": "FALL25",
            "rage_clicks": 6,
            "stage": "checkout"
        },
        recommended_action="Instant Fallback VIP Discount Voucher Modal",
        generated_message="We noticed your discount code didn't apply! As a valued VIP member, here is an exclusive 15% discount applied automatically to your order.",
        discount_code="VIP15OFF",
        action_status="PRESENTED",
        created_at=base_time + timedelta(seconds=135)
    )
    db.add(recovery_alex)
    db.commit()

    print("Sample data successfully seeded!")
    print(f"- Customers: {db.query(Customer).count()}")
    print(f"- Journey Events: {db.query(JourneyEvent).count()}")
    print(f"- Predictions: {db.query(PredictionResult).count()}")
    print(f"- Recovery Actions: {db.query(RecoveryAction).count()}")
    db.close()


if __name__ == "__main__":
    seed()
