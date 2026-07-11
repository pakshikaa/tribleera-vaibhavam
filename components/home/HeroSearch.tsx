"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Search, Wallet } from "lucide-react";
import { categories } from "@/lib/data/categories";
import { vendors } from "@/lib/data/vendors";

const CITIES = Array.from(new Set(vendors.filter((v) => v.status === "approved").map((v) => v.city))).sort();

// Budget presets map straight onto the /vendors minPrice/maxPrice filters.
const BUDGETS = [
  { label: "Under LKR 50K", min: "", max: "50000" },
  { label: "LKR 50K – 100K", min: "50000", max: "100000" },
  { label: "LKR 100K – 200K", min: "100000", max: "200000" },
  { label: "LKR 200K+", min: "200000", max: "" },
];

export function HeroSearch() {
  const router = useRouter();
  const [category, setCategory] = useState("");
  const [city, setCity] = useState("");
  const [budget, setBudget] = useState("");

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (city) params.set("city", city);
    const range = BUDGETS[Number(budget)];
    if (budget !== "" && range) {
      if (range.min) params.set("minPrice", range.min);
      if (range.max) params.set("maxPrice", range.max);
    }
    router.push(`/vendors?${params.toString()}`);
  }

  return (
    <form onSubmit={handleSearch} className="mx-auto mt-2 w-full max-w-3xl" aria-label="Search vendors">
      <div className="flex flex-col gap-2 rounded-[10px] border border-gold/25 bg-white/10 p-2 backdrop-blur-xl lg:flex-row">

        {/* Category */}
        <div className="relative flex flex-1 items-center gap-2.5 rounded-[7px] bg-white/15 px-4 py-3">
          <Search size={15} className="shrink-0 text-cream/60" />
          <div className="flex-1">
            <label htmlFor="hero-cat" className="block text-[9px] font-bold uppercase tracking-[0.2em] text-cream/55">
              Service
            </label>
            <select
              id="hero-cat"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full appearance-none bg-transparent text-[13px] font-medium text-cream outline-none"
            >
              <option value="">All categories</option>
              {categories.map((c) => (
                <option key={c.slug} value={c.slug} className="bg-white text-slate">
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* City */}
        <div className="relative flex flex-1 items-center gap-2.5 rounded-[7px] bg-white/15 px-4 py-3">
          <MapPin size={15} className="shrink-0 text-cream/60" />
          <div className="flex-1">
            <label htmlFor="hero-city" className="block text-[9px] font-bold uppercase tracking-[0.2em] text-cream/55">
              Location
            </label>
            <select
              id="hero-city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full appearance-none bg-transparent text-[13px] font-medium text-cream outline-none"
            >
              <option value="">All cities</option>
              {CITIES.map((c) => (
                <option key={c} value={c} className="bg-white text-slate">
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Budget */}
        <div className="relative flex flex-1 items-center gap-2.5 rounded-[7px] bg-white/15 px-4 py-3">
          <Wallet size={15} className="shrink-0 text-cream/60" />
          <div className="flex-1">
            <label htmlFor="hero-budget" className="block text-[9px] font-bold uppercase tracking-[0.2em] text-cream/55">
              Budget
            </label>
            <select
              id="hero-budget"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full appearance-none bg-transparent text-[13px] font-medium text-cream outline-none"
            >
              <option value="">Any budget</option>
              {BUDGETS.map((b, i) => (
                <option key={b.label} value={i} className="bg-white text-slate">
                  {b.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="shrink-0 rounded-[7px] bg-gradient-to-br from-gold-light via-gold to-gold-deep px-6 py-3 text-[13px] font-bold text-burgundy-deep shadow-glow transition-all hover:-translate-y-0.5 active:scale-[0.98] lg:self-auto"
        >
          Find vendors
        </button>
      </div>
      <p className="mt-2.5 text-center text-[11px] text-white/40">
        Vendors manage live availability — your booking request is confirmed within 24 hrs.
      </p>
    </form>
  );
}
