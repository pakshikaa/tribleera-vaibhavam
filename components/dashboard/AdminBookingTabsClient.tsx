"use client";

import { Tabs } from "@/components/ui/Tabs";
import { Table, THead, Th, Td, Tr } from "@/components/ui/Table";
import { BookingStatusBadge } from "@/components/dashboard/StatusBadge";
import { formatLKR, formatDateShort } from "@/lib/utils/format";
import { getCategoryBySlug } from "@/lib/data/categories";
import type { Booking, BookingLineItem } from "@/types";

export function AdminBookingTabsClient({ bookings }: { bookings: Booking[] }) {
  const byService = bookings.reduce<Record<string, { categoryName: string; rows: { booking: Booking; item: BookingLineItem }[] }>>(
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
        {bookings.map((b) => (
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
    <Tabs
      defaultTab="all"
      tabs={[
        { id: "all", label: "All Bookings", count: bookings.length },
        { id: "by-service", label: "By Service", count: Object.keys(byService).length },
      ]}
      panels={{
        all: allPanel,
        "by-service": byServicePanel,
      }}
    />
  );
}
