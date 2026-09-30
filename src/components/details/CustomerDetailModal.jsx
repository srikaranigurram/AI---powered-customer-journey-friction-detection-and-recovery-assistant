import React from 'react';
import { useDashboard } from '../../context/DashboardContext';
import RiskBadge from '../customers/RiskBadge';
import CustomerJourneyTimeline from './CustomerJourneyTimeline';
import FrictionEvidenceCard from './FrictionEvidenceCard';
import AIInsightCard from './AIInsightCard';
import RecoveryActionCard from '../recovery/RecoveryActionCard';
import {
  X,
  User,
  ShoppingBag,
  Smartphone,
  MapPin,
  Clock,
  Sparkles,
  Zap,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export default function CustomerDetailModal() {
  const {
    isDetailOpen,
    closeCustomerDetails,
    selectedCustomer,
    detailLoading,
    handleTriggerRecovery
  } = useDashboard();

  if (!isDetailOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex justify-end transition-opacity duration-300">
      
      {/* Slide-over Backdrop click dismiss */}
      <div
        className="fixed inset-0"
        onClick={closeCustomerDetails}
      />

      {/* Slide-over Panel Container */}
      <div className="relative w-full max-w-4xl bg-[#090D18] border-l border-slate-800 min-h-screen p-6 lg:p-8 flex flex-col justify-between shadow-2xl z-10">
        
        {/* Top Bar / Header */}
        <div>
          <div className="flex items-center justify-between pb-6 border-b border-slate-800/90">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 p-0.5 shadow-glow-indigo">
                <img
                  src={selectedCustomer?.avatar}
                  alt={selectedCustomer?.name || 'Customer'}
                  className="w-full h-full rounded-[14px] object-cover"
                />
              </div>

              <div>
                <div className="flex items-center gap-2.5">
                  <h2 className="text-lg lg:text-xl font-black text-white tracking-tight">
                    {selectedCustomer?.name || 'Customer Assessment'}
                  </h2>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 bg-slate-800 text-slate-300 rounded-md border border-slate-700">
                    {selectedCustomer?.id}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1">
                  <span>{selectedCustomer?.email}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-500" />
                    {selectedCustomer?.location || 'Unknown Location'}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Smartphone className="w-3 h-3 text-slate-500" />
                    {selectedCustomer?.device}
                  </span>
                </div>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={closeCustomerDetails}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700"
              aria-label="Close details"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Loading state indicator */}
          {detailLoading ? (
            <div className="py-24 text-center">
              <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-sm font-semibold text-slate-300">
                Retrieving telemetry traces & AI insights...
              </p>
            </div>
          ) : selectedCustomer ? (
            <div className="mt-6 space-y-6">
              
              {/* Summary Metrics Pill Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-500">Risk Assessment</span>
                  <div className="mt-1">
                    <RiskBadge level={selectedCustomer.riskLevel} score={selectedCustomer.riskScore} size="sm" />
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-500">Cart Total</span>
                  <div className="mt-1 text-sm font-mono font-black text-white">
                    ${selectedCustomer.cartValue.toFixed(2)}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-500">Friction Category</span>
                  <div className="mt-1 text-xs font-bold text-rose-400 truncate">
                    {selectedCustomer.frictionType}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-500">Session Status</span>
                  <div className="mt-1 text-xs font-mono font-semibold text-cyan-400">
                    {selectedCustomer.status}
                  </div>
                </div>
              </div>

              {/* Recovery Action Trigger Box */}
              <RecoveryActionCard
                customer={selectedCustomer}
                onTriggered={() => {}}
              />

              {/* AI Insight Card (Likely Cause, Deep Explanation, Recommended Strategy, Personalized Message) */}
              <AIInsightCard
                aiInsight={selectedCustomer.aiInsight}
                customerId={selectedCustomer.id}
              />

              {/* Grid: Journey Timeline & Friction Evidence */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
                {/* 6-Step Journey Visualizer */}
                <div className="lg:col-span-7">
                  <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
                    <CustomerJourneyTimeline
                      journey={selectedCustomer.journey}
                      customerId={selectedCustomer.id}
                    />
                  </div>
                </div>

                {/* Evidence Card */}
                <div className="lg:col-span-5">
                  <FrictionEvidenceCard
                    evidence={selectedCustomer.evidence}
                    frictionType={selectedCustomer.frictionType}
                    frictionStage={selectedCustomer.frictionStage}
                  />
                </div>
              </div>

            </div>
          ) : null}
        </div>

        {/* Modal Footer */}
        <div className="pt-6 mt-8 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
          <span>JourneyAI Telemetry Pipeline • Gemini 1.5 Pro</span>
          <button
            onClick={closeCustomerDetails}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition-colors"
          >
            Close Panel
          </button>
        </div>

      </div>
    </div>
  );
}
