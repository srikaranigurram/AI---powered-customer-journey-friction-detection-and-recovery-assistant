import React, { useState, useEffect } from 'react';
import {
  Bot,
  Copy,
  Check,
  Zap,
  MessageSquare,
  HelpCircle,
  Lightbulb
} from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';

export default function AIInsightCard({ aiInsight = {}, customerId = '', onTriggerRecovery = null }) {
  const { addToast } = useDashboard();
  const [copied, setCopied] = useState(false);

  // Field mapping supporting both snake_case (FastAPI/Gemini) and camelCase
  const cause = aiInsight?.cause || aiInsight?.likely_cause || aiInsight?.likelyCause || 'Telemetry friction detected during checkout stage.';
  const explanation = aiInsight?.explanation || 'Customer encountered friction before completing order confirmation.';
  const recommendedRecovery = aiInsight?.recommended_recovery || aiInsight?.recommendedRecovery || 'Trigger 1-Click Alternate Payment link.';
  const initialMessage = aiInsight?.personalized_message || aiInsight?.personalizedMessage || 'We saved your cart! Click here to complete your order in 1 tap.';
  const confidenceScore = aiInsight?.confidence_score ?? aiInsight?.confidenceScore ?? 96;
  const modelName = aiInsight?.model || 'Gemini 1.5 Pro (Simulated)';

  const [editableMessage, setEditableMessage] = useState(initialMessage);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setEditableMessage(initialMessage);
  }, [initialMessage]);

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(editableMessage || initialMessage);
    setCopied(true);
    addToast('Copied to Clipboard', 'Personalized recovery message copied!', 'info');
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="relative p-5 rounded-2xl bg-gradient-to-b from-indigo-950/40 via-slate-900/90 to-slate-900 border border-indigo-500/30 backdrop-blur-xl shadow-glow-indigo overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute -top-12 -right-12 w-44 h-44 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      
      {/* Header with Gemini Model Badge */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/40 shadow-glow-indigo">
            <Bot className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white tracking-wide">
                Gemini AI Friction Diagnostic
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {modelName}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Generative root-cause analysis & personalized customer message
            </p>
          </div>
        </div>

        {confidenceScore !== null && (
          <div className="text-right">
            <div className="text-[10px] uppercase font-bold text-slate-400">
              AI Confidence
            </div>
            <div className="text-sm font-mono font-black text-emerald-400">
              {confidenceScore}%
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4 text-xs">
        
        {/* 1. Likely Cause (Gemini Output Mapping) */}
        <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
          <div className="flex items-center gap-1.5 font-bold text-indigo-300 uppercase tracking-wider text-[11px] mb-1">
            <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
            <span>Likely Cause</span>
          </div>
          <p className="text-slate-200 leading-relaxed font-medium">
            {cause}
          </p>
        </div>

        {/* 2. Deep Explanation */}
        <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
          <div className="flex items-center gap-1.5 font-bold text-indigo-300 uppercase tracking-wider text-[11px] mb-1">
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            <span>AI Reasoning & Explanation</span>
          </div>
          <p className="text-slate-300 leading-relaxed">
            {explanation}
          </p>
        </div>

        {/* 3. Recommended Recovery */}
        <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/30">
          <div className="flex items-center gap-1.5 font-bold text-emerald-400 uppercase tracking-wider text-[11px] mb-1">
            <Zap className="w-3.5 h-3.5 text-emerald-400" />
            <span>Recommended Recovery Strategy</span>
          </div>
          <p className="text-slate-200 leading-relaxed font-semibold">
            {recommendedRecovery}
          </p>
        </div>

        {/* 4. Personalized Customer Message (Gemini Generated) */}
        <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-bold text-cyan-400 uppercase tracking-wider text-[11px]">
              <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
              <span>Personalized Customer Message</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="text-[10px] text-slate-400 hover:text-indigo-300 underline font-mono"
              >
                {isEditing ? 'Done Editing' : 'Edit Text'}
              </button>
              <button
                onClick={handleCopyMessage}
                className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] border border-slate-700 transition-colors"
                title="Copy message to clipboard"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {isEditing ? (
            <textarea
              value={editableMessage}
              onChange={(e) => setEditableMessage(e.target.value)}
              rows={3}
              className="w-full p-2.5 bg-slate-900 text-slate-100 rounded-lg border border-indigo-500/40 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs font-sans leading-relaxed"
            />
          ) : (
            <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800/80 text-xs text-slate-200 italic leading-relaxed">
              "{editableMessage}"
            </div>
          )}

          <div className="text-[10px] text-slate-500 flex items-center justify-between">
            <span>Ready for dispatch via WhatsApp / SMS / Email</span>
            <span className="text-indigo-400 font-mono">Channel: WhatsApp / Email</span>
          </div>
        </div>

      </div>
    </div>
  );
}
