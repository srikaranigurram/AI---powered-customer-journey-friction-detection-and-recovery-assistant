# Backend & Database Module

**Project:** AI-Powered Customer Journey Friction Detection and Recovery Assistant  
**Branch:** `feature/backend-database`  
**Tech Stack:** Python 3.12+, FastAPI, SQLAlchemy 2.0, PostgreSQL / SQLite, Pydantic v2

---

## 🚀 Quick Start (Local Run)

### 1. Install Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 2. Configure Environment (.env)
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
By default, the backend connects to SQLite (`sqlite:///./friction_assistant.db`) for zero-configuration instant local development.
To connect to PostgreSQL, set:
```ini
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/friction_assistant_db
```

### 3. (Optional) Seed Sample Prototype Data
Populate realistic sample customer journeys, rage clicks, ML predictions, and recovery actions:
```bash
python seed_data.py
```

### 4. Start the FastAPI Server
```bash
uvicorn app.main:app --reload --port 8000
```
- **API Base:** `http://localhost:8000`
- **Swagger Interactive API Docs:** `http://localhost:8000/docs`
- **ReDoc:** `http://localhost:8000/redoc`

---

## 🔌 Teammate Integration Guide

### 1. For the ML Teammate (XGBoost Friction/Abandonment Prediction)
Send model predictions to the backend whenever user telemetry indicates potential friction.

* **Endpoint:** `POST /api/v1/predictions/`
* **Request Body:**
```json
{
  "session_id": "SES-8891",
  "customer_id": 1,
  "abandonment_probability": 0.88,
  "risk_level": "HIGH",
  "predicted_friction": "Repeated Promo Code Failure & Rage Click Burst",
  "confidence": 0.94,
  "contributing_factors": [
    "Rage click burst count = 6 on checkout coupon",
    "Dwell time > 60s on payment screen",
    "Coupon error count = 2"
  ],
  "model_version": "xgboost_v1.0"
}
```
* **Fetch Latest Prediction for Session:** `GET /api/v1/predictions/session/{session_id}`

---

### 2. For the Gemini / AI Teammate (Explanation & Recovery Assistant)
Generate and record empathetic recovery interventions based on detected friction.

* **Endpoint:** `POST /api/v1/recovery/`
* **Request Body:**
```json
{
  "session_id": "SES-8891",
  "prediction_id": 1,
  "customer_id": 1,
  "friction_explanation": "Customer encountered an expired promo code error and exhibited rage-clicking behavior on the apply button.",
  "evidence": {
    "session_id": "SES-8891",
    "failed_code": "FALL25",
    "rage_clicks": 6
  },
  "recommended_action": "Instant Fallback VIP Discount Voucher Modal",
  "generated_message": "We noticed your discount code didn't apply! As a valued VIP member, here is an exclusive 15% discount applied automatically.",
  "discount_code": "VIP15OFF",
  "action_status": "PENDING"
}
```
* **Fetch Active Recoveries for Session:** `GET /api/v1/recovery/session/{session_id}`
* **Update Action Status (Shopper accepted/dismissed):** `PATCH /api/v1/recovery/{recovery_id}/status` with `{ "action_status": "ACCEPTED" }`

---

### 3. For the React Frontend Teammate (Dashboard & Analytics)
All endpoints include CORS middleware pre-configured for `http://localhost:3000`, `http://localhost:5173`, and `http://localhost:5174`.

* **Dashboard KPI Summary:** `GET /api/v1/dashboard/stats`
* **End-to-End Session Journey (Events + Prediction + Recovery):** `GET /api/v1/dashboard/customer-journey/{session_id}`
* **Customers List:** `GET /api/v1/customers/`
* **Recent Events Feed:** `GET /api/v1/journey-events/`
* **All Predictions (with risk filtering):** `GET /api/v1/predictions/?risk_level=HIGH`
* **Ingest Telemetry Event from Web App:** `POST /api/v1/journey-events/`

---

## 🗄️ Database Tables Overview

| Table Name | Description |
| :--- | :--- |
| `customers` | Customer profiles, identifiers, segments (VIP, New, etc.) |
| `journey_events` | Clickstream & user telemetry (clicks, rage_clicks, latency, errors) |
| `prediction_results` | ML friction & abandonment predictions, probabilities, and factors |
| `recovery_actions` | Gemini-generated explanations, recommendations, and recovery copy |
