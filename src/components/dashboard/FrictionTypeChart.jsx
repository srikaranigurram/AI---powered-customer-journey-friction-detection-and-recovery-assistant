import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell
} from 'recharts';
import { useDashboard } from '../../context/DashboardContext';
import { AlertOctagon } from 'lucide-react';

export default function FrictionTypeChart() {
  const { analytics, setFrictionFilter, setActiveTab } = useDashboard();

  const frictionData = analytics?.frictionTypes || [
    { type: "Payment Gateway", count: 68, color: "#EF4444" },
    { type: "Shipping Cost", count: 47, color: "#F97316" },
    { type: "Promo Rejection", count: 35, color: "#F59E0B" },
    { type: "Comparison Paralysis", count: 24, color: "#8B5CF6" },
    { type: "Form Validation", count: 15, color: "#06B6D4" }
  ];

  // Shorten names for clean X-axis labels on mobile/desktop
  const formattedData = frictionData.map(d => ({
    ...d,
    shortName: d.type.replace(' Failure', '').replace(' Error', '').replace(' Shock', '')
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900/95 border border-slate-700/80 p-3 rounded-xl shadow-2xl backdrop-blur-md text-xs">
          <div className="font-bold text-white mb-1.5 flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: data.color }}
            />
            {data.type}
          </div>
          <div className="text-slate-300 flex justify-between gap-6">
            <span>Friction Occurrences:</span>
            <span className="font-mono font-bold text-white">{data.count}</span>
          </div>
          {data.highRiskCount && (
            <div className="text-rose-400 flex justify-between gap-6 mt-1 font-semibold">
              <span>High-Risk Blockers:</span>
              <span className="font-mono">{data.highRiskCount}</span>
            </div>
          )}
          <div className="mt-2 text-[10px] text-indigo-300 italic">
            Click bar to filter customer table
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
            Friction Type Breakdown
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Bottlenecks detected by stage classification
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20">
          <AlertOctagon className="w-3.5 h-3.5" />
          <span>Top Blocker: Gateway</span>
        </div>
      </div>

      {/* Bar Chart Container */}
      <div className="h-56 w-full mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={formattedData}
            margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
          >
            <XAxis
              dataKey="shortName"
              stroke="#64748B"
              fontSize={11}
              tickLine={false}
              interval={0}
              angle={-15}
              textAnchor="end"
            />
            <YAxis
              stroke="#64748B"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }} />
            <Bar
              dataKey="count"
              radius={[6, 6, 0, 0]}
              animationDuration={1200}
            >
              {formattedData.map((entry, index) => (
                <Cell
                  key={`bar-cell-${index}`}
                  fill={entry.color}
                  className="cursor-pointer transition-opacity hover:opacity-80"
                  onClick={() => {
                    setFrictionFilter(entry.type);
                    setActiveTab('customers');
                  }}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-800 mt-2">
        <span>Payment & Pricing account for 60.9% of friction</span>
        <button
          onClick={() => {
            setFrictionFilter('ALL');
            setActiveTab('customers');
          }}
          className="text-indigo-400 hover:text-indigo-300 font-medium hover:underline text-xs"
        >
          View all issues →
        </button>
      </div>
    </div>
  );
}
