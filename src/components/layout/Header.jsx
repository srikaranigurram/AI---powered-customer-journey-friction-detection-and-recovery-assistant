import React from 'react';
import { useDashboard } from '../../context/DashboardContext';
import {
  Activity,
  Sparkles,
  RefreshCw,
  Search,
  Bell,
  Database,
  Cpu,
  Layers,
  Zap
} from 'lucide-react';

export default function Header() {
  const {
    refreshData,
    loading,
    searchQuery,
    setSearchQuery,
    useMockData,
    handleToggleApiMode,
    apiBaseUrl,
    activeTab,
    setActiveTab,
    filteredCustomers
  } = useDashboard();

  return (
    <header className="sticky top-0 z-30 bg-[#0A0E1A]/90 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3.5 transition-all">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        
        {/* Brand & Subtitle */}
        <div className="flex items-center gap-3.5">
          <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-600 to-cyan-400 p-0.5 shadow-glow-indigo">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-indigo-400 animate-pulse" />
            </div>
            <div className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500 border border-slate-900"></span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl lg:text-2xl font-black tracking-tight text-white font-sans flex items-center gap-2">
                Journey<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-cyan-400">AI</span>
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 rounded-full">
                v2.4 Live
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              Customer Friction Detection & Recovery Assistant
            </p>
          </div>
        </div>

        {/* Global Actions, Search & Backend Selector */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Global Search Bar */}
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search customer, ID, friction..."
              className="w-full pl-9 pr-3.5 py-1.5 text-xs bg-slate-900/90 text-slate-200 placeholder-slate-500 rounded-lg border border-slate-700/80 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            />
            {searchQuery && (
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">
                {filteredCustomers.length} results
              </span>
            )}
          </div>

          {/* API Backend Switcher Pill (FastAPI vs Mock) */}
          <div className="flex items-center bg-slate-900/90 border border-slate-800 rounded-lg p-1 text-xs">
            <button
              onClick={() => handleToggleApiMode(true)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all text-[11px] font-semibold ${
                useMockData
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Using realistic mock dataset for hackathon frontend demonstration"
            >
              <Database className="w-3.5 h-3.5" />
              Mock API
            </button>
            <button
              onClick={() => handleToggleApiMode(false)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all text-[11px] font-semibold ${
                !useMockData
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Switches to live FastAPI endpoints (http://localhost:8000/api)"
            >
              <Cpu className="w-3.5 h-3.5" />
              FastAPI
            </button>
          </div>

          {/* Quick Refresh Button */}
          <button
            onClick={refreshData}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 rounded-lg transition-all active:scale-95 disabled:opacity-50"
            title="Refresh analytics and active customer states"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-indigo-400 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Sync</span>
          </button>

          {/* Quick AI Trigger Demo */}
          <button
            onClick={() => setActiveTab('recovery')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-lg shadow-glow-indigo transition-all transform active:scale-95"
          >
            <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
            <span>Recovery Hub</span>
          </button>
        </div>

      </div>
    </header>
  );
}
