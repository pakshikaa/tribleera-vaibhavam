"use client";

import Link from "next/link";
import { Bell } from "lucide-react";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { useAdminAuth } from "@/components/dashboard/AdminAuthContext";
import {
  getAdminSnapshot,
  markAdminNotificationsRead,
  subscribeAdminData,
} from "@/lib/utils/adminLiveData";
import { cn } from "@/lib/utils/cn";
import { formatDateShort } from "@/lib/utils/format";

export function AdminNotificationBell() {
  const adminSession = useAdminAuth();
  const snapshot = useSyncExternalStore(subscribeAdminData, getAdminSnapshot, getAdminSnapshot);
  const [open, setOpen] = useState(false);
  // The bell sits in the left sidebar on desktop — anchoring the panel to the
  // bell's right edge pushed it off-screen. Anchor toward the roomier side.
  const [alignLeft, setAlignLeft] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  function toggleOpen() {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) setAlignLeft(rect.left + rect.width / 2 < window.innerWidth / 2);
    setOpen((value) => !value);
  }

  const canSeeFinance = adminSession?.role === "super_admin" || adminSession?.role === "finance_admin";
  const canSeeContent = adminSession?.role === "super_admin" || adminSession?.role === "content_admin";

  const visibleNotifications = useMemo(() => {
    const financeTypes = ["payment", "payment_verified", "dispute"];
    const contentTypes = ["vendor_update", "vendor_register", "request_submitted", "request_rerouted"];
    if (canSeeFinance && canSeeContent) return snapshot.notifications;
    const allowed = canSeeFinance ? financeTypes : contentTypes;
    return snapshot.notifications.filter((item) => allowed.includes(item.type));
  }, [snapshot.notifications, canSeeFinance, canSeeContent]);

  const pendingApps = useMemo(
    () => (canSeeContent ? snapshot.applications.filter((item) => item.status === "pending") : []),
    [snapshot.applications, canSeeContent]
  );
  const pendingPayments = useMemo(
    () => (canSeeFinance ? snapshot.pendingPayments : []),
    [snapshot.pendingPayments, canSeeFinance]
  );

  // Unread messages plus still-outstanding work. Marking read clears the
  // first part; the queues clear only when the admin actually works them.
  const unreadNotifications = visibleNotifications.filter((item) => !item.read);
  const badgeCount = unreadNotifications.length + pendingApps.length + pendingPayments.length;

  useEffect(() => {
    if (!open) return;
    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("keydown", handleEscape);
    return () => {
      window.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  const items = [
    ...visibleNotifications.slice(0, 4).map((item) => ({
      key: `n-${item.time}-${item.message}`,
      label: item.message,
      meta: item.time ? formatDateShort(item.time) : "Recent",
      href: item.href ?? "/dashboard/admin",
      unread: !item.read,
    })),
    ...pendingApps.slice(0, 2).map((item) => ({
      key: `a-${item.id}`,
      label: `New vendor application: ${item.businessName}`,
      meta: item.city,
      href: "/dashboard/admin/vendors",
      unread: true,
    })),
    ...pendingPayments.slice(0, 2).map((item) => ({
      key: `p-${item.id}`,
      label: `Payment awaiting verification: ${item.bookingId}`,
      meta: item.customerName,
      href: "/dashboard/admin/payments",
      unread: true,
    })),
  ].slice(0, 6);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={toggleOpen}
        aria-label={
          badgeCount > 0 ? `Admin notifications (${badgeCount} pending)` : "Admin notifications"
        }
        aria-expanded={open}
        className="relative flex h-10 w-10 items-center justify-center rounded-[10px] border border-slate/10 bg-white text-slate shadow-sm transition-colors hover:bg-ivory"
      >
        <Bell size={17} />
        {badgeCount > 0 && (
          <span className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-burgundy px-1 text-[10px] font-bold text-white">
            {badgeCount > 99 ? "99+" : badgeCount}
          </span>
        )}
      </button>

      {open && (
        <div
          className={cn(
            "absolute top-12 z-50 w-80 max-w-[calc(100vw-24px)] rounded-[12px] border border-slate/10 bg-white p-3 shadow-lift",
            alignLeft ? "left-0" : "right-0"
          )}
        >
          <div className="mb-2 flex items-center justify-between px-1">
            <p className="text-sm font-semibold text-slate">Admin alerts</p>
            {unreadNotifications.length > 0 && (
              <button
                type="button"
                onClick={markAdminNotificationsRead}
                className="text-xs font-medium text-burgundy hover:underline"
              >
                Mark all read
              </button>
            )}
          </div>

          {items.length === 0 ? (
            <p className="rounded-[8px] bg-ivory px-3 py-4 text-sm text-slate-soft">No new alerts right now.</p>
          ) : (
            <div className="space-y-2">
              {items.map((item) => (
                <Link
                  key={item.key}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "block rounded-[8px] border px-3 py-2.5 transition-colors hover:bg-ivory",
                    item.unread ? "border-burgundy/25 bg-burgundy/[0.04]" : "border-slate/8"
                  )}
                >
                  <p className="text-sm text-slate">{item.label}</p>
                  <p className="mt-1 text-xs text-slate-soft">{item.meta}</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
