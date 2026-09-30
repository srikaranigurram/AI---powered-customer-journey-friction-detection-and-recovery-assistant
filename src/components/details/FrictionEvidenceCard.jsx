import React from 'react';
import { AlertOctagon, CheckCircle, ShieldAlert, Cpu, Activity, Zap } from 'lucide-react';

export default function FrictionEvidenceCard({ evidence = {}, frictionType = '', frictionStage = '' }) {
  const factors = evidence.factors || [];

  return (
    <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <AlertOctagon className="w-4 h-4 text-rose-400" />
          <span>Friction Evidence & Telemetry Signals</span>
        </h4>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30">
          Detected at {frictionStage || 'Checkout'}
        </span>
      </div>

      {/* Primary Trigger Factor */}
      <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
        <div className="text-[11px] font-bold text-indigo-400 uppercase tracking-wide mb-1">
          Primary Friction Factor
        </div>
        <div className="text-xs font-semibold text-white">
          {evidence.primaryFactor || frictionType}
        </div>
        {evidence.impactScore && (
          <div className="mt-2 text-xs text-rose-400 font-medium flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-rose-500" />
            <span>Impact: {evidence.impactScore}</span>
          </div>
        )}
      </div>

      {/* Granular Behavioral Factors List */}
      <div className="space-y-2">
        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          Observed Telemetry Signals ({factors.length})
        </div>
        <div className="space-y-1.5">
          {factors.map((factor, idx) => (
            <div
              key={idx}
              className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-950/50 border border-slate-800/80 text-xs text-slate-300"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
              <span className="leading-relaxed">{factor}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
