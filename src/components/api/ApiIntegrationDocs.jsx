import React, { useState } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import {
  Code2,
  Cpu,
  Database,
  CheckCircle2,
  Copy,
  Check,
  Server,
  Terminal,
  Zap,
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
      description: 'Fetch all active customers with risk scores and detected friction tags',
      responseExample: `[
  {
    "id": "CUST-8492",
    "name": "Alex Rivera",
    "riskScore": 94,
    "riskLevel": "HIGH",
    "frictionType": "Payment Gateway Failure",
    "cartValue": 349.99,
    "status": "Pending Recovery"
  }
]`
    },
    {
      method: 'GET',
      path: '/api/customers/{customerId}',
      description: 'Fetch complete customer details, 6-step journey timeline, and evidence signals',
      responseExample: `{
  "id": "CUST-8492",
  "name": "Alex Rivera",
  "riskScore": 94,
  "journey": [
    { "step": "Product View", "status": "completed", "duration": "3m 12s" },
    { "step": "Payment", "status": "friction", "details": "3DS pop-up failed" }
  ],
  "evidence": { "primaryFactor": "3DS Auth Timeout" }
}`
    },
    {
      method: 'GET',
      path: '/api/analytics/risk',
      description: 'Dashboard aggregated metrics: total, high-risk, frictions, distribution',
      responseExample: `{
  "totalCustomers": 1248,
  "highRiskCustomers": 142,
  "frictionsDetected": 189,
  "recoverableCustomers": 118,
  "riskDistribution": [
    { "name": "High Risk", "count": 142, "color": "#EF4444" }
  ]
}`
    },
    {
      method: 'GET',
      path: '/api/ai/insight/{customerId}',
      description: 'Gemini Generative diagnostics: root cause, reasoning, and personalized message',
      responseExample: `{
  "likelyCause": "3D-Secure iframe timeout on iOS Safari",
  "explanation": "High buyer intent dropped strictly due to gateway tokenization error.",
  "recommendedRecovery": "1-Click Apple Pay Link via WhatsApp",
  "personalizedMessage": "Hi Alex, we noticed a bank verification issue...",
  "confidenceScore": 98,
  "model": "Gemini 1.5 Pro"
}`
    },
    {
      method: 'POST',
      path: '/api/recovery/trigger',
      description: 'Trigger automated recovery action sequence (WhatsApp, SMS, Email)',
      requestExample: `{
  "customerId": "CUST-8492",
  "channel": "WhatsApp",
  "strategy": "1-Click Alternative Payment Link",
  "discountOffer": "Free Express Shipping"
}`,
      responseExample: `{
  "success": true,
  "message": "Recovery action triggered successfully.",
  "data": { "logId": "REC-901", "status": "Delivered" }
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
      
      {/* Handover Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-950/60 via-slate-900/90 to-purple-950/60 border border-indigo-500/30 backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold text-xs border border-indigo-500/30">
                Person 4 Handover Spec
              </span>
              <h2 className="text-lg font-bold text-white">
                FastAPI & Gemini Integration Architecture
              </h2>
            </div>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              The JourneyAI React frontend is architected with a decoupled service layer (<code className="text-indigo-300">src/services/api.js</code>).
              Once your teammates run the FastAPI backend, switch the toggle below or update <code className="text-indigo-300">.env</code> to connect live.
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

        {/* Custom Base URL Input */}
        <div className="mt-4 pt-4 border-t border-slate-800 flex flex-wrap items-center gap-3">
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

              {/* Response Spec */}
              <div className="relative rounded-xl bg-slate-950 p-3.5 border border-slate-800/80">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 mb-1.5">
                  <span>Expected JSON Payload</span>
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
