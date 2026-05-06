# NeoPay Gateway – Payment Gateway Simulator

A modern, fully-functional payment gateway simulator built with **Next.js 14**, **TypeScript**, **Zustand**, and **Tailwind CSS**. This project demonstrates a complete payment lifecycle with real-world UX considerations, form validation, and state management—without using any third-party payment SDK.

## 🎯 Features

### ✅ Payment Form
- **Real-time field validation** with per-field error messages (not all-at-once on submit)
- **Auto-formatting** of card numbers (spaces every 4 digits: `4242 4242 4242 4242`)
- **Card type detection** (Visa, Mastercard, Amex) with visual badges
- **Expiry date validation** that rejects past dates
- **CVV validation** (3 digits standard, 4 digits for Amex)
- **Currency selector** (USD, INR)
- **Disabled submit button** until form is fully valid

### 💳 Live Card Preview
- Real-time card preview that updates as user types
- Displays card number, cardholder name, expiry date
- Realistic card-like layout with gradient background
- Chip and brand indicators

### 🔄 Full Payment Lifecycle
- **Idle** – Ready to accept payment
- **Processing** – 2-second simulated gateway delay
- **Success** – Payment processed successfully
- **Failed** – Payment declined with reason (e.g., "Insufficient funds")
- **Timeout** – Gateway doesn't respond within 6 seconds

### 🔁 Retry Logic
- Up to **3 retry attempts** per transaction
- Same transaction ID reused across retries (idempotency—no duplicates)
- Attempt counter displayed to user (e.g., "Attempt 2 of 3")
- Clear UX when max retries exhausted

### 📜 Transaction History
- Persistent transaction list stored in browser's **localStorage**
- Survives page refreshes
- Expandable transaction details (ID, amount, card, timestamp, failure reason)
- Visual status indicators (success/failed/timeout)

### ��️ Robust Error Handling
- Network errors detected separately from API failures
- Friendly, readable error messages (no raw error objects)
- Graceful timeout handling using **AbortController** (6-second limit)
- Form state preservation during errors

### 📱 Responsive Design
- Mobile-first approach (tested at 375px, 1280px)
- Two-column layout on desktop
- Touch-friendly buttons and inputs
- Accessible form labels and error messages

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (Recommended: Node 20+)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/vignesh1683/Payment-Gateway.git
   cd Payment-Gateway
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   ```
   http://localhost:3000
   ```

### Build for Production

```bash
npm run build
npm start
```

## 📋 Usage Guide

### Making a Payment

1. **Fill in the form:**
   - Enter cardholder name
   - Enter card number (auto-formats as you type)
   - Enter expiry date (MM/YY)
   - Enter CVV (3-4 digits depending on card type)
   - Enter amount and select currency

2. **Review:**
   - Live card preview updates in real-time
   - Status shows as "Ready" when form is valid

3. **Submit:**
   - Click the "Pay" button to process
   - Spinner shows during 2-second gateway simulation

4. **Result:**
   - **Success:** Shows confirmation with option to return home
   - **Failed:** Shows failure reason with retry button (up to 3 attempts)
   - **Timeout:** Shows timeout message with retry option

5. **History:**
   - All transactions persist in browser's localStorage
   - Click any transaction to view full details (ID, attempts, card type, timestamp)

### Test Card Numbers

Use any of these test cards (or any card passing Luhn validation):
- **Visa:** `4242 4242 4242 4242`
- **Mastercard:** `5555 5555 5555 4444`
- **Amex:** `3782 822463 10005`

**Note:** Payment outcomes are randomized server-side (60% success, 25% failure, 15% timeout).

## 🏗️ Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── pay/
│   │       └── route.ts          # Mock payment gateway (60% success, 25% fail, 15% timeout)
│   ├── globals.css               # Global Tailwind styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Main page (payment flow UI)
├── components/
│   ├── PaymentForm.tsx           # Form with real-time validation
│   ├── CardPreview.tsx           # Live card preview
│   ├── StatusScreen.tsx          # Success/Failed/Timeout screen
│   ├── TransactionHistory.tsx    # Transaction history list
│   └── Badge.tsx                 # Card type badge component
├── store/
│   └── usePaymentStore.ts        # Zustand store (global state + localStorage)
├── types/
│   └── payment.ts                # TypeScript interfaces
└── utils/
    ├── validation.ts             # Card/expiry/CVV validation + Luhn algorithm
    └── formatting.ts             # Number/date formatting utilities
