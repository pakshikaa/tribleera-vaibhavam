"use client";

import { Check, Sparkles } from "lucide-react";
import { VendorPackage } from "@/types";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { formatLKR } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";

export function PackageCard({
  pkg,
  selected,
  onSelect,
}: {
  pkg: VendorPackage;
  selected?: boolean;
  onSelect?: () => void;
}) {
  return (
    <div
      className={cn(
        "relative flex flex-col rounded-[8px] border bg-white p-6 shadow-soft transition-all duration-300",
        pkg.recommended ? "border-gold shadow-lift md:scale-[1.02]" : "border-slate/10",
        selected && "ring-2 ring-burgundy"
      )}
    >
      {pkg.recommended && (
        <Badge tone="gold" icon={<Sparkles size={12} />} className="absolute -top-3 left-6">
          Most booked
        </Badge>
      )}
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-soft">{pkg.tier}</p>
      <h3 className="mt-1 font-display text-2xl">{pkg.name}</h3>
      <p className="mt-2 text-sm text-slate-soft">{pkg.description}</p>
      <p className="mt-5 font-display text-3xl text-burgundy-deep">{formatLKR(pkg.price)}</p>
      <ul className="mt-5 flex-1 space-y-2.5">
        {pkg.inclusions.map((inc) => (
          <li key={inc} className="flex items-start gap-2 text-sm text-slate">
            <Check size={16} className="mt-0.5 shrink-0 text-success" />
            {inc}
          </li>
        ))}
      </ul>
      <Button
        variant={selected ? "primary" : pkg.recommended ? "primary" : "secondary"}
        className="mt-6"
        fullWidth
        onClick={onSelect}
      >
        {selected ? "Added to cart" : "Select this package"}
      </Button>
    </div>
  );
}
