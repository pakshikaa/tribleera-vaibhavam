import type { Metadata } from "next";
import { TrendingUp } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { StatCard } from "@/components/ui/StatCard";
import { Badge } from "@/components/ui/Badge";
import { formatDate, formatLKR } from "@/lib/utils/format";
import { getVendorBySlug } from "@/lib/data/vendors";
import { bookings } from "@/lib/data/bookings";

export const metadata: Metadata = { title: "Revenue | Vendor Dashboard" };

const VENDOR_SLUG = "pushpa-florals-and-decor";

export default function VendorRevenuePage() {
  const vendor = getVendorBySlug(VENDOR_SLUG)!;

  const vendorBookings = bookings.filter((b) =>
    b.items.some((i) => i.vendorId === vendor.id)
  );

  const allItems = vendorBookings.flatMap((b) =>
    b.items.filter((i) => i.vendorId === vendor.id).map((i) => ({ ...i, booking: b }))
  );

  const completedBookings = vendorBookings.filter((b) => b.status === "completed");
  const completedRevenue = completedBookings.reduce(
    (sum, b) =>
      sum + b.items.filter((i) => i.vendorId === vendor.id).reduce((s, i) => s + i.price, 0),
    0
  );
  const pendingRevenue = vendorBookings
    .filter((b) => b.status !== "completed" && b.status !== "cancelled")
    .reduce(
      (sum, b) =>
        sum + b.items.filter((i) => i.vendorId === vendor.id).reduce((s, i) => s + i.price, 0),
      0
    );
  const totalRevenue = completedRevenue + pendingRevenue;
  const advancePaid = Math.round(totalRevenue * 0.2);
  const monthlyTarget = 450000;
  const progress = Math.min(100, Math.round((completedRevenue / monthlyTarget) * 100));

  return (
    <div className="bg-ivory" data-portal="true">
      <section className="border-b border-slate/8 bg-white py-8">
        <Container>
          <h1 className="font-display text-2xl text-burgundy-deep">Revenue</h1>
          <p className="mt-1 text-sm text-slate-soft">
            Track your earnings and payment status.
          </p>
        </Container>
      </section>

      <Container className="py-8 md:py-12">
        {/* Summary cards */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard
            label="Total earned"
            value={formatLKR(completedRevenue)}
            icon={<TrendingUp size={18} />}
          />
          <StatCard
            label="Pending payout"
            value={formatLKR(pendingRevenue)}
            delta="After service completion"
          />
          <StatCard
            label="Advance received"
            value={formatLKR(advancePaid)}
            delta="20% escrow advance"
          />
          <StatCard
            label="Events completed"
            value={String(completedBookings.length)}
          />
        </div>

        {/* Monthly target progress */}
        <div className="mt-6 rounded-[10px] border border-slate/8 bg-white p-5 shadow-soft">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-soft">
                Monthly target
              </p>
              <p className="mt-1 font-display text-3xl text-burgundy-deep">
                {formatLKR(completedRevenue)}
              </p>
              <p className="text-xs text-slate-soft">of {formatLKR(monthlyTarget)} goal</p>
            </div>
            <Badge tone="gold">â†‘ +12.5% vs last month</Badge>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs text-slate-soft">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-ivory-deep">
              <div
                className="h-full rounded-full bg-burgundy transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Escrow info */}
        <div className="mt-4 rounded-[10px] border border-gold/20 bg-gold/[0.06] p-4">
          <p className="text-sm font-semibold text-slate">How TRIBLEERA escrow works</p>
          <p className="mt-1 text-xs leading-relaxed text-slate-soft">
            Customers pay 20% advance at booking. The remaining 80% is collected after service
            completion. TRIBLEERA releases your full payout within 3 business days of event
            completion confirmation.
          </p>
        </div>

        {/* Transaction list */}
        <div className="mt-8">
          <h2 className="mb-4 font-display text-lg text-slate">Transactions</h2>
          {allItems.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-soft">No transactions yet.</p>
          ) : (
            <div className="overflow-x-auto rounded-[8px] border border-slate/8 bg-white shadow-soft">
              <table className="w-full min-w-[640px] text-sm">
                <thead>
                  <tr className="border-b border-slate/8 bg-ivory text-left text-xs font-semibold uppercase tracking-wide text-slate-soft">
                    <th className="px-4 py-3">Customer</th>
                    <th className="px-4 py-3">Package</th>
                    <th className="px-4 py-3">Event date</th>
                    <th className="px-4 py-3 text-right">Amount</th>
                    <th className="px-4 py-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate/8">
                  {allItems.map((item, i) => (
                    <tr key={i} className="hover:bg-ivory/50">
                      <td className="px-4 py-3 font-medium text-slate">
                        {item.booking.customerName}
                      </td>
                      <td className="px-4 py-3 text-slate-soft">{item.packageName}</td>
                      <td className="px-4 py-3 text-slate-soft">
                        {formatDate(item.booking.eventDate)}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-burgundy-deep">
                        {formatLKR(item.price)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Badge
                          tone={
                            item.booking.status === "completed"
                              ? "success"
                              : item.booking.status === "cancelled"
                                ? "danger"
                                : "warning"
                          }
                        >
                          {item.booking.status === "completed"
                            ? "Paid"
                            : item.booking.status === "cancelled"
                              ? "Cancelled"
                              : "Pending"}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
