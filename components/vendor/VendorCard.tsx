"use client";

import Link from "next/link";
import { useRef } from "react";
import { ArrowUpRight, MapPin, ShieldCheck, Star } from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Vendor } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { useCompare } from "@/context/CompareContext";
import { SmartImage } from "@/components/ui/SmartImage";
import { ShortlistButton } from "@/components/vendor/ShortlistButton";
import { formatLKR } from "@/lib/utils/format";

export function VendorCard({ vendor }: { vendor: Vendor }) {
  const isTopRated = vendor.trustScore >= 4.8;
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [5, -5]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-6, 6]), { stiffness: 300, damping: 30 });
  const { add, remove, compareList, isComparing } = useCompare();
  const comparing = isComparing(vendor.slug);
  const canAddMore = compareList.length < 3;

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  }

  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformPerspective: 1000 }}
      className="group flex flex-col"
    >
      <div className="relative flex flex-col overflow-hidden rounded-[10px] border border-slate/10 bg-white shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:border-burgundy/20 hover:shadow-lift">
        <Link href={`/vendors/${vendor.slug}`} aria-label={vendor.name} className="absolute inset-0 z-0 rounded-[10px]" />
        <div className="pointer-events-none relative z-[1] aspect-[4/3] overflow-hidden">
          <div className="h-full w-full transition-transform duration-700 group-hover:scale-[1.06]">
            <SmartImage
              src={vendor.imageUrl}
              alt={`${vendor.name} - ${vendor.tagline}`}
              fallbackVariant={vendor.motif}
              fallbackTone={vendor.tone}
              fallbackSeed={vendor.id.length}
              sizes="(max-width: 640px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate/60 via-slate/5 to-transparent" />

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

          <div className="absolute right-3 top-3 z-10 flex flex-col items-end gap-2">
            <ShortlistButton
              slug={vendor.slug}
              size={16}
              className="h-8 w-8 bg-black/25 backdrop-blur-sm hover:bg-black/40"
            />
            <button
              type="button"
              aria-pressed={comparing}
              aria-label={comparing ? "Remove from compare" : "Add to compare"}
              title={!canAddMore && !comparing ? "Max 3 vendors" : undefined}
              disabled={!canAddMore && !comparing}
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                if (comparing) {
                  remove(vendor.slug);
                  return;
                }
                add(vendor.slug);
              }}
              className="pointer-events-auto rounded-full border border-white/30 bg-black/30 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur-sm transition-colors hover:bg-black/45 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Compare ({compareList.length}/3)
            </button>
          </div>

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
              <Badge key={tag} tone="slate">
                {tag}
              </Badge>
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
    </motion.div>
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
