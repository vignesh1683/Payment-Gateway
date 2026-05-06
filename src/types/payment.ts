export type CardType = 'VISA' | 'MASTERCARD' | 'AMEX' | 'UNKNOWN';

export type Currency = 'INR' | 'USD';

export type PaymentStatus = 'IDLE' | 'PROCESSING' | 'SUCCESS' | 'FAILED';

export interface Transaction {
  id: string;
  cardholderName: string;
  cardNumber: string; // Masked version
  cardType: CardType;
  amount: string;
  currency: Currency;
  status: PaymentStatus;
  timestamp: number;
}