"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, LogOut, User } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const NAV_ITEMS = [
  { href: "/dashboard/customer", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/customer/profile", label: "My Profile", icon: User, exact: false },
];

export default function CustomerDashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [customerAuth, setCustomerAuth] = useState<string | null | undefined>(undefined);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const timer = window.setTimeout(() => {
      try {
        setCustomerAuth(sessionStorage.getItem("customer-auth"));
      } catch {
        setCustomerAuth(null);
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (customerAuth === undefined) {
      return;
    }

    if (!customerAuth) {
      router.replace("/login?redirect=/");
    }
  }, [customerAuth, router]);

  function handleSignOut() {
    try {
      window.sessionStorage.removeItem("customer-auth");
      window.sessionStorage.removeItem("customer-name");
      window.sessionStorage.removeItem("user-auth");
      window.sessionStorage.removeItem("user-slug");
    } catch {}

    setCustomerAuth(null);
    router.push("/login");
  }

  if (!customerAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ivory">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-burgundy border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory">
      <header className="sticky top-0 z-30 border-b border-slate/10 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5">
              <Image
                src="/logo/tribleera-mark-192.png"
                alt="TRIBLEERA VAIBHAVAM"
                width={34}
                height={34}
                className="rounded-[8px]"
              />
              <div className="leading-none">
                <p className="font-display text-sm font-bold tracking-[0.16em] text-burgundy-deep">TRIBLEERA</p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.22em] text-slate-soft">Customer Space</p>
              </div>
            </Link>
          </div>

          <nav className="hidden items-center gap-1 md:flex">
            {NAV_ITEMS.map((item) => {
              const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-burgundy text-white"
                      : "text-slate-soft hover:bg-burgundy/5 hover:text-burgundy"
                  )}
                >
                  <Icon size={16} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <button
            type="button"
            onClick={handleSignOut}
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-slate/15 bg-white px-4 py-2 text-sm font-medium text-slate-soft transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600"
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>

        <div className="mx-auto flex w-full max-w-6xl gap-2 overflow-x-auto px-4 pb-3 md:hidden">
          {NAV_ITEMS.map((item) => {
            const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "inline-flex min-h-11 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors",
                  active
                    ? "bg-burgundy text-white"
                    : "bg-ivory text-slate-soft hover:text-burgundy"
                )}
              >
                <Icon size={16} />
                {item.label}
              </Link>
            );
          })}
        </div>
      </header>

      {children}
    </div>
  );
}
