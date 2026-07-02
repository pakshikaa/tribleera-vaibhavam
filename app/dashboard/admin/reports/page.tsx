import type { Metadata } from "next";
import { BarChart3 } from "lucide-react";
import { bookings } from "@/lib/data/bookings";
import { vendors } from "@/lib/data/vendors";
import { categories } from "@/lib/data/categories";
import { formatLKR } from "@/lib/utils/format";
import { BackButton } from "@/components/ui/BackButton";

export const metadata: Metadata = { title: "Reports — Admin" };

export default function AdminReportsPage() {
  const totalRevenue = bookings.reduce((s, b) => s + b.serviceTotal, 0);
  const totalFees = bookings.reduce((s, b) => s + b.platformFee, 0);
  const approvedVendors = vendors.filter((v) => v.status === "approved").length;
  const confirmedBookings = bookings.filter((b) => b.status === "confirmed" || b.status === "completed").length;

  const byCategory = categories.map((cat) => {
    const catBookings = bookings.filter((b) =>
      b.items.some((i) => i.categorySlug === cat.slug) || b.categorySlug === cat.slug
    );
    const revenue = catBookings.reduce((s, b) => s + b.serviceTotal, 0);
    return { name: cat.name, count: catBookings.length, revenue };
  });

  return (
    <div className="space-y-6">
      <BackButton href="/dashboard/admin" label="Admin" className="mb-4" />
      <div>
        <h1 className="font-display text-2xl font-bold text-slate">Reports</h1>
        <p className="mt-1 text-sm text-slate-soft">Platform performance summary.</p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Total GMV", value: formatLKR(totalRevenue) },
          { label: "Platform revenue", value: formatLKR(totalFees) },
          { label: "Active vendors", value: String(approvedVendors) },
          { label: "Confirmed bookings", value: String(confirmedBookings) },
        ].map((k) => (
          <div key={k.label} className="rounded-[10px] border border-slate/10 bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-soft">{k.label}</p>
            <p className="mt-2 font-display text-2xl font-bold text-slate">{k.value}</p>
          </div>
        ))}
      </div>

      {/* By category */}
      <div className="rounded-[10px] border border-slate/10 bg-white">
        <div className="border-b border-slate/8 px-5 py-4">
          <h2 className="font-display text-base font-semibold text-slate flex items-center gap-2">
            <BarChart3 size={16} className="text-burgundy" /> Bookings by Category
          </h2>
        </div>
        <div className="divide-y divide-slate/8">
          {byCategory.map((cat) => {
            const pct = totalRevenue > 0 ? Math.round((cat.revenue / totalRevenue) * 100) : 0;
            return (
              <div key={cat.name} className="px-5 py-4">
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium text-slate">{cat.name}</span>
                  <span className="text-slate-soft">{cat.count} bookings · {formatLKR(cat.revenue)}</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-ivory">
                  <div
                    className="h-full rounded-full bg-burgundy transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
