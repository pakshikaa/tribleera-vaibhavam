import type { Metadata } from "next";
import Link from "next/link";
import { Store, Users, Wallet, ShieldAlert, ArrowRight, LayoutGrid, Scale, AlertCircle } from "lucide-react";
import { StatCard } from "@/components/ui/StatCard";
import { Tabs } from "@/components/ui/Tabs";
import { AdminUsersClient } from "@/components/dashboard/AdminUsersClient";
import { BookingStatusBadge } from "@/components/dashboard/StatusBadge";
import { formatLKR, formatDateShort } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";
import { vendors } from "@/lib/data/vendors";
import { bookings } from "@/lib/data/bookings";
import { users, vendorApplications } from "@/lib/data/users";
import { disputeCases } from "@/lib/data/disputes";

export const metadata: Metadata = { title: "Admin Dashboard" };

const QUICK_ACTIONS = [
  {
    label: "Vendor applications",
    count: 3,
    href: "/dashboard/admin/vendors",
    color: "border-gold bg-gold/5 text-gold-deep",
  },
  {
    label: "Payments to verify",
    count: 2,
    href: "/dashboard/admin/payments",
    color: "border-burgundy/30 bg-burgundy/5 text-burgundy",
  },
  {
    label: "Open disputes",
    count: 1,
    href: "/dashboard/admin/disputes",
    color: "border-red-300 bg-red-50 text-red-700",
  },
  {
    label: "Events in 3 days",
    count: 4,
    href: "/dashboard/admin/reminders",
    color: "border-slate/20 bg-ivory text-slate",
  },
];

const ACTIVITY_FEED = [
  { time: "2 minutes ago", type: "vendor_update", message: "Jaffna Frames Studio updated their portfolio", icon: "📸" },
  { time: "1 hour ago", type: "vendor_register", message: "New vendor application: Velvet Sugarcrafts (Cakes)", icon: "🆕" },
  { time: "3 hours ago", type: "payment", message: "Payment verified for TRB-20260451 — LKR 15,180", icon: "💳" },
  { time: "Yesterday", type: "dispute", message: "Dispute #003 closed — Full refund issued", icon: "⚖️" },
  { time: "Yesterday", type: "vendor_update", message: "Anjali Bridal Studio updated packages", icon: "✏️" },
  { time: "2 days ago", type: "vendor_register", message: "New vendor application: Golden Arch Decor", icon: "🆕" },
];

const TYPE_COLORS: Record<string, string> = {
  vendor_update: "bg-blue-50 border-blue-200 text-blue-700",
  vendor_register: "bg-success-pale border-success/30 text-success",
  payment: "bg-gold/10 border-gold/30 text-gold-deep",
  dispute: "bg-rose-pale border-rose/30 text-burgundy",
};

const QUICK_LINKS = [
  {
    href: "/dashboard/admin/vendors",
    icon: Store,
    title: "Vendor approvals",
    description: `${vendorApplications.length} application${vendorApplications.length !== 1 ? "s" : ""} awaiting review`,
  },
  {
    href: "/dashboard/admin/bookings",
    icon: Wallet,
    title: "Bookings & payments",
    description: "Monitor every transaction and platform fee in real time",
  },
  {
    href: "/dashboard/admin/disputes",
    icon: Scale,
    title: "Disputes & cancellations",
    description: `${disputeCases.filter((c) => c.status === "open").length} case${disputeCases.filter((c) => c.status === "open").length !== 1 ? "s" : ""} need attention`,
  },
  {
    href: "/dashboard/admin/categories",
    icon: LayoutGrid,
    title: "Category management",
    description: "Control which services are live for customers",
  },
];

export default function AdminDashboardPage() {
  const totalFees = bookings.reduce((s, b) => s + b.platformFee, 0);
  const activeVendors = vendors.filter((v) => v.status === "approved").length;

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-slate">Platform Overview</h1>
        <p className="mt-1 text-sm text-slate-soft">Welcome back — here&apos;s what&apos;s happening today.</p>
      </div>

      {/* Needs Your Attention */}
      {QUICK_ACTIONS.some((a) => a.count > 0) && (
        <div className="rounded-[10px] border border-amber-200 bg-amber-50 p-5">
          <div className="mb-3 flex items-center gap-2">
            <AlertCircle size={16} className="text-amber-600" />
            <p className="text-sm font-semibold text-amber-800">Needs your attention</p>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {QUICK_ACTIONS.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className={cn("rounded-[8px] border p-3 transition-all hover:shadow-sm", action.color)}
              >
                <p className="font-display text-2xl font-bold">{action.count}</p>
                <p className="mt-0.5 text-xs font-medium">{action.label}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Active vendors" value={String(activeVendors)} icon={<Store size={18} />} />
        <StatCard label="Pending approvals" value={String(vendorApplications.length)} deltaTone="danger" icon={<ShieldAlert size={18} />} />
        <StatCard label="Total bookings" value={String(bookings.length)} icon={<Users size={18} />} />
        <StatCard label="Platform fees earned" value={formatLKR(totalFees)} icon={<Wallet size={18} />} />
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {QUICK_LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="group flex items-center justify-between rounded-[8px] border border-slate/8 bg-white p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-burgundy/8 text-burgundy">
                <l.icon size={20} />
              </div>
              <div>
                <p className="font-display text-lg text-slate">{l.title}</p>
                <p className="text-sm text-slate-soft">{l.description}</p>
              </div>
            </div>
            <ArrowRight size={18} className="shrink-0 text-gold-deep opacity-0 transition-opacity group-hover:opacity-100" />
          </Link>
        ))}
      </div>

      {/* Tabs: Recent bookings + Users */}
      <Tabs
        tabs={[
          { id: "activity", label: "Recent bookings", count: bookings.length },
          { id: "users", label: "Manage users", count: users.length },
        ]}
        panels={{
          activity: (
            <div className="space-y-3">
              {bookings.map((b) => (
                <div key={b.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate/8 bg-white px-4 py-3.5">
                  <div>
                    <p className="text-sm font-semibold text-slate">
                      {b.id} <span className="font-normal text-slate-soft">&middot; {b.customerName}</span>
                    </p>
                    <p className="text-xs text-slate-soft">
                      {formatDateShort(b.createdAt)} &middot; {b.items.length} vendor(s)
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-burgundy-deep">{formatLKR(b.payableNow)}</span>
                    <BookingStatusBadge status={b.status} />
                  </div>
                </div>
              ))}
            </div>
          ),
          users: <AdminUsersClient initial={users} />,
        }}
      />

      {/* Recent Activity Feed */}
      <div>
        <h2 className="mb-4 font-display text-lg font-semibold text-slate">Recent Activity</h2>
        <div className="space-y-2">
          {ACTIVITY_FEED.map((item, i) => (
            <div key={i} className="flex items-start gap-3 rounded-[8px] border border-slate/8 bg-white p-4">
              <span className="text-xl">{item.icon}</span>
              <div className="flex-1">
                <p className="text-sm text-slate">{item.message}</p>
                <p className="mt-0.5 text-[11px] text-slate-soft">{item.time}</p>
              </div>
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-[10px] font-semibold border",
                  TYPE_COLORS[item.type] ?? "bg-ivory border-slate/10 text-slate-soft"
                )}
              >
                {item.type.replace("_", " ")}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
