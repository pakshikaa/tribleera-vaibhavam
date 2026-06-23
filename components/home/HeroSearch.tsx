"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, CalendarDays, ChevronDown } from "lucide-react";
import { categories } from "@/lib/data/categories";

export function HeroSearch() {
  const router = useRouter();
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");

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
      <div className="flex flex-col gap-2 rounded-[10px] border border-gold/30 bg-white/10 p-2 backdrop-blur-xl sm:flex-row">
        {/* Category */}
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

        {/* Date */}
        <div className="relative flex flex-1 items-center gap-2 rounded-[7px] bg-white/15 px-3.5 py-3">
          <CalendarDays size={16} className="shrink-0 text-cream-dim" />
          <div className="flex-1">
            <label htmlFor="hero-date" className="block text-[10px] font-semibold uppercase tracking-wider text-cream/60">
              Wedding date
            </label>
            <input
              id="hero-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-transparent text-sm font-medium text-cream outline-none [color-scheme:dark]"
              min={new Date().toISOString().split("T")[0]}
            />
          </div>
        </div>

        <button
          type="submit"
          className="rounded-[7px] bg-gradient-to-br from-gold-light via-gold to-gold-deep px-6 py-3 text-sm font-bold text-burgundy-950 shadow-glow transition-all hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(212,175,106,0.45)] active:scale-[0.98]"
        >
          Find vendors
        </button>
      </div>
    </form>
  );
}
