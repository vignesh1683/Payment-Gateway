import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'visa' | 'mastercard' | 'amex' | 'unknown';
}

const Badge: React.FC<BadgeProps> = ({ children, variant = 'unknown' }) => {
  const variants = {
    visa: 'bg-blue-100 text-blue-700 border-blue-200',
    mastercard: 'bg-orange-100 text-orange-700 border-orange-200',
    amex: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    unknown: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${variants[variant]}`}>
      {children}
    </span>
  );
};

export default Badge;
