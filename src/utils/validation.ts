import { CardType } from '@/types/payment';

export const validateCardNumber = (number: string): boolean => {
  const digits = number.replace(/\D/g, '');
  if (digits.length < 13 || digits.length > 19) return false;

  // Luhn Algorithm
  let sum = 0;
  let shouldDouble = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits.charAt(i));
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
};

export const detectCardType = (number: string): CardType => {
  const digits = number.replace(/\D/g, '');
  if (/^4/.test(digits)) return 'VISA';
  if (/^5[1-5]/.test(digits) || /^2[2-7]/.test(digits)) return 'MASTERCARD';
  if (/^3[47]/.test(digits)) return 'AMEX';
  return 'UNKNOWN';
};

export const validateExpiry = (expiry: string): boolean => {
  if (!/^\d{2}\/\d{2}$/.test(expiry)) return false;
  
  const [month, year] = expiry.split('/').map(Number);
  if (month < 1 || month > 12) return false;

  const now = new Date();
  const currentYear = now.getFullYear() % 100;
  const currentMonth = now.getMonth() + 1;

  if (year < currentYear) return false;
  if (year === currentYear && month < currentMonth) return false;
  
  return true;
};

export const validateCVV = (cvv: string, cardType: CardType): boolean => {
  const digits = cvv.replace(/\D/g, '');
  if (cardType === 'AMEX') {
    return digits.length === 4;
  }
  return digits.length === 3;
};

export const validateAmount = (amount: number): boolean => {
  return amount > 0;
};
