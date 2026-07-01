"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Bell, Heart, LogIn, Menu, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
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
  useEffect(() => {
    const id = window.setTimeout(() => setMounted(true), 0);
    return () => window.clearTimeout(id);
  }, []);

  const isHome = mounted ? pathname === "/" : false;
  const homeAtTop = isHome && !scrolled;
  const homeScrolled = isHome && scrolled;

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
          : homeScrolled
            ? "border-gold/20 bg-[#15040C]/85 backdrop-blur-xl shadow-[0_2px_20px_rgba(0,0,0,0.4)]"
            : "border-slate/10 bg-white/95 backdrop-blur-md shadow-sm"
      )}
    >
      <Container className="flex h-16 items-center justify-between md:h-20">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <motion.span
            whileHover={{ scale: 1.05 }}
            animate={
              isHome
                ? {
                    boxShadow: [
                      "0 0 0 1px rgba(212,175,106,0.25), 0 4px 20px rgba(212,175,106,0.1)",
                      "0 0 0 1px rgba(212,175,106,0.5), 0 8px 30px rgba(212,175,106,0.25)",
                      "0 0 0 1px rgba(212,175,106,0.25), 0 4px 20px rgba(212,175,106,0.1)",
                    ],
                  }
                : undefined
            }
            transition={{
              duration: homeAtTop ? 3 : 0.3,
              repeat: homeAtTop ? Infinity : 0,
              ease: "easeInOut",
            }}
            className="rounded-md"
          >
            <Image
              src="/logo/tribleera-mark-192.png"
              alt="TRIBLERERA VAIBHAVAM"
              width={44}
              height={44}
              className="rounded-md"
              priority
            />
          </motion.span>
          <span className={cn("font-display text-xl font-semibold tracking-widest", isHome ? "text-white" : "text-burgundy-deep")}>
            TRIBLERERA
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-5 md:flex lg:gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-[13px] font-medium transition-colors",
                link.gold
                  ? isHome
                    ? "text-gold font-semibold hover:text-gold-light"
                    : "text-gold-deep font-semibold hover:text-burgundy"
                  : isHome
                    ? "text-white/75 hover:text-white"
                    : "text-slate/70 hover:text-burgundy"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop right section */}
        <div className="hidden items-center gap-1.5 md:flex">

          {/* Notification bell */}
          <button
            type="button"
            aria-label="View notifications, 3 unread"
            className={cn(
              "relative hidden h-9 w-9 items-center justify-center rounded-lg transition-colors lg:flex",
              isHome
                ? "text-white/70 hover:bg-white/10 hover:text-white"
                : "text-slate/60 hover:bg-burgundy/5 hover:text-burgundy"
            )}
          >
            <Bell size={18} aria-hidden="true" strokeWidth={1.75} />
            <span
              aria-hidden="true"
              className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[9px] font-bold leading-none text-burgundy-deep"
            >
              3
            </span>
          </button>

          {/* Shortlist */}
          <Link
            href="/shortlist"
            aria-label="Your shortlist"
            className={cn(
              "relative flex h-9 w-9 items-center justify-center rounded-lg transition-colors",
              isHome
                ? "text-white/70 hover:text-white hover:bg-white/10"
                : "text-slate/60 hover:text-burgundy hover:bg-burgundy/5"
            )}
          >
            <Heart size={18} strokeWidth={1.75} aria-hidden="true" />
            {slHydrated && shortlistCount > 0 && (
              <span
                aria-label={`${shortlistCount} saved vendors`}
                className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-burgundy text-[9px] font-bold leading-none text-white"
              >
                {shortlistCount}
              </span>
            )}
          </Link>

          {/* Cart */}
          <Link
            href="/booking/cart"
            aria-label="Your cart"
            className={cn(
              "relative flex h-9 w-9 items-center justify-center rounded-lg transition-colors",
              isHome
                ? "text-white/70 hover:text-white hover:bg-white/10"
                : "text-slate/60 hover:text-burgundy hover:bg-burgundy/5"
            )}
          >
            <ShoppingBag size={18} strokeWidth={1.75} aria-hidden="true" />
            {hydrated && items.length > 0 && (
              <span
                aria-label={`${items.length} items in cart`}
                className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[9px] font-bold leading-none text-burgundy-deep"
              >
                {items.length}
              </span>
            )}
          </Link>

          {/* Sign In */}
          <Link
            href="/login"
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              isHome
                ? "text-white/70 hover:bg-white/10 hover:text-white"
                : "text-slate/60 hover:bg-burgundy/5 hover:text-burgundy"
            )}
          >
            <LogIn size={15} strokeWidth={1.75} />
            Sign In
          </Link>

          {/* Divider */}
          <div className={cn("h-5 w-px", isHome ? "bg-white/15" : "bg-slate/15")} />

          {/* For Vendors */}
          <Button
            href="/vendor/register"
            variant={isHome ? "glass" : "secondary"}
            size="sm"
            className="hidden lg:inline-flex"
          >
            For Vendors
          </Button>

          {/* Primary CTA */}
          <Button
            href="/vendors"
            variant={isHome ? "gold" : "primary"}
            size="sm"
          >
            Find Vendors
          </Button>

        </div>

        {/* Mobile right */}
        <div className="flex items-center gap-3 md:hidden">
          <Sheet>
            <SheetTrigger aria-label="Open menu">
              <Menu size={24} className={isHome ? "text-white" : "text-slate"} />
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
                  { href: "/about", label: "About" },
                  { href: "/contact", label: "Contact" },
                  { href: "/faq", label: "FAQ" },
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
