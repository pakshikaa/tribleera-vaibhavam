"use client";

import { useMemo, useSyncExternalStore } from "react";
import { Download, FileText, Landmark, Wallet } from "lucide-react";
import { formatDateShort, formatLKR } from "@/lib/utils/format";
import {
  buildInvoiceHtml,
  calculateRefundFromBooking,
  downloadCsv,
  downloadInvoice,
  getAdminSnapshot,
  subscribeAdminData,
} from "@/lib/utils/adminLiveData";
import { cn } from "@/lib/utils/cn";
import { AdminPendingVerificationClient } from "@/components/dashboard/AdminPendingVerificationClient";
import { Button } from "@/components/ui/Button";
import type { Booking } from "@/types";

const STATUS_STYLE: Record<string, string> = {
  confirmed: "bg-success-pale text-success",
  advance_paid: "bg-gold/10 text-gold-deep",
  pending: "bg-warning-pale text-warning",
  completed: "bg-ivory text-slate-soft",
  cancelled: "bg-danger-pale text-danger",
  cancellation_requested: "bg-rose-pale text-burgundy",
};

function invoiceRows(booking: Booking) {
  return [
    { label: "Service total", amount: booking.serviceTotal },
    { label: "Advance paid now", amount: booking.payableNow },
    { label: "Platform fee", amount: booking.platformFee },
    { label: "Vendor payout remaining", amount: booking.remainingBalance },
  ];
}

