export type PaymentStatus = 'IDLE' | 'PROCESSING' | 'SUCCESS' | 'FAILED' | 'TIMEOUT';

export type CardType = 'VISA' | 'MASTERCARD' | 'AMEX' | 'UNKNOWN';

export type Currency = 'INR' | 'USD';

export interface PaymentPayload {
  cardholderName: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  amount: number;
  currency: Currency;
  transactionId: string;
}

export interface Transaction {
  id: string;
  amount: number;
  currency: Currency;
  status: 'SUCCESS' | 'FAILED' | 'TIMEOUT';
  timestamp: number;
  cardLast4: string;
  cardType: CardType;
  failureReason?: string;
  attemptCount: number;
}

export interface ApiResponse {
  status: 'SUCCESS' | 'FAILED';
  reason?: string;
  transactionId: string;
}
