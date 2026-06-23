export interface CancellationRecord {
  bookingId: string;
  customerId: string;
  vendorName: string;
  reason: string;
  cancelledAt: string;
  refundAmount: number;
  refundStatus: "pending" | "processing" | "credited";
  daysBeforeEvent: number;
}

export const cancelledBookings: CancellationRecord[] = [
  {
    bookingId: "TRB-20260012",
    customerId: "customer-niranjala-kajan",
    vendorName: "Pushpa Florals and Decor",
    reason: "Event postponed",
    cancelledAt: "2026-06-21T09:00:00+05:30",
    refundAmount: 13200,
    refundStatus: "processing",
    daysBeforeEvent: 32,
  },
  {
    bookingId: "TRB-20259940",
    customerId: "customer-niranjala-kajan",
    vendorName: "Yaazh Invites and Stationery",
    reason: "Found another vendor",
    cancelledAt: "2026-06-17T15:00:00+05:30",
    refundAmount: 8800,
    refundStatus: "credited",
    daysBeforeEvent: 12,
  },
  {
    bookingId: "TRB-20259804",
    customerId: "customer-revathi",
    vendorName: "Lumiere Wedding Films",
    reason: "Financial reasons",
    cancelledAt: "2026-06-22T10:30:00+05:30",
    refundAmount: 4200,
    refundStatus: "pending",
    daysBeforeEvent: 4,
  },
];
