import React from 'react';
import { useDashboard } from '../../context/DashboardContext';
import RiskBadge from '../customers/RiskBadge';
import {
  Zap,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Send,
  Sparkles,
  TrendingUp,
  Eye,
  Info
} from 'lucide-react';

export default function RecoveryCenterView() {
  const {
    customers,
    recoveryLogs,
    openCustomerDetails,
    handleTriggerRecovery,
    triggeringRecovery
  } = useDashboard();

  const recoverableCustomers = customers.filter(
    c => c.riskLevel === 'HIGH' || c.status === 'Pending Recovery' || c.status === 'Pending'
  );

  const triggeredCount = customers.filter(c => c.status === 'Triggered' || c.status === 'Delivered').length;

  return (
    <div className="space-y-6">
      
      {/* Top Recovery KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* 1. Pending Interventions */}
        <div className="p-5 rounded-2xl bg-gradient-to-b from-indigo-500/10 to-transparent border border-indigo-500/20 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Pending Interventions
            </span>
            <div className="p-2 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black font-mono text-white">
              {recoverableCustomers.length}
            </span>
            <span className="text-xs text-amber-400 font-semibold">Immediate Action</span>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            High-intent shoppers stuck at checkout / payment gates
          </p>
        </div>

        {/* 2. Dispatched Sequences */}
        <div className="p-5 rounded-2xl bg-gradient-to-b from-purple-500/10 to-transparent border border-purple-500/20 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Dispatched Sequences
            </span>
            <div className="p-2 rounded-xl bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
              <Send className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black font-mono text-white">
              {triggeredCount + 3}
            </span>
            <span className="text-xs text-indigo-400 font-semibold">Omnichannel</span>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            WhatsApp, SMS and 1-Click Alternate Payment links
          </p>
        </div>

        {/* 3. Estimated Recovered Revenue (Marked as Demo / Estimated with Info Tooltip) */}
        <div className="p-5 rounded-2xl bg-gradient-to-b from-emerald-500/10 to-transparent border border-emerald-500/20 backdrop-blur-md relative group">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Estimated Recovered Revenue
              </span>
              <div className="relative">
                <Info
                  className="w-3.5 h-3.5 text-slate-400 hover:text-slate-200 cursor-help transition-colors"
                  title="Currently based on synthetic demo data. Will be populated from the backend after recovery actions are connected."
                />
              </div>
            </div>
            <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black font-mono text-emerald-400">
              $1,306.55
            </span>
            <span className="text-xs text-emerald-400 font-semibold">+68.4% Win-rate</span>
          </div>

          <p className="mt-2 text-[11px] text-slate-400 leading-tight">
            Currently based on synthetic demo data. Will be populated from the backend after recovery actions are connected.
          </p>
        </div>
      </div>

      {/* Active Recovery Queues */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Actionable High-Risk Carts Queue</span>
            </h3>
            <p className="text-xs text-slate-400">
              AI-generated personalized recovery strategy for each friction point
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {recoverableCustomers.map((customer) => (
            <div
              key={customer.id}
              className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={customer.avatar}
                      alt={customer.name}
                      className="w-11 h-11 rounded-full object-cover border border-slate-700"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        {customer.name}
                        <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                          {customer.id}
                        </span>
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Cart Value: <strong className="text-slate-200">${customer.cartValue.toFixed(2)}</strong> • {customer.device}
                      </p>
                    </div>
                  </div>
                  <RiskBadge level={customer.riskLevel} score={customer.riskScore} size="sm" />
                </div>

                {/* AI Reasoning Summary */}
                <div className="mt-3.5 p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
                  <div className="text-[10px] uppercase font-bold text-indigo-400 mb-1 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Recommended Action
                  </div>
                  <div className="font-semibold text-slate-200">
                    {customer.recovery?.recommendedStrategy || 'Direct WhatsApp Payment Recovery'}
                  </div>
                  <div className="mt-1.5 text-slate-400 italic text-[11px] line-clamp-2">
                    "{customer.aiInsight?.personalizedMessage}"
                  </div>
                </div>
              </div>

              {/* Recovery Action Controls */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-3">
                <button
                  onClick={() => openCustomerDetails(customer.id)}
                  className="px-3 py-2 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 flex items-center gap-1.5 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Inspect Timeline</span>
                </button>

                <button
                  onClick={() => handleTriggerRecovery(customer.id)}
                  disabled={triggeringRecovery || customer.status === 'Triggered' || customer.status === 'Delivered'}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-xs font-bold transition-all ${
                    customer.status === 'Triggered' || customer.status === 'Delivered'
                      ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                      : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-glow-indigo active:scale-95'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                  <span>
                    {customer.status === 'Triggered' || customer.status === 'Delivered'
                      ? 'Recovery Dispatched'
                      : 'Trigger Instant Recovery'}
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recovery Audit Trail & Logs */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Real-Time Recovery Dispatch Logs</span>
            </h3>
            <p className="text-xs text-slate-400">
              Historical record of automated customer recovery interventions
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-500 uppercase text-[10px] font-bold">
                <th className="pb-3 px-3">Log ID</th>
                <th className="pb-3 px-3">Customer</th>
                <th className="pb-3 px-3">Recovery Strategy</th>
                <th className="pb-3 px-3">Channel</th>
                <th className="pb-3 px-3">Triggered Time</th>
                <th className="pb-3 px-3">Revenue Protected</th>
                <th className="pb-3 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {recoveryLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-indigo-400">
                    {log.id}
                  </td>
                  <td className="py-3 px-3 font-semibold text-white">
                    {log.customerName}
                    <span className="block text-[10px] text-slate-500 font-mono">
                      {log.customerId}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-300 max-w-xs truncate">
                    {log.strategy}
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 font-mono text-[11px] text-slate-300">
                      {log.channel}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-400 font-mono">
                    {log.triggeredAt}
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-emerald-400">
                    {log.revenueProtected}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                        log.status === 'Converted'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30'
                      }`}
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
