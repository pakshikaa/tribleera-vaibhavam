"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ChevronDown } from "lucide-react";
import { categories } from "@/lib/data/categories";

export function HeroSearch() {
  const router = useRouter();
  const [category, setCategory] = useState("");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    router.push(`/vendors?${params.toString()}`);
  }

  return (
    <form
      onSubmit={handleSearch}
      className="mx-auto mt-10 w-full max-w-2xl"
      aria-label="Search vendors"
    >
      <div className="flex flex-col gap-2 rounded-[10px] border border-gold/30 bg-white/10 p-2 backdrop-blur-xl sm:flex-row sm:items-stretch">
        <div className="relative flex flex-1 items-center gap-2 rounded-[7px] bg-white/15 px-3.5 py-3">
          <Search size={16} className="shrink-0 text-cream-dim" />
          <div className="relative flex-1">
            <label htmlFor="hero-category" className="block text-[10px] font-semibold uppercase tracking-wider text-cream/60">
              Service
            </label>
            <select
              id="hero-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full appearance-none bg-transparent text-sm font-medium text-cream outline-none placeholder:text-cream/50"
            >
              <option value="">All categories</option>
              {categories.map((c) => (
                <option key={c.slug} value={c.slug} className="text-slate">
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <ChevronDown size={14} className="shrink-0 text-cream-dim" />
        </div>

        <button
          type="submit"
          className="rounded-[7px] bg-gradient-to-br from-gold-light via-gold to-gold-deep px-6 py-3 text-sm font-bold text-burgundy-950 shadow-glow transition-all hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(212,175,106,0.45)] active:scale-[0.98] sm:min-w-[220px]"
        >
          Find vendors
        </button>
      </div>
      <p className="mt-3 text-center text-xs text-cream-faint">
        Date availability confirmed directly with your chosen vendor
      </p>
    </form>
  );
}
