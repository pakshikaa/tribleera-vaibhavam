"use client";

import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { useToast } from "@/components/ui/Toast";
import { readSessionStorage, writeSessionStorage } from "@/lib/utils/browser-storage";

const STORAGE_KEY = "tribleera-compare";

interface CompareContextValue {
  compareList: string[];
  add: (slug: string) => void;
  remove: (slug: string) => void;
  clear: () => void;
  isComparing: (slug: string) => boolean;
}

const CompareContext = createContext<CompareContextValue | null>(null);

export function CompareProvider({ children }: { children: ReactNode }) {
  const [compareList, setCompareList] = useState<string[]>(() =>
    typeof window === "undefined" ? [] : readSessionStorage<string[]>(STORAGE_KEY, [])
  );
  const { showToast } = useToast();

  useEffect(() => {
    writeSessionStorage(STORAGE_KEY, compareList);
  }, [compareList]);

  const value = useMemo<CompareContextValue>(
    () => ({
      compareList,
      add: (slug) => {
        setCompareList((prev) => {
          if (prev.includes(slug)) return prev;
          if (prev.length >= 3) {
            showToast("You can compare up to 3 vendors", "error");
            return prev;
          }

          return [...prev, slug];
        });
      },
      remove: (slug) => {
        setCompareList((prev) => prev.filter((item) => item !== slug));
      },
      clear: () => {
        setCompareList([]);
      },
      isComparing: (slug) => compareList.includes(slug),
    }),
    [compareList, showToast]
  );

  return <CompareContext.Provider value={value}>{children}</CompareContext.Provider>;
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error("useCompare must be used within CompareProvider");
  }

  return context;
}