```

## 🛠️ Tech Stack & Architecture

### Why Zustand?
- ✅ **Lightweight** – No boilerplate like Redux
- ✅ **Hook-based** – Familiar React patterns
- ✅ **TypeScript support** – First-class type safety
- ✅ **Middleware** – Built-in `persist` for localStorage
- ✅ **Performance** – Minimal re-renders

### State Management

The app uses **Zustand** for global state management with localStorage persistence:

```typescript
interface PaymentState {
  status: PaymentStatus;              // 'IDLE' | 'PROCESSING' | 'SUCCESS' | 'FAILED' | 'TIMEOUT'
  currentTransactionId: string | null; // Active transaction ID (UUID)
  attemptCount: number;               // Current retry attempt (0-3)
  history: Transaction[];             // All transactions (persisted)
}
```

### Form Validation

Real-time validation at three points:
1. **onChange** – Live validation as user types
2. **onBlur** – Final validation when field loses focus
3. **onSubmit** – Final check before API call

Uses:
- **Luhn Algorithm** for card validation
- **Regex patterns** for card type and CVV
- **Date math** for expiry validation

### API Gateway Simulation

The `/api/pay` route randomizes outcomes:
- **60%** → Success (2s delay)
- **25%** → Failure with reason (2s delay)
- **15%** → Timeout (8s delay, frontend aborts at 6s)

### Idempotency Pattern

Each transaction uses a unique UUID that persists across retries, preventing duplicate history entries.

## 🎨 Design & Styling

- **Tailwind CSS** for utility-first styling
- **Dark theme** with slate, indigo, and accent colors
- **Gradient effects** for visual depth
- **Responsive layouts** adaptive to all screen sizes

## 🧪 Testing Scenarios

### ✅ Success Path
1. Fill form with valid test card
2. Submit payment
3. See success message
4. Transaction appears in history

### 🔁 Retry Path
1. Attempt payment (fails ~40% of time)
2. Click retry (up to 3 times total)
3. After 3 failed attempts, retry disabled
4. See "Maximum retry attempts reached"

### ✓ Validation Path
1. Type invalid card number
2. See real-time error feedback
3. Submit button remains disabled
4. Fix error, button enables automatically

### 💾 Persistence Path
1. Make transactions
2. Refresh page
3. Transaction history persists
4. Form state resets (prevents stale attempts)

## 📊 Performance Optimizations

✅ Code Splitting – Components lazy-loaded by Next.js  
✅ CSS Purging – Tailwind removes unused styles  
✅ State Updates – Zustand minimizes re-renders  
✅ API Caching – Transaction history cached locally  

## �� Security Considerations

⚠️ **This is a simulator, not production-ready:**

- ✅ Card numbers shown only in preview (masked in history)
- ✅ Full card details never persisted
- ⚠️ No encryption (real systems need HTTPS + TLS)
- ⚠️ No PCI compliance
- ⚠️ No rate limiting

## 📝 Assumptions & Design Decisions

1. **Client-Side Only** – Frontend simulator with no backend payment processing
2. **localStorage Persistence** – Transaction history stored locally
3. **Idempotency via UUID** – Same transaction ID for retries
4. **Form State Reset on Refresh** – Only history persists to prevent stale attempts
5. **Deterministic Outcomes** – Server-side randomized success rates (60%, 25%, 15%)
6. **No Authentication** – No user login required
7. **2-Second Processing Delay** – Simulates gateway latency

## 🔮 Future Improvements

-  **Enhanced Accessibility** – aria-describedby, aria-invalid
-  **Keyboard Navigation** – Full Tab/Enter/Escape support
-  **Analytics** – Track success rates and patterns
-  **Dark/Light Mode Toggle** – Theme switcher
-  **Toast Notifications** – Non-blocking feedback
-  **Saved Cards** – Store masked card data
-  **Email Receipts** – Transaction confirmations
-  **Multi-Currency Display** – Locale-aware formatting
-  **3D Secure Simulation** – Additional auth step
-  **Mobile Wallet** – Apple Pay / Google Pay
-  **Invoice PDF** – Downloadable receipts
-  **Admin Dashboard** – Analytics and transaction view
-  **Payment Links** – Share payment requests
-  **Unit Tests** – Jest + React Testing Library
-  **E2E Tests** – Playwright/Cypress

## 📦 Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `next` | ^14.2.22 | React framework |
| `react` | ^18.3.1 | UI library |
| `typescript` | ^5 | Type safety |
| `zustand` | ^5.0.13 | State management |
| `tailwindcss` | ^3.4.17 | Styling |
| `lucide-react` | ^1.14.0 | Icons |
| `eslint` | ^9 | Linting |

## 🔗 Links

- **GitHub:** https://github.com/vignesh1683/Payment-Gateway
- **Contact:** vignesh.m1683@gmail.com

**Built with ❤️ – by Srivignesh**
