"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { History, MapPin } from "lucide-react";
import { SmartImage } from "@/components/ui/SmartImage";
import { vendors } from "@/lib/data/vendors";
import { readRecentlyViewed, recordRecentlyViewed } from "@/lib/utils/recently-viewed";
import { formatLKR } from "@/lib/utils/format";

/** Mount on a vendor profile to record the visit. Renders nothing. */
export function RecentlyViewedTracker({ vendorSlug }: { vendorSlug: string }) {
  useEffect(() => {
    recordRecentlyViewed(vendorSlug);
  }, [vendorSlug]);
  return null;
}

/** Compact "pick up where you left off" strip for the vendors listing. */
export function RecentlyViewedVendors({ excludeSlug }: { excludeSlug?: string }) {
  const [slugs, setSlugs] = useState<string[]>([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSlugs(readRecentlyViewed());
  }, []);

  const recent = slugs
    .filter((slug) => slug !== excludeSlug)
    .map((slug) => vendors.find((v) => v.slug === slug))
    .filter((v): v is (typeof vendors)[number] => Boolean(v))
    .slice(0, 6);

  if (recent.length === 0) return null;

  return (
    <section aria-label="Recently viewed vendors" className="mb-8">
      <p className="mb-3 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-soft">
        <History size={12} aria-hidden="true" /> Recently viewed
      </p>
      <div className="scrollbar-hide -mx-1 flex gap-3 overflow-x-auto px-1 pb-1">
        {recent.map((vendor) => (
          <Link
            key={vendor.slug}
            href={`/vendors/${vendor.slug}`}
            className="flex w-[220px] shrink-0 items-center gap-3 rounded-[8px] border border-slate/10 bg-white p-2.5 shadow-soft transition-all hover:-translate-y-0.5 hover:border-burgundy/25"
          >
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-[6px]">
              <SmartImage
                src={vendor.imageUrl}
                alt={vendor.name}
                fallbackVariant={vendor.motif}
                fallbackTone={vendor.tone}
                fallbackSeed={vendor.id.length}
                sizes="48px"
              />
            </div>
            <div className="min-w-0">
              <p className="truncate text-[13px] font-semibold text-slate">{vendor.name}</p>
              <p className="mt-0.5 flex items-center gap-1 truncate text-[11px] text-slate-soft">
                <MapPin size={9} aria-hidden="true" /> {vendor.city} · {formatLKR(vendor.startingPrice)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
