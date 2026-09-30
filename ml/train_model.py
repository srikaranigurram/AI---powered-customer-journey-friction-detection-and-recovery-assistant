"""
Training Pipeline for Customer Journey Friction Detection & Abandonment Prediction.

Updates:
- Supports the exact 8 friction categories required by the backend contract:
  ['PAYMENT', 'PRICE', 'DELIVERY', 'PRODUCT_INFORMATION', 'PRODUCT_TRUST',
   'DECISION_DIFFICULTY', 'TECHNICAL', 'SUPPORT']
- Aligns risk levels: LOW (<0.25), MEDIUM (0.25-<0.50), HIGH (0.50-<0.75), CRITICAL (>=0.75)
- Saves customer_id and session_id in synthetic data
- Saves trained models and LabelEncoder supporting all 8 classes
- Generates SHAP explanation plot to ml/outputs/shap_summary.png
"""

import os
import sys
from pathlib import Path
import joblib
import matplotlib
matplotlib.use("Agg")  # Non-interactive backend for headless environments
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import shap
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    f1_score,
    precision_score,
    recall_score,
)
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from xgboost import XGBClassifier

# Ensure repository root and ml directory are in sys.path
BASE_DIR = Path(__file__).resolve().parent
REPO_ROOT = BASE_DIR.parent
if str(REPO_ROOT) not in sys.path:
    sys.path.insert(0, str(REPO_ROOT))
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

# Import reusable feature engineering from predictor
try:
    from ml.predictor import ALL_FEATURES, FRICTION_CATEGORIES, prepare_features
except ImportError:
    from predictor import ALL_FEATURES, FRICTION_CATEGORIES, prepare_features

# Destination paths
DATA_DIR = BASE_DIR / "data"
MODELS_DIR = BASE_DIR / "models"
OUTPUTS_DIR = BASE_DIR / "outputs"

DATA_FILE = DATA_DIR / "customer_data.csv"
ABANDONMENT_MODEL_FILE = MODELS_DIR / "abandonment_model.pkl"
FRICTION_MODEL_FILE = MODELS_DIR / "friction_model.pkl"
FRICTION_ENCODER_FILE = MODELS_DIR / "friction_encoder.pkl"
SHAP_SUMMARY_FILE = OUTPUTS_DIR / "shap_summary.png"


