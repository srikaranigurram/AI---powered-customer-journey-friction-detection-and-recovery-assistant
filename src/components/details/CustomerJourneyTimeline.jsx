import React from 'react';
import {
  Eye,
  Columns2,
  ShoppingCart,
  CreditCard,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  ArrowDown
} from 'lucide-react';

export default function CustomerJourneyTimeline({ journey = [], customerId = '' }) {
  const getStepIcon = (stepName, status) => {
    switch (stepName) {
      case 'Product View':
        return Eye;
      case 'Comparison':
        return Columns2;
      case 'Add to Cart':
        return ShoppingCart;
      case 'Checkout':
        return CreditCard;
      case 'Payment':
        return status === 'friction' ? AlertTriangle : CreditCard;
      case 'Order/Abandonment':
        return status === 'abandoned' ? XCircle : CheckCircle2;
      default:
        return Eye;
    }
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case 'completed':
        return {
          badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
          dot: 'bg-emerald-500 shadow-glow-emerald',
          line: 'bg-emerald-500/50',
          card: 'bg-slate-900/60 border-slate-800'
        };
      case 'friction':
        return {
          badge: 'bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse',
          dot: 'bg-rose-500 shadow-glow-rose ring-4 ring-rose-500/20',
          line: 'bg-gradient-to-b from-emerald-500/50 to-rose-500/60',
          card: 'bg-rose-500/10 border-rose-500/40 shadow-glow-rose'
        };
      case 'abandoned':
        return {
          badge: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
          dot: 'bg-rose-500/80',
          line: 'bg-slate-700',
          card: 'bg-slate-900/80 border-slate-800'
        };
      default:
        return {
          badge: 'bg-slate-800 text-slate-500 border-slate-700',
          dot: 'bg-slate-700',
          line: 'bg-slate-800',
          card: 'bg-slate-950/40 border-slate-800/60 opacity-60'
        };
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <span>Customer Journey Flow</span>
          <span className="text-[11px] font-mono text-indigo-400 normal-case">
            ({journey.length} Stages)
          </span>
        </h4>
        <div className="flex items-center gap-3 text-[11px]">
          <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Success
          </span>
          <span className="flex items-center gap-1.5 text-rose-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span> Friction Drop
          </span>
        </div>
      </div>

      <div className="relative pl-6 space-y-5 before:absolute before:left-[11px] before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-800">
        {journey.map((item, index) => {
          const Icon = getStepIcon(item.step, item.status);
          const style = getStatusStyles(item.status);
          const isFriction = item.status === 'friction';

          return (
            <div key={`${item.step}-${index}`} className="relative group">
              {/* Timeline Node Dot */}
              <div
                className={`absolute -left-6 top-1.5 w-6 h-6 rounded-full border border-slate-950 flex items-center justify-center transition-transform group-hover:scale-110 ${style.dot}`}
              >
                <Icon className="w-3 h-3 text-white" />
              </div>

              {/* Step Card Content */}
              <div
                className={`p-3.5 rounded-xl border transition-all ${style.card}`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white font-mono">
                      {index + 1}. {item.step}
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border uppercase tracking-wide ${style.badge}`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono">
                    {item.duration !== '-' && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        {item.duration}
                      </span>
                    )}
                    <span>{item.timestamp}</span>
                  </div>
                </div>

                <div className="mt-2 text-xs font-semibold text-slate-200">
                  {item.title}
                </div>

                <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                  {item.details}
                </p>

                {isFriction && (
                  <div className="mt-2.5 p-2 rounded-lg bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-center gap-2 font-medium">
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>Friction Hotspot: Root cause of session drop detected at this step.</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
