"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { categories } from "@/lib/data/categories";

export function HeroSearch() {
  const router = useRouter();
  const [category, setCategory] = useState("");

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    router.push(`/vendors?${params.toString()}`);
  }

  return (
    <form onSubmit={handleSearch} className="mx-auto mt-2 w-full max-w-xl" aria-label="Search vendors">
      <div className="flex flex-col gap-2 rounded-[10px] border border-gold/25 bg-white/10 p-2 backdrop-blur-xl sm:flex-row">

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

        {/* Submit */}
        <button
          type="submit"
          className="shrink-0 rounded-[7px] bg-gradient-to-br from-gold-light via-gold to-gold-deep px-6 py-3 text-[13px] font-bold text-burgundy-deep shadow-glow transition-all hover:-translate-y-0.5 active:scale-[0.98] sm:self-auto"
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
