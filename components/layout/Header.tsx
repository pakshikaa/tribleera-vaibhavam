"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Heart, Menu, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { NotificationPanel } from "@/components/ui/NotificationPanel";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useCart } from "@/context/CartContext";
import { useShortlist } from "@/context/ShortlistContext";
import { useScrolled } from "@/hooks/use-scrolled";
import { cn } from "@/lib/utils/cn";

const NAV_LINKS = [
  { href: "/services", label: "Services" },
  { href: "/vendors", label: "Vendors" },
  { href: "/#how-it-works", label: "How it works" },
  { href: "/event-request", label: "Plan Your Wedding", accent: true },
  { href: "/dashboard/customer", label: "Sign In" },
];

export function Header() {
  const pathname = usePathname();
  const { items, hydrated } = useCart();
  const { count: shortlistCount, hydrated: slHydrated } = useShortlist();
  const isHome = pathname === "/";
  const scrolled = useScrolled(40);
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
              alt="TRIBLEERA VAIBHAVAM"
              width={44}
              height={44}
              className="rounded-md"
              priority
            />
          </motion.span>
          <span className={cn("font-display text-xl font-semibold tracking-widest", isHome ? "text-white" : "text-burgundy-deep")}>
            TRIBLEERA
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "relative text-[13px] font-medium tracking-wide transition-colors after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-gold after:transition-all after:duration-300 hover:after:w-full",
                link.accent
                  ? isHome
                    ? "text-gold font-semibold hover:text-gold-light"
                    : "text-gold-deep font-semibold hover:text-burgundy"
                  : isHome
                    ? "text-white/80 font-medium hover:text-white"
                    : "text-slate/80 font-medium hover:text-burgundy"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <NotificationPanel
            triggerClassName={cn(
              isHome ? "text-white/80 hover:bg-white/10 hover:text-white" : "text-slate/70 hover:bg-burgundy/5 hover:text-burgundy"
            )}
          />
          <Link
            href="/shortlist"
            aria-label="Your shortlist"
            className={cn(
              "relative rounded-lg p-2 transition-colors",
              isHome ? "text-white/80 hover:bg-white/10 hover:text-white" : "text-slate/70 hover:bg-burgundy/5 hover:text-burgundy"
            )}
          >
            <Heart size={20} strokeWidth={1.75} />
            {slHydrated && shortlistCount > 0 && (
              <span className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-burgundy text-[9px] font-bold text-white">
                {shortlistCount}
              </span>
            )}
          </Link>

          <Link
            href="/booking/cart"
            aria-label="Your cart"
            className={cn(
              "relative rounded-lg p-2 transition-colors",
              isHome ? "text-white/80 hover:bg-white/10 hover:text-white" : "text-slate/70 hover:bg-burgundy/5 hover:text-burgundy"
            )}
          >
            <ShoppingBag size={20} strokeWidth={1.75} />
            {hydrated && items.length > 0 && (
              <span className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[9px] font-bold text-burgundy-deep">
                {items.length}
              </span>
            )}
          </Link>

          <div className={cn("mx-2 h-5 w-px", isHome ? "bg-white/25" : "bg-slate/20")} />

          <Button
            href="/vendor/register"
            variant={isHome ? "glass" : "secondary"}
            size="sm"
            className={
              isHome
                ? "rounded-[4px] border border-white/40 px-4 py-2 text-sm font-semibold text-white hover:border-white/60 hover:bg-white/10"
                : undefined
            }
          >
            For Vendors
          </Button>
          <Button href="/services" variant="gold" size="sm">
            Start Planning
          </Button>
        </div>

        <div className="flex items-center gap-4 md:hidden">
          <NotificationPanel
            triggerClassName={cn(
              "relative",
              isHome ? "text-white hover:text-white" : "text-slate hover:text-burgundy"
            )}
          />
          <Link href="/booking/cart" aria-label="Your cart" className="relative">
            <ShoppingBag size={22} className={isHome ? "text-white" : "text-slate"} />
            {hydrated && items.length > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-gold text-[10px] font-bold text-burgundy-deep">
                {items.length}
              </span>
            )}
          </Link>
          <Sheet>
            <SheetTrigger aria-label="Open menu">
              <Menu size={24} className={isHome ? "text-white" : "text-slate"} />
            </SheetTrigger>
            <SheetContent>
              <SheetTitle className="mb-8">Menu</SheetTitle>
              <nav className="flex flex-col gap-1">
                {NAV_LINKS.map((link) => (
                  <SheetClose key={link.href} asChild>
                    <Link
                      href={link.href}
                      className={cn(
                        "rounded-md px-3 py-3 text-[15px] font-medium hover:bg-white",
                        link.accent ? "text-burgundy" : "text-slate"
                      )}
                    >
                      {link.label}
                    </Link>
                  </SheetClose>
                ))}
                <div className="my-3 h-px bg-slate/10" />
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
