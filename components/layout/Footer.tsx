import Link from "next/link";
import Image from "next/image";
import { Camera, Globe2, PlayCircle } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { categories } from "@/lib/data/categories";

const COLUMNS = [
  {
    title: "Platform",
    links: [
      { href: "/services", label: "Browse services" },
      { href: "/vendors", label: "All vendors" },
      { href: "/vendor/register", label: "Register as a vendor" },
    ],
  },
  {
    title: "Phase 1 categories",
    links: categories.map((c) => ({ href: `/vendors?category=${c.slug}`, label: c.name })),
  },
  {
    title: "Support",
    links: [
      { href: "/#how-it-works", label: "How it works" },
      { href: "/trust", label: "Escrow protection" },
      { href: "/dashboard/customer", label: "Customer dashboard" },
      { href: "/booking/cart", label: "View cart" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-gold/15 bg-ink text-cream">
      <Container className="py-14 md:py-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              <Image
                src="/logo/tribleera-mark-192.png"
                alt="TRIBLEERA VAIBHAVAM"
                width={52}
                height={52}
                className="rounded-md shadow-glow"
              />
              <span className="font-display text-lg text-cream">TRIBLEERA</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-cream-faint">
              Jaffna&rsquo;s premium wedding concierge — verified photographers, decorators, bridal artists,
              cake ateliers and invitation houses, bookable with full price transparency.
            </p>
            <div className="mt-5 flex gap-3">
              {[Camera, Globe2, PlayCircle].map((Icon, i) => (
                <span
                  key={i}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-cream/15 text-cream-dim transition-colors hover:border-gold hover:text-gold"
                >
                  <Icon size={16} />
                </span>
              ))}
            </div>
          </div>
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-gold">{col.title}</p>
              <ul className="space-y-3">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm text-cream-dim hover:text-cream">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-cream/10 pt-7 text-xs text-cream-faint md:flex-row">
          <p>© 2026 Tribleera Vaibhavam, Jaffna, Sri Lanka. All rights reserved.</p>
          <p className="font-display text-sm text-cream-dim">தேர்வின் செம்மை, வைபவத்தின் பெருமை</p>
        </div>
      </Container>
    </footer>
  );
}