def generate_synthetic_dataset(n_samples: int = 2400, seed: int = 42) -> pd.DataFrame:
    """
    Generates a realistic synthetic customer journey dataset supporting all 8 backend friction categories:
    - PAYMENT
    - PRICE
    - DELIVERY
    - PRODUCT_INFORMATION
    - PRODUCT_TRUST
    - DECISION_DIFFICULTY
    - TECHNICAL
    - SUPPORT
    """
    np.random.seed(seed)

    # 1. Identifiers
    customer_ids = [i + 1 for i in range(n_samples)]
    session_ids = [f"SES-{8000 + i}" for i in range(n_samples)]

    # 2. Session browsing characteristics
    session_duration = np.random.exponential(scale=11.0, size=n_samples) + 1.0
    session_duration = np.round(np.clip(session_duration, 1.0, 60.0), 1)

    pages_viewed = np.random.poisson(lam=9, size=n_samples) + 1
    pages_viewed = np.clip(pages_viewed, 1, 35)

    products_viewed = [
        int(np.random.randint(0, max(1, p))) for p in pages_viewed
    ]
    products_viewed = np.array(products_viewed)

    search_count = np.random.poisson(lam=3, size=n_samples)
    search_count = np.clip(search_count, 0, 15)

    previous_orders = np.random.poisson(lam=2.5, size=n_samples)
    previous_orders = np.clip(previous_orders, 0, 15)

    # 3. Cart & checkout progression
    cart_items = np.where(
        products_viewed > 0,
        np.random.poisson(lam=1.8, size=n_samples),
        0,
    )
    cart_items = np.clip(cart_items, 0, 10)

    base_item_price = np.random.uniform(400, 2800, size=n_samples)
    cart_value = np.where(
        cart_items > 0,
        np.round(cart_items * base_item_price, 2),
        0.0,
    )

    checkout_started = np.where(
        cart_items > 0,
        np.random.binomial(1, 0.72, size=n_samples),
        np.random.binomial(1, 0.05, size=n_samples),
    )

    # Payment attempts: only if checkout started
    payment_attempts = np.zeros(n_samples, dtype=int)
    has_checkout = checkout_started == 1
    payment_attempts[has_checkout] = np.random.choice(
        [0, 1, 2, 3, 4],
        size=np.sum(has_checkout),
        p=[0.08, 0.60, 0.18, 0.10, 0.04],
    )

    # Payment failed
    prob_payment_fail = np.zeros(n_samples)
    prob_payment_fail[payment_attempts == 1] = 0.08
    prob_payment_fail[payment_attempts == 2] = 0.75
    prob_payment_fail[payment_attempts >= 3] = 0.92
    payment_failed = np.random.binomial(1, prob_payment_fail)

    # Delivery days: 1 to 14 days
    delivery_days = np.random.choice(
        np.arange(1, 15),
        size=n_samples,
        p=[0.05, 0.12, 0.17, 0.20, 0.15, 0.10, 0.06, 0.04, 0.03, 0.03, 0.02, 0.01, 0.01, 0.01],
    )

    # Support contact & negative feedback
    prob_support = 0.10 + 0.35 * payment_failed + 0.20 * (delivery_days > 7)
    prob_support = np.clip(prob_support, 0.02, 0.85)
    support_contact = np.random.binomial(1, prob_support)

    prob_feedback = 0.06 + 0.25 * payment_failed + 0.25 * (delivery_days > 7) + 0.20 * support_contact
    prob_feedback = np.clip(prob_feedback, 0.01, 0.80)
    negative_feedback = np.random.binomial(1, prob_feedback)

    # 4. Target 1: Abandonment probability and outcome
    logit = (
        -1.3
        + 2.6 * payment_failed
        + 1.7 * (payment_attempts > 1)
        + 1.3 * (delivery_days > 7)
        + 1.2 * support_contact
        + 1.5 * negative_feedback
        + 1.2 * (cart_items > 0) * (checkout_started == 0)
        + 0.9 * (cart_value > 4500)
        - 0.28 * previous_orders
        + np.random.normal(0, 0.45, size=n_samples)
    )
    prob_abandon = 1.0 / (1.0 + np.exp(-logit))
    abandoned = np.random.binomial(1, prob_abandon)

    # 5. Target 2: Customer Friction Type (Strictly 8 categories)
    # ['PAYMENT', 'PRICE', 'DELIVERY', 'PRODUCT_INFORMATION', 'PRODUCT_TRUST', 'DECISION_DIFFICULTY', 'TECHNICAL', 'SUPPORT']
    friction_types = []
    for i in range(n_samples):
        # 1. Payment friction
        if payment_failed[i] == 1 or payment_attempts[i] >= 2:
            friction_types.append("PAYMENT")
        # 2. Delivery friction
        elif delivery_days[i] > 7:
            friction_types.append("DELIVERY")
        # 3. Support friction
        elif support_contact[i] == 1:
            friction_types.append("SUPPORT")
        # 4. Product trust friction
        elif negative_feedback[i] == 1 and previous_orders[i] <= 1:
            friction_types.append("PRODUCT_TRUST")
        # 5. Price friction
        elif cart_value[i] >= 3500 and (checkout_started[i] == 0 or payment_attempts[i] == 0):
            friction_types.append("PRICE")
        # 6. Technical friction
        elif checkout_started[i] == 1 and payment_attempts[i] == 0 and session_duration[i] >= 10:
            friction_types.append("TECHNICAL")
        # 7. Decision difficulty friction
        elif products_viewed[i] >= 6 and session_duration[i] >= 12:
            friction_types.append("DECISION_DIFFICULTY")
        # 8. Product information friction
        elif search_count[i] >= 3 and products_viewed[i] <= 3:
            friction_types.append("PRODUCT_INFORMATION")
        else:
            # Assign remaining cases across categories naturally based on behavioral tilt
            if cart_value[i] > 2000:
                friction_types.append("PRICE")
            elif products_viewed[i] >= 4:
                friction_types.append("DECISION_DIFFICULTY")
            elif search_count[i] >= 2:
                friction_types.append("PRODUCT_INFORMATION")
            elif previous_orders[i] == 0:
                friction_types.append("PRODUCT_TRUST")
            elif session_duration[i] > 15:
                friction_types.append("TECHNICAL")
            else:
                friction_types.append(np.random.choice(FRICTION_CATEGORIES))

    # Add 4% label noise to prevent artificial determinism
    for idx in range(n_samples):
        if np.random.rand() < 0.04:
            friction_types[idx] = np.random.choice(FRICTION_CATEGORIES)

    df = pd.DataFrame({
        "customer_id": customer_ids,
        "session_id": session_ids,
        "session_duration": session_duration,
        "pages_viewed": pages_viewed,
        "products_viewed": products_viewed,
        "search_count": search_count,
        "cart_items": cart_items,
        "cart_value": cart_value,
        "checkout_started": checkout_started,
        "payment_attempts": payment_attempts,
        "payment_failed": payment_failed,
        "delivery_days": delivery_days,
        "support_contact": support_contact,
        "negative_feedback": negative_feedback,
        "previous_orders": previous_orders,
        "abandoned": abandoned,
        "friction_type": friction_types,
    })

    return df


