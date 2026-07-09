"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Heart, LogIn, Menu, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { NotificationPanel } from "@/components/ui/NotificationPanel";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useCart } from "@/context/CartContext";
import { useShortlist } from "@/context/ShortlistContext";
import { useScrolled } from "@/hooks/use-scrolled";
import { cn } from "@/lib/utils/cn";

const NAV_LINKS = [
  { href: "/services",      label: "Services",          gold: false },
  { href: "/vendors",       label: "Vendors",           gold: false },
  { href: "/#how-it-works", label: "How it works",      gold: false },
  { href: "/event-request", label: "Plan Your Wedding", gold: true  },
];

export function Header() {
  const pathname = usePathname();
  const { items, hydrated } = useCart();
  const { count: shortlistCount, hydrated: slHydrated } = useShortlist();
  const scrolled = useScrolled(40);

  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setMounted(true); }, []);

  const isHome = mounted ? pathname === "/" : false;
  const homeAtTop = isHome && !scrolled;
  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
      className={cn(
        "z-50 border-b transition-all duration-500",
        isHome ? "fixed inset-x-0 top-0" : "sticky top-0",
        homeAtTop
          ? "border-transparent bg-transparent"
          : "border-slate/10 bg-white/95 backdrop-blur-md shadow-sm"
      )}
    >
      <Container className="flex min-h-16 items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          aria-label="TRIBLEERA VAIBHAVAM - Home"
          className="flex shrink-0 items-center gap-[9px]"
        >
          <motion.span whileHover={{ scale: 1.04 }} className="overflow-hidden rounded-[8px] border border-[rgba(212,175,106,0.25)]">
            <Image
              src="/logo/tribleera-mark-192.png"
              alt=""
              width={36}
              height={36}
              className="h-9 w-9 shrink-0 object-cover"
              priority
            />
          </motion.span>
          <span className="flex select-none flex-col leading-none">
            <span
              className={cn(
                "font-display text-[15px] font-bold tracking-[0.15em] transition-colors duration-300",
                homeAtTop ? "text-[#F7EEE2]" : "text-[#1F2937]"
              )}
            >
              TRIBLEERA
            </span>
            <span
              className={cn(
                "mt-0.5 font-display text-[8px] font-medium tracking-[0.3em] transition-colors duration-300",
                homeAtTop ? "text-[rgba(247,238,226,0.58)]" : "text-[rgba(31,41,55,0.55)]"
              )}
            >
              VAIBHAVAM
            </span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-5 md:flex lg:gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-[14px] font-medium tracking-[0.01em] transition-colors",
                link.gold
                  ? "font-semibold text-gold hover:text-gold-light"
                  : homeAtTop
                    ? "text-[#F7EEE2] hover:text-white"
                    : "text-[#1F2937] hover:text-burgundy"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop right section */}
        <div className="hidden items-center gap-1.5 md:flex">

          {/* Notification bell — desktop only */}
          <NotificationPanel
            triggerClassName={cn(
              "flex h-11 w-11 items-center justify-center rounded-lg transition-colors",
              homeAtTop
                ? "text-white/70 hover:text-white hover:bg-white/10"
                : "text-slate/60 hover:text-burgundy hover:bg-burgundy/5"
            )}
          />

          {/* Shortlist */}
          <Link
            href="/shortlist"
            aria-label="Your shortlist"
            className={cn(
              "relative flex h-11 w-11 items-center justify-center rounded-lg transition-colors",
              homeAtTop
                ? "text-white/70 hover:text-white hover:bg-white/10"
                : "text-slate/60 hover:text-burgundy hover:bg-burgundy/5"
            )}
          >
            <Heart size={18} strokeWidth={1.75} aria-hidden="true" />
            {slHydrated && shortlistCount > 0 && (
              <span
                aria-hidden="true"
                className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-burgundy text-[9px] font-bold leading-none text-white"
              >
                {shortlistCount}
              </span>
            )}
            <span className="sr-only">
              {shortlistCount > 0 ? `${shortlistCount} saved vendors` : "Your shortlist"}
            </span>
          </Link>

          {/* Cart */}
          <Link
            href="/booking/cart"
            aria-label="Your cart"
            className={cn(
              "relative flex h-11 w-11 items-center justify-center rounded-lg transition-colors",
              homeAtTop
                ? "text-white/70 hover:text-white hover:bg-white/10"
                : "text-slate/60 hover:text-burgundy hover:bg-burgundy/5"
            )}
          >
            <ShoppingBag size={18} strokeWidth={1.75} aria-hidden="true" />
            {hydrated && items.length > 0 && (
              <span
                aria-hidden="true"
                className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[9px] font-bold leading-none text-burgundy-deep"
              >
                {items.length}
              </span>
            )}
            <span className="sr-only">
              {items.length > 0 ? `${items.length} items in cart` : "Your cart"}
            </span>
          </Link>

          {/* Sign In */}
          <Link
            href="/login"
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              homeAtTop
                ? "text-white/70 hover:bg-white/10 hover:text-white"
                : "text-slate/60 hover:bg-burgundy/5 hover:text-burgundy"
            )}
          >
            <LogIn size={15} strokeWidth={1.75} />
            Sign In
          </Link>

          {/* Divider */}
          <div className={cn("h-5 w-px", homeAtTop ? "bg-white/15" : "bg-slate/15")} />

          {/* Vendor portal */}
          <Button
            href="/vendor/login"
            variant={homeAtTop ? "glass" : "secondary"}
            size="sm"
            className="hidden lg:inline-flex"
          >
            Vendor Portal
          </Button>

        </div>

        {/* Mobile right — hamburger ONLY, no bell */}
        <div className="flex items-center gap-3 md:hidden">
          <Sheet>
            <SheetTrigger aria-label="Open menu">
              <Menu size={24} className={homeAtTop ? "text-white" : "text-slate"} />
            </SheetTrigger>
            <SheetContent>
              <SheetTitle>Menu</SheetTitle>
              <nav className="mt-6 flex flex-col gap-1">
                {NAV_LINKS.map((link) => (
                  <SheetClose key={link.href} asChild>
                    <Link
                      href={link.href}
                      className={cn(
                        "rounded-md px-3 py-3 text-base font-medium text-slate hover:bg-ivory",
                        link.gold && "text-gold-deep font-semibold"
                      )}
                    >
                      {link.label}
                    </Link>
                  </SheetClose>
                ))}
                {[
                  { href: "/about",   label: "About"   },
                  { href: "/contact", label: "Contact" },
                  { href: "/faq",     label: "FAQ"     },
                ].map((link) => (
                  <SheetClose key={link.href} asChild>
                    <Link
                      href={link.href}
                      className="rounded-md px-3 py-3 text-base font-medium text-slate hover:bg-ivory hover:text-burgundy"
                    >
                      {link.label}
                    </Link>
                  </SheetClose>
                ))}
                <div className="my-2 h-px bg-slate/10" />
                <SheetClose asChild>
                  <Link
                    href="/login"
                    className="rounded-md px-3 py-3 text-base font-medium text-slate hover:bg-ivory hover:text-burgundy"
                  >
                    Sign in
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link
                    href="/vendor/login"
                    className="rounded-md px-3 py-3 text-base font-medium text-slate hover:bg-ivory border-t border-slate/10"
                  >
                    Vendor Portal
                  </Link>
                </SheetClose>
              </nav>
              <div className="my-4 h-px bg-slate/10" />
              <div className="flex flex-col gap-3">
                <Button href="/vendor/register" variant="secondary" fullWidth>
                  Register as Vendor
                </Button>
                <Button href="/vendors" variant="primary" fullWidth>
                  Find Vendors
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </Container>
    </motion.header>
  );
}
