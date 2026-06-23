"use client";

import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { useCompare } from "@/context/CompareContext";
import { useShortlist } from "@/context/ShortlistContext";
import { getVendorBySlug } from "@/lib/data/vendors";
import { formatLKR } from "@/lib/utils/format";
import type { Vendor } from "@/types";

export default function VendorsComparePage() {
  const { compareList, clear } = useCompare();
  const { add } = useShortlist();
  const vendors = compareList.map((slug) => getVendorBySlug(slug)).filter((vendor): vendor is Vendor => Boolean(vendor));

  if (vendors.length < 2) {
    return (
      <div className="bg-ivory py-16">
        <Container>
          <EmptyState
            title="Add at least 2 vendors to compare"
            description="Use the compare buttons on vendor cards to build a side-by-side shortlist."
            action={<Button href="/vendors">Browse vendors</Button>}
          />
        </Container>
      </div>
    );
  }

  const lowestPrice = Math.min(...vendors.map((vendor) => vendor.startingPrice));
  const highestTrust = Math.max(...vendors.map((vendor) => vendor.trustScore));

  return (
    <div className="bg-ink pb-16">
      <section className="border-b border-gold/10 bg-gradient-to-b from-burgundy-950 via-ink to-ink py-16">
        <Container>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gold">Compare Vendors</p>
          <h1 className="mt-4 font-display text-4xl text-cream md:text-5xl">Comparing {vendors.length} Vendors</h1>
          <p className="mt-4 max-w-2xl text-cream-dim">
            Review pricing, trust score, experience, location, and package positioning before you shortlist or book.
          </p>
        </Container>
      </section>

      <Container className="pt-10">
        <div className="overflow-x-auto rounded-[12px] border border-gold/10 bg-white shadow-soft">
          <table className="min-w-[900px] w-full">
            <thead>
              <tr className="border-b border-slate/8 bg-ivory">
                <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-soft">Field</th>
                {vendors.map((vendor) => (
                  <th key={vendor.slug} className="px-4 py-4 text-left">
                    <p className="font-display text-xl text-slate">{vendor.name}</p>
                    <p className="mt-1 text-xs text-slate-soft">{vendor.city}</p>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { label: "Category", render: (vendor: (typeof vendors)[number]) => vendor.categorySlug },
                {
                  label: "Price",
                  render: (vendor: (typeof vendors)[number]) => (
                    <span className={vendor.startingPrice === lowestPrice ? "font-semibold text-emerald-700" : ""}>
                      {formatLKR(vendor.startingPrice)}
                    </span>
                  ),
                },
                {
                  label: "Trust Score",
                  render: (vendor: (typeof vendors)[number]) => (
                    <span className={vendor.trustScore === highestTrust ? "font-semibold text-gold-deep" : ""}>
                      {vendor.trustScore.toFixed(1)}
                    </span>
                  ),
                },
                { label: "Experience", render: (vendor: (typeof vendors)[number]) => `${vendor.experienceYears} years` },
                { label: "Response Time", render: (vendor: (typeof vendors)[number]) => vendor.responseTime },
                { label: "Verified", render: (vendor: (typeof vendors)[number]) => (vendor.verified ? "Yes" : "No") },
                { label: "Location", render: (vendor: (typeof vendors)[number]) => vendor.location },
                { label: "Tags", render: (vendor: (typeof vendors)[number]) => vendor.tags.slice(0, 3).join(", ") },
                { label: "Top Package", render: (vendor: (typeof vendors)[number]) => vendor.packages[1]?.name ?? vendor.packages[0]?.name ?? "-" },
              ].map((row) => (
                <tr key={row.label} className="border-b border-slate/8 align-top last:border-b-0">
                  <td className="px-4 py-4 text-sm font-semibold text-slate">{row.label}</td>
                  {vendors.map((vendor) => (
                    <td key={`${vendor.slug}-${row.label}`} className="px-4 py-4 text-sm text-slate-soft">
                      {row.render(vendor)}
                    </td>
                  ))}
                </tr>
              ))}
              <tr>
                <td className="px-4 py-4 text-sm font-semibold text-slate">Action</td>
                {vendors.map((vendor) => (
                  <td key={`${vendor.slug}-actions`} className="px-4 py-4">
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm" variant="secondary" onClick={() => add(vendor.slug)}>
                        Add to shortlist
                      </Button>
                      <Button size="sm" href={`/vendors/${vendor.slug}/packages`}>
                        Book this vendor
                      </Button>
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mt-5">
          <Button variant="glass" size="sm" onClick={clear}>
            Clear compare list
          </Button>
        </div>
      </Container>
    </div>
  );
}
