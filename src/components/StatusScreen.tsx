import React from 'react';
import { PaymentStatus, Transaction } from '@/types/payment';
import { CheckCircle2, XCircle, Clock, AlertCircle, RotateCcw, Home } from 'lucide-react';
import { formatCurrency } from '@/utils/formatting';

interface StatusScreenProps {
  status: PaymentStatus;
  transaction: Transaction | null;
  onRetry: () => void;
  onReset: () => void;
  attemptCount: number;
}

const StatusScreen: React.FC<StatusScreenProps> = ({
  status,
  transaction,
  onRetry,
  onReset,
  attemptCount,
}) => {
  if (status === 'IDLE' || status === 'PROCESSING') return null;

  const isSuccess = status === 'SUCCESS';
  const isTimeout = status === 'TIMEOUT';
  const isFailed = status === 'FAILED';
  const canRetry = attemptCount < 3 && !isSuccess;

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-800 w-full max-w-md text-center animate-in fade-in zoom-in duration-300">
      <div className="mb-6">
        {isSuccess && <CheckCircle2 className="w-20 h-20 text-emerald-500 mx-auto" />}
        {isFailed && <XCircle className="w-20 h-20 text-red-500 mx-auto" />}
        {isTimeout && <Clock className="w-20 h-20 text-amber-500 mx-auto" />}
      </div>

      <h2 className="text-2xl font-bold mb-2">
        {isSuccess && 'Payment Successful!'}
        {isFailed && 'Payment Failed'}
        {isTimeout && 'Payment Timed Out'}
      </h2>

      <p className="text-slate-400 mb-8">
        {isSuccess && `Your payment of ${transaction ? formatCurrency(transaction.amount, transaction.currency) : ''} was processed successfully.`}
        {isFailed && (transaction?.failureReason || 'There was an issue processing your transaction.')}
        {isTimeout && 'The payment gateway took too long to respond. Please check your connection or try again.'}
      </p>

      {transaction && (
        <div className="w-full bg-slate-800/50 rounded-xl p-4 mb-8 text-left space-y-2 border border-slate-700/50">
          <div className="flex justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-500">Transaction ID</span>
            <span className="text-[10px] font-mono text-slate-300">{transaction.id.slice(0, 18)}...</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-500">Amount</span>
            <span className="text-[10px] font-mono text-slate-300">{formatCurrency(transaction.amount, transaction.currency)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-500">Card</span>
            <span className="text-[10px] font-mono text-slate-300">{transaction.cardType} •••• {transaction.cardLast4}</span>
          </div>
        </div>
      )}

      <div className="flex flex-col w-full gap-3">
        {canRetry && (
          <button
            onClick={onRetry}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Retry Payment (Attempt {attemptCount + 1} of 3)
          </button>
        )}
        
        {(!canRetry || isSuccess) && (
          <button
            onClick={onReset}
            className="w-full py-4 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            Return Home
          </button>
        )}

        {!isSuccess && !canRetry && (
          <div className="flex items-center justify-center gap-2 text-red-400 text-xs mt-2">
            <AlertCircle className="w-4 h-4" />
            Maximum retry attempts reached.
          </div>
        )}
      </div>
    </div>
  );
};

export default StatusScreen;
