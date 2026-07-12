"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Clock, Eye, Landmark, ShieldCheck } from "lucide-react";
import { formatLKR } from "@/lib/utils/format";
import { generateId, safeGet, safePush, safeSet } from "@/lib/utils/store";
import { appendAuditLog } from "@/lib/utils/adminLiveData";
import { Modal } from "@/components/ui/Modal";
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
  bankTransferReference?: string;
  depositSlipName?: string | null;
  depositSlipDataUrl?: string | null;
  depositSlipMimeType?: string | null;
}

function readPending(): PendingPayment[] {
  return safeGet<PendingPayment[]>("tv-payments-pending", []);
}

export function AdminPendingVerificationClient() {
  const [pending, setPending] = useState<PendingPayment[]>(() => readPending());
  const [viewer, setViewer] = useState<PendingPayment | null>(null);
  const [checkedRefs, setCheckedRefs] = useState<Record<string, boolean>>({});

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

    appendAuditLog({
      actor: "Admin",
      action: "Verified payment",
      entityType: "payment",
      entityId: payment.id,
      entityLabel: payment.bookingId,
      details: `Verified ${formatLKR(payment.totals.payableNow)} for ${payment.customerName}. Ref ${payment.bankTransferReference ?? "n/a"}.`,
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
      <div className="space-y-3">
        {pending.map((payment) => {
          const referenceChecked = checkedRefs[payment.id] ?? false;
          return (
            <div key={payment.id} className="rounded-[8px] bg-white p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-medium text-slate">{payment.bookingId} · {payment.customerName}</p>
                  <p className="text-xs text-slate-soft">
                    {payment.items.map((item) => item.vendorName).join(", ")} · {formatLKR(payment.totals.payableNow)}
                  </p>
                  <p className="mt-1 text-xs text-slate-soft">
                    Ref: <span className="font-medium text-slate">{payment.bankTransferReference ?? "Not provided"}</span>
                    {" · "}
                    Slip: <span className="font-medium text-slate">{payment.depositSlipName ?? "No file"}</span>
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setViewer(payment)}
                    className="flex items-center gap-1.5 rounded-[6px] border border-slate/15 px-3.5 py-2 text-xs font-semibold text-slate transition-colors hover:bg-ivory"
                  >
                    <Eye size={14} /> View proof
                  </button>
                  <button
                    type="button"
                    onClick={() => verify(payment)}
                    disabled={!referenceChecked && payment.paymentMethod === "bank"}
                    className="flex items-center gap-1.5 rounded-[6px] bg-burgundy px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-burgundy-deep disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <CheckCircle2 size={14} /> Verify
                  </button>
                </div>
              </div>
              {payment.paymentMethod === "bank" && (
                <label className="mt-3 flex items-center gap-2 text-xs text-slate-soft">
                  <input
                    type="checkbox"
                    checked={referenceChecked}
                    onChange={(event) => setCheckedRefs((prev) => ({ ...prev, [payment.id]: event.target.checked }))}
                    className="accent-burgundy"
                  />
                  Bank reference checked against deposit proof
                </label>
              )}
            </div>
          );
        })}
      </div>

      <Modal open={Boolean(viewer)} onOpenChange={(open) => { if (!open) setViewer(null); }} title="Deposit slip review">
        {viewer && (
          <div className="space-y-4">
            <div className="rounded-[8px] border border-slate/10 bg-ivory p-4 text-sm">
              <p className="font-semibold text-slate">{viewer.customerName}</p>
              <p className="mt-1 text-slate-soft">{viewer.bookingId} · {formatLKR(viewer.totals.payableNow)}</p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <p className="flex items-center gap-2 text-slate-soft"><Landmark size={14} /> Ref: <span className="font-medium text-slate">{viewer.bankTransferReference ?? "Not provided"}</span></p>
                <p className="flex items-center gap-2 text-slate-soft"><ShieldCheck size={14} /> Method: <span className="font-medium text-slate">{viewer.paymentMethod ?? "n/a"}</span></p>
              </div>
            </div>

            {!viewer.depositSlipDataUrl ? (
              <p className="text-sm text-slate-soft">No deposit proof file was attached to this payment.</p>
            ) : viewer.depositSlipMimeType === "application/pdf" ? (
              <iframe src={viewer.depositSlipDataUrl} title="Deposit slip PDF" className="h-[480px] w-full rounded-[8px] border border-slate/10 bg-white" />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={viewer.depositSlipDataUrl} alt="Deposit slip" className="max-h-[520px] w-full rounded-[8px] border border-slate/10 object-contain bg-white" />
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
