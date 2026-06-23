import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock, ShieldCheck } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SmartImage } from "@/components/ui/SmartImage";
import { MotifArt } from "@/components/ui/MotifArt";
import { Badge } from "@/components/ui/Badge";
import { categories, comingSoonCategories } from "@/lib/data/categories";

export const metadata: Metadata = {
  title: "Wedding Services",
  description: "Explore TRIBLEERA VAIBHAVAM's Phase 1 wedding services in Jaffna — photography, cakes, decoration, bridal makeup and invitations.",
};

export default function ServicesPage() {
  return (
    <div className="bg-ivory">
      {/* Dark-luxury page hero — consistent with homepage brand */}
      <section className="relative overflow-hidden bg-ink py-20 md:py-28">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_50%_0%,rgba(122,31,61,0.35),transparent_65%)]" />
          <svg className="absolute -right-20 top-0 h-[420px] w-[420px] text-gold/[0.08]" viewBox="0 0 200 200" fill="none">
            <path d="M40 180 V100 C40 50 65 15 100 15 C135 15 160 50 160 100 V180" stroke="currentColor" strokeWidth="5" />
            <path d="M62 180 V104 C62 68 78 38 100 38 C122 38 138 68 138 104 V180" stroke="currentColor" strokeWidth="5" />
          </svg>
        </div>
        <Container className="relative z-10 text-center">
          <p className="mb-4 inline-flex items-center justify-center gap-2.5 text-[11.5px] font-semibold uppercase tracking-[0.22em] text-gold">
            <span className="h-px w-7 bg-gold" />
            Phase One
            <span className="h-px w-7 bg-gold" />
          </p>
          <h1 className="font-display text-[34px] font-bold leading-[1.1] text-cream md:text-[54px]">
            What does your<br />celebration need?
          </h1>
          <p className="mx-auto mt-5 max-w-lg text-[15px] leading-relaxed text-cream-dim">
            Five curated service categories — each hand-vetted for craftsmanship, cultural understanding
            and reliability. Choose a category to see matching Jaffna studios.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-4 text-xs text-cream-faint">
            <span className="flex items-center gap-1.5"><ShieldCheck size={13} className="text-gold" /> Every vendor background-checked</span>
            <span className="text-cream/20">·</span>
            <span className="flex items-center gap-1.5"><ShieldCheck size={13} className="text-gold" /> Advance held in escrow</span>
            <span className="text-cream/20">·</span>
            <span className="flex items-center gap-1.5"><ShieldCheck size={13} className="text-gold" /> Transparent pricing</span>
          </div>
        </Container>
      </section>

      {/* Category grid */}
      <Container className="py-14 md:py-20">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat, i) => (
            <Link
              key={cat.slug}
              href={`/vendors?category=${cat.slug}`}
              className="group flex flex-col overflow-hidden rounded-[10px] border border-slate/10 bg-white shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:border-burgundy/20 hover:shadow-lift"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <div className="h-full w-full transition-transform duration-700 group-hover:scale-[1.06]">
                  <SmartImage
                    src={cat.imageUrl}
                    alt={cat.description}
                    fallbackVariant={cat.motif}
                    fallbackTone={cat.tone}
                    fallbackSeed={i}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate/50 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-4">
                  <p className="font-display text-sm italic text-white/80">{cat.tamilName}</p>
                </div>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-start justify-between gap-2">
                  <h2 className="font-display text-xl text-slate group-hover:text-burgundy">{cat.name}</h2>
                  <ArrowRight size={18} className="mt-1 shrink-0 text-gold-deep opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100" />
                </div>
                <p className="mt-2.5 flex-1 text-sm leading-relaxed text-slate-soft">{cat.description}</p>
                <div className="mt-4 flex items-center justify-between border-t border-slate/8 pt-3">
                  <span className="text-xs font-semibold text-slate-soft">{cat.vendorCount} verified studio{cat.vendorCount !== 1 ? "s" : ""}</span>
                  <span className="text-xs font-semibold text-gold-deep group-hover:underline">Explore →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Coming soon */}
        <div className="mt-16 rounded-[10px] border border-slate/8 bg-white p-8 md:p-10">
          <div className="flex items-center gap-2.5">
            <Clock size={18} className="text-gold-deep" />
            <h2 className="font-display text-xl text-slate">Coming soon to TRIBLEERA</h2>
          </div>
          <p className="mt-1.5 max-w-xl text-sm text-slate-soft">
            We&rsquo;re onboarding vetted vendors in these categories next. Register as a vendor to be first in line.
          </p>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {comingSoonCategories.map((cat, i) => (
              <div key={cat.slug} className="relative flex flex-col overflow-hidden rounded-[8px] border border-slate/8 bg-ivory opacity-80">
                <div className="relative aspect-[16/10] overflow-hidden grayscale">
                  <MotifArt variant={cat.motif} tone={cat.tone} seed={i} label={cat.name} />
                </div>
                <div className="p-4">
                  <div className="mb-1.5">
                    <Badge tone="slate">Coming soon</Badge>
                  </div>
                  <h3 className="font-display text-base text-slate">{cat.name}</h3>
                  <p className="mt-1 text-xs text-slate-soft">{cat.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}
