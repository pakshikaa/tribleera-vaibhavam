"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { BarChart3, Download, FileText } from "lucide-react";
import { categories } from "@/lib/data/categories";
import { formatLKR } from "@/lib/utils/format";
import { DateRangeFilter, downloadCsv, getAdminSnapshot, isInDateRange, subscribeAdminData } from "@/lib/utils/adminLiveData";
import { downloadReportPdf } from "@/lib/utils/reportExport";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/Button";

const DATE_FILTERS: Array<{ id: DateRangeFilter; label: string }> = [
  { id: "7d", label: "This week" },
  { id: "month", label: "This month" },
  { id: "30d", label: "Last 30 days" },
  { id: "all", label: "All time" },
];

export function AdminReportsClient() {
  const snapshot = useSyncExternalStore(subscribeAdminData, getAdminSnapshot, getAdminSnapshot);
  const [range, setRange] = useState<DateRangeFilter>("month");

  const filteredBookings = useMemo(
    () => snapshot.bookings.filter((booking) => isInDateRange(booking.createdAt, range)),
    [snapshot.bookings, range]
  );

  const totalRevenue = filteredBookings.reduce((sum, booking) => sum + booking.serviceTotal, 0);
  const totalFees = filteredBookings.reduce((sum, booking) => sum + booking.platformFee, 0);
  const approvedVendors = snapshot.vendors.filter((vendor) => vendor.status === "approved").length;
  const confirmedBookings = filteredBookings.filter((booking) => booking.status === "confirmed" || booking.status === "completed" || booking.status === "advance_paid").length;

  const byCategory = categories.map((category) => {
    const matches = filteredBookings.filter((booking) =>
      booking.items.some((item) => item.categorySlug === category.slug) || booking.categorySlug === category.slug
    );
    return {
      name: category.name,
      count: matches.length,
      revenue: matches.reduce((sum, booking) => sum + booking.serviceTotal, 0),
    };
  });

  const monthlyTrend = useMemo(() => {
    const bucket = new Map<string, { label: string; bookings: number; fees: number }>();
    filteredBookings.forEach((booking) => {
      const date = new Date(booking.createdAt);
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      if (!bucket.has(key)) {
        bucket.set(key, {
          label: date.toLocaleString("en-US", { month: "short", year: "2-digit" }),
          bookings: 0,
          fees: 0,
        });
      }
      const current = bucket.get(key)!;
      current.bookings += 1;
      current.fees += booking.platformFee;
    });
    return Array.from(bucket.values());
  }, [filteredBookings]);

  const maxCategoryCount = Math.max(1, ...byCategory.map((item) => item.count));
  const maxTrendFee = Math.max(1, ...monthlyTrend.map((item) => item.fees));

  const rangeLabel = DATE_FILTERS.find((filter) => filter.id === range)?.label ?? "All time";
  const exportRows = filteredBookings.map((booking) => ({
    booking_id: booking.id,
    customer: booking.customerName,
    city: booking.customerCity,
    created_at: booking.createdAt,
    event_date: booking.eventDate,
    status: booking.status,
    service_total: booking.serviceTotal,
    platform_fee: booking.platformFee,
    payable_now: booking.payableNow,
  }));

  function exportPdf() {
    void downloadReportPdf({
      filename: "tribleera-booking-report.pdf",
      title: "Booking Report",
      subtitle: `Period: ${rangeLabel} · ${filteredBookings.length} booking${filteredBookings.length !== 1 ? "s" : ""}`,
      columns: [
        { header: "Booking", key: "booking_id" },
        { header: "Customer", key: "customer" },
        { header: "City", key: "city" },
        { header: "Created", key: "created_at" },
        { header: "Event date", key: "event_date" },
        { header: "Status", key: "status" },
        { header: "Service total", key: "service_total", align: "right" },
        { header: "Platform fee", key: "platform_fee", align: "right" },
      ],
      rows: exportRows,
      summary: [
        { label: "Total GMV", value: formatLKR(totalRevenue) },
        { label: "Platform revenue", value: formatLKR(totalFees) },
        { label: "Confirmed bookings", value: String(confirmedBookings) },
      ],
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate">Reports</h1>
          <p className="mt-1 text-sm text-slate-soft">Live performance summary with date-range views and exportable data.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {DATE_FILTERS.map((filter) => (
            <button
              key={filter.id}
              type="button"
              onClick={() => setRange(filter.id)}
              className={cn(
                "rounded-full border px-3.5 py-2 text-xs font-semibold transition-colors",
                range === filter.id ? "border-burgundy bg-burgundy text-white" : "border-slate/15 bg-white text-slate-soft hover:text-slate"
              )}
            >
              {filter.label}
            </button>
          ))}
          <Button
            size="sm"
            variant="secondary"
            icon={<Download size={14} />}
            onClick={() => downloadCsv("tribleera-booking-report.csv", exportRows)}
          >
            CSV
          </Button>
          <Button size="sm" variant="secondary" icon={<FileText size={14} />} onClick={exportPdf}>
            PDF
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Total GMV", value: formatLKR(totalRevenue) },
          { label: "Platform revenue", value: formatLKR(totalFees) },
          { label: "Active vendors", value: String(approvedVendors) },
          { label: "Confirmed bookings", value: String(confirmedBookings) },
        ].map((item) => (
          <div key={item.label} className="rounded-[10px] border border-slate/10 bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-soft">{item.label}</p>
            <p className="mt-2 font-display text-2xl font-bold text-slate">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[10px] border border-slate/10 bg-white">
          <div className="border-b border-slate/8 px-5 py-4">
            <h2 className="flex items-center gap-2 font-display text-base font-semibold text-slate">
              <BarChart3 size={16} className="text-burgundy" />
              Bookings by Category
            </h2>
          </div>
          <div className="space-y-4 px-5 py-5">
            {byCategory.map((item) => (
              <div key={item.name}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium text-slate">{item.name}</span>
                  <span className="text-slate-soft">{item.count} bookings · {formatLKR(item.revenue)}</span>
                </div>
                <div className="h-3 w-full overflow-hidden rounded-full bg-ivory">
                  <div className="h-full rounded-full bg-burgundy transition-all" style={{ width: `${(item.count / maxCategoryCount) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[10px] border border-slate/10 bg-white">
          <div className="border-b border-slate/8 px-5 py-4">
            <h2 className="font-display text-base font-semibold text-slate">Revenue Trend</h2>
          </div>
          <div className="px-5 py-5">
            {monthlyTrend.length === 0 ? (
              <p className="text-sm text-slate-soft">No bookings in this date range.</p>
            ) : (
              <div className="flex h-56 items-end gap-3">
                {monthlyTrend.map((item) => (
                  <div key={item.label} className="flex flex-1 flex-col items-center gap-2">
                    <div className="flex h-full w-full items-end">
                      <div
                        className="w-full rounded-t-[8px] bg-gold transition-all"
                        style={{ height: `${Math.max(12, (item.fees / maxTrendFee) * 100)}%` }}
                        title={`${item.label}: ${formatLKR(item.fees)}`}
                      />
                    </div>
                    <p className="text-[11px] font-medium text-slate-soft">{item.label}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
