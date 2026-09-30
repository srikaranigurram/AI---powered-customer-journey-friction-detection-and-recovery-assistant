import React from 'react';
import { useDashboard } from '../../context/DashboardContext';
import {
  LayoutDashboard,
  Users,
  Zap,
  Activity,
  Code2,
  Bot
} from 'lucide-react';

export default function Sidebar() {
  const { activeTab, setActiveTab, customers, useMockData } = useDashboard();

  const highRiskCount = customers.filter(c => c.riskLevel === 'HIGH').length;
  const pendingRecoveryCount = customers.filter(c => c.status === 'Pending Recovery' || c.status === 'Pending').length;

  const navItems = [
    {
      id: 'dashboard',
      label: 'Executive Dashboard',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'customers',
      label: 'Customer Risk Table',
      icon: Users,
      badge: highRiskCount > 0 ? `${highRiskCount} High` : null,
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40'
    },
    {
      id: 'recovery',
      label: 'Recovery Center',
      icon: Zap,
      badge: pendingRecoveryCount > 0 ? `${pendingRecoveryCount} Actionable` : null,
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40'
    },
    {
      id: 'live-feed',
      label: 'Live Journey Stream',
      icon: Activity,
      badge: 'Demo',
      badgeColor: 'bg-slate-700/60 text-slate-300 border-slate-600'
    },
    {
      id: 'api-docs',
      label: 'FastAPI Contract Spec',
      icon: Code2,
      badge: 'Team Spec',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40'
    }
  ];

  return (
    <aside className="w-full lg:w-64 bg-[#0B0F1A] border-r border-slate-800/80 flex flex-col shrink-0">
      {/* Navigation Links */}
      <div className="p-4 space-y-1.5 flex-1">
        <div className="px-3 py-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          Main Navigation
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 group ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-600/90 to-purple-600/80 text-white shadow-glow-indigo border border-indigo-500/40'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/90 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-400'
                  }`}
                />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    isActive ? 'bg-white/20 text-white border-white/30' : item.badgeColor
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* AI & ML System Status Card — Clearly Indicating Demo Status */}
        <div className="pt-6">
          <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800/90 text-xs">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-amber-400" />
                <span className="font-semibold text-slate-200">Gemini Engine</span>
              </div>
              <span className="flex items-center gap-1.5 text-[10px] font-mono text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                {useMockData ? 'Not Connected' : 'FastAPI Ready'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Demo Mode — awaiting Gemini API backend integration.
            </p>
            <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-500">
              <span>Source: Mock Schema</span>
              <span className="text-slate-400 font-mono">Person 3 Pipeline</span>
            </div>
          </div>
        </div>
      </div>

      {/* Role & Hackathon Banner */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold text-xs">
            P4
          </div>
          <div className="text-xs">
            <div className="font-semibold text-slate-200">Person 4 • Frontend</div>
            <div className="text-[11px] text-slate-500">React + Vite + Recharts</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
