"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Home, LayoutGrid, ShoppingBag, User } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useShortlist } from "@/context/ShortlistContext";
import { cn } from "@/lib/utils/cn";

const TABS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/services", label: "Services", icon: LayoutGrid },
  { href: "/shortlist", label: "Saved", icon: Heart },
  { href: "/booking/cart", label: "Cart", icon: ShoppingBag },
  { href: "/dashboard/customer", label: "Profile", icon: User },
];

export function MobileBottomNav() {
  const pathname = usePathname();
  const { items, hydrated } = useCart();
  const { count: shortlistCount, hydrated: shortlistHydrated } = useShortlist();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate/10 bg-white/95 backdrop-blur-md md:hidden">
      <div className="flex items-center justify-between px-1 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        {TABS.map((tab) => {
          const active = tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href);
          const Icon = tab.icon;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "relative flex min-w-0 flex-1 flex-col items-center gap-1 rounded-lg px-0 py-2 text-[10px] font-medium transition-colors",
                active ? "text-burgundy" : "text-slate-soft"
              )}
            >
              <Icon size={18} strokeWidth={active ? 2.4 : 2} />
              {tab.label}
              {tab.href === "/shortlist" && shortlistHydrated && shortlistCount > 0 && (
                <span className="absolute right-3 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-burgundy text-[9px] font-bold text-white">
                  {shortlistCount}
                </span>
              )}
              {tab.href === "/booking/cart" && hydrated && items.length > 0 && (
                <span className="absolute right-3 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[9px] font-bold text-burgundy-deep">
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
