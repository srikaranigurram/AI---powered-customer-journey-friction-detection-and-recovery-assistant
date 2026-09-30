# JourneyAI — Customer Friction Detection & Recovery Assistant
### Hackathon Frontend & Dashboard (Person 4)

![JourneyAI](https://img.shields.io/badge/Frontend-React%20%2B%20Vite%20%2B%20Tailwind-indigo)
![Charts](https://img.shields.io/badge/Visualization-Recharts-cyan)
![API](https://img.shields.io/badge/Backend%20Ready-FastAPI%20REST-emerald)
![AI Diagnostics](https://img.shields.io/badge/AI%20Engine-Gemini%201.5%20Pro-purple)

**JourneyAI** is an AI-powered customer journey friction detection and automated recovery assistant. It evaluates real-time shopper telemetry, pinpoints conversion drop-off hotspots, generates root-cause AI explanations via Gemini, and triggers personalized multi-channel recovery sequences (WhatsApp, SMS, Email).

---

## 🚀 Key Features Built (Person 4 Responsibility)

### 1. Executive Analytics Dashboard
- **Key Metric Indicators:** Total Customers, High-Risk Customers, Frictions Detected, Recoverable Customers, and Estimated Protected Revenue.
- **Risk Distribution Chart:** Interactive Recharts Donut chart with real-time level segmentation (`HIGH`, `MEDIUM`, `LOW`).
- **Friction Type Breakdown:** Categorized friction hotspots (*Payment Gateway Failure, Shipping Cost Shock, Promo Code Rejection, Comparison Paralysis, Form Validation Error*).
- **6-Stage Journey Drop-Off Funnel:** Funnel conversion tracking from initial discovery to order completion.
- **Recent High-Risk Queue:** Quick-action cards for rapid triage.

### 2. Customer Risk Table
- **Required Columns:**
  1. `Customer ID` (with avatar, profile metadata, device & cart value)
  2. `Risk %` (visual gauge + percentage)
  3. `Risk Level` (Strict color coding: **HIGH = Red**, **MEDIUM = Orange**, **LOW = Green**)
  4. `Friction Type` & Funnel Stage
  5. `Evidence & Telemetry Factors` (Primary blocker and observed signal counts)
  6. `Action` (**View Details** drawer & **Trigger Recovery** button)
- Interactive Search, Risk Level pills, and Friction Category dropdown filters.

### 3. Customer Details & 6-Stage Journey Timeline
- Full slide-over inspection modal displaying:
  1. **Product View** (SKU specs, review interactions)
  2. **Comparison** (Variant comparison, dwell times)
  3. **Add to Cart** (Basket composition)
  4. **Checkout** (Shipping & address calculation)
  5. **Payment** (Gateway tokenization & 3DS verification)
  6. **Order/Abandonment** (Outcome & recovery status)

### 4. Gemini AI Insight Diagnostics
- **Likely Cause:** AI-identified primary root cause of friction.
- **AI Reasoning & Explanation:** Contextual rationale evaluating buyer intent vs technical friction.
- **Recommended Strategy:** Tailored recovery approach.
- **Personalized Customer Message:** Auto-generated recovery copy with 1-click copy & in-app text editor.
- **Confidence Score:** AI inference confidence gauge.

### 5. Multi-Channel Recovery Action Center
- **Strategies Supported:** 1-Click Alternate Payment Link (Apple Pay / PayPal), Dynamic Free Shipping Code, Auto-Applied Coupon, and AI Buyer Recommendation Guides.
- **Channels:** WhatsApp, Email, SMS, In-App Banner.
- **1-Click Dispatch:** Interactive trigger button with celebration animation and toast notification:  
  `"Recovery action triggered successfully."`
- **Real-Time Recovery Logs:** Live audit trail of delivered interventions and protected cart values.

---

## 🛠️ Tech Stack

- **Framework:** React 18 + Vite
- **Styling:** Tailwind CSS (Dark Glassmorphism, Neon Glow accents, Responsive Layout)
- **Charts & Data Viz:** Recharts + Lucide React Icons
- **Animation & Confetti:** Canvas Confetti + Custom CSS Keyframes
- **API Architecture:** Decoupled `src/services/api.js` (Mock & FastAPI toggle)

---

## 📂 Project Architecture

```
src/
├── components/
│   ├── layout/          # Header, Sidebar, MetricCard
│   ├── dashboard/       # OverviewMetrics, RiskDistributionChart, FrictionTypeChart, JourneyFunnelChart, RecentHighRiskWidget
│   ├── customers/       # CustomerRiskTable, CustomerFilters, RiskBadge
│   ├── details/         # CustomerDetailModal, CustomerJourneyTimeline, FrictionEvidenceCard, AIInsightCard
│   ├── recovery/        # RecoveryCenterView, RecoveryActionCard
│   ├── stream/          # LiveJourneyStream (Real-time telemetry feed)
│   ├── api/             # ApiIntegrationDocs (FastAPI team spec)
│   └── common/          # ToastNotification
├── services/
│   ├── api.js           # REST API functions (getCustomers, getCustomerDetails, triggerRecovery, etc.)
│   └── mockData.js      # Rich hackathon mock dataset
├── context/
│   └── DashboardContext.jsx # Global state, filtering, modals, toasts, recovery dispatch
├── styles/
│   └── index.css        # Glassmorphism tokens, glow utilities, dark theme scrollbars
├── App.jsx              # Main tab router & modal manager
└── main.jsx             # React DOM entry point
```

---

## ⚡ Getting Started

### 1. Run Frontend in Development Mode
```bash
npm install
npm run dev
```
The application will launch on `http://localhost:5173/`.

### 2. Connect to Teammates' FastAPI Backend (Person 1, 2, 3)

The frontend is configured to run out-of-the-box using mock JSON data. When your teammates start the FastAPI backend:

1. Copy `.env.example` to `.env`:
   ```bash
   VITE_USE_MOCK=false
   VITE_API_BASE_URL=http://localhost:8000/api
   ```
2. Or toggle **"Mock API / FastAPI"** in the top navigation bar at runtime!

### Expected FastAPI Endpoints in `src/services/api.js`:
- `GET /api/customers` — Returns customer risk list
- `GET /api/customers/{customerId}` — Returns journey steps & evidence
- `GET /api/analytics/risk` — Returns risk summary & distribution
- `GET /api/analytics/friction` — Returns friction categories & funnel drop-offs
- `GET /api/ai/insight/{customerId}` — Returns Gemini diagnostics & copy
- `POST /api/recovery/trigger` — Dispatches recovery action