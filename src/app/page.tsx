'use client';

import React, { useState } from 'react';
import PaymentForm from '@/components/PaymentForm';
import CardPreview from '@/components/CardPreview';
import StatusScreen from '@/components/StatusScreen';
import TransactionHistory from '@/components/TransactionHistory';
import { usePaymentStore } from '@/store/usePaymentStore';
import { CardType } from '@/types/payment';

export default function Home() {
  const { status, setStatus, history, currentTransactionId, attemptCount, resetAttemptCount, setCurrentTransactionId } = usePaymentStore();

  const [previewData, setPreviewData] = useState({
    cardNumber: '',
    cardholderName: '',
    expiryDate: '',
    cardType: 'UNKNOWN' as CardType,
  });

  const handleFormUpdate = (data: any) => {
    setPreviewData({
      cardNumber: data.cardNumber,
      cardholderName: data.cardholderName,
      expiryDate: data.expiryDate,
      cardType: data.cardType,
    });
  };

  const currentTransaction = history.find(t => t.id === currentTransactionId) || null;

  const handleRetry = () => {
    setStatus('IDLE');
  };

  const handleReset = () => {
    setStatus('IDLE');
    resetAttemptCount();
    setCurrentTransactionId(null);
  };

  return (
    <main className="min-h-screen flex flex-col items-center py-12 px-4 md:px-8 bg-slate-950 text-slate-50">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 mb-4">
          NeoPay Gateway
        </h1>
        <p className="text-slate-400 max-w-md mx-auto">
          Experience the future of secure digital payments with our lightning-fast gateway simulator.
        </p>
      </div>

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Left Column: Form / Status & History */}
        <div className="flex flex-col space-y-12 items-center lg:items-end order-2 lg:order-1">
          {/* Form or Status Screen */}
          <div className="w-full flex justify-center lg:justify-end min-h-[500px]">
            {(status === 'IDLE' || status === 'PROCESSING') ? (
              <PaymentForm onFormUpdate={handleFormUpdate} />
            ) : (
              <StatusScreen
                status={status}
                transaction={currentTransaction}
                onRetry={handleRetry}
                onReset={handleReset}
                attemptCount={attemptCount}
              />
            )}
          </div>

          {/* History Section (Visible on mobile/tablet below the form) */}
          <div className="lg:hidden w-full flex justify-center">
            <TransactionHistory />
          </div>
        </div>

        {/* Right Column: Preview, Stats & History (Desktop) */}
        <div className="flex flex-col items-center lg:items-start space-y-12 order-1 lg:order-2">
          <div className="sticky top-12 space-y-10 w-full">
            <div className="flex flex-col items-center lg:items-start">
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-6">Live Card Preview</h3>
              <CardPreview {...previewData} />
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
              <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800">
                <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Status</p>
                <p className={`font-mono text-xs ${status === 'SUCCESS' ? 'text-emerald-400' :
                  status === 'FAILED' ? 'text-red-400' :
                    status === 'TIMEOUT' ? 'text-amber-400' :
                      status === 'PROCESSING' ? 'text-indigo-400 animate-pulse' : 'text-slate-400'
                  }`}>
                  {status === 'IDLE' ? 'Ready' : status.charAt(0) + status.slice(1).toLowerCase()}
                </p>
              </div>
              <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800">
                <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Attempt</p>
                <p className="text-indigo-400 font-mono text-xs">{attemptCount} of 3 Used</p>
              </div>
            </div>

            {/* Desktop History Section */}
            <div className="hidden lg:block w-full">
              <TransactionHistory />
            </div>

            {/* Quick Tips */}
            <div className="max-w-sm bg-indigo-500/5 p-4 rounded-xl border border-indigo-500/20">
              <p className="text-xs text-indigo-300 leading-relaxed">
                <span className="font-bold">Tip:</span> All transactions are persisted in your browser's local storage. Feel free to refresh the page!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-20 py-8 border-t border-slate-900 w-full max-w-6xl text-center">
        <p className="text-slate-600 text-[10px] tracking-widest uppercase">
          Neo Pay - A Payment Gateway @ vignesh.m1683@gmail.com
        </p>
      </footer>
    </main>
  );
}
