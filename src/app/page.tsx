'use client';

import React, { useState } from 'react';
import PaymentForm from '@/components/PaymentForm';
import CardPreview from '@/components/CardPreview';
import { CardType } from '@/types/payment';

export default function Home() {
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

  return (
    <main className="min-h-screen flex flex-col items-center py-12 px-4 md:px-8">
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
        {/* Left: Form */}
        <div className="flex justify-center lg:justify-end order-2 lg:order-1">
          <PaymentForm onFormUpdate={handleFormUpdate} />
        </div>

        {/* Right: Preview & Stats */}
        <div className="flex flex-col items-center lg:items-start space-y-8 order-1 lg:order-2">
          <div className="sticky top-12 space-y-8 w-full">
            <div className="flex flex-col items-center lg:items-start">
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-6">Live Card Preview</h3>
              <CardPreview {...previewData} />
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
              <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800">
                <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Status</p>
                <p className="text-emerald-400 font-mono text-xs">Ready for Transaction</p>
              </div>
              <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800">
                <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Attempt</p>
                <p className="text-indigo-400 font-mono text-xs">1 of 3 Available</p>
              </div>
            </div>

            {/* Quick Tips */}
            <div className="max-w-sm bg-indigo-500/5 p-4 rounded-xl border border-indigo-500/20">
              <p className="text-xs text-indigo-300 leading-relaxed">
                <span className="font-bold">Tip:</span> Try different card numbers to see real-time card type detection (4 for Visa, 5 for Mastercard, 34/37 for Amex).
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
