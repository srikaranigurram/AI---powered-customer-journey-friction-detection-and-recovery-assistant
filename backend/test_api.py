"""
Automated validation script for all API endpoints.
Tests health, customers, journey events, ML predictions, Gemini recoveries, and dashboard views.
"""

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def run_tests():
    print("=== STARTING BACKEND API TESTS ===\n")

    # 1. Health check
    res = client.get("/api/v1/health")
    assert res.status_code == 200, f"Health check failed: {res.text}"
    print(f"[PASS] Health Check: {res.json()}")

    # 2. Customers
    new_customer = {
        "customer_code": "CUST-9999",
        "name": "Jane Doe",
        "email": "jane.doe@example.com",
        "segment": "VIP"
    }
    res = client.post("/api/v1/customers/", json=new_customer)
    assert res.status_code in [201, 400], f"Create customer failed: {res.text}"
    cust_id = res.json()["id"] if res.status_code == 201 else 1
    print(f"[PASS] Customer API (POST/GET): Cust ID {cust_id}")

    res = client.get("/api/v1/customers/")
    assert res.status_code == 200 and len(res.json()) >= 1
    print(f"[PASS] Customers List: {len(res.json())} customer(s) found")

    # 3. Journey Event Ingestion
    session_id = "SES-TEST-001"
    event_payload = {
        "session_id": session_id,
        "customer_id": cust_id,
        "stage": "checkout",
        "event_type": "rage_click",
        "page_url": "/checkout/review",
        "component_id": "pay-button",
        "latency_ms": 450,
        "dwell_time_seconds": 120.5,
        "event_metadata": {"clicks_in_burst": 8}
    }
    res = client.post("/api/v1/journey-events/", json=event_payload)
    assert res.status_code == 201, f"Event ingestion failed: {res.text}"
    print(f"[PASS] Single Event Ingestion: Event ID {res.json()['id']}")

    # Batch event ingestion
    batch_payload = {
        "events": [
            {
                "session_id": session_id,
                "customer_id": cust_id,
                "stage": "checkout",
                "event_type": "form_error",
                "page_url": "/checkout/payment",
                "component_id": "cvv-input",
                "event_metadata": {"field": "cvv", "error": "Invalid format"}
            }
        ]
    }
    res = client.post("/api/v1/journey-events/batch", json=batch_payload)
    assert res.status_code == 201, f"Batch event ingestion failed: {res.text}"
    print(f"[PASS] Batch Event Ingestion: {len(res.json())} event(s) logged")

    # Fetch session events
    res = client.get(f"/api/v1/journey-events/session/{session_id}")
    assert res.status_code == 200 and len(res.json()) >= 2
    print(f"[PASS] Session Events Retrieval: {len(res.json())} event(s) for session {session_id}")

    # 4. ML Prediction Storage & Retrieval
    pred_payload = {
        "session_id": session_id,
        "customer_id": cust_id,
        "abandonment_probability": 0.92,
        "risk_level": "CRITICAL",
        "predicted_friction": "Payment Gateway Timeout & Repeated Clicks",
        "confidence": 0.96,
        "contributing_factors": [
            "CVV format error count > 1",
            "8 rage clicks on pay-button",
            "Dwell time > 120 seconds"
        ],
        "model_version": "xgboost_v1.0"
    }
    res = client.post("/api/v1/predictions/", json=pred_payload)
    assert res.status_code == 201, f"Prediction storage failed: {res.text}"
    pred_id = res.json()["id"]
    print(f"[PASS] ML Prediction Ingestion: Prediction ID {pred_id}, Risk: {res.json()['risk_level']}")

    res = client.get(f"/api/v1/predictions/session/{session_id}")
    assert res.status_code == 200 and res.json()["risk_level"] == "CRITICAL"
    print(f"[PASS] Latest Prediction Retrieval for Session: Success")

    # 5. Gemini Recovery Action Storage, Retrieval & Status Update
    recovery_payload = {
        "session_id": session_id,
        "prediction_id": pred_id,
        "customer_id": cust_id,
        "friction_explanation": "Customer repeatedly clicked the pay button while encountering CVV validation errors, creating a payment barrier.",
        "evidence": {
            "session_id": session_id,
            "failed_field": "cvv",
            "rage_clicks": 8
        },
        "recommended_action": "Proactive Payment Help Chat Assistant",
        "generated_message": "Need help completing your order? Our assistant is ready to help you with payment options.",
        "discount_code": "HELP10",
        "action_status": "PRESENTED"
    }
    res = client.post("/api/v1/recovery/", json=recovery_payload)
    assert res.status_code == 201, f"Recovery creation failed: {res.text}"
    recovery_id = res.json()["id"]
    print(f"[PASS] Gemini Recovery Storage: Recovery ID {recovery_id}")

    # Update recovery status (e.g. customer accepts)
    res = client.patch(f"/api/v1/recovery/{recovery_id}/status", json={"action_status": "ACCEPTED"})
    assert res.status_code == 200 and res.json()["action_status"] == "ACCEPTED"
    print(f"[PASS] Gemini Recovery Status Update: Changed to ACCEPTED")

    # 6. React Dashboard Endpoints
    res = client.get("/api/v1/dashboard/stats")
    assert res.status_code == 200
    stats = res.json()
    print(f"[PASS] Dashboard Stats: {stats}")

    res = client.get(f"/api/v1/dashboard/customer-journey/{session_id}")
    assert res.status_code == 200
    detail = res.json()
    assert len(detail["events"]) >= 2
    assert detail["latest_prediction"] is not None
    assert len(detail["recovery_actions"]) >= 1
    print(f"[PASS] End-to-End Consolidated Customer Journey: Success (events={len(detail['events'])}, prediction={detail['latest_prediction']['risk_level']}, recovery={detail['recovery_actions'][0]['action_status']})")

    print("\n[SUCCESS] ALL TESTS PASSED! The Backend MVP is 100% operational.")


if __name__ == "__main__":
    run_tests()
