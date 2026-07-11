"use client";

import { Heart, Scale } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { VendorCard, VendorCardSkeleton } from "@/components/vendor/VendorCard";
import { CompareTable } from "@/components/vendor/CompareTable";
import { BackButton } from "@/components/ui/BackButton";
import { useShortlist } from "@/context/ShortlistContext";
import { vendors } from "@/lib/data/vendors";

export function ShortlistPageClient() {
  const { slugs, hydrated } = useShortlist();
  const saved = vendors.filter((v) => slugs.includes(v.slug));

  return (
    <div className="bg-ivory">
      <section className="relative overflow-hidden bg-ink py-16 md:py-22">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_30%_0%,rgba(122,31,61,0.3),transparent_60%)]" />
        <Container className="relative z-10">
          <BackButton href="/vendors" label="Vendors" dark className="mb-4" />
          <p className="mb-3 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
            <span className="h-px w-5 bg-gold" />
            Your Priority List
          </p>
          <h1 className="font-display text-[30px] font-bold leading-[1.15] text-cream md:text-[46px]">
            Vendors you love.
          </h1>
          <p className="mt-3 text-[15px] text-cream-dim">
            {hydrated && saved.length > 0
              ? `${saved.length} studio${saved.length !== 1 ? "s" : ""} saved — compare and book when ready.`
              : "Save vendors from any listing by tapping the heart icon."}
          </p>
        </Container>
      </section>

      <Container className="py-10 md:py-14">
        {!hydrated ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => <VendorCardSkeleton key={i} />)}
          </div>
        ) : saved.length === 0 ? (
          <EmptyState
            icon={<Heart size={32} />}
            title="No vendors saved yet"
            description="Browse vendors and tap the ♡ heart icon on any card to save them here for easy comparison."
            action={<Button href="/vendors">Browse vendors</Button>}
          />
        ) : (
          <>
            {saved.length >= 2 && (
              <section aria-label="Compare shortlisted vendors" className="mb-10">
                <p className="mb-3 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-soft">
                  <Scale size={12} aria-hidden="true" /> Side-by-side comparison
                  {saved.length > 4 && <span className="normal-case tracking-normal">(first 4 shown)</span>}
                </p>
                <CompareTable vendors={saved} />
              </section>
            )}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {saved.map((v) => <VendorCard key={v.id} vendor={v} />)}
            </div>
          </>
        )}
      </Container>
    </div>
  );
}
