import React, { useState } from 'react';
import { usePaymentStore } from '@/store/usePaymentStore';
import { Transaction } from '@/types/payment';
import { formatCurrency } from '@/utils/formatting';
import { 
  ChevronRight, 
  History, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ExternalLink,
  Calendar,
  CreditCard
} from 'lucide-react';

const TransactionHistory: React.FC = () => {
  const { history } = usePaymentStore();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-6 bg-slate-900/30 rounded-2xl border border-dashed border-slate-800 text-slate-500">
        <History className="w-12 h-12 mb-4 opacity-20" />
        <p className="text-sm font-medium">No transaction history yet.</p>
        <p className="text-[10px] mt-1">Completed payments will appear here.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <History className="w-5 h-5 text-indigo-400" />
        <h3 className="text-lg font-bold">Transaction History</h3>
      </div>

      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        {history.map((transaction) => {
          const isExpanded = selectedId === transaction.id;
          const isSuccess = transaction.status === 'SUCCESS';
          const isFailed = transaction.status === 'FAILED';
          const isTimeout = transaction.status === 'TIMEOUT';

          return (
            <div 
              key={transaction.id}
              className={`group bg-slate-900/50 rounded-xl border transition-all duration-300 overflow-hidden ${
                isExpanded ? 'border-indigo-500/50 ring-1 ring-indigo-500/20' : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <button
                onClick={() => setSelectedId(isExpanded ? null : transaction.id)}
                className="w-full p-4 flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    isSuccess ? 'bg-emerald-500/10 text-emerald-500' :
                    isFailed ? 'bg-red-500/10 text-red-500' :
                    'bg-amber-500/10 text-amber-500'
                  }`}>
                    {isSuccess && <CheckCircle2 className="w-4 h-4" />}
                    {isFailed && <XCircle className="w-4 h-4" />}
                    {isTimeout && <Clock className="w-4 h-4" />}
                  </div>
                  <div>
                    <p className="text-sm font-bold tracking-tight">
                      {formatCurrency(transaction.amount, transaction.currency)}
                    </p>
                    <p className="text-[10px] text-slate-500 font-medium">
                      {new Date(transaction.timestamp).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                    isSuccess ? 'bg-emerald-500/5 text-emerald-500 border-emerald-500/20' :
                    isFailed ? 'bg-red-500/5 text-red-500 border-red-500/20' :
                    'bg-amber-500/5 text-amber-500 border-amber-500/20'
                  }`}>
                    {transaction.status}
                  </span>
                  <ChevronRight className={`w-4 h-4 text-slate-600 transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`} />
                </div>
              </button>

              {isExpanded && (
                <div className="px-4 pb-4 animate-in slide-in-from-top-2 duration-300">
                  <div className="h-px bg-slate-800 mb-4" />
                  <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-[10px]">
                    <div className="space-y-1">
                      <p className="text-slate-500 uppercase font-bold flex items-center gap-1">
                        <CreditCard className="w-3 h-3" /> Card Info
                      </p>
                      <p className="text-slate-300 font-mono">{transaction.cardType} •••• {transaction.cardLast4}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-slate-500 uppercase font-bold flex items-center gap-1">
                        <ExternalLink className="w-3 h-3" /> Transaction ID
                      </p>
                      <p className="text-slate-300 font-mono break-all">{transaction.id}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-slate-500 uppercase font-bold flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> Timestamp
                      </p>
                      <p className="text-slate-300">{new Date(transaction.timestamp).toISOString()}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-slate-500 uppercase font-bold flex items-center gap-1">
                        <RotateCcw className="w-3 h-3" /> Attempts
                      </p>
                      <p className="text-slate-300">{transaction.attemptCount} of 3</p>
                    </div>
                    {transaction.failureReason && (
                      <div className="col-span-2 space-y-1 mt-2 p-2 bg-red-500/5 border border-red-500/10 rounded-lg">
                        <p className="text-red-400 uppercase font-bold">Failure Reason</p>
                        <p className="text-red-300/80 italic">{transaction.failureReason}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Simple RotateCcw icon replacement if needed
const RotateCcw = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
  </svg>
);

export default TransactionHistory;
