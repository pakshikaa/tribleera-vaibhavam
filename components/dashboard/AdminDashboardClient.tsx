"use client";

import Link from "next/link";
import { useMemo, useState, useSyncExternalStore } from "react";
import { ArrowRight, LayoutGrid, Scale, ShieldAlert, Store, Users, Wallet } from "lucide-react";
import { AdminActivityFeedClient } from "@/components/dashboard/AdminActivityFeedClient";
import { useAdminAuth } from "@/components/dashboard/AdminAuthContext";
import { AdminAuditLogClient } from "@/components/dashboard/AdminAuditLogClient";
import { AdminGreetingBar } from "@/components/dashboard/AdminGreetingBar";
import { AdminUsersClient } from "@/components/dashboard/AdminUsersClient";
import { BookingStatusBadge } from "@/components/dashboard/StatusBadge";
import { StatCard } from "@/components/ui/StatCard";
import { Table, THead, Th, Td, Tr } from "@/components/ui/Table";
import { Tabs } from "@/components/ui/Tabs";
import { cn } from "@/lib/utils/cn";
import { formatDateShort, formatLKR } from "@/lib/utils/format";
import { DateRangeFilter, getAdminSnapshot, isInDateRange, subscribeAdminData } from "@/lib/utils/adminLiveData";

const DATE_FILTERS: Array<{ id: DateRangeFilter; label: string }> = [
  { id: "7d", label: "This week" },
  { id: "month", label: "This month" },
  { id: "30d", label: "Last 30 days" },
  { id: "all", label: "All time" },
];

