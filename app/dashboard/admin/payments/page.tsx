import type { Metadata } from "next";
import { bookings } from "@/lib/data/bookings";
import { formatLKR, formatDateShort } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";
import { BackButton } from "@/components/ui/BackButton";

export const metadata: Metadata = { title: "Payments — Admin" };

const STATUS_STYLE: Record<string, string> = {
  confirmed: "bg-success-pale text-success",
  advance_paid: "bg-gold/10 text-gold-deep",
  pending: "bg-warning-pale text-warning",
  completed: "bg-ivory text-slate-soft",
  cancelled: "bg-danger-pale text-danger",
};

export default function AdminPaymentsPage() {
  const sorted = [...bookings].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const totalCollected = bookings.reduce((s, b) => s + b.payableNow, 0);
  const totalFees = bookings.reduce((s, b) => s + b.platformFee, 0);
  const pendingCount = bookings.filter((b) => b.status === "pending").length;

  return (
    <div className="space-y-6">
      <BackButton href="/dashboard/admin" label="Admin" className="mb-4" />
      <div>
        <h1 className="font-display text-2xl font-bold text-slate">Payments</h1>
        <p className="mt-1 text-sm text-slate-soft">All advance payments and platform fees collected.</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: "Total collected", value: formatLKR(totalCollected), color: "text-success" },
          { label: "Platform fees earned", value: formatLKR(totalFees), color: "text-gold-deep" },
          { label: "Awaiting payment", value: String(pendingCount), color: "text-burgundy" },
        ].map((s) => (
          <div key={s.label} className="rounded-[10px] border border-slate/10 bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-soft">{s.label}</p>
            <p className={cn("mt-2 font-display text-2xl font-bold", s.color)}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Payments table */}
      <div className="overflow-hidden rounded-[10px] border border-slate/10 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate/8 bg-ivory text-xs font-semibold uppercase tracking-wider text-slate-soft">
              <th className="px-5 py-3 text-left">Booking ID</th>
              <th className="px-5 py-3 text-left">Customer</th>
              <th className="px-5 py-3 text-left">Date</th>
              <th className="px-5 py-3 text-right">Advance paid</th>
              <th className="px-5 py-3 text-right">Platform fee</th>
              <th className="px-5 py-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate/8">
            {sorted.map((b) => (
              <tr key={b.id} className="hover:bg-ivory/50">
                <td className="px-5 py-3.5 font-medium text-burgundy-deep">{b.id}</td>
                <td className="px-5 py-3.5">
                  <p className="font-medium text-slate">{b.customerName}</p>
                  <p className="text-xs text-slate-soft">{b.customerCity}</p>
                </td>
                <td className="px-5 py-3.5 text-slate-soft">{formatDateShort(b.eventDate)}</td>
                <td className="px-5 py-3.5 text-right font-semibold text-slate">{formatLKR(b.payableNow)}</td>
                <td className="px-5 py-3.5 text-right text-slate-soft">{formatLKR(b.platformFee)}</td>
                <td className="px-5 py-3.5">
                  <span className={cn("rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize", STATUS_STYLE[b.status] ?? "bg-ivory text-slate-soft")}>
                    {b.status.replace("_", " ")}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
