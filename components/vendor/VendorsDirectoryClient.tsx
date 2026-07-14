"use client";

import { useMemo, useSyncExternalStore } from "react";
import { ShieldCheck, SearchX } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { VendorFilters } from "@/components/vendor/VendorFilters";
import { VendorCard } from "@/components/vendor/VendorCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { getCategoryBySlug, categories } from "@/lib/data/categories";
import { Vendor } from "@/types";
import { getLiveVendors, getVendorCities, getVendorCountByCategory, subscribeLiveVendors } from "@/lib/utils/liveVendors";
import { RecentlyViewedVendors } from "@/components/vendor/RecentlyViewed";
import { CompareBar } from "@/components/vendor/CompareBar";

interface SearchParams {
  category?: string;
  city?: string;
  sort?: string;
  q?: string;
  minPrice?: string;
  maxPrice?: string;
  minTrust?: string;
}

export function VendorsDirectoryClient({
  initialVendors,
  searchParams,
}: {
  initialVendors: Vendor[];
  searchParams: SearchParams;
}) {
  const liveVendors = useSyncExternalStore(subscribeLiveVendors, getLiveVendors, () => initialVendors);

  const cityOptions = useMemo(() => getVendorCities(liveVendors), [liveVendors]);
  const activeCategory = searchParams.category ? getCategoryBySlug(searchParams.category) : null;

  const results = useMemo(() => {
    let next = liveVendors.filter((vendor) => vendor.status === "approved");

    if (searchParams.category) next = next.filter((vendor) => vendor.categorySlug === searchParams.category);
    if (searchParams.city) next = next.filter((vendor) => vendor.city === searchParams.city);
    if (searchParams.q) {
      const query = searchParams.q.toLowerCase();
      next = next.filter((vendor) =>
        vendor.name.toLowerCase().includes(query) ||
        vendor.location.toLowerCase().includes(query) ||
        vendor.tagline.toLowerCase().includes(query) ||
        vendor.description.toLowerCase().includes(query) ||
        vendor.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }
    if (searchParams.minPrice) next = next.filter((vendor) => vendor.startingPrice >= Number(searchParams.minPrice));
    if (searchParams.maxPrice) next = next.filter((vendor) => vendor.startingPrice <= Number(searchParams.maxPrice));
    if (searchParams.minTrust) next = next.filter((vendor) => vendor.trustScore >= Number(searchParams.minTrust));

    if (searchParams.sort === "price-asc") return [...next].sort((a, b) => a.startingPrice - b.startingPrice);
    if (searchParams.sort === "price-desc") return [...next].sort((a, b) => b.startingPrice - a.startingPrice);
    return [...next].sort((a, b) => b.trustScore - a.trustScore);
  }, [liveVendors, searchParams]);

  return (
    <>
      <section className="relative overflow-hidden bg-ink pb-12 pt-16 md:pb-16 md:pt-20">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_30%_0%,rgba(122,31,61,0.3),transparent_60%)]" />
        <Container className="relative z-10">
          <p className="mb-3 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
            <span className="h-px w-5 bg-gold" />
            Vendor Directory
          </p>
          <h1 className="text-display-lg text-cream drop-shadow-[0_2px_12px_rgba(21,4,12,0.8)]">
            {activeCategory ? activeCategory.name : "Find your perfect match."}
          </h1>
          {activeCategory && (
            <p className="mt-2 font-display text-base italic text-gold/80">{activeCategory.name}</p>
          )}
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-cream-dim drop-shadow-[0_2px_12px_rgba(21,4,12,0.8)]">
            {activeCategory
              ? activeCategory.description
              : "All verified studios across Jaffna, Colombo and beyond — filtered by trust score, city and price."}
          </p>

          <div className="mt-6 -mx-4 flex gap-2 overflow-x-auto scrollbar-hide px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
            <Button href="/vendors" variant={!searchParams.category ? "gold" : "glass"} size="sm" className="shrink-0">
              All
            </Button>
            {categories.map((category) => (
              <Button
                key={category.slug}
                href={`/vendors?category=${category.slug}`}
                variant={searchParams.category === category.slug ? "gold" : "glass"}
                size="sm"
                className="shrink-0"
              >
                {category.name} ({getVendorCountByCategory(liveVendors, category.slug)})
              </Button>
            ))}
          </div>
        </Container>
      </section>

      <div className="border-b border-slate/8 bg-white">
        <Container className="py-3">
          <div className="flex flex-wrap items-center gap-6 text-xs text-slate-soft">
            <span className="flex items-center gap-1.5"><ShieldCheck size={13} className="text-burgundy" /> Background checked</span>
            <span className="flex items-center gap-1.5"><ShieldCheck size={13} className="text-burgundy" /> Contract signed with TRIBLEERA</span>
            <span className="flex items-center gap-1.5"><ShieldCheck size={13} className="text-burgundy" /> Insured / risk-assessed onboarding</span>
          </div>
        </Container>
      </div>

      <Container className="py-8 md:py-12">
        <RecentlyViewedVendors />
        <VendorFilters cities={cityOptions} />
        <div className="mt-8">
          <p className="text-body-sm mb-6 text-slate-soft">
            <span className="font-semibold text-slate">{results.length}</span> verified vendor{results.length !== 1 ? "s" : ""}
            {activeCategory ? ` in ${activeCategory.name}` : " across all categories"}
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
              {results.map((vendor) => <VendorCard key={vendor.id} vendor={vendor} />)}
            </div>
          )}
        </div>
      </Container>

      <CompareBar />
    </>
  );
}
