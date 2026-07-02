"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Calendar, HelpCircle, LayoutDashboard, LogOut, Menu,
  Package, User, Wallet,
} from "lucide-react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils/cn";

const NAV_ITEMS = [
  { href: "/dashboard/vendor",           label: "Overview",  icon: LayoutDashboard },
  { href: "/dashboard/vendor/bookings",  label: "Bookings",  icon: Calendar },
  { href: "/dashboard/vendor/revenue",   label: "Revenue",   icon: Wallet },
  { href: "/dashboard/vendor/profile",   label: "Profile",   icon: User },
  { href: "/dashboard/vendor/packages",  label: "Packages",  icon: Package },
];

const BOTTOM_ITEMS = [
  { href: "/contact",  label: "Support",  icon: HelpCircle },
  { href: "/",         label: "Log Out",  icon: LogOut },
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

function SidebarContent({ pathname }: { pathname: string }) {
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
        {BOTTOM_ITEMS.map((item) => (
          <NavItem key={item.href} {...item} active={false} />
        ))}
      </nav>
    </div>
  );
}

export default function VendorDashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [checked, setChecked] = useState(false);

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

  return (
    <div className="flex min-h-screen bg-[#FAF7F2]">
      {/* Desktop sidebar */}
      <aside className="hidden w-56 shrink-0 border-r border-slate/10 bg-white md:flex md:flex-col">
        <SidebarContent pathname={pathname} />
      </aside>

      {/* Main area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile top bar */}
        <div className="flex h-14 items-center justify-between border-b border-slate/10 bg-white px-4 md:hidden">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo/tribleera-mark-192.png" alt="TRIBLEERA" width={28} height={28} className="rounded-md" />
            <span className="font-display text-sm font-bold text-[#5C0427]">TRIBLEERA</span>
          </Link>
          <Sheet>
            <SheetTrigger aria-label="Open sidebar">
              <Menu size={22} className="text-slate" />
            </SheetTrigger>
            <SheetContent className="w-56 p-0">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <SidebarContent pathname={pathname} />
            </SheetContent>
          </Sheet>
        </div>

        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
