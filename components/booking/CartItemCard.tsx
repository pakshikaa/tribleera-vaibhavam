"use client";

import Link from "next/link";
import { Trash2 } from "lucide-react";
import { BookingLineItem } from "@/types";
import { SmartImage } from "@/components/ui/SmartImage";
import { Badge } from "@/components/ui/Badge";
import { formatLKR } from "@/lib/utils/format";
import { lineItemBreakdown } from "@/lib/utils/booking";
import { getCategoryBySlug } from "@/lib/data/categories";
import { getVendorBySlug } from "@/lib/data/vendors";

export function CartItemCard({ item, onRemove }: { item: BookingLineItem; onRemove: () => void }) {
  const category = getCategoryBySlug(item.categorySlug);
  const vendor = getVendorBySlug(item.vendorId);
  const breakdown = lineItemBreakdown(item.price);

  return (
    <div className="rounded-[8px] border border-slate/8 bg-white p-4 shadow-soft">
      <div className="flex gap-4">
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
      <div className="mt-3 grid grid-cols-2 gap-2 border-t border-slate/8 pt-3 text-xs sm:grid-cols-4">
        <div>
          <p className="text-slate-soft">Advance (20%)</p>
          <p className="font-medium text-slate">{formatLKR(breakdown.advanceAmount)}</p>
        </div>
        <div>
          <p className="text-slate-soft">Platform fee (3%)</p>
          <p className="font-medium text-slate">{formatLKR(breakdown.platformFee)}</p>
        </div>
        <div>
          <p className="text-slate-soft">Payable now</p>
          <p className="font-medium text-burgundy-deep">{formatLKR(breakdown.payableNow)}</p>
        </div>
        <div>
          <p className="text-slate-soft">Remaining</p>
          <p className="font-medium text-slate">{formatLKR(breakdown.remainingBalance)}</p>
        </div>
      </div>
    </div>
  );
}
