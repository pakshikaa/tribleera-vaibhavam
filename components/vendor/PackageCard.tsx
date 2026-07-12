"use client";

import Image from "next/image";
import { Check, MessageCircle, Sparkles } from "lucide-react";
import { MotifTone, MotifVariant, VendorPackage } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { MotifArt } from "@/components/ui/MotifArt";
import { cn } from "@/lib/utils/cn";
import { formatLKR } from "@/lib/utils/format";

interface PackageCardProps {
  pkg: VendorPackage;
  motif?: MotifVariant;
  tone?: MotifTone;
  seed?: number;
  selected?: boolean;
  onSelect?: () => void;
  /** When set, shows a "Request custom quote" WhatsApp CTA — many Tamil vendors negotiate. */
  quoteVendorName?: string;
}

export function PackageCard({ pkg, motif = "arch", tone = "gold", seed = 0, selected, onSelect, quoteVendorName }: PackageCardProps) {
  return (
    <div
      className={cn(
        "relative flex flex-col overflow-hidden rounded-[12px] border bg-white shadow-soft transition-all duration-300",
        pkg.recommended ? "border-gold shadow-lift md:scale-[1.02]" : "border-slate/10",
        selected && "ring-2 ring-burgundy"
      )}
    >
      <div className="relative aspect-[16/9] overflow-hidden">
        {pkg.coverImageUrl ? (
          <Image src={pkg.coverImageUrl} alt={`${pkg.name} package`} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
        ) : (
          <MotifArt variant={motif} tone={tone} seed={seed} className="h-full w-full" label={`${pkg.name} package artwork`} />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent" />
        {pkg.recommended && (
          <Badge tone="gold" icon={<Sparkles size={12} />} className="absolute left-4 top-4 z-10">
            Most booked
          </Badge>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-soft">{pkg.tier}</p>
        <h3 className="text-display-sm mt-1">{pkg.name}</h3>
        <p className="mt-2 text-sm text-slate-soft">{pkg.description}</p>
        <p className="mt-5 font-display text-2xl font-bold text-burgundy-deep">{formatLKR(pkg.price)}</p>
        {pkg.customFields && Object.keys(pkg.customFields).length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {Object.entries(pkg.customFields).map(([key, value]) =>
              value ? (
                <span key={key} className="rounded-full bg-ivory px-2.5 py-1 text-[11px] text-slate-soft">
                  {key.replace(/([A-Z])/g, " $1").replace(/-/g, " ")}: {value}
                </span>
              ) : null
            )}
          </div>
        )}
        <ul className="mt-5 flex-1 space-y-2.5">
          {pkg.inclusions.map((inclusion) => (
            <li key={inclusion} className="flex items-start gap-2 text-sm text-slate">
              <Check size={16} className="mt-0.5 shrink-0 text-success" />
              {inclusion}
            </li>
          ))}
        </ul>
        <Button variant={selected ? "primary" : pkg.recommended ? "primary" : "secondary"} className="mt-6" fullWidth onClick={onSelect}>
          {selected ? "Added to cart" : "Select this package"}
        </Button>
        {quoteVendorName && (
          <a
            href={`https://wa.me/94771234567?text=${encodeURIComponent(
              `Hi TRIBLEERA VAIBHAVAM, I'd like a custom quote for the "${pkg.name}" package (${formatLKR(pkg.price)}) from ${quoteVendorName}. My requirements are a little different.`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2.5 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold text-burgundy transition-colors hover:text-burgundy-deep"
          >
            <MessageCircle size={13} aria-hidden="true" /> Request custom quote — prices are negotiable
          </a>
        )}
      </div>
    </div>
  );
}
