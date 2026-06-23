// Booking & payment math for TRIBLEERA VAIBHAVAM.
//
// Business rule (see Tribleera_Vaibhavangal_Development_Idea brief):
//   Customer pays now  = 20% advance of the service value
//                       + 3% platform service fee on the service value
//   Remaining balance  = service value - advance (settled with the vendor
//                         directly per the milestone schedule)
//
// These rates are intentionally centralised here so the whole product
// (cart, payment summary, customer dashboard, admin dashboard) reads the
// same numbers if commercial terms ever change.

export const ADVANCE_RATE = 0.2; // 20%
export const PLATFORM_FEE_RATE = 0.03; // 3%

export interface MoneyBreakdown {
  serviceTotal: number;
  advanceAmount: number;
  platformFee: number;
  payableNow: number;
  remainingBalance: number;
}

/** Breakdown for a single vendor/category line item. */
export function lineItemBreakdown(price: number): MoneyBreakdown {
  const advanceAmount = Math.round(price * ADVANCE_RATE);
  const platformFee = Math.round(price * PLATFORM_FEE_RATE);
  return {
    serviceTotal: price,
    advanceAmount,
    platformFee,
    payableNow: advanceAmount + platformFee,
    remainingBalance: price - advanceAmount,
  };
}

/** Aggregate breakdown across every item in the booking cart. */
export function cartBreakdown(prices: number[]): MoneyBreakdown {
  const serviceTotal = prices.reduce((sum, p) => sum + p, 0);
  const advanceAmount = Math.round(serviceTotal * ADVANCE_RATE);
  const platformFee = Math.round(serviceTotal * PLATFORM_FEE_RATE);
  return {
    serviceTotal,
    advanceAmount,
    platformFee,
    payableNow: advanceAmount + platformFee,
    remainingBalance: serviceTotal - advanceAmount,
  };
}

/**
 * Generates a demo booking reference, e.g. "TRB-20260451". Defined at module
 * scope (not inside a component) so the call site stays a pure render path —
 * a real backend would issue this ID instead.
 */
export function generateBookingId(): string {
  return `TRB-${Math.floor(20260000 + Math.random() * 9999)}`;
}
