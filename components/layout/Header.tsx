"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { Menu, ShoppingBag, LayoutDashboard, ChevronDown, Heart } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Sheet, SheetTrigger, SheetContent, SheetTitle, SheetClose } from "@/components/ui/sheet";
import { useCart } from "@/context/CartContext";
import { useShortlist } from "@/context/ShortlistContext";
import { useScrolled } from "@/hooks/use-scrolled";
import { cn } from "@/lib/utils/cn";

const NAV_LINKS = [
  { href: "/services", label: "Services" },
  { href: "/vendors", label: "Vendors" },
  { href: "/#how-it-works", label: "How it works" },
];

const DASHBOARD_LINKS = [
  { href: "/dashboard/customer", label: "Customer dashboard" },
  { href: "/dashboard/vendor", label: "Vendor dashboard" },
  { href: "/dashboard/admin", label: "Admin dashboard" },
];

export function Header() {
  const pathname = usePathname();
  const { items, hydrated } = useCart();
  const { count: shortlistCount, hydrated: slHydrated } = useShortlist();
  const [dashOpen, setDashOpen] = useState(false);
  const isHome = pathname === "/";
  const scrolled = useScrolled(40);

  // Marketing surface (home, transparent-over-hero, then glass-dark on scroll)
  // vs. utility surface (every other page, always solid light glass).
  const dark = isHome;
  const solid = !isHome || scrolled;

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
      className={cn(
        "sticky top-0 z-50 border-b transition-colors duration-500",
        dark
          ? solid
            ? "border-gold/15 bg-ink/80 backdrop-blur-xl"
            : "border-white/0 bg-transparent"
          : "border-slate/8 bg-ivory/90 backdrop-blur-md"
      )}
    >
      <Container className="flex h-16 items-center justify-between md:h-20">
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <motion.span whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
            <Image
              src="/logo/tribleera-mark-192.png"
              alt="TRIBLEERA VAIBHAVAM"
              width={44}
              height={44}
              className={cn("rounded-md", dark && "shadow-glow")}
              priority
            />
          </motion.span>
          <span
            className={cn(
              "font-display text-lg tracking-wide md:text-xl",
              dark ? "text-cream" : "text-burgundy-deep"
            )}
          >
            TRIBLEERA
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "relative text-sm font-medium transition-colors after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-gold after:transition-all after:duration-300 hover:after:w-full",
                dark ? "text-cream-dim hover:text-cream" : "text-slate-soft hover:text-burgundy"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <div className="relative">
            <button
              onClick={() => setDashOpen((o) => !o)}
              onBlur={() => setTimeout(() => setDashOpen(false), 150)}
              className={cn(
                "flex items-center gap-1.5 text-sm font-medium transition-colors",
                dark ? "text-cream-dim hover:text-cream" : "text-slate-soft hover:text-burgundy"
              )}
            >
              <LayoutDashboard size={16} />
              Dashboards
              <ChevronDown size={14} className={cn("transition-transform", dashOpen && "rotate-180")} />
            </button>
            {dashOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-lg border border-slate/10 bg-white py-1.5 shadow-lift animate-scale-in">
                {DASHBOARD_LINKS.map((d) => (
                  <Link
                    key={d.href}
                    href={d.href}
                    className="block px-4 py-2.5 text-sm text-slate hover:bg-ivory hover:text-burgundy"
                  >
                    {d.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link
            href="/shortlist"
            aria-label="Your shortlist"
            className={cn(
              "relative flex items-center transition-colors",
              dark ? "text-cream-dim hover:text-cream" : "text-slate-soft hover:text-burgundy"
            )}
          >
            <Heart size={18} />
            {slHydrated && shortlistCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-burgundy text-[9px] font-bold text-white">
                {shortlistCount}
              </span>
            )}
          </Link>

          <Link
            href="/booking/cart"
            className={cn(
              "relative flex items-center gap-1.5 text-sm font-medium transition-colors",
              dark ? "text-cream-dim hover:text-cream" : "text-slate-soft hover:text-burgundy"
            )}
          >
            <ShoppingBag size={18} />
            {hydrated && items.length > 0 && (
              <span className="absolute -right-2.5 -top-2 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-gold text-[10px] font-bold text-burgundy-deep">
                {items.length}
              </span>
            )}
          </Link>

          <Button href="/vendor/register" variant={dark ? "glass" : "secondary"} size="sm">
            For Vendors
          </Button>
          <Button href="/services" variant={dark ? "gold" : "primary"} size="sm">
            Start Planning
          </Button>
        </div>

        <div className="flex items-center gap-4 md:hidden">
          <Link href="/booking/cart" className="relative">
            <ShoppingBag size={22} className={dark ? "text-cream" : "text-slate"} />
            {hydrated && items.length > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-gold text-[10px] font-bold text-burgundy-deep">
                {items.length}
              </span>
            )}
          </Link>
          <Sheet>
            <SheetTrigger aria-label="Open menu">
              <Menu size={24} className={dark ? "text-cream" : "text-slate"} />
            </SheetTrigger>
            <SheetContent>
              <SheetTitle className="mb-8">Menu</SheetTitle>
              <nav className="flex flex-col gap-1">
                {NAV_LINKS.map((link) => (
                  <SheetClose key={link.href} asChild>
                    <Link href={link.href} className="rounded-md px-3 py-3 text-base font-medium text-slate hover:bg-white">
                      {link.label}
                    </Link>
                  </SheetClose>
                ))}
                <div className="my-3 h-px bg-slate/10" />
                <p className="px-3 pb-1 text-xs font-semibold uppercase tracking-wide text-slate-soft">
                  Demo dashboards
                </p>
                {DASHBOARD_LINKS.map((d) => (
                  <SheetClose key={d.href} asChild>
                    <Link href={d.href} className="rounded-md px-3 py-3 text-base font-medium text-slate hover:bg-white">
                      {d.label}
                    </Link>
                  </SheetClose>
                ))}
              </nav>
              <div className="mt-auto flex flex-col gap-3">
                <Button href="/vendor/register" variant="secondary" fullWidth>
                  Register as Vendor
                </Button>
                <Button href="/services" variant="primary" fullWidth>
                  Start Planning
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </Container>
    </motion.header>
  );
}
