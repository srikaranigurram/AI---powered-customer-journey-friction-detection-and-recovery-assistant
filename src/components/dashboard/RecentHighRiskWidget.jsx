import React from 'react';
import { useDashboard } from '../../context/DashboardContext';
import RiskBadge from '../customers/RiskBadge';
import {
  ShieldAlert,
  ArrowRight,
  Zap,
  Eye,
  Clock,
  Smartphone,
  Laptop
} from 'lucide-react';

export default function RecentHighRiskWidget() {
  const {
    customers,
    openCustomerDetails,
    handleTriggerRecovery,
    triggeringRecovery,
    setActiveTab
  } = useDashboard();

  const highRiskCustomers = customers
    .filter(c => c.riskLevel === 'HIGH')
    .slice(0, 3);

  return (
    <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400">
            <ShieldAlert className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide">
              Recent High-Risk Drop-Offs
            </h3>
            <p className="text-xs text-slate-400">
              Immediate intervention recommended
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('customers')}
          className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 group"
        >
          View All ({customers.length})
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
        </button>
      </div>

      {/* High-Risk Customer Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {highRiskCustomers.map((customer) => {
          const isRecovered = customer.status === 'Triggered' || customer.status === 'Delivered';

          return (
            <div
              key={customer.id}
              className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/90 hover:border-slate-700 transition-all flex flex-col justify-between group"
            >
              {/* Card Header */}
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={customer.avatar}
                      alt={customer.name}
                      className="w-9 h-9 rounded-full object-cover border border-slate-700"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">
                        {customer.name}
                      </h4>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                        <span>{customer.id}</span>
                        <span>•</span>
                        <span className="text-slate-300 font-semibold">${customer.cartValue.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  <RiskBadge level={customer.riskLevel} score={customer.riskScore} size="sm" />
                </div>

                {/* Friction Callout */}
                <div className="p-2.5 rounded-lg bg-rose-500/5 border border-rose-500/20 text-xs mb-3">
                  <div className="font-semibold text-rose-300 flex items-center justify-between">
                    <span>{customer.frictionType}</span>
                    <span className="text-[10px] text-slate-400 font-normal">
                      {customer.detectedAt}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {customer.evidence?.primaryFactor || customer.aiInsight?.likelyCause}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
                <button
                  onClick={() => openCustomerDetails(customer.id)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Inspect Journey</span>
                </button>

                <button
                  onClick={() => handleTriggerRecovery(customer.id)}
                  disabled={triggeringRecovery || isRecovered}
                  className={`flex items-center justify-center gap-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all ${
                    isRecovered
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-glow-indigo active:scale-95'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>{isRecovered ? 'Triggered' : 'Recover'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
