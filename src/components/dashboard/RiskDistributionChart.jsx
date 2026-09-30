import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { useDashboard } from '../../context/DashboardContext';
import { ShieldCheck, ShieldAlert, AlertTriangle } from 'lucide-react';

export default function RiskDistributionChart() {
  const { customers, setRiskFilter, setActiveTab } = useDashboard();

  const highCount = customers.filter(c => c.riskLevel === 'HIGH').length;
  const mediumCount = customers.filter(c => c.riskLevel === 'MEDIUM').length;
  const lowCount = customers.filter(c => c.riskLevel === 'LOW').length;
  const total = highCount + mediumCount + lowCount || 1;

  const data = [
    {
      name: 'High Risk',
      level: 'HIGH',
      value: highCount,
      percentage: ((highCount / total) * 100).toFixed(1),
      color: '#EF4444',
      glow: 'shadow-glow-rose',
      icon: ShieldAlert
    },
    {
      name: 'Medium Risk',
      level: 'MEDIUM',
      value: mediumCount,
      percentage: ((mediumCount / total) * 100).toFixed(1),
      color: '#F59E0B',
      glow: 'shadow-glow-amber',
      icon: AlertTriangle
    },
    {
      name: 'Low Risk',
      level: 'LOW',
      value: lowCount,
      percentage: ((lowCount / total) * 100).toFixed(1),
      color: '#10B981',
      glow: 'shadow-glow-emerald',
      icon: ShieldCheck
    }
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-slate-900/95 border border-slate-700/80 p-3 rounded-xl shadow-2xl backdrop-blur-md text-xs">
          <div className="flex items-center gap-2 font-bold text-white mb-1">
            <span
              className="w-2.5 h-2.5 rounded-full inline-block"
              style={{ backgroundColor: item.color }}
            />
            {item.name}
          </div>
          <div className="text-slate-300 flex justify-between gap-4">
            <span>Customer Count:</span>
            <span className="font-mono font-bold text-white">{item.value}</span>
          </div>
          <div className="text-slate-300 flex justify-between gap-4 mt-0.5">
            <span>Share of Total:</span>
            <span className="font-mono font-bold" style={{ color: item.color }}>
              {item.percentage}%
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-white tracking-wide">
            Risk Distribution
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time customer risk segmentation
          </p>
        </div>
        <span className="text-[11px] font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md border border-slate-700">
          {total} Evaluated
        </span>
      </div>

      {/* Donut Chart */}
      <div className="relative h-52 w-full flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip content={<CustomTooltip />} />
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={56}
              outerRadius={80}
              paddingAngle={4}
              dataKey="value"
              stroke="#0B0F19"
              strokeWidth={3}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  className="cursor-pointer transition-opacity hover:opacity-80"
                  onClick={() => {
                    setRiskFilter(entry.level);
                    setActiveTab('customers');
                  }}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center Donut Label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-xs text-slate-400 font-medium">Critical</span>
          <span className="text-xl font-black font-mono text-rose-400">
            {data[0].percentage}%
          </span>
        </div>
      </div>

      {/* Interactive Legend with filter clicks */}
      <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-800">
        {data.map((item) => (
          <button
            key={item.name}
            onClick={() => {
              setRiskFilter(item.level);
              setActiveTab('customers');
            }}
            className="p-2 rounded-xl bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800/80 hover:border-slate-700 transition-all text-left flex flex-col justify-between"
          >
            <div className="flex items-center gap-1.5">
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-[11px] font-medium text-slate-300 truncate">
                {item.level}
              </span>
            </div>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="text-sm font-bold font-mono text-white">
                {item.value}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {item.percentage}%
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
