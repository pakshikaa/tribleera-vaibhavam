"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutGrid, ShoppingBag, User } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { cn } from "@/lib/utils/cn";

const TABS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/services", label: "Services", icon: LayoutGrid },
  { href: "/booking/cart", label: "Cart", icon: ShoppingBag },
  { href: "/dashboard/customer", label: "Profile", icon: User },
];

export function MobileBottomNav() {
  const pathname = usePathname();
  const { items, hydrated } = useCart();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate/10 bg-white/95 backdrop-blur-md md:hidden">
      <div className="flex items-center justify-around px-2 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        {TABS.map((tab) => {
          const active = tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href);
          const Icon = tab.icon;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "relative flex flex-col items-center gap-1 rounded-lg px-4 py-1.5 text-[11px] font-medium transition-colors",
                active ? "text-burgundy" : "text-slate-soft"
              )}
            >
              <Icon size={20} strokeWidth={active ? 2.4 : 2} />
              {tab.label}
              {tab.href === "/booking/cart" && hydrated && items.length > 0 && (
                <span className="absolute right-2 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[9px] font-bold text-burgundy-deep">
                  {items.length}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
