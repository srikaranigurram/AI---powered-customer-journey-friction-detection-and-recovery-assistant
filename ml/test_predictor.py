"""
Test Suite for Customer Friction & Abandonment Predictor.

Verifies the exact backend contract format required by Person 2:
{
  "session_id": "SES-8891",
  "customer_id": 1,
  "abandonment_probability": 0.88,
  "risk_level": "HIGH",
  "predicted_friction": "PAYMENT",
  "confidence": 0.94,
  "contributing_factors": [
    "Two failed payment attempts",
    "Checkout was started",
    "Payment page dwell time was high"
  ],
  "model_version": "xgboost_v1.0"
}
"""

import json
import sys
from pathlib import Path

# Add repository root and current ml directory to sys.path
BASE_DIR = Path(__file__).resolve().parent
REPO_ROOT = BASE_DIR.parent
if str(REPO_ROOT) not in sys.path:
    sys.path.insert(0, str(REPO_ROOT))
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

# Standard import for Person 2:
from ml.predictor import predict_customer_journey

EXPECTED_KEYS = {
    "session_id",
    "customer_id",
    "abandonment_probability",
    "risk_level",
    "predicted_friction",
    "confidence",
    "contributing_factors",
    "model_version",
}

DISALLOWED_OLD_KEYS = {
    "risk",
    "risk_percentage",
    "friction",
    "friction_confidence",
    "evidence",
}

VALID_FRICTION_CATEGORIES = {
    "PAYMENT",
    "PRICE",
    "DELIVERY",
    "PRODUCT_INFORMATION",
    "PRODUCT_TRUST",
    "DECISION_DIFFICULTY",
    "TECHNICAL",
    "SUPPORT",
}

VALID_RISK_LEVELS = {"LOW", "MEDIUM", "HIGH", "CRITICAL"}


def validate_contract(result: dict):
    """Asserts that the prediction result adheres strictly to the backend schema."""
    # 1. Exact keys present
    assert set(result.keys()) == EXPECTED_KEYS, (
        f"Result keys do not match expected contract!\n"
        f"Got: {set(result.keys())}\nExpected: {EXPECTED_KEYS}"
    )

    # 2. Check no deprecated fields
    for old_key in DISALLOWED_OLD_KEYS:
        assert old_key not in result, f"Deprecated field '{old_key}' found in result!"

    # 3. Type & range validations
    assert isinstance(result["session_id"], str), "session_id must be a string"
    assert isinstance(result["abandonment_probability"], float), "abandonment_probability must be a float"
    assert 0.0 <= result["abandonment_probability"] <= 1.0, "abandonment_probability must be between 0 and 1"

    assert result["risk_level"] in VALID_RISK_LEVELS, f"Invalid risk_level: {result['risk_level']}"
    assert result["predicted_friction"] in VALID_FRICTION_CATEGORIES, (
        f"Invalid predicted_friction: {result['predicted_friction']}"
    )

    assert isinstance(result["confidence"], float), "confidence must be a float"
    assert 0.0 <= result["confidence"] <= 1.0, "confidence must be between 0 and 1"

    assert isinstance(result["contributing_factors"], list), "contributing_factors must be a list"
    assert result["model_version"] == "xgboost_v1.0", "model_version must be 'xgboost_v1.0'"


