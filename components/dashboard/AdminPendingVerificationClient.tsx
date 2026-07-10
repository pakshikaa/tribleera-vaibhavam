"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Clock } from "lucide-react";
import { formatLKR } from "@/lib/utils/format";
import { generateId, safeGet, safePush, safeSet } from "@/lib/utils/store";
import type { BookingLineItem } from "@/types";

interface PendingPayment {
  id: string;
  bookingId: string;
  items: BookingLineItem[];
  totals: { serviceTotal: number; advanceAmount: number; platformFee: number; payableNow: number; remainingBalance: number };
  customerName: string;
  customerCity?: string;
  eventDate?: string;
  submittedAt: string;
  paymentMethod?: string;
}

function readPending(): PendingPayment[] {
  return safeGet<PendingPayment[]>("tv-payments-pending", []);
}

export function AdminPendingVerificationClient() {
  const [pending, setPending] = useState<PendingPayment[]>(() => readPending());

  useEffect(() => {
    const interval = setInterval(() => setPending(readPending()), 10000);
    return () => clearInterval(interval);
  }, []);

  if (pending.length === 0) return null;

  function verify(payment: PendingPayment) {
    const remaining = readPending().filter((p) => p.id !== payment.id);
    safeSet("tv-payments-pending", remaining);

    const confirmedBooking = {
      ...payment,
      status: "confirmed",
      adminVerified: true,
      verifiedAt: new Date().toISOString(),
      verifiedBy: "admin",
    };
    safePush("tv-bookings", confirmedBooking);

    const uppercaseLastBooking = safeGet<{ id?: string } & Record<string, unknown>>("TRIBLEERA-last-booking", {});
    if (uppercaseLastBooking.id === payment.id || uppercaseLastBooking.id === payment.bookingId) {
      safeSet("TRIBLEERA-last-booking", { ...uppercaseLastBooking, adminVerified: true, status: "confirmed" });
    }

    const lowercaseLastBooking = safeGet<{ id?: string } & Record<string, unknown>>("tribleera-last-booking", {});
    if (lowercaseLastBooking.id === payment.id || lowercaseLastBooking.id === payment.bookingId) {
      safeSet("tribleera-last-booking", { ...lowercaseLastBooking, adminVerified: true, status: "confirmed" });
    }

    safePush("tv-notifications-cust-demo", {
      id: generateId("N"),
      type: "booking_confirmed",
      title: "Booking confirmed! 🎉",
      message: "Your advance payment has been verified. Vendor contact details are now available.",
      href: "/booking/confirmation",
      read: false,
      createdAt: new Date().toISOString(),
    });

    payment.items?.forEach((item) => {
      const vendorBookings = safeGet<unknown[]>(`tv-vendor-bookings-${item.vendorId}`, []);
      vendorBookings.unshift(confirmedBooking);
      safeSet(`tv-vendor-bookings-${item.vendorId}`, vendorBookings);
    });

    safePush("tv-admin-notifications", {
      id: generateId("AN"),
      type: "payment_verified",
      message: `Payment verified: ${payment.customerName} — ${formatLKR(payment.totals.payableNow)}`,
      time: new Date().toISOString(),
      icon: "✅",
    });

    setPending((prev) => prev.filter((p) => p.id !== payment.id));
  }

  return (
    <div className="rounded-[10px] border border-amber-200 bg-amber-50 p-5">
      <div className="mb-3 flex items-center gap-2">
        <Clock size={16} className="text-amber-600" />
        <p className="text-sm font-semibold text-amber-800">
          Pending verification{pending.length > 1 ? ` (${pending.length})` : ""}
        </p>
      </div>
      <div className="space-y-2">
        {pending.map((payment) => (
          <div key={payment.id} className="flex flex-wrap items-center justify-between gap-3 rounded-[8px] bg-white p-4">
            <div>
              <p className="font-medium text-slate">{payment.bookingId} &middot; {payment.customerName}</p>
              <p className="text-xs text-slate-soft">
                {payment.items.map((item) => item.vendorName).join(", ")} &middot; {formatLKR(payment.totals.payableNow)}
              </p>
            </div>
            <button
              type="button"
              onClick={() => verify(payment)}
              className="flex items-center gap-1.5 rounded-[6px] bg-burgundy px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-burgundy-deep"
            >
              <CheckCircle2 size={14} /> Verify
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
