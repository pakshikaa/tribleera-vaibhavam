import type { Metadata } from "next";
import { Suspense } from "react";
import { Container } from "@/components/ui/Container";
import { VendorFilters } from "@/components/vendor/VendorFilters";
import { VendorCard, VendorCardSkeleton } from "@/components/vendor/VendorCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { vendors } from "@/lib/data/vendors";
import { getCategoryBySlug, categories } from "@/lib/data/categories";
import { ShieldCheck, SearchX } from "lucide-react";

export const metadata: Metadata = {
  title: "Browse Vendors",
  description:
    "Search verified Tamil wedding vendors by category, city and budget on TRIBLEERA VAIBHAVAM — Jaffna's premium wedding marketplace.",
  openGraph: {
    title: "Find Your Wedding Vendors | TRIBLEERA VAIBHAVAM",
    description:
      "25+ verified studios across Jaffna, Colombo and beyond. Filter by category, budget and trust score.",
    url: "/vendors",
  },
};

interface SearchParams { category?: string; city?: string; sort?: string; q?: string; minPrice?: string; maxPrice?: string; minTrust?: string; }

function VendorResults({ searchParams }: { searchParams: SearchParams }) {
  let results = vendors.filter((v) => v.status === "approved");
  if (searchParams.category) results = results.filter((v) => v.categorySlug === searchParams.category);
  if (searchParams.city) results = results.filter((v) => v.city === searchParams.city);
  if (searchParams.q) {
    const q = searchParams.q.toLowerCase();
    results = results.filter((v) =>
      v.name.toLowerCase().includes(q) ||
      v.location.toLowerCase().includes(q) ||
      v.tagline.toLowerCase().includes(q) ||
      v.description.toLowerCase().includes(q) ||
      v.tags.some((t) => t.toLowerCase().includes(q))
    );
  }
  if (searchParams.minPrice) results = results.filter((v) => v.startingPrice >= Number(searchParams.minPrice));
  if (searchParams.maxPrice) results = results.filter((v) => v.startingPrice <= Number(searchParams.maxPrice));
  if (searchParams.minTrust) results = results.filter((v) => v.trustScore >= Number(searchParams.minTrust));

  if (searchParams.sort === "price-asc") results = [...results].sort((a, b) => a.startingPrice - b.startingPrice);
  else if (searchParams.sort === "price-desc") results = [...results].sort((a, b) => b.startingPrice - a.startingPrice);
  else results = [...results].sort((a, b) => b.trustScore - a.trustScore);

  const categoryLabel = searchParams.category ? getCategoryBySlug(searchParams.category)?.name : null;

  return (
    <>
      <p className="text-body-sm mb-6 text-slate-soft">
        <span className="font-semibold text-slate">{results.length}</span> verified vendor{results.length !== 1 ? "s" : ""}
        {categoryLabel ? ` in ${categoryLabel}` : " across all categories"}
      </p>
      {results.length === 0 ? (
        <EmptyState
          icon={<SearchX size={32} />}
          title="No vendors match those filters"
          description="Try clearing a filter or searching a different city."
          action={<Button href="/vendors" variant="secondary">Clear all filters</Button>}
        />
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((v) => <VendorCard key={v.id} vendor={v} />)}
        </div>
      )}
    </>
  );
}

export default async function VendorsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;  const activeCat = params.category ? getCategoryBySlug(params.category) : null;

  return (
    <div className="bg-ivory">
      {/* Dark-luxury hero banner */}
      <section className="relative overflow-hidden bg-ink pb-12 pt-16 md:pb-16 md:pt-20">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_30%_0%,rgba(122,31,61,0.3),transparent_60%)]" />
        <Container className="relative z-10">
          <p className="mb-3 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
            <span className="h-px w-5 bg-gold" />
            Vendor Directory
          </p>
          <h1 className="text-display-lg text-cream drop-shadow-[0_2px_12px_rgba(21,4,12,0.8)]">
            {activeCat ? activeCat.name : "Find your perfect match."}
          </h1>
          {activeCat && (
            <p className="mt-2 font-display text-base italic text-gold/80">{activeCat.name}</p>
          )}
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-cream-dim drop-shadow-[0_2px_12px_rgba(21,4,12,0.8)]">
            {activeCat ? activeCat.description : "All verified studios across Jaffna, Colombo and beyond — filtered by trust score, city and price."}
          </p>

          {/* Quick category pills */}
          <div className="mt-6 -mx-4 flex gap-2 overflow-x-auto scrollbar-hide px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
            <Button href="/vendors" variant={!params.category ? "gold" : "glass"} size="sm" className="shrink-0">
              All
            </Button>
            {categories.map((c) => (
              <Button
                key={c.slug}
                href={`/vendors?category=${c.slug}`}
                variant={params.category === c.slug ? "gold" : "glass"}
                size="sm"
                className="shrink-0"
              >
                {c.name} ({vendors.filter((v) => v.categorySlug === c.slug && v.status === "approved").length})
              </Button>
            ))}
          </div>
        </Container>
      </section>

      {/* Trust strip */}
      <div className="border-b border-slate/8 bg-white">
        <Container className="py-3">
          <div className="flex flex-wrap items-center gap-6 text-xs text-slate-soft">
            <span className="flex items-center gap-1.5"><ShieldCheck size={13} className="text-burgundy" /> All vendors background-verified</span>
            <span className="flex items-center gap-1.5"><ShieldCheck size={13} className="text-burgundy" /> Advance held in TRIBLEERA escrow</span>
            <span className="flex items-center gap-1.5"><ShieldCheck size={13} className="text-burgundy" /> Transparent pricing — no hidden fees</span>
          </div>
        </Container>
      </div>

      <Container className="py-8 md:py-12">
        <VendorFilters />
        <div className="mt-8">
          <Suspense
            fallback={
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => <VendorCardSkeleton key={i} />)}
              </div>
            }
          >
            <VendorResults searchParams={params} />
          </Suspense>
        </div>
      </Container>
    </div>
  );
}
