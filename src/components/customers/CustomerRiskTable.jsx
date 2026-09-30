import React from 'react';
import { useDashboard } from '../../context/DashboardContext';
import RiskBadge from './RiskBadge';
import {
  Eye,
  Zap,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Smartphone,
  Laptop,
  ArrowUpDown,
  ShoppingBag,
  Sparkles
} from 'lucide-react';

export default function CustomerRiskTable() {
  const {
    filteredCustomers,
    openCustomerDetails,
    handleTriggerRecovery,
    triggeringRecovery
  } = useDashboard();

  if (filteredCustomers.length === 0) {
    return (
      <div className="p-12 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
        <AlertCircle className="w-10 h-10 text-slate-500 mx-auto mb-3" />
        <h3 className="text-base font-bold text-white">No customers match your filter criteria</h3>
        <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
          Try resetting the risk level or friction filter in the control bar above.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md overflow-hidden shadow-2xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/70 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <th className="py-3.5 px-4">Customer ID</th>
              <th className="py-3.5 px-4">Risk %</th>
              <th className="py-3.5 px-4">Risk Level</th>
              <th className="py-3.5 px-4">Friction Type</th>
              <th className="py-3.5 px-4">Evidence</th>
              <th className="py-3.5 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-xs">
            {filteredCustomers.map((customer) => {
              const isTriggered = customer.status === 'Triggered' || customer.status === 'Delivered';
              const isConverted = customer.status === 'Converted';
              const isHigh = customer.riskLevel === 'HIGH';

              return (
                <tr
                  key={customer.id}
                  className={`hover:bg-slate-800/40 transition-colors group ${
                    isHigh ? 'bg-rose-500/[0.02]' : ''
                  }`}
                >
                  {/* 1. Customer ID & Profile */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="relative shrink-0">
                        <img
                          src={customer.avatar}
                          alt={customer.name}
                          className="w-10 h-10 rounded-full object-cover border border-slate-700/80"
                        />
                        {isHigh && (
                          <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500 border border-slate-900"></span>
                          </span>
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-white text-xs flex items-center gap-2 group-hover:text-indigo-300 transition-colors">
                          <span>{customer.name}</span>
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700">
                            {customer.id}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                          <span className="text-slate-300 font-semibold font-mono">
                            ${customer.cartValue.toFixed(2)}
                          </span>
                          <span>•</span>
                          <span className="truncate max-w-[130px]">{customer.device}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* 2. Risk % */}
                  <td className="py-4 px-4">
                    <div className="w-28">
                      <div className="flex items-center justify-between text-xs mb-1 font-mono font-bold">
                        <span
                          className={
                            customer.riskScore > 75
                              ? 'text-rose-400'
                              : customer.riskScore > 45
                              ? 'text-amber-400'
                              : 'text-emerald-400'
                          }
                        >
                          {customer.riskScore}%
                        </span>
                        <span className="text-[10px] text-slate-500 font-normal">
                          {customer.riskScore > 75 ? 'Critical' : customer.riskScore > 45 ? 'Moderate' : 'Safe'}
                        </span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            customer.riskScore > 75
                              ? 'bg-rose-500 shadow-glow-rose'
                              : customer.riskScore > 45
                              ? 'bg-amber-500'
                              : 'bg-emerald-500'
                          }`}
                          style={{ width: `${customer.riskScore}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* 3. Risk Level (HIGH / MEDIUM / LOW) */}
                  <td className="py-4 px-4">
                    <RiskBadge
                      level={customer.riskLevel}
                      score={null}
                      size="sm"
                    />
                  </td>

                  {/* 4. Friction Type */}
                  <td className="py-4 px-4">
                    <div className="flex flex-col gap-1">
                      <span className="font-semibold text-slate-200">
                        {customer.frictionType}
                      </span>
                      <span className="inline-flex items-center text-[10px] text-slate-400">
                        Stage: <strong className="text-indigo-400 ml-1">{customer.frictionStage}</strong>
                      </span>
                    </div>
                  </td>

                  {/* 5. Evidence */}
                  <td className="py-4 px-4 max-w-xs">
                    <div className="text-[11px] text-slate-300 leading-relaxed line-clamp-2">
                      {customer.evidence?.primaryFactor || 'Standard session velocity'}
                    </div>
                    {customer.evidence?.factors && customer.evidence.factors.length > 0 && (
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        +{customer.evidence.factors.length} behavioral signals detected
                      </div>
                    )}
                  </td>

                  {/* 6. Actions */}
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {/* View Details button */}
                      <button
                        onClick={() => openCustomerDetails(customer.id)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-medium text-xs border border-slate-700 transition-all hover:border-slate-600"
                        title="View Full Customer Journey & AI Insights"
                      >
                        <Eye className="w-3.5 h-3.5 text-indigo-400" />
                        <span>View Details</span>
                      </button>

                      {/* Trigger Recovery Button */}
                      <button
                        onClick={() => handleTriggerRecovery(customer.id)}
                        disabled={triggeringRecovery || isTriggered || isConverted}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs transition-all ${
                          isConverted
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 cursor-default'
                            : isTriggered
                            ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 cursor-default'
                            : isHigh
                            ? 'bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white shadow-glow-rose active:scale-95'
                            : 'bg-indigo-600 hover:bg-indigo-500 text-white active:scale-95'
                        }`}
                        title="Trigger AI Recovery Action"
                      >
                        {isConverted ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Converted</span>
                          </>
                        ) : isTriggered ? (
                          <>
                            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                            <span>Triggered</span>
                          </>
                        ) : (
                          <>
                            <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                            <span>Recover</span>
                          </>
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Table Footer Summary */}
      <div className="px-4 py-3 bg-slate-950/60 border-t border-slate-800 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span> High Risk: <strong>{filteredCustomers.filter(c => c.riskLevel === 'HIGH').length}</strong>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span> Medium: <strong>{filteredCustomers.filter(c => c.riskLevel === 'MEDIUM').length}</strong>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Low: <strong>{filteredCustomers.filter(c => c.riskLevel === 'LOW').length}</strong>
          </span>
        </div>

        <div className="text-[11px] text-slate-500 font-mono">
          FastAPI Ready Endpoint: <code className="text-indigo-400">GET /api/customers</code>
        </div>
      </div>
    </div>
  );
}
