"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Calendar, HelpCircle, LayoutDashboard, LogOut, Menu,
  Package, User, Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

const NAV_ITEMS = [
  { href: "/dashboard/vendor",           label: "Overview",  icon: LayoutDashboard },
  { href: "/dashboard/vendor/bookings",  label: "Bookings",  icon: Calendar },
  { href: "/dashboard/vendor/revenue",   label: "Revenue",   icon: Wallet },
  { href: "/dashboard/vendor/profile",   label: "Profile",   icon: User },
  { href: "/dashboard/vendor/packages",  label: "Packages",  icon: Package },
];

function NavItem({ href, label, icon: Icon, active }: { href: string; label: string; icon: React.ElementType; active: boolean }) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 border-l-4 px-4 py-3 text-sm transition-all",
        active
          ? "border-[#7A1F3D] bg-[#7A1F3D]/8 font-semibold text-[#7A1F3D]"
          : "border-transparent text-[#4B5563] hover:bg-[#FAF7F2] hover:text-[#1F2937]"
      )}
    >
      <Icon size={17} aria-hidden="true" />
      {label}
    </Link>
  );
}

function SidebarContent({ pathname, onSignOut }: { pathname: string; onSignOut: () => void }) {
  function isActive(href: string) {
    return href === "/dashboard/vendor" ? pathname === href : pathname.startsWith(href);
  }
  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-slate/10 p-5">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo/tribleera-mark-192.png" alt="TRIBLEERA" width={32} height={32} className="rounded-[6px]" />
          <span className="font-display text-sm font-bold text-[#5C0427]">TRIBLEERA</span>
        </Link>
        <p className="mt-3 text-xs text-[#4B5563]">Vendor Portal</p>
      </div>
      <nav className="flex-1 py-3">
        {NAV_ITEMS.map((item) => (
          <NavItem key={item.href} {...item} active={isActive(item.href)} />
        ))}
        <div className="my-3 mx-4 h-px bg-slate/10" />
        <NavItem href="/contact" label="Support" icon={HelpCircle} active={false} />
        <button
          type="button"
          onClick={onSignOut}
          className="flex w-full items-center gap-3 border-l-4 border-transparent px-4 py-3 text-left text-sm text-[#4B5563] transition-all hover:bg-[#FAF7F2] hover:text-[#1F2937]"
        >
          <LogOut size={17} aria-hidden="true" />
          Log Out
        </button>
      </nav>
    </div>
  );
}

export default function VendorDashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const [mobileMenuPath, setMobileMenuPath] = useState<string | null>(null);
  const [vendorName] = useState(() => {
    try {
      return sessionStorage.getItem("vendor-name") ?? "Vendor account";
    } catch {
      return "Vendor account";
    }
  });

  useEffect(() => {
    try {
      const authed = sessionStorage.getItem("vendor-auth") === "true";
      if (!authed) router.replace("/vendor/login");
      // eslint-disable-next-line react-hooks/set-state-in-effect
      else setChecked(true);
    } catch {
      setChecked(true);
    }
  }, [router]);

  if (!checked) return null;

  function handleSignOut() {
    try {
      sessionStorage.removeItem("vendor-auth");
      sessionStorage.removeItem("vendor-slug");
      sessionStorage.removeItem("vendor-name");
    } catch {}
    router.push("/vendor/login");
  }

  return (
    <div className="dashboard-page flex min-h-screen bg-[#FAF7F2]" data-portal="true">
      {/* Desktop sidebar */}
      <aside className="hidden w-56 shrink-0 border-r border-slate/10 bg-white md:flex md:flex-col">
        <SidebarContent pathname={pathname} onSignOut={handleSignOut} />
      </aside>

      {/* Main area */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Mobile top bar */}
        <div className="sticky top-0 z-40 flex h-14 shrink-0 items-center justify-between border-b border-slate/10 bg-white px-4 md:hidden">
          <div className="flex items-center gap-2">
            <Image src="/logo/tribleera-mark-192.png" alt="TRIBLEERA" width={28} height={28} className="rounded-md" />
            <span className="text-[13px] font-bold tracking-[0.06em] text-[#5C0427]">Vendor Portal</span>
          </div>
          <button
            type="button"
            onClick={() => setMobileMenuPath(pathname)}
            aria-label="Open navigation menu"
            className="flex h-11 w-11 items-center justify-center rounded-lg"
          >
            <Menu size={20} className="text-slate" />
          </button>
        </div>

        {mobileMenuPath === pathname && (
          <>
            <div className="fixed inset-0 z-50 bg-black/45 md:hidden" onClick={() => setMobileMenuPath(null)} />
            <div className="fixed inset-y-0 left-0 z-[51] flex w-[260px] max-w-[80vw] flex-col bg-white shadow-[4px_0_20px_rgba(0,0,0,0.15)] md:hidden">
              <div className="flex items-center justify-between border-b border-slate/10 px-4 py-3">
                <span className="text-[13px] font-bold text-[#5C0427]">Menu</span>
                <button
                  type="button"
                  onClick={() => setMobileMenuPath(null)}
                  aria-label="Close menu"
                  className="flex h-11 w-11 items-center justify-center rounded-lg text-slate"
                >
                  <span className="text-xl leading-none">×</span>
                </button>
              </div>
              <div className="border-b border-slate/10 px-4 py-3.5">
                <p className="text-xs text-slate-soft">Signed in as</p>
                <p className="mt-0.5 text-[13px] font-semibold text-slate">{vendorName}</p>
              </div>
              <nav className="flex-1 px-3 py-2">
                {NAV_ITEMS.map((item) => {
                  const active = item.href === "/dashboard/vendor" ? pathname === item.href : pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuPath(null)}
                      className={cn(
                        "mb-1 flex min-h-11 items-center gap-2.5 rounded-lg px-3 py-3 text-sm",
                        active ? "bg-[#F5EDE3] font-semibold text-[#5C0427]" : "text-[#4B5563]"
                      )}
                    >
                      <item.icon size={18} aria-hidden="true" />
                      {item.label}
                    </Link>
                  );
                })}
                <Link href="/contact" onClick={() => setMobileMenuPath(null)} className="mb-1 flex min-h-11 items-center gap-2.5 rounded-lg px-3 py-3 text-sm text-[#4B5563]">
                  <HelpCircle size={18} aria-hidden="true" />
                  Support
                </Link>
              </nav>
              <div className="border-t border-slate/10 p-3">
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="flex min-h-11 w-full items-center gap-2.5 rounded-lg px-3 py-3 text-left text-sm text-[#4B5563]"
                >
                  <LogOut size={18} aria-hidden="true" />
                  Sign out
                </button>
              </div>
            </div>
          </>
        )}

        <main className="flex-1 overflow-y-auto overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}
