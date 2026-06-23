"use client";

import Link from "next/link";
import { MapPin, ShieldCheck, Star, ArrowUpRight } from "lucide-react";
import { Vendor } from "@/types";
import { SmartImage } from "@/components/ui/SmartImage";
import { Badge } from "@/components/ui/Badge";
import { formatLKR } from "@/lib/utils/format";
import { ShortlistButton } from "@/components/vendor/ShortlistButton";

export function VendorCard({ vendor }: { vendor: Vendor }) {
  const isTopRated = vendor.trustScore >= 4.8;
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-[10px] border border-slate/10 bg-white shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:border-burgundy/20 hover:shadow-lift">
      <Link
        href={`/vendors/${vendor.slug}`}
        aria-label={vendor.name}
        className="absolute inset-0 z-0 rounded-[10px]"
      />
      <div className="pointer-events-none relative z-[1] aspect-[4/3] overflow-hidden">
        <div className="h-full w-full transition-transform duration-700 group-hover:scale-[1.06]">
          <SmartImage
            src={vendor.imageUrl}
            alt={`${vendor.name} — ${vendor.tagline}`}
            fallbackVariant={vendor.motif}
            fallbackTone={vendor.tone}
            fallbackSeed={vendor.id.length}
            sizes="(max-width: 640px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate/60 via-slate/5 to-transparent" />

        {/* Top badges */}
        <div className="absolute left-3 top-3 flex gap-1.5">
          {vendor.verified && (
            <span className="flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[10.5px] font-semibold text-burgundy shadow-sm backdrop-blur-sm">
              <ShieldCheck size={11} /> Verified
            </span>
          )}
          {isTopRated && (
            <span className="rounded-full bg-gold px-2.5 py-1 text-[10.5px] font-bold text-burgundy-deep shadow-sm">
              ★ Top rated
            </span>
          )}
        </div>

        {/* Shortlist button */}
        <ShortlistButton
          slug={vendor.slug}
          size={16}
          className="absolute right-3 top-3 z-10 h-8 w-8 bg-black/25 backdrop-blur-sm hover:bg-black/40"
        />

        {/* Bottom overlay */}
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
          <div>
            <p className="font-display text-sm font-semibold text-white">{vendor.name}</p>
            <p className="mt-0.5 flex items-center gap-1 text-[11px] text-white/70">
              <MapPin size={10} /> {vendor.location}
            </p>
          </div>
          <div className="flex items-center gap-1 rounded-full bg-white/15 px-2 py-1 backdrop-blur-sm">
            <Star size={11} className="fill-gold text-gold" />
            <span className="text-[11px] font-semibold text-white">{vendor.trustScore.toFixed(1)}</span>
          </div>
        </div>
      </div>

      <div className="pointer-events-none relative z-[1] flex flex-1 flex-col p-4 md:p-5">
        <p className="line-clamp-2 text-sm leading-relaxed text-slate-soft">{vendor.tagline}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {vendor.tags.slice(0, 2).map((tag) => (
            <Badge key={tag} tone="slate">{tag}</Badge>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-slate/8 pt-3">
          <div>
            <p className="text-[10px] uppercase tracking-wide text-slate-soft">Starting at</p>
            <p className="font-display text-lg font-semibold text-burgundy-deep">{formatLKR(vendor.startingPrice)}</p>
          </div>
          <span className="flex items-center gap-1 text-xs font-semibold text-burgundy opacity-0 transition-opacity group-hover:opacity-100">
            View packages <ArrowUpRight size={13} />
          </span>
        </div>
      </div>
    </div>
  );
}

export function VendorCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-[10px] border border-slate/8 bg-white shadow-soft">
      <div className="relative aspect-[4/3] animate-pulse bg-ivory-deep" />
      <div className="space-y-3 p-4 md:p-5">
        <div className="h-4 w-2/3 animate-pulse rounded bg-ivory-deep" />
        <div className="h-3 w-full animate-pulse rounded bg-ivory-deep" />
        <div className="h-8 w-full animate-pulse rounded bg-ivory-deep" />
      </div>
    </div>
  );
}
