"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from "react";

const STORAGE_KEY = "TRIBLEERA-shortlist-v1";

interface ShortlistContextValue {
  slugs: string[];
  add: (slug: string) => void;
  remove: (slug: string) => void;
  toggle: (slug: string) => void;
  has: (slug: string) => boolean;
  count: number;
  hydrated: boolean;
}

const ShortlistContext = createContext<ShortlistContextValue | null>(null);

export function ShortlistProvider({ children }: { children: ReactNode }) {
  const [slugs, setSlugs] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setSlugs(JSON.parse(raw));
    } catch {
      // ignore
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(slugs));
    } catch {
      // ignore
    }
  }, [slugs, hydrated]);

  const add = useCallback((slug: string) => setSlugs((prev) => prev.includes(slug) ? prev : [...prev, slug]), []);
  const remove = useCallback((slug: string) => setSlugs((prev) => prev.filter((s) => s !== slug)), []);
  const toggle = useCallback((slug: string) => setSlugs((prev) => prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]), []);
  const has = useCallback((slug: string) => slugs.includes(slug), [slugs]);

  const value = useMemo(() => ({ slugs, add, remove, toggle, has, count: slugs.length, hydrated }), [slugs, add, remove, toggle, has, hydrated]);

  return <ShortlistContext.Provider value={value}>{children}</ShortlistContext.Provider>;
}

export function useShortlist() {
  const ctx = useContext(ShortlistContext);
  if (!ctx) throw new Error("useShortlist must be used inside ShortlistProvider");
  return ctx;
}
