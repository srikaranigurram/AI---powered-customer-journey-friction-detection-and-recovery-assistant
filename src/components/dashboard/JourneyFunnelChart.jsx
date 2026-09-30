import React from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { ArrowRight, Flame, CheckCircle2, TrendingDown } from 'lucide-react';

export default function JourneyFunnelChart() {
  const { analytics } = useDashboard();

  const funnelSteps = [
    { name: '1. Product View', visitors: 1248, drop: '0%', rate: '100%', status: 'normal' },
    { name: '2. Comparison', visitors: 980, drop: '-21.5%', rate: '78.5%', status: 'warning' },
    { name: '3. Add to Cart', visitors: 640, drop: '-34.7%', rate: '51.3%', status: 'normal' },
    { name: '4. Checkout', visitors: 420, drop: '-34.4%', rate: '33.6%', status: 'friction' },
    { name: '5. Payment Gate', visitors: 280, drop: '-33.3%', rate: '22.4%', status: 'critical' },
    { name: '6. Order Complete', visitors: 195, drop: '-30.4%', rate: '15.6%', status: 'converted' }
  ];

  return (
    <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
        <div>
          <h3 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
            Journey Drop-Off Funnel
            <span className="px-2 py-0.5 text-[10px] bg-rose-500/10 text-rose-400 border border-rose-500/30 rounded-full font-bold">
              Highest Drop: Payment (33%)
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Stage-by-stage session attrition and conversion funnel
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="flex items-center gap-1 text-slate-400 text-[11px]">
            <span className="w-2.5 h-2.5 rounded-sm bg-indigo-500"></span> Flow
          </span>
          <span className="flex items-center gap-1 text-slate-400 text-[11px]">
            <span className="w-2.5 h-2.5 rounded-sm bg-rose-500"></span> Friction Drop
          </span>
        </div>
      </div>

      {/* Visual Funnel Steps */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {funnelSteps.map((step, idx) => {
          const isCritical = step.status === 'critical';
          const isFriction = step.status === 'friction';
          const isConverted = step.status === 'converted';

          return (
            <div
              key={step.name}
              className={`p-3.5 rounded-xl border transition-all duration-200 flex flex-col justify-between ${
                isCritical
                  ? 'bg-rose-500/10 border-rose-500/30 shadow-glow-rose'
                  : isFriction
                  ? 'bg-amber-500/10 border-amber-500/30'
                  : isConverted
                  ? 'bg-emerald-500/10 border-emerald-500/30'
                  : 'bg-slate-950/60 border-slate-800/80'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 mb-1">
                  <span>Step {idx + 1}</span>
                  {isCritical && (
                    <span className="flex items-center gap-0.5 text-rose-400 font-bold">
                      <Flame className="w-3 h-3 text-rose-500 animate-bounce" /> Hotspot
                    </span>
                  )}
                  {isConverted && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  )}
                </div>
                <div className="text-xs font-bold text-white truncate">
                  {step.name.replace(/^\d+\.\s*/, '')}
                </div>
              </div>

              <div className="mt-3">
                <div className="text-base font-black font-mono text-white">
                  {step.visitors} <span className="text-[10px] font-normal text-slate-400 font-sans">sessions</span>
                </div>
                
                <div className="mt-1.5 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 font-mono">
                    {step.rate}
                  </span>
                  {idx > 0 && (
                    <span className="text-rose-400 font-mono font-bold text-[10px] flex items-center">
                      <TrendingDown className="w-3 h-3 mr-0.5" />
                      {step.drop}
                    </span>
                  )}
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      isCritical
                        ? 'bg-rose-500'
                        : isFriction
                        ? 'bg-amber-500'
                        : isConverted
                        ? 'bg-emerald-500'
                        : 'bg-indigo-500'
                    }`}
                    style={{ width: step.rate }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
