import React from 'react';

export default function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendType = 'neutral',
  color = 'indigo',
  onClick = null
}) {
  const colorMap = {
    indigo: {
      bg: 'from-indigo-500/10 to-indigo-500/5',
      border: 'border-indigo-500/20 hover:border-indigo-500/40',
      iconBg: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
      glow: 'hover:shadow-glow-indigo',
      textAccent: 'text-indigo-400'
    },
    rose: {
      bg: 'from-rose-500/10 to-rose-500/5',
      border: 'border-rose-500/20 hover:border-rose-500/40',
      iconBg: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
      glow: 'hover:shadow-glow-rose',
      textAccent: 'text-rose-400'
    },
    amber: {
      bg: 'from-amber-500/10 to-amber-500/5',
      border: 'border-amber-500/20 hover:border-amber-500/40',
      iconBg: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
      glow: 'hover:shadow-glow-amber',
      textAccent: 'text-amber-400'
    },
    emerald: {
      bg: 'from-emerald-500/10 to-emerald-500/5',
      border: 'border-emerald-500/20 hover:border-emerald-500/40',
      iconBg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
      glow: 'hover:shadow-glow-emerald',
      textAccent: 'text-emerald-400'
    },
    cyan: {
      bg: 'from-cyan-500/10 to-cyan-500/5',
      border: 'border-cyan-500/20 hover:border-cyan-500/40',
      iconBg: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
      glow: 'hover:shadow-glow-cyan',
      textAccent: 'text-cyan-400'
    }
  }[color] || {
    bg: 'from-slate-800/20 to-slate-800/5',
    border: 'border-slate-700/40 hover:border-slate-600',
    iconBg: 'bg-slate-800 text-slate-300 border-slate-700',
    glow: '',
    textAccent: 'text-slate-300'
  };

  const trendColor = {
    up: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    down: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    neutral: 'text-slate-400 bg-slate-800 border-slate-700'
  }[trendType];

  return (
    <div
      onClick={onClick}
      className={`relative p-5 rounded-2xl bg-gradient-to-b ${colorMap.bg} backdrop-blur-md border ${colorMap.border} ${colorMap.glow} transition-all duration-300 ${
        onClick ? 'cursor-pointer transform hover:-translate-y-1' : ''
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          {title}
        </span>
        {Icon && (
          <div className={`p-2.5 rounded-xl border ${colorMap.iconBg} shrink-0`}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl lg:text-3xl font-extrabold text-white font-mono tracking-tight">
          {value}
        </span>
        {trend && (
          <span className={`text-[11px] font-semibold px-1.5 py-0.5 rounded-md border ${trendColor}`}>
            {trend}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="mt-2 text-xs text-slate-400 leading-tight">
          {subtitle}
        </p>
      )}
    </div>
  );
}
