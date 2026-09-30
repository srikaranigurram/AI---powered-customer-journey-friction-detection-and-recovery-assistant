"""
Predictor Module for Customer Journey Friction Detection & Recovery.

Main backend integration function:
    from ml.predictor import predict_customer_journey

Returns the exact backend contract format:
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

from pathlib import Path
from typing import Any, Dict, List, Union
import joblib
import numpy as np
import pandas as pd

# Directory paths
BASE_DIR = Path(__file__).resolve().parent
MODELS_DIR = BASE_DIR / "models"
ABANDONMENT_MODEL_PATH = MODELS_DIR / "abandonment_model.pkl"
FRICTION_MODEL_PATH = MODELS_DIR / "friction_model.pkl"
FRICTION_ENCODER_PATH = MODELS_DIR / "friction_encoder.pkl"

# Model metadata
MODEL_VERSION = "xgboost_v1.0"

# The 8 friction categories required by the backend contract
FRICTION_CATEGORIES = [
    "DECISION_DIFFICULTY",
    "DELIVERY",
    "PAYMENT",
    "PRICE",
    "PRODUCT_INFORMATION",
    "PRODUCT_TRUST",
    "SUPPORT",
    "TECHNICAL",
]

# Raw feature list expected from input (excluding session_id / customer_id / targets)
BASE_FEATURE_NAMES = [
    "session_duration",
    "pages_viewed",
    "products_viewed",
    "search_count",
    "cart_items",
    "cart_value",
    "checkout_started",
    "payment_attempts",
    "payment_failed",
    "delivery_days",
    "support_contact",
    "negative_feedback",
    "previous_orders",
]

# Engineered feature names
ENGINEERED_FEATURE_NAMES = [
    "payment_failure_rate",
    "engagement_score",
    "delivery_risk",
    "support_friction",
]

# Combined features used by the models
ALL_FEATURES = BASE_FEATURE_NAMES + ENGINEERED_FEATURE_NAMES

# Cached model instances for fast prediction
_abandonment_model = None
_friction_model = None
_friction_encoder = None


def load_models():
    """
    Loads and caches trained models and encoders from disk.
    """
    global _abandonment_model, _friction_model, _friction_encoder

    if _abandonment_model is None:
        if not ABANDONMENT_MODEL_PATH.exists():
            raise FileNotFoundError(
                f"Model file not found at {ABANDONMENT_MODEL_PATH}. "
                "Please run `python ml/train_model.py` first."
            )
        _abandonment_model = joblib.load(ABANDONMENT_MODEL_PATH)

    if _friction_model is None:
        if not FRICTION_MODEL_PATH.exists():
            raise FileNotFoundError(
                f"Model file not found at {FRICTION_MODEL_PATH}. "
                "Please run `python ml/train_model.py` first."
            )
        _friction_model = joblib.load(FRICTION_MODEL_PATH)

    if _friction_encoder is None:
        if not FRICTION_ENCODER_PATH.exists():
            raise FileNotFoundError(
                f"Encoder file not found at {FRICTION_ENCODER_PATH}. "
                "Please run `python ml/train_model.py` first."
            )
        _friction_encoder = joblib.load(FRICTION_ENCODER_PATH)

    return _abandonment_model, _friction_model, _friction_encoder


def prepare_features(data: Union[Dict[str, Any], pd.DataFrame]) -> pd.DataFrame:
    """
    Transforms raw customer attributes into engineered model features.
    Accepts either a single dictionary or a pandas DataFrame.
    Returns a DataFrame containing ALL_FEATURES in the exact order needed by models.
    """
    if isinstance(data, dict):
        df = pd.DataFrame([data])
    elif isinstance(data, pd.DataFrame):
        df = data.copy()
    else:
        raise ValueError("Input data must be a dictionary or a pandas DataFrame.")

    # Fill any missing base features with standard defaults
    for col in BASE_FEATURE_NAMES:
        if col not in df.columns:
            df[col] = 0

    # Ensure numeric types
    for col in BASE_FEATURE_NAMES:
        df[col] = pd.to_numeric(df[col], errors="coerce").fillna(0)

    # 1. Feature: payment_failure_rate
    attempts = df["payment_attempts"]
    failed = df["payment_failed"]
    df["payment_failure_rate"] = np.where(attempts > 0, failed / attempts, 0.0)

    # 2. Feature: engagement_score
    interactions = df["pages_viewed"] + df["products_viewed"] + df["search_count"]
    df["engagement_score"] = interactions / (df["session_duration"] + 1.0)

    # 3. Feature: delivery_risk
    df["delivery_risk"] = np.where(df["delivery_days"] > 7, 1.0, 0.0)

    # 4. Feature: support_friction
    has_support_contact = df["support_contact"] == 1
    has_negative_feedback = df["negative_feedback"] == 1
    df["support_friction"] = np.where(has_support_contact | has_negative_feedback, 1.0, 0.0)

    return df[ALL_FEATURES]


def generate_contributing_factors(customer_data: Dict[str, Any]) -> List[str]:
    """
    Generates human-readable contributing factors based on actual customer behavior.
    Matches the required backend friction and risk signals.
    """
    factors: List[str] = []

    payment_failed = customer_data.get("payment_failed", 0)
    payment_attempts = customer_data.get("payment_attempts", 0)
    checkout_started = customer_data.get("checkout_started", 0)
    session_duration = customer_data.get("session_duration", 0)
    delivery_days = customer_data.get("delivery_days", 0)
    support_contact = customer_data.get("support_contact", 0)
    negative_feedback = customer_data.get("negative_feedback", 0)
    cart_items = customer_data.get("cart_items", 0)
    cart_value = customer_data.get("cart_value", 0)
    products_viewed = customer_data.get("products_viewed", 0)
    search_count = customer_data.get("search_count", 0)

    # Payment signals
    if payment_failed == 1:
        if payment_attempts == 2:
            factors.append("Two failed payment attempts")
        elif payment_attempts > 2:
            factors.append(f"{payment_attempts} failed payment attempts")
        else:
            factors.append("Payment failed")
    elif payment_attempts > 1:
        factors.append("Multiple payment attempts")

    # Checkout signals
    if checkout_started == 1:
        factors.append("Checkout was started")

    # Dwell time / session duration
    if session_duration >= 12:
        factors.append("Payment page dwell time was high")

    # Delivery signals
    if delivery_days > 7:
        factors.append("Long delivery time")

    # Support & Feedback signals
    if support_contact == 1:
        factors.append("Customer contacted support")

    if negative_feedback == 1:
        factors.append("Negative feedback")

    # Price / Cart signals
    if cart_value >= 3500 and cart_items > 0:
        factors.append("High cart value hesitation")

    # Decision / Information signals
    if products_viewed >= 6 and cart_items <= 1:
        factors.append("High product comparison without purchase")

    if search_count >= 4 and products_viewed <= 2:
        factors.append("High search count indicating product information difficulty")

    return factors


def get_risk_level(probability: float) -> str:
    """
    Maps abandonment probability to backend risk level:
    - 0.00 to <0.25: LOW
    - 0.25 to <0.50: MEDIUM
    - 0.50 to <0.75: HIGH
    - 0.75 to 1.00:  CRITICAL
    """
    if probability < 0.25:
        return "LOW"
    elif probability < 0.50:
        return "MEDIUM"
    elif probability < 0.75:
        return "HIGH"
    else:
        return "CRITICAL"


def predict_customer_journey(customer_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Main prediction endpoint for Person 2 (FastAPI backend).

    Accepts:
        customer_data: Python dictionary with customer feature values, session_id, customer_id.

    Returns:
        JSON-serializable Python dictionary matching the backend contract:
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
    # Load cached models
    abandonment_model, friction_model, friction_encoder = load_models()

    # Preserve session_id and customer_id
    session_id = customer_data.get("session_id", "SES-0001")
    customer_id = customer_data.get("customer_id", 1)

    # Preprocess features using exact same logic as training
    features_df = prepare_features(customer_data)

    # 1. Predict abandonment probability (Model 1)
    abandonment_proba = abandonment_model.predict_proba(features_df)[0]
    # Class 1 is abandonment
    risk_prob = float(abandonment_proba[1])
    abandonment_probability = round(float(np.clip(risk_prob, 0.0, 1.0)), 2)
    risk_level = get_risk_level(abandonment_probability)

    # 2. Predict customer friction type (Model 2 - 8 categories)
    friction_proba = friction_model.predict_proba(features_df)[0]
    predicted_class_idx = int(np.argmax(friction_proba))
    confidence = round(float(friction_proba[predicted_class_idx]), 2)
    predicted_friction = str(friction_encoder.inverse_transform([predicted_class_idx])[0])

    # 3. Generate contributing factors
    contributing_factors = generate_contributing_factors(customer_data)

    return {
        "session_id": session_id,
        "customer_id": customer_id,
        "abandonment_probability": abandonment_probability,
        "risk_level": risk_level,
        "predicted_friction": predicted_friction,
        "confidence": confidence,
        "contributing_factors": contributing_factors,
        "model_version": MODEL_VERSION,
    }


# Backwards compatibility alias
predict_customer = predict_customer_journey
