import React from 'react';
import { DashboardProvider, useDashboard } from './context/DashboardContext';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import OverviewMetrics from './components/dashboard/OverviewMetrics';
import RiskDistributionChart from './components/dashboard/RiskDistributionChart';
import FrictionTypeChart from './components/dashboard/FrictionTypeChart';
import JourneyFunnelChart from './components/dashboard/JourneyFunnelChart';
import RecentHighRiskWidget from './components/dashboard/RecentHighRiskWidget';
import CustomerFilters from './components/customers/CustomerFilters';
import CustomerRiskTable from './components/customers/CustomerRiskTable';
import CustomerDetailModal from './components/details/CustomerDetailModal';
import RecoveryCenterView from './components/recovery/RecoveryCenterView';
import LiveJourneyStream from './components/stream/LiveJourneyStream';
import ApiIntegrationDocs from './components/api/ApiIntegrationDocs';
import ToastNotification from './components/common/ToastNotification';

function MainContent() {
  const { activeTab, loading } = useDashboard();

  return (
    <main className="flex-1 overflow-y-auto p-4 lg:p-8 space-y-6">
      {/* 1. Executive Dashboard View */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Key Metrics Summary */}
          <OverviewMetrics />

          {/* Core Analytics Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5">
              <RiskDistributionChart />
            </div>
            <div className="lg:col-span-7">
              <FrictionTypeChart />
            </div>
          </div>

          {/* Journey Drop-off Funnel Visualizer */}
          <JourneyFunnelChart />

          {/* Recent High-Risk Customers Action List */}
          <RecentHighRiskWidget />
        </div>
      )}

      {/* 2. Customer Risk Table View */}
      {activeTab === 'customers' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-xl font-black text-white tracking-tight">
                Customer Risk Assessment Table
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Real-time classification of friction points, abandonment scores, and evidence factors
              </p>
            </div>
          </div>

          <CustomerFilters />
          <CustomerRiskTable />
        </div>
      )}

      {/* 3. Recovery Center View */}
      {activeTab === 'recovery' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-xl font-black text-white tracking-tight">
                AI Recovery Action Hub
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Automated multi-channel recovery triggers, personalized incentives, and dispatch logs
              </p>
            </div>
          </div>

          <RecoveryCenterView />
        </div>
      )}

      {/* 4. Live Journey Stream View */}
      {activeTab === 'live-feed' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <LiveJourneyStream />
        </div>
      )}

      {/* 5. FastAPI Team Handover Spec */}
      {activeTab === 'api-docs' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <ApiIntegrationDocs />
        </div>
      )}
    </main>
  );
}

export default function App() {
  return (
    <DashboardProvider>
      <div className="min-h-screen flex flex-col bg-[#080B11] text-slate-100 font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
        <Header />
        <div className="flex-1 flex flex-col lg:flex-row">
          <Sidebar />
          <MainContent />
        </div>
        <CustomerDetailModal />
        <ToastNotification />
      </div>
    </DashboardProvider>
  );
}