export function AdminPaymentsClient() {
  const snapshot = useSyncExternalStore(subscribeAdminData, getAdminSnapshot, getAdminSnapshot);
  const sorted = useMemo(() => [...snapshot.bookings].sort((a, b) => b.createdAt.localeCompare(a.createdAt)), [snapshot.bookings]);

  const totalCollected = snapshot.bookings.reduce((sum, booking) => sum + booking.payableNow, 0);
  const totalFees = snapshot.bookings.reduce((sum, booking) => sum + booking.platformFee, 0);
  const vendorPayouts = snapshot.bookings.reduce((sum, booking) => sum + booking.remainingBalance, 0);
  const totalRefunds = snapshot.refunds.reduce((sum, refund) => sum + refund.refundAmount, 0);
  const pendingCount = snapshot.pendingPayments.length;

  const refundable = snapshot.bookings.filter((booking) => booking.status === "cancellation_requested");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate">Payments</h1>
        <p className="mt-1 text-sm text-slate-soft">Advance payments, bank proof verification, revenue splits, refunds, and invoices.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        {[
          { label: "Total collected", value: formatLKR(totalCollected), color: "text-success" },
          { label: "Platform revenue", value: formatLKR(totalFees), color: "text-gold-deep" },
          { label: "Vendor payouts due", value: formatLKR(vendorPayouts), color: "text-burgundy" },
          { label: "Refunds tracked", value: formatLKR(totalRefunds), color: "text-slate" },
        ].map((item) => (
          <div key={item.label} className="rounded-[10px] border border-slate/10 bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-soft">{item.label}</p>
            <p className={cn("mt-2 font-display text-2xl font-bold", item.color)}>{item.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-[10px] border border-slate/10 bg-white p-5">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-display text-lg text-slate">Financial dashboard</h2>
            <p className="mt-1 text-sm text-slate-soft">Track the 3% platform fee, vendor payouts, and refunds from a single view.</p>
          </div>
          <Button
            size="sm"
            variant="secondary"
            icon={<Download size={14} />}
            onClick={() =>
              downloadCsv("tribleera-financial-dashboard.csv", sorted.map((booking) => ({
                booking_id: booking.id,
                created_at: booking.createdAt,
                customer: booking.customerName,
                service_total: booking.serviceTotal,
                advance_paid: booking.payableNow,
                platform_fee: booking.platformFee,
                vendor_payout_due: booking.remainingBalance,
                status: booking.status,
              })))
            }
          >
            Export finance CSV
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-[8px] border border-slate/10 bg-ivory p-4">
            <p className="flex items-center gap-2 text-sm font-semibold text-slate"><Wallet size={15} className="text-gold-deep" /> Platform revenue retained</p>
            <p className="mt-2 font-display text-2xl text-gold-deep">{formatLKR(totalFees)}</p>
          </div>
          <div className="rounded-[8px] border border-slate/10 bg-ivory p-4">
            <p className="flex items-center gap-2 text-sm font-semibold text-slate"><Landmark size={15} className="text-burgundy" /> Vendor payouts outstanding</p>
            <p className="mt-2 font-display text-2xl text-burgundy">{formatLKR(vendorPayouts)}</p>
          </div>
          <div className="rounded-[8px] border border-slate/10 bg-ivory p-4">
            <p className="flex items-center gap-2 text-sm font-semibold text-slate"><FileText size={15} className="text-slate" /> Pending verifications</p>
            <p className="mt-2 font-display text-2xl text-slate">{pendingCount}</p>
          </div>
        </div>
      </div>

      <AdminPendingVerificationClient />

      {refundable.length > 0 && (
        <div className="rounded-[10px] border border-slate/10 bg-white p-5">
          <h2 className="font-display text-lg text-slate">Refund calculator</h2>
          <p className="mt-1 text-sm text-slate-soft">
            Cancellation requests scored against the refund policy: 50% at 31+ days, 25% at 7–30 days, nothing inside 7 days.
            Refunds are raised and tracked on the Disputes desk.
          </p>
          <div className="mt-4 space-y-3">
            {refundable.map((booking) => {
              const refund = calculateRefundFromBooking(booking);
              return (
                <div key={booking.id} className="rounded-[8px] border border-slate/10 bg-ivory p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-medium text-slate">{booking.id} · {booking.customerName}</p>
                      <p className="text-xs text-slate-soft">
                        Advance paid {formatLKR(booking.payableNow)} · {refund.daysBeforeEvent} days remaining · {refund.refundPercent}% refund
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <p
                        className={cn(
                          "font-display text-lg",
                          refund.refundAmount > 0 ? "text-success" : "text-danger"
                        )}
                      >
                        {formatLKR(refund.refundAmount)}
                      </p>
                      <Button href="/dashboard/admin/disputes" size="sm" variant="secondary">
                        Process refund
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="overflow-x-auto rounded-[10px] border border-slate/10 bg-white">
        <table className="w-full min-w-[900px] text-sm">
          <thead>
            <tr className="border-b border-slate/8 bg-ivory text-xs font-semibold uppercase tracking-wider text-slate-soft">
              <th className="px-5 py-3 text-left">Booking ID</th>
              <th className="px-5 py-3 text-left">Customer</th>
              <th className="px-5 py-3 text-left">Date</th>
              <th className="px-5 py-3 text-right">Advance paid</th>
              <th className="px-5 py-3 text-right">Platform fee</th>
              <th className="px-5 py-3 text-right">Vendor payout</th>
              <th className="px-5 py-3 text-left">Status</th>
              <th className="px-5 py-3 text-left">Invoices</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate/8">
            {sorted.map((booking) => (
              <tr key={booking.id} className="hover:bg-ivory/50">
                <td className="px-5 py-3.5 font-medium text-burgundy-deep">{booking.id}</td>
                <td className="px-5 py-3.5">
                  <p className="font-medium text-slate">{booking.customerName}</p>
                  <p className="text-xs text-slate-soft">{booking.customerCity}</p>
                </td>
                <td className="px-5 py-3.5 text-slate-soft">{formatDateShort(booking.eventDate)}</td>
                <td className="px-5 py-3.5 text-right font-semibold text-slate">{formatLKR(booking.payableNow)}</td>
                <td className="px-5 py-3.5 text-right text-slate-soft">{formatLKR(booking.platformFee)}</td>
                <td className="px-5 py-3.5 text-right text-slate-soft">{formatLKR(booking.remainingBalance)}</td>
                <td className="px-5 py-3.5">
                  <span className={cn("rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize", STATUS_STYLE[booking.status] ?? "bg-ivory text-slate-soft")}>
                    {booking.status.replace("_", " ")}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() =>
                        downloadInvoice(
                          `${booking.id}-customer-invoice.html`,
                          buildInvoiceHtml({
                            invoiceId: `${booking.id}-CUS`,
                            title: "Customer Invoice",
                            billTo: booking.customerName,
                            issuedAt: booking.createdAt,
                            rows: invoiceRows(booking),
                            note: "Customer copy. Use for booking and payment reference within Sri Lanka accounting records.",
                          })
                        )
                      }
                    >
                      Customer
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() =>
                        downloadInvoice(
                          `${booking.id}-vendor-invoice.html`,
                          buildInvoiceHtml({
                            invoiceId: `${booking.id}-VND`,
                            title: "Vendor Payout Statement",
                            billTo: booking.items.map((item) => item.vendorName).join(", "),
                            issuedAt: booking.createdAt,
                            rows: [
                              { label: "Vendor service value", amount: booking.serviceTotal - booking.platformFee },
                              { label: "Outstanding payout", amount: booking.remainingBalance },
                            ],
                            note: "Vendor-facing payout statement generated by TRIBLEERA VAIBHAVAM.",
                          })
                        )
                      }
                    >
                      Vendor
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() =>
                        downloadInvoice(
                          `${booking.id}-platform-invoice.html`,
                          buildInvoiceHtml({
                            invoiceId: `${booking.id}-PLT`,
                            title: "Platform Fee Invoice",
                            billTo: "TRIBLEERA VAIBHAVAM Internal Accounts",
                            issuedAt: booking.createdAt,
                            rows: [{ label: "Platform fee earned", amount: booking.platformFee }],
                            note: "Internal platform revenue record. Review against Sri Lanka tax filing requirements before official submission.",
                          })
                        )
                      }
                    >
                      Platform
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
