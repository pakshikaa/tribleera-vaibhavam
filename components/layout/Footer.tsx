"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { categories } from "@/lib/data/categories";
import { ADMIN_LOGIN_PATH } from "@/lib/utils/adminAuth";

const COLUMNS = [
  {
    title: "Platform",
    links: [
      { href: "/services", label: "Services" },
      { href: "/vendors", label: "Vendors" },
      { href: "/vendor/register", label: "Become a vendor" },
    ],
  },
  {
    title: "Phase 1 Categories",
    links: categories.map((c) => ({ href: `/vendors?category=${c.slug}`, label: c.name })),
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About Us" },
      { href: "/contact", label: "Contact" },
      { href: "/faq", label: "FAQ" },
      { href: "/#how-it-works", label: "How It Works" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/terms", label: "Terms and Conditions" },
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/trust", label: "Trust and Safety" },
    ],
  },
] as const;

const SOCIAL = [
  {
    href: "https://wa.me/94771234567",
    label: "TRIBLEERA on WhatsApp",
    Icon: ({ size }: { size?: number }) => <MessageCircle size={size} aria-hidden="true" />,
  },
] as const;

export function Footer() {
  const pathname = usePathname();
  const PORTALS = [
    "/vendor/login",
    "/vendor/register",
    "/dashboard/vendor",
    "/dashboard/admin",
    "/admin/login",
    "/login",
  ];

  if (PORTALS.some((route) => pathname === route || pathname.startsWith(`${route}/`))) {
    return null;
  }

  return (
    <footer className="border-t border-gold/15 bg-ink text-cream">
      <Container className="py-14 md:py-20">
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 lg:grid-cols-[1.3fr_1fr_1fr_1fr_1fr] lg:gap-12">
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5">
              <Image
                src="/logo/tribleera-mark-192.png"
                alt="TRIBLEERA VAIBHAVAM"
                width={32}
                height={32}
                className="rounded-md shadow-glow"
              />
              <span className="flex flex-col items-start leading-none">
                <span className="font-display text-[16px] font-bold tracking-widest text-cream">TRIBLEERA</span>
                <span className="mt-0.5 font-display text-[9px] font-semibold tracking-[0.3em] text-gold/70">VAIBHAVAM</span>
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-cream-faint">
              Jaffna&apos;s premium wedding marketplace for verified photographers, decorators, makeup artists,
              cake studios, and invitation designers, also suited to milestone celebrations.
            </p>
            <div className="mt-5 flex gap-3">
              {SOCIAL.map(({ href, label, Icon }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-cream/15 text-cream-dim transition-colors hover:border-gold hover:text-gold"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-gold">{col.title}</p>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link href={link.href} className="text-sm text-cream-dim hover:text-cream">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-cream/10 pt-7 text-xs text-cream-faint md:flex-row">
          <p>&copy; 2026 TRIBLEERA VAIBHAVAM, Jaffna, Sri Lanka. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <p className="font-display text-sm text-cream-dim">Curated Tamil wedding services in Jaffna</p>
            <Link
              href={ADMIN_LOGIN_PATH}
              aria-label="Admin login"
              className="text-[11px] text-cream-faint opacity-20 transition-opacity hover:opacity-60"
            >
              <span aria-hidden="true">&#9881;</span>
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
