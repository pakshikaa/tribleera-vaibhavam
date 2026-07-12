import type { Metadata } from "next";
import { AdminBookingTabsClient } from "@/components/dashboard/AdminBookingTabsClient";
import { bookings } from "@/lib/data/bookings";
import { BackButton } from "@/components/ui/BackButton";

export const metadata: Metadata = { title: "Bookings & Payments — Admin" };

export default function AdminBookingsPage() {
  return (
    <div className="space-y-6">
      <BackButton href="/dashboard/admin" label="Admin" className="mb-4" />
      <div>
        <h1 className="font-display text-2xl font-bold text-slate">Bookings & Payments</h1>
        <p className="mt-1 text-sm text-slate-soft">
          Monitor every transaction flowing through the platform with live filters and exports.
        </p>
      </div>

      <AdminBookingTabsClient bookings={bookings} />
    </div>
  );
}
