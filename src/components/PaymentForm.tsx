'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePaymentStore } from '@/store/usePaymentStore';
import {
  validateCardNumber,
  detectCardType,
  validateExpiry,
  validateCVV,
  validateAmount
} from '@/utils/validation';
import { formatCardNumber, formatExpiryDate } from '@/utils/formatting';
import { Currency, CardType, Transaction } from '@/types/payment';
import Badge from './Badge';
import { Loader2, ShieldCheck } from 'lucide-react';

interface FormErrors {
  cardholderName?: string;
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  amount?: string;
}

interface PaymentFormProps {
  onFormUpdate: (data: any) => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ onFormUpdate }) => {
  const {
    status,
    setStatus,
    incrementAttemptCount,
    setCurrentTransactionId,
    currentTransactionId,
    addTransaction,
    attemptCount
  } = usePaymentStore();

  const [formData, setFormData] = useState({
    cardholderName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    amount: '',
    currency: 'USD' as Currency,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [cardType, setCardType] = useState<CardType>('UNKNOWN');

  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    onFormUpdate({ ...formData, cardType });
  }, [formData, cardType, onFormUpdate]);

  const validateField = (name: string, value: string) => {
    let error = '';
    switch (name) {
      case 'cardholderName':
        if (!value.trim()) error = 'Name is required';
        break;
      case 'cardNumber':
        if (!validateCardNumber(value)) error = 'Invalid card number';
        break;
      case 'expiryDate':
        if (!validateExpiry(value)) error = 'Invalid expiry (MM/YY)';
        break;
      case 'cvv':
        if (!validateCVV(value, cardType)) error = `Invalid CVV (${cardType === 'AMEX' ? '4' : '3'} digits)`;
        break;
      case 'amount':
        if (!validateAmount(Number(value))) error = 'Amount must be greater than 0';
        break;
    }
    return error;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'cardNumber') {
      formattedValue = formatCardNumber(value);
      setCardType(detectCardType(formattedValue));
    } else if (name === 'expiryDate') {
      formattedValue = formatExpiryDate(value);
    }

    setFormData(prev => ({ ...prev, [name]: formattedValue }));

    const error = validateField(name, formattedValue);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, formData[name as keyof typeof formData] as string);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const isFormValid =
    formData.cardholderName &&
    formData.cardNumber &&
    formData.expiryDate &&
    formData.cvv &&
    formData.amount &&
    Object.values(errors).every(err => !err);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!isFormValid || status === 'PROCESSING') return;

    // Set initial state for the transaction
    setStatus('PROCESSING');

    // Use existing transaction ID if it's a retry, otherwise generate new
    const transactionId = currentTransactionId || crypto.randomUUID();
    if (!currentTransactionId) {
      setCurrentTransactionId(transactionId);
    }

    incrementAttemptCount();

    // Setup AbortController for 6s timeout
    abortControllerRef.current = new AbortController();
    const timeoutId = setTimeout(() => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    }, 6000);

    try {
      const response = await fetch('/api/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          amount: Number(formData.amount),
          transactionId
        }),
        signal: abortControllerRef.current.signal
      });

      clearTimeout(timeoutId);
      const data = await response.json();

      const transaction: Transaction = {
        id: transactionId,
        amount: Number(formData.amount),
        currency: formData.currency,
        status: data.status === 'SUCCESS' ? 'SUCCESS' : 'FAILED',
        timestamp: Date.now(),
        cardLast4: formData.cardNumber.slice(-4),
        cardType: cardType,
        failureReason: data.reason,
        attemptCount: attemptCount + 1
      };

      addTransaction(transaction);
      setStatus(transaction.status);

    } catch (error: any) {
      clearTimeout(timeoutId);

      const isTimeout = error.name === 'AbortError';
      const status: 'TIMEOUT' | 'FAILED' = isTimeout ? 'TIMEOUT' : 'FAILED';

      const transaction: Transaction = {
        id: transactionId,
        amount: Number(formData.amount),
        currency: formData.currency,
        status: status,
        timestamp: Date.now(),
        cardLast4: formData.cardNumber.slice(-4),
        cardType: cardType,
        failureReason: isTimeout ? 'Gateway timeout' : 'Network error',
        attemptCount: attemptCount + 1
      };

      addTransaction(transaction);
      setStatus(status);
    }
  };

  if (status !== 'IDLE' && status !== 'PROCESSING') return null;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-md bg-slate-900/50 p-8 rounded-2xl border border-slate-800 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-2 mb-2">
        <ShieldCheck className="w-5 h-5 text-indigo-400" />
        <h2 className="text-xl font-bold">Payment Details</h2>
      </div>

      <div className="space-y-4">
        {/* Cardholder Name */}
        <div>
          <label className="block text-xs font-medium text-slate-400 uppercase mb-1">Cardholder Name</label>
          <input
            name="cardholderName"
            type="text"
            value={formData.cardholderName}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="John Doe"
            disabled={status === 'PROCESSING'}
            className={`w-full bg-slate-800 border ${touched.cardholderName && errors.cardholderName ? 'border-red-500' : 'border-slate-700'} rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all disabled:opacity-50`}
          />
          {touched.cardholderName && errors.cardholderName && <p className="text-red-500 text-[10px] mt-1">{errors.cardholderName}</p>}
        </div>

        {/* Card Number */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-xs font-medium text-slate-400 uppercase">Card Number</label>
            <Badge variant={cardType.toLowerCase() as any}>{cardType}</Badge>
          </div>
          <input
            name="cardNumber"
            type="text"
            value={formData.cardNumber}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="0000 0000 0000 0000"
            disabled={status === 'PROCESSING'}
            className={`w-full bg-slate-800 border ${touched.cardNumber && errors.cardNumber ? 'border-red-500' : 'border-slate-700'} rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 tracking-widest transition-all disabled:opacity-50`}
          />
          {touched.cardNumber && errors.cardNumber && <p className="text-red-500 text-[10px] mt-1">{errors.cardNumber}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Expiry Date */}
          <div>
            <label className="block text-xs font-medium text-slate-400 uppercase mb-1">Expiry Date</label>
            <input
              name="expiryDate"
              type="text"
              value={formData.expiryDate}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="MM/YY"
              disabled={status === 'PROCESSING'}
              className={`w-full bg-slate-800 border ${touched.expiryDate && errors.expiryDate ? 'border-red-500' : 'border-slate-700'} rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all disabled:opacity-50`}
            />
            {touched.expiryDate && errors.expiryDate && <p className="text-red-500 text-[10px] mt-1">{errors.expiryDate}</p>}
          </div>

          {/* CVV */}
          <div>
            <label className="block text-xs font-medium text-slate-400 uppercase mb-1">CVV</label>
            <input
              name="cvv"
              type="text"
              value={formData.cvv}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder={cardType === 'AMEX' ? '0000' : '000'}
              disabled={status === 'PROCESSING'}
              className={`w-full bg-slate-800 border ${touched.cvv && errors.cvv ? 'border-red-500' : 'border-slate-700'} rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all disabled:opacity-50`}
            />
            {touched.cvv && errors.cvv && <p className="text-red-500 text-[10px] mt-1">{errors.cvv}</p>}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {/* Amount */}
          <div className="col-span-2">
            <label className="block text-xs font-medium text-slate-400 uppercase mb-1">Amount</label>
            <input
              name="amount"
              type="number"
              value={formData.amount}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="0.00"
              disabled={status === 'PROCESSING'}
              className={`w-full bg-slate-800 border ${touched.amount && errors.amount ? 'border-red-500' : 'border-slate-700'} rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all disabled:opacity-50`}
            />
            {touched.amount && errors.amount && <p className="text-red-500 text-[10px] mt-1">{errors.amount}</p>}
          </div>

          {/* Currency */}
          <div>
            <label className="block text-xs font-medium text-slate-400 uppercase mb-1">Currency</label>
            <select
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              disabled={status === 'PROCESSING'}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all appearance-none disabled:opacity-50"
            >
              <option value="USD">USD</option>
              <option value="INR">INR</option>
            </select>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={!isFormValid || status === 'PROCESSING'}
        className={`w-full py-4 rounded-xl font-bold text-white transition-all transform active:scale-95 ${!isFormValid || status === 'PROCESSING'
            ? 'bg-slate-700 cursor-not-allowed opacity-50'
            : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-lg hover:shadow-indigo-500/30'
          }`}
      >
        {status === 'PROCESSING' ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            Processing...
          </span>
        ) : (
          `Pay ${formData.amount ? formData.currency + ' ' + formData.amount : ''}`
        )}
      </button>
    </form>
  );
};

export default PaymentForm;
