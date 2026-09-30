import React, { useState } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import {
  Radio,
  Eye,
  Info
} from 'lucide-react';

export default function LiveJourneyStream() {
  const { openCustomerDetails } = useDashboard();
  const [streamEvents] = useState([
    {
      id: 'EVT-901',
      time: 'Just now',
      customerId: 'CUST-8492',
      customerName: 'Alex Rivera',
      stage: 'Payment',
      event: '3DS Verification Failed (HTTP 408 Timeout)',
      type: 'friction',
      cartValue: '$349.99'
    },
    {
      id: 'EVT-902',
      time: '1 min ago',
      customerId: 'CUST-3910',
      customerName: 'Elena Rostova',
      stage: 'Checkout',
      event: 'Shipping fee modal closed after 48s dwell time',
      type: 'friction',
      cartValue: '$840.00'
    },
    {
      id: 'EVT-903',
      time: '2 mins ago',
      customerId: 'CUST-5521',
      customerName: 'Marcus Vance',
      stage: 'Checkout',
      event: 'Invalid promo code entered: SAVE20',
      type: 'warning',
      cartValue: '$129.50'
    },
    {
      id: 'EVT-904',
      time: '3 mins ago',
      customerId: 'CUST-6744',
      customerName: 'Sophie Chen',
      stage: 'Comparison',
      event: 'Toggled between 27" and 32" monitor specs 6x',
      type: 'warning',
      cartValue: '$560.00'
    },
    {
      id: 'EVT-905',
      time: '4 mins ago',
      customerId: 'CUST-1823',
      customerName: 'Liam O\'Connor',
      stage: 'Order Placed',
      event: 'Order Confirmed #ORD-9912 via Apple Pay',
      type: 'success',
      cartValue: '$420.00'
    }
  ]);

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Radio className="w-5 h-5 animate-pulse" />
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-wide">
                  Journey Telemetry Stream
                </h3>
                {/* Changed from WebSocket: CONNECTED to Simulated Live */}
                <span className="px-2 py-0.5 text-[10px] bg-amber-500/10 text-amber-300 border border-amber-500/30 rounded-full font-mono font-bold">
                  Simulated Live
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Simulated behavioral event signals for hackathon demonstration
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-950/60 px-3 py-1.5 rounded-lg border border-slate-800 font-mono">
            <Info className="w-3.5 h-3.5 text-slate-400" />
            <span>Event Simulation Rate: <strong className="text-emerald-400">18.4 events/min</strong></span>
          </div>
        </div>

        {/* Live Event Feed */}
        <div className="space-y-2.5">
          {streamEvents.map((evt) => {
            const isFriction = evt.type === 'friction';
            const isWarning = evt.type === 'warning';

            return (
              <div
                key={evt.id}
                className={`p-3.5 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isFriction
                    ? 'bg-rose-500/10 border-rose-500/30 shadow-glow-rose'
                    : isWarning
                    ? 'bg-amber-500/10 border-amber-500/25'
                    : 'bg-emerald-500/5 border-emerald-500/20'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                      isFriction
                        ? 'bg-rose-500 animate-ping'
                        : isWarning
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-white">
                        {evt.customerName}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                        {evt.customerId}
                      </span>
                      <span className="text-[10px] font-semibold text-indigo-300 bg-indigo-500/20 px-2 py-0.5 rounded">
                        {evt.stage}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-0.5">
                      {evt.event}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                  <span className="text-xs font-mono font-bold text-white">
                    {evt.cartValue}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {evt.time}
                  </span>
                  <button
                    onClick={() => openCustomerDetails(evt.customerId)}
                    className="px-2.5 py-1 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Inspect</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
