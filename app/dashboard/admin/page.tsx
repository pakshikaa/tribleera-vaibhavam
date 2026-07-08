import type { Metadata } from "next";
import Link from "next/link";
import { Store, Users, Wallet, ShieldAlert, ArrowRight, LayoutGrid, Scale } from "lucide-react";
import { StatCard } from "@/components/ui/StatCard";
import { Tabs } from "@/components/ui/Tabs";
import { Table, THead, Th, Td, Tr } from "@/components/ui/Table";
import { AdminUsersClient } from "@/components/dashboard/AdminUsersClient";
import { AdminActivityFeedClient } from "@/components/dashboard/AdminActivityFeedClient";
import { AdminQuickActionsClient } from "@/components/dashboard/AdminQuickActionsClient";
import { AdminGreetingBar } from "@/components/dashboard/AdminGreetingBar";
import { BookingStatusBadge } from "@/components/dashboard/StatusBadge";
import { formatLKR, formatDateShort } from "@/lib/utils/format";
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
      {/* Greeting bar */}
      <AdminGreetingBar />

      {/* Page header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-slate">Platform Overview</h1>
        <p className="mt-1 text-sm text-slate-soft">Welcome back — here&apos;s what&apos;s happening today.</p>
      </div>

      {/* Needs Your Attention */}
      <AdminQuickActionsClient staticActions={QUICK_ACTIONS} />

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Active vendors" value={String(activeVendors)} icon={<Store size={18} />} accent="burgundy" />
        <StatCard
          label="Pending approvals"
          value={String(vendorApplications.length)}
          deltaTone="danger"
          icon={<ShieldAlert size={18} />}
          accent="gold"
        />
        <StatCard label="Total bookings" value={String(bookings.length)} icon={<Users size={18} />} accent="info" />
        <StatCard label="Platform fees earned" value={formatLKR(totalFees)} icon={<Wallet size={18} />} accent="success" />
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

      {/* Recent bookings (table) + Activity feed — split layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[3fr_2fr]">
        <div>
          <Tabs
            tabs={[
              { id: "bookings", label: "Recent bookings", count: bookings.length },
              { id: "users", label: "Manage users", count: users.length },
            ]}
            panels={{
              bookings: (
                <Table>
                  <THead>
                    <Th>Booking</Th>
                    <Th>Customer</Th>
                    <Th>Service</Th>
                    <Th>Date</Th>
                    <Th>Status</Th>
                    <Th className="text-right">Amount</Th>
                  </THead>
                  <tbody>
                    {bookings.slice(0, 5).map((b) => (
                      <Tr key={b.id}>
                        <Td className="font-medium text-burgundy-deep">{b.id}</Td>
                        <Td>{b.customerName}</Td>
                        <Td>
                          {b.items[0]?.vendorName ?? "—"}
                          {b.items.length > 1 && (
                            <span className="text-slate-soft"> +{b.items.length - 1}</span>
                          )}
                        </Td>
                        <Td className="text-slate-soft">{formatDateShort(b.eventDate)}</Td>
                        <Td>
                          <BookingStatusBadge status={b.status} />
                        </Td>
                        <Td className="text-right font-medium text-burgundy-deep">{formatLKR(b.payableNow)}</Td>
                      </Tr>
                    ))}
                  </tbody>
                </Table>
              ),
              users: <AdminUsersClient initial={users} />,
            }}
          />
        </div>

        {/* Recent Activity Feed */}
        <div>
          <h2 className="mb-4 font-display text-lg font-semibold text-slate">Recent Activity</h2>
          <AdminActivityFeedClient staticFeed={ACTIVITY_FEED} />
        </div>
      </div>
    </div>
  );
}
