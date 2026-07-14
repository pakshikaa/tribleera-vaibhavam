"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from "react";

const STORAGE_KEY = "TRIBLEERA-compare-v1";

/** A side-by-side table stops being readable past three columns on mobile. */
export const MAX_COMPARE = 3;

interface CompareContextValue {
  slugs: string[];
  toggle: (slug: string) => void;
  remove: (slug: string) => void;
  clear: () => void;
  has: (slug: string) => boolean;
  isFull: boolean;
  count: number;
  hydrated: boolean;
}

const CompareContext = createContext<CompareContextValue | null>(null);

export function CompareProvider({ children }: { children: ReactNode }) {
  const [slugs, setSlugs] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setSlugs((JSON.parse(raw) as string[]).slice(0, MAX_COMPARE));
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

  // Selecting past the cap is a no-op — CompareButton disables itself and
  // explains why, so this never silently drops a vendor the user expected.
  const toggle = useCallback((slug: string) => {
    setSlugs((prev) => {
      if (prev.includes(slug)) return prev.filter((s) => s !== slug);
      if (prev.length >= MAX_COMPARE) return prev;
      return [...prev, slug];
    });
  }, []);

  const remove = useCallback((slug: string) => setSlugs((prev) => prev.filter((s) => s !== slug)), []);
  const clear = useCallback(() => setSlugs([]), []);
  const has = useCallback((slug: string) => slugs.includes(slug), [slugs]);

  const value = useMemo(
    () => ({
      slugs,
      toggle,
      remove,
      clear,
      has,
      isFull: slugs.length >= MAX_COMPARE,
      count: slugs.length,
      hydrated,
    }),
    [slugs, toggle, remove, clear, has, hydrated]
  );

  return <CompareContext.Provider value={value}>{children}</CompareContext.Provider>;
}

export function useCompare() {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error("useCompare must be used inside CompareProvider");
  return ctx;
}
