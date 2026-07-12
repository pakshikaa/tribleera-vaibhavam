"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const BUDGET_OPTIONS = [
  { label: "Any budget", min: "", max: "" },
  { label: "Under LKR 25K", min: "0", max: "25000" },
  { label: "LKR 25K–75K", min: "25000", max: "75000" },
  { label: "LKR 75K–150K", min: "75000", max: "150000" },
  { label: "LKR 150K+", min: "150000", max: "" },
];

const TRUST_OPTIONS = [
  { label: "Any rating", min: "" },
  { label: "4.9+", min: "4.9" },
  { label: "4.7+", min: "4.7" },
  { label: "4.5+", min: "4.5" },
];

const DEFAULT_CITIES = ["Jaffna", "Colombo", "Trincomalee", "Batticaloa", "Kandy", "Vavuniya", "Point Pedro"];

export function VendorFilters({ cities = DEFAULT_CITIES }: { cities?: string[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const q = params.get("q") ?? "";
  const sort = params.get("sort") ?? "trust";
  const city = params.get("city") ?? "";
  const minPrice = params.get("minPrice") ?? "";
  const maxPrice = params.get("maxPrice") ?? "";
  const minTrust = params.get("minTrust") ?? "";

  function update(updates: Record<string, string>) {
    const next = new URLSearchParams(params.toString());
    Object.entries(updates).forEach(([k, v]) => {
      if (!v) next.delete(k);
      else next.set(k, v);
    });
    router.push(`${pathname}?${next.toString()}`, { scroll: false });
  }

  const activeBudget = BUDGET_OPTIONS.find((b) => b.min === minPrice && b.max === maxPrice) ?? BUDGET_OPTIONS[0];
  const activeTrust = TRUST_OPTIONS.find((t) => t.min === minTrust) ?? TRUST_OPTIONS[0];

  const activeCount = [
    !!q, !!city, !!sort && sort !== "trust",
    activeBudget !== BUDGET_OPTIONS[0],
    activeTrust !== TRUST_OPTIONS[0],
  ].filter(Boolean).length;

  return (
    <div className="rounded-[8px] border border-slate/8 bg-white p-4 shadow-soft md:p-5">
      {/* Search — name / service / city */}
      <div>
        <label
          htmlFor="vendor-search"
          className="mb-2 block text-[10.5px] font-semibold uppercase tracking-wider text-slate-soft"
        >
          Vendor name / service / city
        </label>
        <div className="flex items-center gap-2 rounded-[4px] border border-slate/20 px-3 py-2.5 focus-within:border-burgundy">
          <Search size={16} className="text-slate-soft" aria-hidden="true" />
          <input
            id="vendor-search"
            defaultValue={q}
            onChange={(e) => update({ q: e.target.value })}
            placeholder="e.g. 'Jaffna Frames Studio' or 'bridal makeup'"
            className="w-full text-sm text-slate placeholder:text-slate-soft/70 focus:outline-none"
          />
        </div>
      </div>

      {/* Filter pills row 1 — City + Sort */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {/* City */}
        <div className="relative">
          <select
            value={city}
            onChange={(e) => update({ city: e.target.value })}
            aria-label="Filter by city"
            className={cn(
              "appearance-none rounded-full border px-4 py-2 text-xs font-semibold transition-colors cursor-pointer pr-7",
              city ? "border-burgundy bg-burgundy text-white" : "border-slate/20 text-slate-soft hover:border-burgundy hover:text-burgundy"
            )}
          >
            <option value="">All cities</option>
            {cities.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Sort */}
        <div className="relative">
          <select
            value={sort}
            onChange={(e) => update({ sort: e.target.value })}
            aria-label="Sort vendors"
            className={cn(
              "appearance-none rounded-full border px-4 py-2 text-xs font-semibold transition-colors cursor-pointer pr-7",
              sort !== "trust" ? "border-burgundy bg-burgundy text-white" : "border-slate/20 text-slate-soft hover:border-burgundy hover:text-burgundy"
            )}
          >
            <option value="trust">Trust score</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
          </select>
        </div>

        {activeCount > 0 && (
          <button
            onClick={() => router.push(pathname, { scroll: false })}
            className="flex items-center gap-1.5 rounded-full border border-slate/20 px-3.5 py-2 text-xs font-semibold text-slate-soft hover:border-burgundy hover:text-burgundy"
          >
            <SlidersHorizontal size={12} />
            Clear {activeCount > 0 ? `(${activeCount})` : ""}
          </button>
        )}
      </div>

      {/* Budget range pills */}
      <div className="mt-3">
        <p className="mb-2 text-[10.5px] font-semibold uppercase tracking-wider text-slate-soft">Budget range</p>
        <div className="flex flex-wrap gap-2">
          {BUDGET_OPTIONS.map((b) => (
            <button
              key={b.label}
              onClick={() => update({ minPrice: b.min, maxPrice: b.max })}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors",
                activeBudget.label === b.label
                  ? "border-burgundy bg-burgundy text-white"
                  : "border-slate/20 text-slate-soft hover:border-burgundy hover:text-burgundy"
              )}
            >
              {b.label}
            </button>
          ))}
        </div>
      </div>

      {/* Trust score pills */}
      <div className="mt-3">
        <p className="mb-2 text-[10.5px] font-semibold uppercase tracking-wider text-slate-soft">Minimum trust score</p>
        <div className="flex flex-wrap gap-2">
          {TRUST_OPTIONS.map((t) => (
            <button
              key={t.label}
              onClick={() => update({ minTrust: t.min })}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors",
                activeTrust.label === t.label
                  ? "border-burgundy bg-burgundy text-white"
                  : "border-slate/20 text-slate-soft hover:border-burgundy hover:text-burgundy"
              )}
            >
              {t.label === "Any rating" ? "Any rating" : `★ ${t.label}`}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
