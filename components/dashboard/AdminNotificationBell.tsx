"use client";

import Link from "next/link";
import { Bell } from "lucide-react";
import { useMemo, useSyncExternalStore } from "react";
import { useAdminAuth } from "@/components/dashboard/AdminAuthContext";
import { getAdminSnapshot, subscribeAdminData } from "@/lib/utils/adminLiveData";
import { formatDateShort } from "@/lib/utils/format";

export function AdminNotificationBell() {
  const adminSession = useAdminAuth();
  const snapshot = useSyncExternalStore(subscribeAdminData, getAdminSnapshot, getAdminSnapshot);
  const canSeeFinance = adminSession?.role === "super_admin" || adminSession?.role === "finance_admin";
  const canSeeContent = adminSession?.role === "super_admin" || adminSession?.role === "content_admin";

  const financeNotifications = useMemo(
    () => snapshot.notifications.filter((item) => item.type === "payment" || item.type === "payment_verified" || item.type === "dispute"),
    [snapshot.notifications]
  );
  const contentNotifications = useMemo(
    () => snapshot.notifications.filter((item) => item.type === "vendor_update" || item.type === "vendor_register" || item.type === "request_submitted" || item.type === "request_rerouted"),
    [snapshot.notifications]
  );

  const visibleNotifications = canSeeFinance && canSeeContent
    ? snapshot.notifications
    : canSeeFinance
      ? financeNotifications
      : contentNotifications;

  const count = (canSeeContent ? snapshot.applications.filter((item) => item.status === "pending").length : 0)
    + (canSeeFinance ? snapshot.pendingPayments.length : 0)
    + visibleNotifications.length;

  const items = [
    ...visibleNotifications.slice(0, 4).map((item) => ({
      label: item.message,
      meta: item.time ? formatDateShort(item.time) : "Recent",
      href: item.href ?? "/dashboard/admin",
    })),
    ...(canSeeContent
      ? snapshot.applications
          .filter((item) => item.status === "pending")
          .slice(0, 2)
          .map((item) => ({
            label: `New vendor application: ${item.businessName}`,
            meta: item.city,
            href: "/dashboard/admin/vendors",
          }))
      : []),
    ...(canSeeFinance
      ? snapshot.pendingPayments.slice(0, 2).map((item) => ({
          label: `Payment awaiting verification: ${item.bookingId}`,
          meta: item.customerName,
          href: "/dashboard/admin/payments",
        }))
      : []),
  ].slice(0, 6);

  return (
    <div className="group relative">
      <button
        type="button"
        aria-label="Admin notifications"
        className="relative flex h-10 w-10 items-center justify-center rounded-[10px] border border-slate/10 bg-white text-slate shadow-sm"
      >
        <Bell size={17} />
        {count > 0 && (
          <span className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-burgundy px-1 text-[10px] font-bold text-white">
            {count > 99 ? "99+" : count}
          </span>
        )}
      </button>

      <div className="pointer-events-none absolute right-0 top-12 z-50 hidden w-80 rounded-[12px] border border-slate/10 bg-white p-3 shadow-lift group-hover:pointer-events-auto group-hover:block">
        <div className="mb-2 flex items-center justify-between px-1">
          <p className="text-sm font-semibold text-slate">Admin alerts</p>
          <Link href={canSeeContent ? "/dashboard/admin/vendors" : "/dashboard/admin/payments"} className="text-xs font-medium text-burgundy hover:underline">
            Review
          </Link>
        </div>
        {items.length === 0 ? (
          <p className="rounded-[8px] bg-ivory px-3 py-4 text-sm text-slate-soft">No new alerts right now.</p>
        ) : (
          <div className="space-y-2">
            {items.map((item, index) => (
              <Link
                key={`${item.label}-${index}`}
                href={item.href}
                className="block rounded-[8px] border border-slate/8 px-3 py-2.5 transition-colors hover:bg-ivory"
              >
                <p className="text-sm text-slate">{item.label}</p>
                <p className="mt-1 text-xs text-slate-soft">{item.meta}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
