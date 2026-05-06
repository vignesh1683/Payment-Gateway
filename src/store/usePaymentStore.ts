import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { PaymentStatus, Transaction, CardType, Currency } from '@/types/payment';

interface PaymentState {
  // Global Payment Lifecycle
  status: PaymentStatus;

  // Current Transaction Context
  currentTransactionId: string | null;
  attemptCount: number;

  // History
  history: Transaction[];

  // Actions
  setStatus: (status: PaymentStatus) => void;
  setCurrentTransactionId: (id: string | null) => void;
  incrementAttemptCount: () => void;
  resetAttemptCount: () => void;
  addTransaction: (transaction: Transaction) => void;
  clearHistory: () => void;
}

export const usePaymentStore = create<PaymentState>()(
  persist(
    (set) => ({
      status: 'IDLE',
      currentTransactionId: null,
      attemptCount: 0,
      history: [],

      setStatus: (status) => set({ status }),

      setCurrentTransactionId: (id) => set({ currentTransactionId: id }),

      incrementAttemptCount: () => set((state) => ({ attemptCount: state.attemptCount + 1 })),

      resetAttemptCount: () => set({ attemptCount: 0 }),

      addTransaction: (transaction) => set((state) => {
        const existingIndex = state.history.findIndex((t) => t.id === transaction.id);
        if (existingIndex > -1) {
          const newHistory = [...state.history];
          newHistory[existingIndex] = transaction;
          return { history: newHistory };
        }
        return { history: [transaction, ...state.history] };
      }),

      clearHistory: () => set({ history: [] }),
    }),
    {
      name: 'payment-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ history: state.history }), // Only persist history across refreshes
    }
  )
);
