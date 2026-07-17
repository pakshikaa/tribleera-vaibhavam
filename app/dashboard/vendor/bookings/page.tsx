import type { Metadata } from "next";
import { CalendarCheck, CalendarDays, Inbox, MapPin, Wallet } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatCard } from "@/components/ui/StatCard";
import { VendorBookingsRequests } from "@/components/dashboard/VendorBookingsRequests";
import { VendorPageHeader } from "@/components/dashboard/VendorPageHeader";
import { formatDate, formatLKR } from "@/lib/utils/format";
import { getVendorBySlug } from "@/lib/data/vendors";
import { bookings } from "@/lib/data/bookings";
import { vendorRequests } from "@/lib/data/vendorRequests";

export const metadata: Metadata = { title: "Bookings | Vendor Dashboard" };

const VENDOR_SLUG = "pushpa-florals-and-decor";

const STATUS_TONE: Record<string, "success" | "warning" | "danger" | "slate"> = {
  confirmed:    "success",
  advance_paid: "success",
  completed:    "slate",
  pending:      "warning",
  cancelled:    "danger",
};

const STATUS_LABEL: Record<string, string> = {
  confirmed:    "Confirmed",
  advance_paid: "Advance paid",
  completed:    "Completed",
  pending:      "Pending",
  cancelled:    "Cancelled",
};

export default function VendorBookingsPage() {
  const vendor = getVendorBySlug(VENDOR_SLUG)!;
  const vendorBookings = bookings.filter((b) =>
    b.items.some((i) => i.vendorId === vendor.id)
  );
  const newRequests = vendorRequests.filter((r) => r.status === "new");
  const acceptedRequests = vendorRequests.filter((r) => r.status === "accepted");
  const confirmedValue = vendorBookings.reduce(
    (sum, b) => sum + b.items.filter((i) => i.vendorId === vendor.id).reduce((s, i) => s + i.price, 0),
    0
  );

  return (
    <div className="space-y-8" data-portal="true">
      <VendorPageHeader
        title="Bookings"
        description="Manage your booking requests and confirmed events."
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="New requests" value={String(newRequests.length)} icon={<Inbox size={18} />} accent="burgundy" />
        <StatCard label="Accepted requests" value={String(acceptedRequests.length)} icon={<CalendarDays size={18} />} accent="gold" />
        <StatCard label="Confirmed bookings" value={String(vendorBookings.length)} icon={<CalendarCheck size={18} />} accent="info" />
        <StatCard label="Confirmed value" value={formatLKR(confirmedValue)} icon={<Wallet size={18} />} accent="success" />
      </div>

      <div>
        {/* Incoming requests — full live workflow: accept, reject, counter-offer, threads */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg text-slate">
              Incoming requests
              {newRequests.length > 0 && (
                <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-burgundy text-[10px] font-bold text-white">
                  {newRequests.length}
                </span>
              )}
            </h2>
          </div>
          <VendorBookingsRequests />
        </section>

        {/* Confirmed / active bookings */}
        <section className="mt-10">
          <h2 className="mb-4 font-display text-lg text-slate">
            Confirmed bookings
            {acceptedRequests.length > 0 && (
              <span className="ml-2 text-sm font-normal text-slate-soft">
                ({acceptedRequests.length})
              </span>
            )}
          </h2>

          {vendorBookings.length === 0 && acceptedRequests.length === 0 ? (
            <EmptyState
              icon={<CalendarDays size={24} />}
              title="No confirmed bookings yet"
              description="Accepted requests will appear here."
            />
          ) : (
            <div className="space-y-3">
              {vendorBookings.map((booking) => {
                const myItems = booking.items.filter((i) => i.vendorId === vendor.id);
                const myTotal = myItems.reduce((s, i) => s + i.price, 0);
                return (
                  <div
                    key={booking.id}
                    className="rounded-[8px] border border-slate/8 bg-white p-5 shadow-soft"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-slate">{booking.customerName}</p>
                        <p className="text-xs text-slate-soft">
                          {myItems.map((i) => i.packageName).join(", ")}
                        </p>
                      </div>
                      <Badge tone={STATUS_TONE[booking.status] ?? "slate"}>
                        {STATUS_LABEL[booking.status] ?? booking.status}
                      </Badge>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-soft">
                      <span className="flex items-center gap-1">
                        <CalendarDays size={11} /> {formatDate(booking.eventDate)}
                      </span>
                      {booking.location && (
                        <span className="flex items-center gap-1">
                          <MapPin size={11} /> {booking.location}
                        </span>
                      )}
                      <span>Booked {formatDate(booking.createdAt)}</span>
                    </div>

                    <div className="mt-3 flex items-center justify-between border-t border-slate/8 pt-3">
                      <p className="font-display text-lg font-semibold text-burgundy-deep">
                        {formatLKR(myTotal)}
                      </p>
                      <span className="text-xs text-slate-soft">
                        Booking #{booking.id}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