def run_tests():
    print("=" * 75)
    print("RUNNING PREDICTOR INFERENCE TESTS (Person 2 Integration)")
    print("=" * 75)

    # Test Case 1: Payment friction scenario
    case_1 = {
        "session_id": "SES-8891",
        "customer_id": 1,
        "session_duration": 14,
        "pages_viewed": 10,
        "products_viewed": 6,
        "search_count": 4,
        "cart_items": 2,
        "cart_value": 3999,
        "checkout_started": 1,
        "payment_attempts": 2,
        "payment_failed": 1,
        "delivery_days": 5,
        "support_contact": 0,
        "negative_feedback": 0,
        "previous_orders": 2,
    }

    print("\n[TEST CASE 1] Payment Friction (Matches Backend Contract Example)")
    print("Input:")
    print(json.dumps(case_1, indent=2))
    res_1 = predict_customer_journey(case_1)
    print("\nResult (JSON Serialized):")
    print(json.dumps(res_1, indent=2))
    validate_contract(res_1)

    # Test Case 2: Smooth low-risk shopper
    case_2 = {
        "session_id": "SES-1022",
        "customer_id": 42,
        "session_duration": 6,
        "pages_viewed": 7,
        "products_viewed": 4,
        "search_count": 1,
        "cart_items": 2,
        "cart_value": 1200,
        "checkout_started": 1,
        "payment_attempts": 1,
        "payment_failed": 0,
        "delivery_days": 3,
        "support_contact": 0,
        "negative_feedback": 0,
        "previous_orders": 8,
    }

    print("\n" + "-" * 75)
    print("[TEST CASE 2] Low Risk / Loyal Shopper")
    print("Input:")
    print(json.dumps(case_2, indent=2))
    res_2 = predict_customer_journey(case_2)
    print("\nResult (JSON Serialized):")
    print(json.dumps(res_2, indent=2))
    validate_contract(res_2)

    # Test Case 3: Delivery delay friction (HIGH Risk)
    case_3 = {
        "session_id": "SES-3310",
        "customer_id": 99,
        "session_duration": 11,
        "pages_viewed": 8,
        "products_viewed": 3,
        "search_count": 2,
        "cart_items": 1,
        "cart_value": 2200,
        "checkout_started": 1,
        "payment_attempts": 1,
        "payment_failed": 0,
        "delivery_days": 13,
        "support_contact": 0,
        "negative_feedback": 0,
        "previous_orders": 1,
    }

    print("\n" + "-" * 75)
    print("[TEST CASE 3] Delivery Delay Friction (> 7 Days, HIGH Risk)")
    print("Input:")
    print(json.dumps(case_3, indent=2))
    res_3 = predict_customer_journey(case_3)
    print("\nResult (JSON Serialized):")
    print(json.dumps(res_3, indent=2))
    validate_contract(res_3)

    # Test Case 4: Medium risk browsing hesitation
    case_medium = {
        "session_id": "SES-4450",
        "customer_id": 78,
        "session_duration": 10,
        "pages_viewed": 9,
        "products_viewed": 5,
        "search_count": 3,
        "cart_items": 1,
        "cart_value": 3100,
        "checkout_started": 0,
        "payment_attempts": 0,
        "payment_failed": 0,
        "delivery_days": 4,
        "support_contact": 0,
        "negative_feedback": 0,
        "previous_orders": 1,
    }

    print("\n" + "-" * 75)
    print("[TEST CASE 4] Cart Abandonment without Checkout (MEDIUM Risk)")
    print("Input:")
    print(json.dumps(case_medium, indent=2))
    res_medium = predict_customer_journey(case_medium)
    print("\nResult (JSON Serialized):")
    print(json.dumps(res_medium, indent=2))
    validate_contract(res_medium)

    # Test Case 5: Support & negative feedback (CRITICAL Risk)
    case_5 = {
        "session_id": "SES-7704",
        "customer_id": 150,
        "session_duration": 18,
        "pages_viewed": 12,
        "products_viewed": 3,
        "search_count": 5,
        "cart_items": 1,
        "cart_value": 1800,
        "checkout_started": 0,
        "payment_attempts": 0,
        "payment_failed": 0,
        "delivery_days": 4,
        "support_contact": 1,
        "negative_feedback": 1,
        "previous_orders": 0,
    }

    print("\n" + "-" * 75)
    print("[TEST CASE 5] Customer Support & Negative Feedback (CRITICAL Risk)")
    print("Input:")
    print(json.dumps(case_5, indent=2))
    res_5 = predict_customer_journey(case_5)
    print("\nResult (JSON Serialized):")
    print(json.dumps(res_5, indent=2))
    validate_contract(res_5)

    print("\n" + "=" * 75)
    print("ALL TESTS PASSED! Returned structure strictly conforms to backend contract.")
    print("=" * 75)


if __name__ == "__main__":
    run_tests()
