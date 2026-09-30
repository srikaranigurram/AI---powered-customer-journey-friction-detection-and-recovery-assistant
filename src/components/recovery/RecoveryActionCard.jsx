import React, { useState } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import {
  Zap,
  Send,
  CheckCircle2,
  Clock,
  MessageCircle,
  Mail,
  Smartphone,
  Tag,
  ShieldCheck,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function RecoveryActionCard({ customer, onTriggered = null }) {
  const { handleTriggerRecovery, triggeringRecovery } = useDashboard();
  const [selectedChannel, setSelectedChannel] = useState(
    customer?.recovery?.channel?.split('+')[0]?.trim() || 'WhatsApp'
  );
  const [selectedOffer, setSelectedOffer] = useState(
    customer?.recovery?.discountOffer || 'Free Shipping Voucher'
  );

  if (!customer) return null;

  const isTriggered = customer.status === 'Triggered' || customer.status === 'Delivered';
  const isConverted = customer.status === 'Converted';

  const channels = [
    { id: 'WhatsApp', label: 'WhatsApp', icon: MessageCircle, color: 'text-emerald-400' },
    { id: 'Email', label: 'Email', icon: Mail, color: 'text-cyan-400' },
    { id: 'SMS', label: 'SMS', icon: Smartphone, color: 'text-amber-400' }
  ];

  const handleExecute = async () => {
    const success = await handleTriggerRecovery(customer.id, {
      channel: selectedChannel,
      strategy: customer.recovery?.recommendedStrategy,
      discountOffer: selectedOffer,
      message: customer.aiInsight?.personalizedMessage
    });
    if (success && onTriggered) {
      onTriggered();
    }
  };

  return (
    <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white tracking-wide">
              Automated Recovery Action Center
            </h4>
            <p className="text-[11px] text-slate-400">
              Trigger high-conversion recovery dispatch to customer
            </p>
          </div>
        </div>

        {/* Recovery Status */}
        <div className="flex items-center gap-1.5">
          {isConverted ? (
            <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Status: Converted
            </span>
          ) : isTriggered ? (
            <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              Status: Triggered & Delivered
            </span>
          ) : (
            <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              Status: Ready for Trigger
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-2">
        {/* Recommended Strategy Box */}
        <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
          <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">
            Recommended Strategy
          </div>
          <div className="text-xs font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>{customer.recovery?.recommendedStrategy || 'Instant 1-Click Alternate Payment'}</span>
          </div>
          {customer.recovery?.discountOffer && (
            <div className="mt-2 text-[11px] text-amber-300 font-mono flex items-center gap-1">
              <Tag className="w-3.5 h-3.5" />
              Incentive: {customer.recovery.discountOffer}
            </div>
          )}
        </div>

        {/* Recovery Channel Selector */}
        <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
          <div className="text-[10px] uppercase font-bold text-slate-400 mb-2">
            Select Recovery Channel
          </div>
          <div className="grid grid-cols-3 gap-2">
            {channels.map((chan) => {
              const Icon = chan.icon;
              const isSelected = selectedChannel === chan.id;
              return (
                <button
                  key={chan.id}
                  onClick={() => setSelectedChannel(chan.id)}
                  disabled={isTriggered || isConverted}
                  className={`flex flex-col items-center justify-center p-2 rounded-lg border text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-indigo-600/30 border-indigo-500 text-white shadow-glow-indigo'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Icon className={`w-4 h-4 mb-1 ${chan.color}`} />
                  <span className="text-[10px]">{chan.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Trigger Button */}
      <div className="pt-2">
        <button
          onClick={handleExecute}
          disabled={triggeringRecovery || isTriggered || isConverted}
          className={`w-full flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-xl font-bold text-sm transition-all duration-200 shadow-xl ${
            isConverted
              ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 cursor-default'
              : isTriggered
              ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 cursor-default'
              : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white shadow-glow-indigo active:scale-[0.99]'
          }`}
        >
          {triggeringRecovery ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Dispatching AI Recovery Sequence...</span>
            </>
          ) : isConverted ? (
            <>
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>Customer Successfully Recovered!</span>
            </>
          ) : isTriggered ? (
            <>
              <CheckCircle2 className="w-5 h-5 text-indigo-400" />
              <span>Recovery Sequence Active (Dispatched via {selectedChannel})</span>
            </>
          ) : (
            <>
              <Zap className="w-5 h-5 text-amber-300 fill-amber-300 animate-bounce" />
              <span>Trigger Recovery to {customer.name} via {selectedChannel}</span>
            </>
          )}
        </button>
        {isTriggered && customer.recovery?.lastTriggered && (
          <p className="text-center text-[10px] text-slate-400 mt-2">
            Dispatched at {customer.recovery.lastTriggered} • Awaiting customer click
          </p>
        )}
      </div>
    </div>
  );
}
