import React, { useState } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import {
  Code2,
  Copy,
  Check,
  Server,
  Layers,
  Bot
} from 'lucide-react';

export default function ApiIntegrationDocs() {
  const { useMockData, apiBaseUrl, handleToggleApiMode, addToast } = useDashboard();
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [customBaseUrl, setCustomBaseUrl] = useState(apiBaseUrl);

  const endpoints = [
    {
      method: 'GET',
      path: '/api/customers',
      description: 'Fetch all evaluated customers (Person 1 ML Output schema mapped)',
      responseExample: `[
  {
    "customer_id": "CUST-8492",
    "name": "Alex Rivera",
    "risk_score": 94,
    "risk_level": "HIGH",
    "friction_type": "Payment Gateway Failure",
    "evidence": [
      "3DS authentication timeout",
      "Payment retry detected",
      "Checkout abandonment"
    ],
    "cart_value": 349.99,
    "status": "Pending Recovery"
  }
]`
    },
    {
      method: 'GET',
      path: '/api/customers/{customerId}',
      description: 'Fetch complete customer profile, 6-step journey timeline, and friction factors',
      responseExample: `{
  "customer_id": "CUST-8492",
  "name": "Alex Rivera",
  "risk_score": 94,
  "risk_level": "HIGH",
  "friction_type": "Payment Gateway Failure",
  "cart_value": 349.99,
  "evidence": [
    "3DS authentication timeout",
    "Payment retry detected"
  ],
  "journey": [
    { "step": "Product View", "status": "completed", "duration": "3m 12s" },
    { "step": "Comparison", "status": "completed", "duration": "4m 45s" },
    { "step": "Add to Cart", "status": "completed", "duration": "45s" },
    { "step": "Checkout", "status": "completed", "duration": "1m 10s" },
    { "step": "Payment", "status": "friction", "duration": "7m 05s" },
    { "step": "Order/Abandonment", "status": "abandoned", "duration": "Now" }
  ]
}`
    },
    {
      method: 'GET',
      path: '/api/analytics/risk',
      description: 'Dashboard summary metrics: total, high-risk, frictions, and distribution',
      responseExample: `{
  "totalCustomers": 1248,
  "highRiskCustomers": 142,
  "frictionsDetected": 189,
  "recoverableCustomers": 118,
  "riskDistribution": [
    { "name": "High Risk", "count": 142, "color": "#EF4444" },
    { "name": "Medium Risk", "count": 286, "color": "#F59E0B" },
    { "name": "Low Risk", "count": 820, "color": "#10B981" }
  ]
}`
    },
    {
      method: 'GET',
      path: '/api/analytics/friction',
      description: 'Friction classification breakdown & funnel drop-offs',
      responseExample: `{
  "frictionTypes": [
    { "type": "Payment Gateway Failure", "count": 68, "color": "#EF4444" },
    { "type": "Shipping Cost Shock", "count": 47, "color": "#F97316" },
    { "type": "Promo Code Invalid Error", "count": 35, "color": "#F59E0B" }
  ]
}`
    },
    {
      method: 'GET',
      path: '/api/ai-insight/{customerId}',
      description: 'Gemini diagnostics: cause, reasoning, recommended recovery, and personalized copy',
      responseExample: `{
  "customer_id": "CUST-8492",
  "cause": "Payment processing issue",
  "explanation": "The customer experienced repeated payment failures before abandoning checkout.",
  "recommended_recovery": "Offer an alternate payment method.",
  "personalized_message": "Your previous payment was not completed. You can retry using another payment method."
}`
    },
    {
      method: 'POST',
      path: '/api/recovery/{customerId}',
      description: 'Trigger automated recovery action (WhatsApp, SMS, Email, Incentive)',
      requestExample: `{
  "channel": "WhatsApp",
  "strategy": "1-Click Alternative Payment Link",
  "discountOffer": "Free Express Shipping",
  "message": "Hi Alex, complete your order with 1-click Apple Pay..."
}`,
      responseExample: `{
  "success": true,
  "message": "Recovery action triggered successfully.",
  "data": {
    "status": "Delivered",
    "channel": "WhatsApp",
    "deliveredAt": "10:35 AM"
  }
}`
    }
  ];

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    addToast('Copied', 'JSON snippet copied to clipboard', 'info');
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Handover Architecture Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-950/60 via-slate-900/90 to-purple-950/60 border border-indigo-500/30 backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold text-xs border border-indigo-500/30">
                Person 4 Handover Spec
              </span>
              <h2 className="text-lg font-bold text-white">
                FastAPI, ML & Gemini Integration Contract
              </h2>
            </div>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              The JourneyAI React frontend is ready to consume your FastAPI endpoints. The service layer (<code className="text-indigo-300">src/services/api.js</code>) includes automatic schema normalizers for Person 1's ML model and Person 3's Gemini prompts.
            </p>
          </div>

          {/* Quick Backend Switcher */}
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 shrink-0 text-xs space-y-2">
            <div className="text-[11px] font-semibold text-slate-400">
              Active Data Source:
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleToggleApiMode(true)}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  useMockData
                    ? 'bg-indigo-600 text-white shadow-glow-indigo'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                Mock Data Mode
              </button>
              <button
                onClick={() => handleToggleApiMode(false, customBaseUrl)}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  !useMockData
                    ? 'bg-emerald-600 text-white shadow-glow-emerald'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                FastAPI Mode
              </button>
            </div>
          </div>
        </div>

        {/* Security & Flow Note */}
        <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center gap-2 text-xs text-slate-300 font-mono">
          <Bot className="w-4 h-4 text-indigo-400" />
          <span>Architecture: React Frontend ➔ FastAPI Backend ➔ Gemini / ML (No API keys in client)</span>
        </div>

        {/* Custom Base URL Input */}
        <div className="mt-3 pt-3 border-t border-slate-800 flex flex-wrap items-center gap-3">
          <span className="text-xs text-slate-400 font-mono">FastAPI Base URL:</span>
          <input
            type="text"
            value={customBaseUrl}
            onChange={(e) => setCustomBaseUrl(e.target.value)}
            className="px-3 py-1 bg-slate-950 text-slate-200 rounded-lg border border-slate-700 text-xs font-mono focus:outline-none focus:border-indigo-500 w-72"
          />
          <button
            onClick={() => handleToggleApiMode(!useMockData, customBaseUrl)}
            className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
          >
            Apply URL
          </button>
        </div>
      </div>

      {/* Endpoints Table / Cards */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Server className="w-4 h-4 text-indigo-400" />
          <span>Prepared FastAPI Contract Endpoints</span>
        </h3>

        <div className="grid grid-cols-1 gap-4">
          {endpoints.map((ep, idx) => (
            <div
              key={ep.path}
              className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`px-2.5 py-1 text-xs font-mono font-black rounded-lg ${
                      ep.method === 'GET'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                    }`}
                  >
                    {ep.method}
                  </span>
                  <span className="font-mono text-sm font-bold text-white">
                    {ep.path}
                  </span>
                </div>
                <span className="text-xs text-slate-400 font-medium">
                  {ep.description}
                </span>
              </div>

              {/* Request Spec if applicable */}
              {ep.requestExample && (
                <div className="relative rounded-xl bg-slate-950 p-3.5 border border-slate-800/80">
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 mb-1.5">
                    <span>Request Body (JSON)</span>
                  </div>
                  <pre className="text-xs font-mono text-slate-300 overflow-x-auto">
                    <code>{ep.requestExample}</code>
                  </pre>
                </div>
              )}

              {/* Response Spec */}
              <div className="relative rounded-xl bg-slate-950 p-3.5 border border-slate-800/80">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 mb-1.5">
                  <span>Expected JSON Response</span>
                  <button
                    onClick={() => handleCopy(ep.responseExample, idx)}
                    className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300"
                  >
                    {copiedIndex === idx ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedIndex === idx ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="text-xs font-mono text-slate-300 overflow-x-auto">
                  <code>{ep.responseExample}</code>
                </pre>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
