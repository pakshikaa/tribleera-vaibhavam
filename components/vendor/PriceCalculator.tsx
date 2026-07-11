"use client";

import { useState } from "react";
import type { VendorPackage } from "@/types";
import { formatLKR } from "@/lib/utils/format";
import { ADVANCE_RATE, PLATFORM_FEE_RATE } from "@/lib/utils/booking";

export function PriceCalculator({
  startingPrice,
  packages = [],
}: {
  startingPrice: number;
  packages?: VendorPackage[];
}) {
  const activePackages = packages.filter((p) => !p.archived);
  const [selectedId, setSelectedId] = useState(activePackages[0]?.id ?? "");
  const [price, setPrice] = useState(activePackages[0]?.price ?? startingPrice);

  const advance = Math.round(price * ADVANCE_RATE);
  const fee = Math.round(price * PLATFORM_FEE_RATE);
  const payNow = advance + fee;
  const later = price - advance;

  function handlePackageChange(id: string) {
    setSelectedId(id);
    const pkg = activePackages.find((p) => p.id === id);
    setPrice(pkg ? pkg.price : startingPrice);
  }

  return (
    <div className="space-y-2">
      {activePackages.length > 0 && (
        <div>
          <label htmlFor="price-calc-package" className="block text-[10px] text-slate-soft">
            Package
          </label>
          <select
            id="price-calc-package"
            value={selectedId}
            onChange={(e) => handlePackageChange(e.target.value)}
            className="w-full rounded-[4px] border border-slate/20 bg-white px-3 py-2 text-sm font-semibold text-slate focus:border-burgundy focus:outline-none"
          >
            {activePackages.map((pkg) => (
              <option key={pkg.id} value={pkg.id}>
                {pkg.name} — {formatLKR(pkg.price)}
              </option>
            ))}
            <option value="">Custom amount</option>
          </select>
        </div>
      )}
      <div>
        <label htmlFor="price-calc-input" className="block text-[10px] text-slate-soft">
          {activePackages.length > 0 ? "Adjust amount (LKR)" : "Estimated package price (LKR)"}
        </label>
        <input
          id="price-calc-input"
          type="number"
          value={price}
          onChange={(e) => {
            setPrice(Number(e.target.value));
            setSelectedId("");
          }}
          step={5000}
          min={0}
          className="w-full rounded-[4px] border border-slate/20 bg-white px-3 py-2 text-sm font-semibold text-slate focus:border-burgundy focus:outline-none"
        />
      </div>
      <div className="space-y-1 rounded-[4px] bg-white p-3 text-xs">
        <div className="flex justify-between">
          <span className="text-slate-soft">Advance (20%)</span>
          <span className="font-semibold text-burgundy">{formatLKR(advance)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-soft">Platform fee (3%)</span>
          <span className="font-semibold text-slate">{formatLKR(fee)}</span>
        </div>
        <div className="flex justify-between border-t border-slate/8 pt-1">
          <span className="font-semibold text-slate">Pay today</span>
          <span className="font-bold text-burgundy-deep">{formatLKR(payNow)}</span>
        </div>
        <div className="flex justify-between text-slate-soft">
          <span>After service</span>
          <span>{formatLKR(later)}</span>
        </div>
      </div>
    </div>
  );
}
