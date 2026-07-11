"use client";

import { readLocalStorage, writeLocalStorage } from "@/lib/utils/browser-storage";

const KEY = "TRIBLEERA-recently-viewed";
const MAX_ENTRIES = 8;

/** Most-recently-viewed vendor slugs, newest first. */
export function readRecentlyViewed(): string[] {
  const slugs = readLocalStorage<string[]>(KEY, []);
  return Array.isArray(slugs) ? slugs : [];
}

export function recordRecentlyViewed(vendorSlug: string) {
  if (!vendorSlug) return;
  const next = [vendorSlug, ...readRecentlyViewed().filter((slug) => slug !== vendorSlug)].slice(0, MAX_ENTRIES);
  writeLocalStorage(KEY, next);
}
