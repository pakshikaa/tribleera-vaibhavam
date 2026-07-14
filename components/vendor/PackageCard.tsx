"use client";

import Image from "next/image";
import { Check, MessageCircle, Sparkles } from "lucide-react";
import { MotifTone, MotifVariant, VendorPackage } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { MotifArt } from "@/components/ui/MotifArt";
import { getPackageFieldMeta } from "@/lib/data/packageTemplates";
import { ADVANCE_RATE } from "@/lib/utils/booking";
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
  /** Resolves the package's stored field ids to their labels, units and icons. */
  categorySlug?: string;
}

export function PackageCard({ pkg, motif = "arch", tone = "gold", seed = 0, selected, onSelect, quoteVendorName, categorySlug }: PackageCardProps) {
  const specs = Object.entries(pkg.customFields ?? {})
    .map(([id, value]) => ({
      id,
      value,
      meta: categorySlug ? getPackageFieldMeta(categorySlug, id) : null,
    }))
    .filter((entry) => entry.value);

  const advance = Math.round(pkg.price * ADVANCE_RATE);

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
        <p className="mt-1 text-[11px] text-slate-soft">
          20% advance = <span className="font-semibold text-slate">{formatLKR(advance)}</span> · balance after the event
        </p>

        {specs.length > 0 && (
          <dl className="mt-4 space-y-2.5 border-t border-slate/8 pt-4">
            {specs.map(({ id, value, meta }) =>
              meta ? (
                <div key={id} className="flex items-start gap-2.5">
                  <span aria-hidden="true" className="shrink-0 text-[13px] leading-[1.3]">
                    {meta.icon}
                  </span>
                  <div className="min-w-0">
                    <dt className="text-[9.5px] font-medium uppercase leading-none tracking-[0.08em] text-slate-soft">
                      {meta.label}
                    </dt>
                    <dd className="mt-1 text-[12.5px] font-semibold leading-tight text-slate">
                      {value}
                      {meta.unit ? ` ${meta.unit}` : ""}
                    </dd>
                  </div>
                </div>
              ) : (
                // Unknown field id (category changed, or a legacy package) —
                // still show the value rather than dropping it silently.
                <div key={id} className="flex items-start gap-2.5">
                  <span aria-hidden="true" className="shrink-0 text-[13px] leading-[1.3]">
                    •
                  </span>
                  <dd className="text-[12.5px] font-semibold leading-tight text-slate">{value}</dd>
                </div>
              )
            )}
          </dl>
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
