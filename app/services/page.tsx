import type { Metadata } from "next";
import Link from "next/link";
import { Clock, ShieldCheck } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SmartImage } from "@/components/ui/SmartImage";
import { BackButton } from "@/components/ui/BackButton";
import { MotifArt } from "@/components/ui/MotifArt";
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
          <BackButton href="/" label="Home" dark className="mb-6" />
          <p className="mb-4 inline-flex items-center justify-center gap-2.5 text-[11.5px] font-semibold uppercase tracking-[0.22em] text-gold">
            <span className="h-px w-7 bg-gold" />
            Phase One
            <span className="h-px w-7 bg-gold" />
          </p>
          <h1 className="font-display text-[34px] font-bold leading-[1.1] text-cream md:text-[54px]" style={{ textShadow: "0 1px 12px rgba(21,4,12,0.7)" }}>
            What does your<br />celebration need?
          </h1>
          <p className="mx-auto mt-5 max-w-lg text-[15px] leading-relaxed text-cream-dim" style={{ textShadow: "0 1px 12px rgba(21,4,12,0.7)" }}>
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
            <div key={cat.slug} className="group relative overflow-hidden rounded-[10px] border border-slate/10 bg-white shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:border-burgundy/20 hover:shadow-lift">

              {/* Full-card link (invisible overlay) */}
              <Link
                href={`/vendors?category=${cat.slug}`}
                className="absolute inset-0 z-0"
                aria-label={`Browse ${cat.name} vendors`}
              />

              {/* Image */}
              <div className="relative aspect-[16/10] overflow-hidden">
                <div className="h-full w-full transition-transform duration-700 group-hover:scale-[1.06]">
                  <SmartImage
                    src={cat.imageUrl}
                    alt={cat.name}
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

              {/* Card body */}
              <div className="flex flex-col p-5">
                <h2 className="font-display text-xl text-slate transition-colors group-hover:text-burgundy">
                  {cat.name}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-soft">{cat.description}</p>
                <div className="mt-4 flex items-center justify-between border-t border-slate/8 pt-3">
                  <span className="text-xs font-semibold text-slate-soft">
                    {cat.vendorCount} verified studio{cat.vendorCount !== 1 ? "s" : ""}
                  </span>
                  <span className="relative z-10 text-xs font-semibold text-gold-deep group-hover:underline">
                    Explore →
                  </span>
                </div>
              </div>
            </div>
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
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {comingSoonCategories.map((cat, i) => (
              <div
                key={cat.slug}
                className="group relative flex flex-col overflow-hidden rounded-[10px] border border-slate/10 bg-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-gold/40 hover:shadow-lift"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <div className="h-full w-full transition-transform duration-700 group-hover:scale-[1.06]">
                    {cat.imageUrl ? (
                      <SmartImage
                        src={cat.imageUrl}
                        alt={cat.name}
                        fallbackVariant={cat.motif}
                        fallbackTone={cat.tone}
                        fallbackSeed={i}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                    ) : (
                      <MotifArt variant={cat.motif} tone={cat.tone} seed={i} label={cat.name} />
                    )}
                  </div>
                  <div
                    className="pointer-events-none absolute inset-0"
                    style={{ background: "linear-gradient(to top, rgba(21,4,12,0.82) 0%, rgba(21,4,12,0.25) 45%, transparent 75%)" }}
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-gold px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-burgundy-deep shadow-sm">
                    Coming soon
                  </span>
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="font-display text-base font-semibold text-white" style={{ textShadow: "0 1px 10px rgba(21,4,12,0.9)" }}>
                      {cat.name}
                    </h3>
                    <p className="mt-0.5 font-display text-[11px] text-gold-light/90" style={{ textShadow: "0 1px 8px rgba(21,4,12,0.8)" }}>
                      {cat.tamilName}
                    </p>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-xs leading-relaxed text-slate-soft">{cat.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}
