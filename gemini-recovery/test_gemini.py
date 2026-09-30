"""
test_gemini.py
--------------
Test suite for Person 3: Gemini + Recovery AI.
Runs 5 friction recovery test cases covering:
1. PAYMENT
2. CART_ABANDONMENT
3. PRODUCT_CONFUSION
4. DELIVERY
5. NEGATIVE_FEEDBACK

Validates that analyze_recovery returns all required fields:
- Customer ID
- Friction Type
- Abandonment Risk
- Cause
- Explanation
- Recovery Action
- Customer Message
"""

import sys
from gemini_service import analyze_recovery

# 5 Defined Hackathon Test Cases
TEST_CASES = [
    {
        "title": "TEST 1 - PAYMENT",
        "ml_result": {
            "customer_id": "C101",
            "abandonment_risk": 0.91,
            "friction_type": "PAYMENT",
            "important_factors": [
                "Payment failed",
                "Checkout completed",
            ],
        },
        "customer_message": "Payment was deducted but my order wasn't placed.",
    },
    {
        "title": "TEST 2 - CART ABANDONMENT",
        "ml_result": {
            "customer_id": "C102",
            "abandonment_risk": 0.82,
            "friction_type": "CART_ABANDONMENT",
            "important_factors": [
                "Product added to cart",
                "Checkout not completed",
            ],
        },
        "customer_message": "I added the product but didn't complete the order.",
    },
    {
        "title": "TEST 3 - PRODUCT CONFUSION",
        "ml_result": {
            "customer_id": "C103",
            "abandonment_risk": 0.74,
            "friction_type": "PRODUCT_CONFUSION",
            "important_factors": [
                "Multiple product views",
                "Repeated product comparison",
            ],
        },
        "customer_message": "I'm not sure which size would fit me.",
    },
    {
        "title": "TEST 4 - DELIVERY",
        "ml_result": {
            "customer_id": "C104",
            "abandonment_risk": 0.88,
            "friction_type": "DELIVERY",
            "important_factors": [
                "Delivery delay",
                "Customer contacted support",
            ],
        },
        "customer_message": "My order hasn't arrived yet.",
    },
    {
        "title": "TEST 5 - NEGATIVE FEEDBACK",
        "ml_result": {
            "customer_id": "C105",
            "abandonment_risk": 0.79,
            "friction_type": "NEGATIVE_FEEDBACK",
            "important_factors": [
                "Negative customer feedback",
            ],
        },
        "customer_message": "The shopping experience was frustrating and I couldn't get the help I needed.",
    },
]

REQUIRED_FIELDS = [
    "customer_id",
    "friction_type",
    "abandonment_risk",
    "cause",
    "explanation",
    "recovery_action",
    "customer_message",
]


def run_tests() -> bool:
    print("=" * 70)
    print("AI-POWERED CUSTOMER JOURNEY FRICTION & RECOVERY ASSISTANT")
    print("Person 3 -- Gemini Recovery Module Test Suite")
    print("=" * 70)

    all_passed = True

    for i, test in enumerate(TEST_CASES, start=1):
        print(f"\n--- {test['title']} ---")
        ml_input = test["ml_result"]
        customer_msg = test["customer_message"]

        # Run recovery analysis
        result = analyze_recovery(ml_input, customer_msg)

        # Print outputs clearly as required
        print(f"Customer ID     : {result.get('customer_id')}")
        print(f"Friction Type   : {result.get('friction_type')}")
        print(f"Abandonment Risk: {result.get('abandonment_risk')}")
        print(f"Cause           : {result.get('cause')}")
        print(f"Explanation     : {result.get('explanation')}")
        print(f"Recovery Action : {result.get('recovery_action')}")
        print(f"Customer Message: {result.get('customer_message')}")

        # Validation of required fields
        missing = [f for f in REQUIRED_FIELDS if not result.get(f) and result.get(f) != 0.0]
        if missing:
            print(f"[STATUS] FAILED - Missing fields: {missing}")
            all_passed = False
        else:
            print("[STATUS] PASSED")

    print("\n" + "=" * 70)
    if all_passed:
        print("ALL 5 TESTS COMPLETED SUCCESSFULLY!")
    else:
        print("SOME TESTS FAILED VALIDATION.")
    print("=" * 70)

    return all_passed


if __name__ == "__main__":
    success = run_tests()
    sys.exit(0 if success else 1)
