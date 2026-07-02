import type { Metadata } from "next";
import { TrendingUp, Wallet, ClipboardList, AlertCircle } from "lucide-react";
import { StatCard } from "@/components/ui/StatCard";
import { AdminBookingTabsClient } from "@/components/dashboard/AdminBookingTabsClient";
import { formatLKR } from "@/lib/utils/format";
import { bookings } from "@/lib/data/bookings";
import { BackButton } from "@/components/ui/BackButton";

export const metadata: Metadata = { title: "Bookings & Payments — Admin" };

export default function AdminBookingsPage() {
  const totalVolume = bookings.reduce((s, b) => s + b.serviceTotal, 0);
  const totalFees = bookings.reduce((s, b) => s + b.platformFee, 0);
  const totalCollected = bookings.reduce((s, b) => s + b.payableNow, 0);
  const pendingCount = bookings.filter((b) => b.status === "pending").length;

  return (
    <div className="space-y-6">
      <BackButton href="/dashboard/admin" label="Admin" className="mb-4" />
      <div>
        <h1 className="font-display text-2xl font-bold text-slate">Bookings & Payments</h1>
        <p className="mt-1 text-sm text-slate-soft">
          Monitor every transaction flowing through the platform.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Gross volume" value={formatLKR(totalVolume)} icon={<TrendingUp size={18} />} />
        <StatCard label="Platform fees" value={formatLKR(totalFees)} icon={<Wallet size={18} />} />
        <StatCard label="Collected" value={formatLKR(totalCollected)} icon={<ClipboardList size={18} />} />
        <StatCard
          label="Pending"
          value={String(pendingCount)}
          deltaTone={pendingCount > 0 ? "danger" : "success"}
          icon={<AlertCircle size={18} />}
        />
      </div>

      <AdminBookingTabsClient bookings={bookings} />
    </div>
  );
}