export function AdminDashboardClient() {
  const adminSession = useAdminAuth();
  const snapshot = useSyncExternalStore(subscribeAdminData, getAdminSnapshot, getAdminSnapshot);
  const [range, setRange] = useState<DateRangeFilter>("month");
  const canSeeFinance = adminSession?.role === "super_admin" || adminSession?.role === "finance_admin";
  const canSeeContent = adminSession?.role === "super_admin" || adminSession?.role === "content_admin";

  const filteredBookings = useMemo(
    () => snapshot.bookings.filter((booking) => isInDateRange(booking.createdAt, range)),
    [snapshot.bookings, range]
  );

  const totalFees = filteredBookings.reduce((sum, booking) => sum + booking.platformFee, 0);
  const activeVendors = snapshot.vendors.filter((vendor) => vendor.status === "approved").length;
  const pendingApps = snapshot.applications.filter((item) => item.status === "pending").length;
  const openDisputes = snapshot.disputes.filter((item) => item.status === "open").length;
  const pendingPayments = snapshot.pendingPayments.length;

  const quickLinks = [
    canSeeContent
      ? {
          href: "/dashboard/admin/vendors",
          icon: Store,
          title: "Vendor approvals",
          description: `${pendingApps} application${pendingApps !== 1 ? "s" : ""} awaiting review`,
        }
      : null,
    canSeeFinance
      ? {
          href: "/dashboard/admin/bookings",
          icon: Wallet,
          title: "Bookings & payments",
          description: `${pendingPayments} payment${pendingPayments !== 1 ? "s" : ""} waiting for verification`,
        }
      : null,
    canSeeFinance
      ? {
          href: "/dashboard/admin/disputes",
          icon: Scale,
          title: "Disputes & cancellations",
          description: `${openDisputes} case${openDisputes !== 1 ? "s" : ""} need attention`,
        }
      : null,
    canSeeContent
      ? {
          href: "/dashboard/admin/categories",
          icon: LayoutGrid,
          title: "Category management",
          description: "Control which services are live for customers",
        }
      : null,
  ].filter(Boolean) as Array<{ href: string; icon: typeof Store; title: string; description: string }>;

  const attentionCards = [
    canSeeContent
      ? { label: "Vendor applications", count: pendingApps, href: "/dashboard/admin/vendors", color: "border-gold bg-gold/5 text-gold-deep" }
      : null,
    canSeeFinance
      ? { label: "Payments to verify", count: pendingPayments, href: "/dashboard/admin/payments", color: "border-burgundy/30 bg-burgundy/5 text-burgundy" }
      : null,
    canSeeFinance
      ? { label: "Open disputes", count: openDisputes, href: "/dashboard/admin/disputes", color: "border-red-300 bg-red-50 text-red-700" }
      : null,
    { label: "Unread alerts", count: snapshot.notifications.length, href: "/dashboard/admin", color: "border-slate/20 bg-ivory text-slate" },
  ].filter(Boolean) as Array<{ label: string; count: number; href: string; color: string }>;

  return (
    <div className="space-y-8">
      <AdminGreetingBar />

      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate">Platform Overview</h1>
          <p className="mt-1 text-sm text-slate-soft">Live admin state from bookings, payments, vendors, and audit events.</p>
        </div>
        <div className="flex flex-wrap gap-2">
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
        </div>
      </div>

      <div className="rounded-[10px] border border-amber-200 bg-amber-50 p-5">
        <div className="mb-3 flex items-center gap-2">
          <ShieldAlert size={16} className="text-amber-700" />
          <p className="text-sm font-semibold text-amber-900">Needs your attention</p>
        </div>
        <div className={cn("grid gap-3", attentionCards.length > 3 ? "grid-cols-2 md:grid-cols-4" : "grid-cols-1 md:grid-cols-3")}>
          {attentionCards.map((action) => (
            <Link key={action.href + action.label} href={action.href} className={cn("rounded-[8px] border p-3 transition-all hover:shadow-sm", action.color)}>
              <p className="font-display text-2xl font-bold">{action.count}</p>
              <p className="mt-0.5 text-xs font-medium">{action.label}</p>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Active vendors" value={String(activeVendors)} icon={<Store size={18} />} accent="burgundy" />
        {canSeeContent ? (
          <StatCard label="Pending approvals" value={String(pendingApps)} deltaTone={pendingApps > 0 ? "danger" : "success"} icon={<ShieldAlert size={18} />} accent="gold" />
        ) : (
          <StatCard label="Unread alerts" value={String(snapshot.notifications.length)} icon={<ShieldAlert size={18} />} accent="gold" />
        )}
        <StatCard label="Bookings in range" value={String(filteredBookings.length)} icon={<Users size={18} />} accent="info" />
        <StatCard
          label={canSeeFinance ? "Platform fees in range" : "Open disputes"}
          value={canSeeFinance ? formatLKR(totalFees) : String(openDisputes)}
          icon={<Wallet size={18} />}
          accent="success"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {quickLinks.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group flex items-center justify-between rounded-[8px] border border-slate/8 bg-white p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-burgundy/8 text-burgundy">
                <item.icon size={20} />
              </div>
              <div>
                <p className="font-display text-lg text-slate">{item.title}</p>
                <p className="text-sm text-slate-soft">{item.description}</p>
              </div>
            </div>
            <ArrowRight size={18} className="shrink-0 text-gold-deep opacity-0 transition-opacity group-hover:opacity-100" />
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[3fr_2fr]">
        <div>
          <Tabs
            tabs={[
              { id: "bookings", label: "Recent bookings", count: filteredBookings.length },
              { id: "users", label: "Manage users", count: snapshot.users.length },
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
                    {canSeeFinance && <Th className="text-right">Amount</Th>}
                  </THead>
                  <tbody>
                    {filteredBookings.slice(0, 6).map((booking) => (
                      <Tr key={booking.id}>
                        <Td className="font-medium text-burgundy-deep">{booking.id}</Td>
                        <Td>{booking.customerName}</Td>
                        <Td>{booking.items[0]?.vendorName ?? "-"}</Td>
                        <Td className="text-slate-soft">{formatDateShort(booking.eventDate)}</Td>
                        <Td><BookingStatusBadge status={booking.status} /></Td>
                        {canSeeFinance && <Td className="text-right font-medium text-burgundy-deep">{formatLKR(booking.payableNow)}</Td>}
                      </Tr>
                    ))}
                  </tbody>
                </Table>
              ),
              users: <AdminUsersClient initial={snapshot.users} />,
            }}
          />
        </div>

        <div>
          <h2 className="mb-4 font-display text-lg font-semibold text-slate">Recent Activity</h2>
          <AdminActivityFeedClient staticFeed={[]} />
        </div>
      </div>

      <AdminAuditLogClient />
    </div>
  );
}
