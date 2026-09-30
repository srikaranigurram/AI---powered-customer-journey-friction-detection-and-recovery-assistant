import React from 'react';
import { useDashboard } from '../../context/DashboardContext';
import MetricCard from '../layout/MetricCard';
import {
  Users,
  ShieldAlert,
  AlertOctagon,
  Zap,
  TrendingUp,
  DollarSign
} from 'lucide-react';

export default function OverviewMetrics() {
  const { analytics, customers, setActiveTab, setRiskFilter } = useDashboard();

  const total = analytics?.totalCustomers || customers.length || 0;
  const highRisk = customers.filter(c => c.riskLevel === 'HIGH').length || analytics?.highRiskCustomers || 0;
  const frictions = customers.filter(c => c.frictionType && c.frictionType !== 'None (Healthy Flow)').length || analytics?.frictionsDetected || 0;
  const recoverable = customers.filter(c => c.status === 'Pending Recovery' || c.status === 'Pending').length || analytics?.recoverableCustomers || 0;
  const recoverableRevenue = analytics?.estimatedRecoverableRevenue || '$46,850';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Total Customers */}
      <MetricCard
        title="Total Customers"
        value={total.toLocaleString()}
        subtitle="Active shopping sessions analyzed"
        icon={Users}
        trend="+14.2% vs yesterday"
        trendType="up"
        color="indigo"
        onClick={() => {
          setRiskFilter('ALL');
          setActiveTab('customers');
        }}
      />

      {/* 2. High-Risk Customers */}
      <MetricCard
        title="High-Risk Customers"
        value={highRisk.toString()}
        subtitle="Critical drop-off probability (>75%)"
        icon={ShieldAlert}
        trend="Requires Attention"
        trendType="down"
        color="rose"
        onClick={() => {
          setRiskFilter('HIGH');
          setActiveTab('customers');
        }}
      />

      {/* 3. Frictions Detected */}
      <MetricCard
        title="Frictions Detected"
        value={frictions.toString()}
        subtitle="Gateway, pricing & form blockers"
        icon={AlertOctagon}
        trend="5 Active Categories"
        trendType="neutral"
        color="amber"
        onClick={() => {
          setActiveTab('customers');
        }}
      />

      {/* 4. Recoverable Customers */}
      <MetricCard
        title="Recoverable Customers"
        value={recoverable.toString()}
        subtitle={`Protected Value: ${recoverableRevenue}`}
        icon={Zap}
        trend="68.4% Est. Recovery"
        trendType="up"
        color="emerald"
        onClick={() => {
          setActiveTab('recovery');
        }}
      />
    </div>
  );
}