def train_and_evaluate_models():
    """
    Main training routine:
    - Generates & saves dataset with all 8 friction categories
    - Preprocesses features
    - Trains Model 1 (Abandonment XGBoost binary classifier)
    - Trains Model 2 (Friction type XGBoost multiclass classifier on 8 categories)
    - Evaluates both models
    - Saves models and encoder
    - Generates SHAP explanation plot
    """
    # Create required subdirectories
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    MODELS_DIR.mkdir(parents=True, exist_ok=True)
    OUTPUTS_DIR.mkdir(parents=True, exist_ok=True)

    print("=" * 70)
    print("STEP 1: Generating Synthetic E-Commerce Customer Dataset...")
    print("=" * 70)
    df = generate_synthetic_dataset(n_samples=2400, seed=42)
    df.to_csv(DATA_FILE, index=False)
    print(f"Dataset successfully created with {len(df)} records.")
    print(f"Saved to: {DATA_FILE}")
    print(f"Abandonment distribution:\n{df['abandoned'].value_counts(normalize=True).round(3)}")
    print(f"\nFriction category distribution (8 required classes):\n{df['friction_type'].value_counts()}")

    print("\n" + "=" * 70)
    print("STEP 2: Feature Engineering & Preprocessing...")
    print("=" * 70)
    X = prepare_features(df)
    y_abandonment = df["abandoned"]
    y_friction_raw = df["friction_type"]

    # Encode multiclass friction labels
    friction_encoder = LabelEncoder()
    friction_encoder.fit(FRICTION_CATEGORIES)
    y_friction = friction_encoder.transform(y_friction_raw)

    print(f"Total model features ({len(ALL_FEATURES)}): {ALL_FEATURES}")
    print(f"Friction classes ({len(friction_encoder.classes_)}): {list(friction_encoder.classes_)}")

    # Split datasets (80% train, 20% test)
    X_train_ab, X_test_ab, y_train_ab, y_test_ab = train_test_split(
        X, y_abandonment, test_size=0.20, random_state=42, stratify=y_abandonment
    )

    X_train_fr, X_test_fr, y_train_fr, y_test_fr = train_test_split(
        X, y_friction, test_size=0.20, random_state=42, stratify=y_friction
    )

    print("\n" + "=" * 70)
    print("STEP 3: Training Model 1 - Purchase Abandonment (XGBoost Binary)")
    print("=" * 70)
    abandonment_model = XGBClassifier(
        n_estimators=100,
        max_depth=4,
        learning_rate=0.08,
        subsample=0.85,
        colsample_bytree=0.85,
        eval_metric="logloss",
        random_state=42,
    )
    abandonment_model.fit(X_train_ab, y_train_ab)

    # Evaluate Model 1
    y_pred_ab = abandonment_model.predict(X_test_ab)
    acc_ab = accuracy_score(y_test_ab, y_pred_ab)
    prec_ab = precision_score(y_test_ab, y_pred_ab)
    rec_ab = recall_score(y_test_ab, y_pred_ab)
    f1_ab = f1_score(y_test_ab, y_pred_ab)

    print(f"Accuracy  : {acc_ab:.4f}")
    print(f"Precision : {prec_ab:.4f}")
    print(f"Recall    : {rec_ab:.4f}")
    print(f"F1-Score  : {f1_ab:.4f}")
    print("\nModel 1 Classification Report:")
    print(classification_report(y_test_ab, y_pred_ab, target_names=["Purchased (0)", "Abandoned (1)"]))

    print("\n" + "=" * 70)
    print("STEP 4: Training Model 2 - Friction Classification (8 Categories)")
    print("=" * 70)
    friction_model = XGBClassifier(
        n_estimators=120,
        max_depth=5,
        learning_rate=0.08,
        subsample=0.85,
        colsample_bytree=0.85,
        objective="multi:softprob",
        eval_metric="mlogloss",
        random_state=42,
    )
    friction_model.fit(X_train_fr, y_train_fr)

    # Evaluate Model 2
    y_pred_fr = friction_model.predict(X_test_fr)
    acc_fr = accuracy_score(y_test_fr, y_pred_fr)
    f1_fr_macro = f1_score(y_test_fr, y_pred_fr, average="macro")
    f1_fr_weighted = f1_score(y_test_fr, y_pred_fr, average="weighted")

    print(f"Accuracy         : {acc_fr:.4f}")
    print(f"Macro F1-Score   : {f1_fr_macro:.4f}")
    print(f"Weighted F1-Score: {f1_fr_weighted:.4f}")
    print("\nModel 2 Classification Report:")
    print(classification_report(y_test_fr, y_pred_fr, target_names=friction_encoder.classes_))

    print("\n" + "=" * 70)
    print("STEP 5: Saving Trained Models & Encoders...")
    print("=" * 70)
    joblib.dump(abandonment_model, ABANDONMENT_MODEL_FILE)
    print(f"Saved Abandonment Model -> {ABANDONMENT_MODEL_FILE}")

    joblib.dump(friction_model, FRICTION_MODEL_FILE)
    print(f"Saved Friction Model    -> {FRICTION_MODEL_FILE}")

    joblib.dump(friction_encoder, FRICTION_ENCODER_FILE)
    print(f"Saved Friction Encoder  -> {FRICTION_ENCODER_FILE}")

    print("\n" + "=" * 70)
    print("STEP 6: Generating SHAP Explainability Plot...")
    print("=" * 70)
    try:
        explainer = shap.TreeExplainer(abandonment_model)
        shap_values = explainer.shap_values(X_test_ab)

        plt.figure(figsize=(10, 6))
        shap.summary_plot(shap_values, X_test_ab, show=False)
        plt.title("SHAP Feature Importance - Customer Abandonment Risk", fontsize=13, pad=12)
        plt.savefig(SHAP_SUMMARY_FILE, bbox_inches="tight", dpi=300)
        plt.close()
        print(f"SHAP summary plot successfully saved -> {SHAP_SUMMARY_FILE}")
    except Exception as e:
        print(f"Warning: SHAP plot generation encountered an issue: {e}")
        try:
            shap_obj = explainer(X_test_ab)
            plt.figure(figsize=(10, 6))
            shap.plots.beeswarm(shap_obj, show=False)
            plt.title("SHAP Feature Importance - Customer Abandonment Risk", fontsize=13, pad=12)
            plt.savefig(SHAP_SUMMARY_FILE, bbox_inches="tight", dpi=300)
            plt.close()
            print(f"Fallback SHAP plot saved -> {SHAP_SUMMARY_FILE}")
        except Exception as fallback_error:
            print(f"SHAP Fallback also failed: {fallback_error}")

    print("\n" + "=" * 70)
    print("ML Pipeline Training Completed Successfully!")
    print("=" * 70)


if __name__ == "__main__":
    train_and_evaluate_models()
