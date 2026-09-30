import React from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { Search, Filter, RotateCcw, AlertOctagon, ShieldAlert, Sparkles } from 'lucide-react';

export default function CustomerFilters() {
  const {
    searchQuery,
    setSearchQuery,
    riskFilter,
    setRiskFilter,
    frictionFilter,
    setFrictionFilter,
    customers,
    filteredCustomers
  } = useDashboard();

  const frictionOptions = [
    'ALL',
    'Payment Gateway Failure',
    'Shipping Cost Shock',
    'Promo Code Invalid Error',
    'Comparison Paralysis',
    'Address Auto-Complete Error',
    'None (Healthy Flow)'
  ];

  const resetFilters = () => {
    setSearchQuery('');
    setRiskFilter('ALL');
    setFrictionFilter('ALL');
  };

  const hasActiveFilters = searchQuery !== '' || riskFilter !== 'ALL' || frictionFilter !== 'ALL';

  return (
    <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md space-y-3.5">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        
        {/* Risk Level Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" /> Risk Level:
          </span>

          {['ALL', 'HIGH', 'MEDIUM', 'LOW'].map((level) => {
            const isActive = riskFilter === level;
            const count = level === 'ALL'
              ? customers.length
              : customers.filter(c => c.riskLevel === level).length;

            const badgeStyles = {
              ALL: isActive ? 'bg-indigo-600 text-white shadow-glow-indigo border-indigo-500' : 'bg-slate-800/80 text-slate-300 border-slate-700',
              HIGH: isActive ? 'bg-rose-600 text-white shadow-glow-rose border-rose-500' : 'bg-rose-500/10 text-rose-400 border-rose-500/30',
              MEDIUM: isActive ? 'bg-amber-600 text-white shadow-glow-amber border-amber-500' : 'bg-amber-500/10 text-amber-400 border-amber-500/30',
              LOW: isActive ? 'bg-emerald-600 text-white shadow-glow-emerald border-emerald-500' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
            }[level];

            return (
              <button
                key={level}
                onClick={() => setRiskFilter(level)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all flex items-center gap-1.5 ${badgeStyles}`}
              >
                <span>{level === 'ALL' ? 'All Customers' : level}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-black/30">
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Friction Category Dropdown & Reset */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 hidden sm:inline">
              Friction Type:
            </span>
            <select
              value={frictionFilter}
              onChange={(e) => setFrictionFilter(e.target.value)}
              className="bg-slate-950/80 text-slate-200 text-xs rounded-lg px-3 py-1.5 border border-slate-700 focus:outline-none focus:border-indigo-500 font-medium"
            >
              {frictionOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt === 'ALL' ? 'All Friction Categories' : opt}
                </option>
              ))}
            </select>
          </div>

          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors"
              title="Reset all filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}

          <div className="text-xs text-slate-400 font-mono ml-auto">
            Showing <span className="text-white font-bold">{filteredCustomers.length}</span> of {customers.length}
          </div>
        </div>

      </div>
    </div>
  );
}
