import React from 'react';

export default function RiskBadge({ level, score = null, size = 'md', showPulse = true }) {
  const normalizedLevel = (level || 'LOW').toUpperCase();

  const config = {
    HIGH: {
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/30',
      text: 'text-rose-400',
      dot: 'bg-rose-500',
      glow: 'shadow-[0_0_10px_rgba(244,63,94,0.35)]',
      pulseClass: 'pulse-ring-high bg-rose-500',
      label: 'HIGH RISK'
    },
    MEDIUM: {
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/30',
      text: 'text-amber-400',
      dot: 'bg-amber-500',
      glow: 'shadow-[0_0_10px_rgba(245,158,11,0.3)]',
      pulseClass: 'bg-amber-500',
      label: 'MEDIUM RISK'
    },
    LOW: {
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/30',
      text: 'text-emerald-400',
      dot: 'bg-emerald-500',
      glow: 'shadow-[0_0_10px_rgba(16,185,129,0.3)]',
      pulseClass: 'bg-emerald-500',
      label: 'LOW RISK'
    }
  }[normalizedLevel] || {
    bg: 'bg-slate-500/10',
    border: 'border-slate-500/30',
    text: 'text-slate-400',
    dot: 'bg-slate-500',
    glow: '',
    pulseClass: 'bg-slate-500',
    label: 'UNKNOWN'
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[11px] gap-1.5',
    md: 'px-2.5 py-1 text-xs gap-2',
    lg: 'px-3.5 py-1.5 text-sm gap-2.5'
  }[size] || 'px-2.5 py-1 text-xs gap-2';

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border transition-all ${config.bg} ${config.border} ${config.text} ${config.glow} ${sizeClasses}`}
    >
      <span className="relative flex h-2 w-2">
        {showPulse && normalizedLevel === 'HIGH' && (
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${config.dot}`}></span>
      </span>
      <span className="font-semibold tracking-wider">{config.label}</span>
      {score !== null && (
        <span className="opacity-90 font-mono font-bold ml-0.5">
          {score}%
        </span>
      )}
    </span>
  );
}
