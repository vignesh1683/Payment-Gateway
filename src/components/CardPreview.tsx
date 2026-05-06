import React from 'react';
import { CardType } from '@/types/payment';
import { CreditCard } from 'lucide-react';

interface CardPreviewProps {
  cardNumber: string;
  cardholderName: string;
  expiryDate: string;
  cardType: CardType;
}

const CardPreview: React.FC<CardPreviewProps> = ({
  cardNumber,
  cardholderName,
  expiryDate,
  cardType,
}) => {
  return (
    <div className="relative w-full max-w-sm h-56 rounded-2xl p-6 text-white shadow-2xl overflow-hidden group">
      {/* Background Gradient & Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 group-hover:scale-105 transition-transform duration-500" />
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2)_0%,transparent_100%)]" />
      
      <div className="relative h-full flex flex-col justify-between">
        {/* Top: Card Type & Chip */}
        <div className="flex justify-between items-start">
          <div className="w-12 h-10 bg-yellow-400/80 rounded-md shadow-inner relative overflow-hidden">
            <div className="absolute inset-0 flex flex-col gap-1 justify-center items-center opacity-40">
              <div className="w-full h-px bg-black" />
              <div className="w-full h-px bg-black" />
              <div className="w-full h-px bg-black" />
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold tracking-widest uppercase opacity-80">{cardType}</span>
            <div className="mt-1">
              <CreditCard className="w-8 h-8 opacity-90" />
            </div>
          </div>
        </div>

        {/* Middle: Card Number */}
        <div className="mt-4">
          <p className="text-xl sm:text-2xl font-mono tracking-[0.2em] drop-shadow-md">
            {cardNumber || '•••• •••• •••• ••••'}
          </p>
        </div>

        {/* Bottom: Name & Expiry */}
        <div className="flex justify-between items-end">
          <div className="flex-1">
            <p className="text-[10px] uppercase tracking-wider opacity-60 mb-1">Card Holder</p>
            <p className="text-sm font-medium tracking-wide truncate pr-4">
              {cardholderName || 'YOUR NAME'}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider opacity-60 mb-1 text-right">Expires</p>
            <p className="text-sm font-medium tracking-wide text-right">
              {expiryDate || 'MM/YY'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardPreview;
