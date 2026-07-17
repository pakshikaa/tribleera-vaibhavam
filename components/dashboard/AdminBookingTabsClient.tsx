"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { Download, FileText, Search } from "lucide-react";
import { Tabs } from "@/components/ui/Tabs";
import { Table, THead, Th, Td, Tr } from "@/components/ui/Table";
import { BookingStatusBadge } from "@/components/dashboard/StatusBadge";
import { formatLKR, formatDateShort } from "@/lib/utils/format";
import { getCategoryBySlug } from "@/lib/data/categories";
import type { Booking, BookingLineItem } from "@/types";
import { Button } from "@/components/ui/Button";
import { DateRangeFilter, downloadCsv, getAdminSnapshot, isInDateRange, subscribeAdminData } from "@/lib/utils/adminLiveData";
import { downloadReportPdf } from "@/lib/utils/reportExport";
import { cn } from "@/lib/utils/cn";

export function AdminBookingTabsClient({ bookings }: { bookings: Booking[] }) {
  const liveSnapshot = useSyncExternalStore(subscribeAdminData, getAdminSnapshot, () => ({
    bookings,
    vendors: [],
    applications: [],
    approvedVendorRecords: [],
    notifications: [],
    pendingPayments: [],
    auditLog: [],
    disputes: [],
    refunds: [],
    users: [],
  }));
  const [range, setRange] = useState<DateRangeFilter>("all");
  const [query, setQuery] = useState("");

  const filteredBookings = useMemo(() => liveSnapshot.bookings.filter((booking) => {
    if (!isInDateRange(booking.createdAt, range)) return false;
    if (!query) return true;
    const haystack = `${booking.id} ${booking.customerName} ${booking.customerCity} ${booking.items.map((item) => item.vendorName).join(" ")}`.toLowerCase();
    return haystack.includes(query.toLowerCase());
  }), [liveSnapshot.bookings, range, query]);

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

  const byService = filteredBookings.reduce<Record<string, { categoryName: string; rows: { booking: Booking; item: BookingLineItem }[] }>>(
    (acc, booking) => {
      booking.items.forEach((item) => {
        if (!acc[item.categorySlug]) {
          acc[item.categorySlug] = {
            categoryName: getCategoryBySlug(item.categorySlug)?.name ?? item.categorySlug,
            rows: [],
          };
        }
        acc[item.categorySlug].rows.push({ booking, item });
      });
      return acc;
    },
    {}
  );

  const allPanel = (
    <Table>
      <THead>
        <Th>Booking ID</Th>
        <Th>Customer</Th>
        <Th>Date</Th>
        <Th>Items</Th>
        <Th>Service total</Th>
        <Th>Platform fee</Th>
        <Th>Payable now</Th>
        <Th>Status</Th>
      </THead>
      <tbody>
        {filteredBookings.map((b) => (
          <Tr key={b.id}>
            <Td className="font-medium text-burgundy-deep">{b.id}</Td>
            <Td>
              {b.customerName}
              <span className="block text-xs text-slate-soft">{b.customerCity}</span>
            </Td>
            <Td>{formatDateShort(b.eventDate)}</Td>
            <Td>{b.items.length}</Td>
            <Td>{formatLKR(b.serviceTotal)}</Td>
            <Td>{formatLKR(b.platformFee)}</Td>
            <Td className="font-medium">{formatLKR(b.payableNow)}</Td>
            <Td>
              <BookingStatusBadge status={b.status} />
            </Td>
          </Tr>
        ))}
      </tbody>
    </Table>
  );

  const byServicePanel = (
    <div className="space-y-8">
      {Object.entries(byService).map(([slug, { categoryName, rows }]) => (
        <div key={slug}>
          <h3 className="mb-3 font-display text-lg text-slate">
            {categoryName}{" "}
            <span className="text-sm font-normal text-slate-soft">({rows.length} booking{rows.length !== 1 ? "s" : ""})</span>
          </h3>
          <Table>
            <THead>
              <Th>Booking ID</Th>
              <Th>Customer</Th>
              <Th>Event Date</Th>
              <Th>Vendor</Th>
              <Th>Package</Th>
              <Th>Price</Th>
              <Th>Status</Th>
            </THead>
            <tbody>
              {rows.map(({ booking, item }) => (
                <Tr key={`${booking.id}-${item.categorySlug}`}>
                  <Td className="font-medium text-burgundy-deep">{booking.id}</Td>
                  <Td>{booking.customerName}</Td>
                  <Td>{formatDateShort(booking.eventDate)}</Td>
                  <Td>{item.vendorName}</Td>
                  <Td>{item.packageName}</Td>
                  <Td>{formatLKR(item.price)}</Td>
                  <Td>
                    <BookingStatusBadge status={booking.status} />
                  </Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-[10px] border border-slate/10 bg-white p-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          {([
            ["all", "All time"],
            ["7d", "This week"],
            ["month", "This month"],
            ["30d", "Last 30 days"],
          ] as Array<[DateRangeFilter, string]>).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setRange(id)}
              className={cn(
                "rounded-full border px-3.5 py-2 text-xs font-semibold transition-colors",
                range === id ? "border-burgundy bg-burgundy text-white" : "border-slate/15 text-slate-soft hover:text-slate"
              )}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="flex items-center gap-2 rounded-[8px] border border-slate/15 bg-ivory px-3 py-2">
            <Search size={14} className="text-slate-soft" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search booking, customer, vendor"
              className="bg-transparent text-sm text-slate outline-none"
            />
          </div>
          <Button
            size="sm"
            variant="secondary"
            icon={<Download size={14} />}
            onClick={() => downloadCsv("tribleera-bookings.csv", exportRows)}
          >
            CSV
          </Button>
          <Button
            size="sm"
            variant="secondary"
            icon={<FileText size={14} />}
            onClick={() =>
              void downloadReportPdf({
                filename: "tribleera-bookings.pdf",
                title: "Bookings Report",
                subtitle: `${filteredBookings.length} booking${filteredBookings.length !== 1 ? "s" : ""}${query ? ` · Search: "${query}"` : ""}`,
                columns: [
                  { header: "Booking", key: "booking_id" },
                  { header: "Customer", key: "customer" },
                  { header: "City", key: "city" },
                  { header: "Created", key: "created_at" },
                  { header: "Event date", key: "event_date" },
                  { header: "Status", key: "status" },
                  { header: "Service total", key: "service_total", align: "right" },
                  { header: "Payable now", key: "payable_now", align: "right" },
                ],
                rows: exportRows,
                summary: [
                  {
                    label: "Total service value",
                    value: formatLKR(filteredBookings.reduce((sum, booking) => sum + booking.serviceTotal, 0)),
                  },
                  {
                    label: "Total platform fees",
                    value: formatLKR(filteredBookings.reduce((sum, booking) => sum + booking.platformFee, 0)),
                  },
                ],
              })
            }
          >
            PDF
          </Button>
        </div>
      </div>

      <Tabs
        defaultTab="all"
        tabs={[
          { id: "all", label: "All Bookings", count: filteredBookings.length },
          { id: "by-service", label: "By Service", count: Object.keys(byService).length },
        ]}
        panels={{
          all: allPanel,
          "by-service": byServicePanel,
        }}
      />
    </div>
  );
}
