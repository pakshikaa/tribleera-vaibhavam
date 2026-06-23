"use client";

import Link from "next/link";
import { Trash2 } from "lucide-react";
import { BookingLineItem } from "@/types";
import { SmartImage } from "@/components/ui/SmartImage";
import { Badge } from "@/components/ui/Badge";
import { formatLKR } from "@/lib/utils/format";
import { getCategoryBySlug } from "@/lib/data/categories";
import { getVendorBySlug } from "@/lib/data/vendors";

export function CartItemCard({ item, onRemove }: { item: BookingLineItem; onRemove: () => void }) {
  const category = getCategoryBySlug(item.categorySlug);
  const vendor = getVendorBySlug(item.vendorId);

  return (
    <div className="flex gap-4 rounded-[8px] border border-slate/8 bg-white p-4 shadow-soft">
      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg md:h-24 md:w-24">
        {vendor && (
          <SmartImage
            src={vendor.imageUrl}
            alt={vendor.name}
            fallbackVariant={vendor.motif}
            fallbackTone={vendor.tone}
            fallbackSeed={vendor.id.length}
            sizes="96px"
          />
        )}
      </div>
      <div className="flex flex-1 flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gold-deep">{category?.name}</p>
              <Link href={`/vendors/${item.vendorId}`} className="font-display text-base text-slate hover:text-burgundy md:text-lg">
                {item.vendorName}
              </Link>
            </div>
            <button onClick={onRemove} aria-label="Remove from cart" className="text-slate-soft hover:text-danger">
              <Trash2 size={18} />
            </button>
          </div>
          <Badge tone="slate" className="mt-1.5">
            {item.packageName} package
          </Badge>
        </div>
        <p className="font-display text-lg text-burgundy-deep">{formatLKR(item.price)}</p>
      </div>
    </div>
  );
}
