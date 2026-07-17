"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  BarChart3,
  Bell,
  BookOpen,
  CreditCard,
  Globe,
  LayoutDashboard,
  LogOut,
  Menu,
  Scale,
  ShieldCheck,
  Store,
  Tag,
} from "lucide-react";
import { AdminNotificationBell } from "@/components/dashboard/AdminNotificationBell";
import { AdminAuthProvider } from "@/components/dashboard/AdminAuthContext";
import { getAdminSnapshot, subscribeAdminData } from "@/lib/utils/adminLiveData";
import { cn } from "@/lib/utils/cn";
import {
  ADMIN_LOGIN_PATH,
  canAccessAdminPath,
  clearAdminSession,
  getDefaultAdminPath,
  getRoleLabel,
  readAdminSession,
  refreshAdminSessionActivity,
  type AdminRole,
  type AdminSession,
} from "@/lib/utils/adminAuth";

const NAV = [
  { href: "/dashboard/admin", label: "Dashboard", icon: LayoutDashboard, exact: true, roles: ["super_admin", "finance_admin", "content_admin"] as AdminRole[] },
  { href: "/dashboard/admin/vendors", label: "Vendors", icon: Store, exact: false, roles: ["super_admin", "content_admin"] as AdminRole[] },
  { href: "/dashboard/admin/bookings", label: "Bookings", icon: BookOpen, exact: false, roles: ["super_admin", "finance_admin"] as AdminRole[] },
  { href: "/dashboard/admin/payments", label: "Payments", icon: CreditCard, exact: false, roles: ["super_admin", "finance_admin"] as AdminRole[] },
  { href: "/dashboard/admin/disputes", label: "Disputes", icon: Scale, exact: false, roles: ["super_admin", "finance_admin"] as AdminRole[] },
  { href: "/dashboard/admin/categories", label: "Categories", icon: Tag, exact: false, roles: ["super_admin", "content_admin"] as AdminRole[] },
  { href: "/dashboard/admin/reminders", label: "Reminders", icon: Bell, exact: false, roles: ["super_admin", "content_admin"] as AdminRole[] },
  { href: "/dashboard/admin/reports", label: "Reports", icon: BarChart3, exact: false, roles: ["super_admin", "finance_admin"] as AdminRole[] },
  { href: "/dashboard/admin/moderation", label: "Moderation", icon: ShieldCheck, exact: false, roles: ["super_admin", "content_admin"] as AdminRole[] },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const [session, setSession] = useState<AdminSession | null>(null);
  const [mobileMenuPath, setMobileMenuPath] = useState<string | null>(null);
  const snapshot = useSyncExternalStore(subscribeAdminData, getAdminSnapshot, getAdminSnapshot);
  const pendingApps = snapshot.applications.filter((item) => item.status === "pending").length;

  const visibleNav = useMemo(
    () => (session ? NAV.filter((item) => item.roles.includes(session.role)) : []),
    [session]
  );

  useEffect(() => {
    const current = readAdminSession();
    if (!current) {
      router.replace(ADMIN_LOGIN_PATH);
      return;
    }
    if (!canAccessAdminPath(current.role, pathname)) {
      router.replace(getDefaultAdminPath(current.role));
      return;
    }
    // One-time hydration from a browser-only store — the documented exception
    // to the set-state-in-effect rule used across this repo.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSession(current);
    setAuthChecked(true);
  }, [pathname, router]);

  useEffect(() => {
    if (!session) return;

    const handleActivity = () => {
      const refreshed = refreshAdminSessionActivity();
      if (!refreshed) {
        clearAdminSession();
        setSession(null);
        router.replace(ADMIN_LOGIN_PATH);
        return;
      }
      setSession(refreshed);
    };

    const checkExpiry = () => {
      const current = readAdminSession();
      if (!current) {
        clearAdminSession();
        setSession(null);
        router.replace(ADMIN_LOGIN_PATH);
      }
    };

    const events: Array<keyof WindowEventMap> = ["click", "keydown", "mousemove", "scroll", "touchstart"];
    events.forEach((eventName) => window.addEventListener(eventName, handleActivity, { passive: true }));
    const interval = window.setInterval(checkExpiry, 30000);

    return () => {
      events.forEach((eventName) => window.removeEventListener(eventName, handleActivity));
      window.clearInterval(interval);
    };
  }, [router, session]);

  function handleSignOut() {
    clearAdminSession();
    setSession(null);
    router.push(ADMIN_LOGIN_PATH);
  }

  if (!authChecked || !session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ivory">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-burgundy border-t-transparent" />
      </div>
    );
  }

  const sidebar = (
    <aside className="flex h-full w-60 shrink-0 flex-col border-r border-slate/10 bg-white">
      <div className="flex items-center justify-between gap-2.5 border-b border-slate/10 px-5 py-4">
        <div className="flex items-center gap-2.5">
          <Image src="/logo/tribleera-mark-192.png" alt="TRIBLEERA" width={36} height={36} className="rounded-[8px]" />
          <div>
            <p className="font-display text-sm font-semibold text-burgundy-deep">TRIBLEERA</p>
            <p className="text-[10px] font-medium uppercase tracking-wider text-slate-soft">{getRoleLabel(session.role)}</p>
          </div>
        </div>
        <AdminNotificationBell />
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto p-3">
        {visibleNav.map((item) => {
          const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center justify-between gap-3 rounded-[8px] px-3 py-2.5 text-sm font-medium transition-colors",
                active ? "bg-burgundy text-white" : "text-slate-soft hover:bg-ivory hover:text-slate"
              )}
            >
              <span className="flex items-center gap-3">
                <item.icon size={17} strokeWidth={active ? 2 : 1.75} />
                {item.label}
              </span>
              {item.href === "/dashboard/admin/vendors" && pendingApps > 0 && (
                <span
                  className={cn(
                    "flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-bold",
                    active ? "bg-white/20 text-white" : "bg-gold/20 text-gold-deep"
                  )}
                >
                  {pendingApps}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-0.5 border-t border-slate/10 p-3">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2.5 rounded-[8px] px-3 py-2 text-sm text-slate-soft hover:bg-ivory hover:text-slate"
        >
          <Globe size={15} /> View website
        </Link>
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-2.5 rounded-[8px] px-3 py-2 text-sm text-slate-soft hover:bg-red-50 hover:text-red-600"
        >
          <LogOut size={15} /> Sign out
        </button>
      </div>
    </aside>
  );

  const mobileSidebar = (
    <div className="flex h-full w-[260px] max-w-[80vw] flex-col bg-ink text-cream shadow-[4px_0_20px_rgba(0,0,0,0.25)]">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <div className="flex items-center gap-2">
          <Image src="/logo/tribleera-mark-192.png" alt="TRIBLEERA" width={26} height={26} className="rounded-[5px]" />
          <span className="text-[13px] font-bold tracking-[0.1em] text-gold">{getRoleLabel(session.role)}</span>
        </div>
        <button
          type="button"
          onClick={() => setMobileMenuPath(null)}
          aria-label="Close admin menu"
          className="flex h-11 w-11 items-center justify-center rounded-lg bg-white/8 text-cream"
        >
          <span className="text-xl leading-none">x</span>
        </button>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-3">
        {visibleNav.map((item) => {
          const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileMenuPath(null)}
              className={cn(
                "flex min-h-11 items-center justify-between gap-3 rounded-[8px] px-3 py-3 text-sm font-medium",
                active ? "bg-burgundy text-cream" : "text-cream-faint"
              )}
            >
              <span className="flex items-center gap-3">
                <item.icon size={17} strokeWidth={active ? 2 : 1.75} />
                {item.label}
              </span>
              {item.href === "/dashboard/admin/vendors" && pendingApps > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1 text-[10px] font-bold text-ink">
                  {pendingApps}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
      <div className="space-y-1 border-t border-white/10 p-3">
        <Link href="/" target="_blank" className="flex min-h-11 items-center gap-2.5 rounded-[8px] px-3 py-3 text-sm text-cream-faint">
          <Globe size={15} /> View website
        </Link>
        <button onClick={handleSignOut} className="flex min-h-11 w-full items-center gap-2.5 rounded-[8px] px-3 py-3 text-sm text-cream-faint">
          <LogOut size={15} /> Sign out
        </button>
      </div>
    </div>
  );

  return (
    <AdminAuthProvider value={session}>
      <div className="dashboard-page flex min-h-screen bg-[#F5F6FA]" data-portal="true">
        <div className="sticky top-0 hidden h-screen md:flex">{sidebar}</div>

        {mobileMenuPath === pathname && (
          <div className="fixed inset-0 z-50 flex md:hidden">
            <div className="fixed inset-0 bg-black/40" onClick={() => setMobileMenuPath(null)} />
            <div className="relative z-50 flex h-full">{mobileSidebar}</div>
          </div>
        )}

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-slate/10 bg-[#15040C] px-4 text-cream md:bg-white md:px-5 md:text-slate">
            <div className="flex items-center gap-3">
              <button
                className="flex h-11 w-11 items-center justify-center rounded-lg bg-white/8 text-cream md:hidden"
                onClick={() => setMobileMenuPath(pathname)}
                aria-label="Open admin menu"
              >
                <Menu size={20} />
              </button>
              <div className="flex items-center gap-2 md:hidden">
                <Image src="/logo/tribleera-mark-192.png" alt="TRIBLEERA" width={26} height={26} className="rounded-[5px]" />
                <span className="text-[13px] font-bold tracking-[0.1em] text-gold">Admin</span>
              </div>
              <div className="hidden items-center gap-1.5 text-xs text-slate-soft md:flex">
                <span>{getRoleLabel(session.role)}</span>
                <span>/</span>
                <span className="font-medium text-slate capitalize">
                  {pathname.split("/").pop()?.replace(/-/g, " ") || "Dashboard"}
                </span>
              </div>
            </div>
            <div className="hidden items-center gap-3 md:flex">
              <div className="flex items-center gap-2 rounded-[8px] bg-burgundy/5 px-3 py-1.5">
                <div className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="text-xs font-medium text-burgundy-deep">{getRoleLabel(session.role)}</span>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-auto overflow-x-hidden p-4 md:p-8">{children}</main>
        </div>
      </div>
    </AdminAuthProvider>
  );
}
