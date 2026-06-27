"use client";

import { useState } from "react";
import { formatLKR } from "@/lib/utils/format";
import { ADVANCE_RATE, PLATFORM_FEE_RATE } from "@/lib/utils/booking";

export function PriceCalculator({ startingPrice }: { startingPrice: number }) {
  const [price, setPrice] = useState(startingPrice);
  const advance = Math.round(price * ADVANCE_RATE);
  const fee = Math.round(price * PLATFORM_FEE_RATE);
  const payNow = advance + fee;
  const later = price - advance;

  return (
    <div className="space-y-2">
      <div>
        <label htmlFor="price-calc-input" className="block text-[10px] text-slate-soft">
          Estimated package price (LKR)
        </label>
        <input
          id="price-calc-input"
          type="number"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
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
