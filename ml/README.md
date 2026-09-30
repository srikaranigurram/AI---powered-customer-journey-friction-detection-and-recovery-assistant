# ML Module: Customer Journey Friction Detection & Recovery

This directory contains the **Data + Machine Learning module (Person 1)** for the **AI-Powered Customer Journey Friction Detection and Recovery Assistant**.

---

## 📌 Module Overview

The ML module detects customer journey friction and predicts e-commerce cart/checkout abandonment in real time:
1. **Generates realistic synthetic data** (~2,400 customer sessions) mimicking genuine drop-off behaviors (payment failures, slow delivery, support escalations, price hesitation, decision difficulty).
2. **Engineers reusable behavioral features** (`payment_failure_rate`, `engagement_score`, `delivery_risk`, `support_friction`).
3. **Trains Model 1 (Abandonment Risk)**: XGBoost binary classifier predicting probability of abandonment and classifying risk into `LOW`, `MEDIUM`, `HIGH`, or `CRITICAL`.
4. **Trains Model 2 (Friction Type)**: XGBoost multiclass classifier diagnosing primary root cause across 8 strict backend categories with confidence scores.
5. **Provides Explainability**: SHAP TreeExplainer summary plot highlighting feature influence on abandonment risk.
6. **Exports Clean Prediction Interface**: A single lightweight function `predict_customer_journey()` returning the exact schema required by Person 2's FastAPI backend.

---

## 📁 Folder Structure

```
ml/
├── train_model.py          # Data generation, preprocessing, training, evaluation, SHAP plot
├── predictor.py            # Model loading, feature engineering, and predict_customer_journey() API
├── test_predictor.py       # Integration tests validating the backend contract schema
├── requirements.txt        # ML module dependencies
├── README.md               # Documentation & integration instructions
├── data/
│   └── customer_data.csv   # Generated synthetic customer records (2,400 rows)
├── models/
│   ├── abandonment_model.pkl # Trained XGBoost binary model (Abandonment)
│   ├── friction_model.pkl    # Trained XGBoost multiclass model (8 friction categories)
│   └── friction_encoder.pkl  # Fitted LabelEncoder for the 8 friction categories
└── outputs/
    └── shap_summary.png     # SHAP TreeExplainer feature importance plot
```

---

## 📊 Dataset Features & Targets

### Raw Features
| Feature Name | Type | Description |
|---|---|---|
| `customer_id` | Integer / String | Unique customer identifier |
| `session_id` | String | Unique session identifier (e.g. `SES-8891`) |
| `session_duration` | Float | Total browsing session duration in minutes |
| `pages_viewed` | Integer | Total web pages viewed |
| `products_viewed` | Integer | Number of distinct product pages viewed |
| `search_count` | Integer | Number of catalog searches conducted |
| `cart_items` | Integer | Number of items added to the cart |
| `cart_value` | Float | Total monetary value of items in the cart |
| `checkout_started` | Integer (0/1) | Whether the customer initiated the checkout flow |
| `payment_attempts` | Integer | Total attempts made to process payment |
| `payment_failed` | Integer (0/1) | Whether payment transaction failed |
| `delivery_days` | Integer | Estimated or historical delivery time in days |
| `support_contact` | Integer (0/1) | Whether customer reached out to support |
| `negative_feedback`| Integer (0/1) | Whether customer submitted negative feedback/complaint |
| `previous_orders` | Integer | Historical completed orders by the customer |

### Engineered Features
- **`payment_failure_rate`**: `payment_failed / payment_attempts` (0.0 if 0 attempts).
- **`engagement_score`**: `(pages_viewed + products_viewed + search_count) / (session_duration + 1.0)`.
- **`delivery_risk`**: `1.0` if `delivery_days > 7`, else `0.0`.
- **`support_friction`**: `1.0` if `support_contact == 1` or `negative_feedback == 1`, else `0.0`.

### The 8 Friction Categories (`predicted_friction`)
The model strictly predicts one of these 8 categories:
1. `PAYMENT`
2. `PRICE`
3. `DELIVERY`
4. `PRODUCT_INFORMATION`
5. `PRODUCT_TRUST`
6. `DECISION_DIFFICULTY`
7. `TECHNICAL`
8. `SUPPORT`

### Risk Tiers (`risk_level`)
- `0.00` to `<0.25`: **LOW**
- `0.25` to `<0.50`: **MEDIUM**
- `0.50` to `<0.75`: **HIGH**
- `0.75` to `1.00`: **CRITICAL**

---

## 🚀 How to Train & Test

### 1. Install Dependencies
```bash
pip install -r ml/requirements.txt
```

### 2. Train Models & Generate Assets
Run from the repository root:
```bash
python ml/train_model.py
```
This automatically:
- Synthesizes 2,400 customer sessions into `ml/data/customer_data.csv`.
- Trains and evaluates both XGBoost models.
- Prints Accuracy, Precision, Recall, F1-scores, and classification reports.
- Saves model artifacts into `ml/models/`.
- Generates `ml/outputs/shap_summary.png`.

### 3. Run Inference Tests
Run from the repository root:
```bash
python ml/test_predictor.py
```

---

## 🔌 Person 2 Integration (FastAPI Backend)

### Exact Import Statement
```python
from ml.predictor import predict_customer_journey
```

### Example Input
Pass a Python dictionary containing the customer feature values, along with session and customer IDs:
```python
customer_data = {
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
    "previous_orders": 2
}

prediction = predict_customer_journey(customer_data)
```

### Exact Output Contract
The function returns a 100% JSON-serializable Python dictionary matching the backend contract:
```json
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
```

### Sending Prediction to Backend API Endpoint
Person 2 or testing scripts can dispatch the prediction result to the FastAPI endpoint:
```python
import requests
from ml.predictor import predict_customer_journey

# 1. Run local ML inference
prediction = predict_customer_journey(customer_data)

# 2. Forward to FastAPI backend
response = requests.post(
    "http://localhost:8000/api/v1/predictions/",
    json=prediction
)

print("API Response Code:", response.status_code)
print("API Response Body:", response.json())
```
