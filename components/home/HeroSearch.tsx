"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ChevronDown, CalendarDays } from "lucide-react";
import { categories } from "@/lib/data/categories";

export function HeroSearch() {
  const router = useRouter();
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (date) params.set("date", date);
    router.push(`/vendors?${params.toString()}`);
  }

  return (
    <form onSubmit={handleSearch} className="mx-auto w-full max-w-4xl" aria-label="Search vendors">
      <div className="glass border border-gold/20 bg-black/25 p-4 shadow-soft backdrop-blur-xl sm:p-5">
        <div className="grid gap-3 sm:grid-cols-[1.6fr_1.2fr_auto]">
          <label htmlFor="hero-category" className="sr-only">
            Vendor category
          </label>
          <div className="relative rounded-[16px] border border-gold/15 bg-white/10 px-4 py-4">
            <div className="mb-2 flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-cream/70">
              <Search size={14} className="text-gold" />
              Category
            </div>
            <select
              id="hero-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-transparent text-sm font-medium text-cream outline-none placeholder:text-cream/50"
            >
              <option value="">All categories</option>
              {categories.map((c) => (
                <option key={c.slug} value={c.slug} className="text-slate">
                  {c.name}
                </option>
              ))}
            </select>
            <ChevronDown size={16} className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-cream/70" />
          </div>

          <label htmlFor="hero-date" className="sr-only">
            Event date
          </label>
          <div className="relative rounded-[16px] border border-gold/15 bg-white/10 px-4 py-4">
            <div className="mb-2 flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-cream/70">
              <CalendarDays size={14} className="text-gold" />
              Event date
            </div>
            <input
              id="hero-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full appearance-none bg-transparent text-sm font-medium text-cream outline-none placeholder:text-cream/50"
            />
          </div>

          <button
            type="submit"
            className="inline-flex min-h-[62px] min-w-[150px] items-center justify-center rounded-[16px] bg-gradient-to-br from-gold-light via-gold to-gold-deep px-6 py-4 text-sm font-semibold uppercase tracking-[0.08em] text-ink shadow-glow transition-all hover:-translate-y-0.5 active:scale-[0.98]"
          >
            Find
          </button>
        </div>

        <p className="mt-3 text-center text-sm text-cream/70 sm:text-left">
          Date availability confirmed directly with your chosen vendor.
        </p>
      </div>
    </form>
  );
}
