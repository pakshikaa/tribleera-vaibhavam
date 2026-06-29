"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard,
  Store,
  BookOpen,
  CreditCard,
  Scale,
  Tag,
  Bell,
  BarChart3,
  ShieldCheck,
  Globe,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

const NAV = [
  { href: "/dashboard/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/admin/vendors", label: "Vendors", icon: Store, exact: false },
  { href: "/dashboard/admin/bookings", label: "Bookings", icon: BookOpen, exact: false },
  { href: "/dashboard/admin/payments", label: "Payments", icon: CreditCard, exact: false },
  { href: "/dashboard/admin/disputes", label: "Disputes", icon: Scale, exact: false },
  { href: "/dashboard/admin/categories", label: "Categories", icon: Tag, exact: false },
  { href: "/dashboard/admin/reminders", label: "Reminders", icon: Bell, exact: false },
  { href: "/dashboard/admin/reports", label: "Reports", icon: BarChart3, exact: false },
  { href: "/dashboard/admin/moderation", label: "Moderation", icon: ShieldCheck, exact: false },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem("admin-auth") !== "true") {
        router.replace("/admin/login");
        return;
      }
    } catch {
      router.replace("/admin/login");
      return;
    }
    setAuthChecked(true);
  }, [router]);

  // Close mobile nav on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  function handleSignOut() {
    try { sessionStorage.removeItem("admin-auth"); } catch {}
    router.push("/admin/login");
  }

  if (!authChecked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ivory">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-burgundy border-t-transparent" />
      </div>
    );
  }

  const Sidebar = (
    <aside className="flex h-full w-60 shrink-0 flex-col border-r border-slate/10 bg-white">
      {/* Brand */}
      <div className="flex items-center gap-2.5 border-b border-slate/10 px-5 py-4">
        <Image src="/logo/tribleera-mark-192.png" alt="TRIBLEERA" width={36} height={36} className="rounded-[8px]" />
        <div>
          <p className="font-display text-sm font-semibold text-burgundy-deep">TRIBLEERA</p>
          <p className="text-[10px] font-medium uppercase tracking-wider text-slate-soft">Admin Panel</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-0.5 overflow-y-auto p-3">
        {NAV.map((item) => {
          const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-[8px] px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-burgundy text-white"
                  : "text-slate-soft hover:bg-ivory hover:text-slate"
              )}
            >
              <item.icon size={17} strokeWidth={active ? 2 : 1.75} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="border-t border-slate/10 p-3 space-y-0.5">
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

  return (
    <div className="flex min-h-screen bg-[#F5F6FA]">

      {/* Desktop sidebar */}
      <div className="hidden h-screen sticky top-0 md:flex">
        {Sidebar}
      </div>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="fixed inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="relative z-50 flex h-full">
            {Sidebar}
          </div>
        </div>
      )}

      {/* Main */}
      <div className="flex flex-1 flex-col min-w-0">

        {/* Top bar */}
        <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-slate/10 bg-white px-5">
          <div className="flex items-center gap-3">
            {/* Mobile hamburger */}
            <button
              className="rounded-lg p-1.5 text-slate-soft hover:bg-ivory md:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation"
            >
              <Menu size={20} />
            </button>
            {/* Breadcrumb */}
            <div className="hidden items-center gap-1.5 text-xs text-slate-soft md:flex">
              <span>Admin</span>
              <span>/</span>
              <span className="font-medium text-slate capitalize">
                {pathname.split("/").pop()?.replace(/-/g, " ") || "Dashboard"}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-[8px] bg-burgundy/5 px-3 py-1.5">
              <div className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-xs font-medium text-burgundy-deep">admin</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
