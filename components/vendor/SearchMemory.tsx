"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

const KEY = "TRIBLEERA-last-vendor-search";

/**
 * Mounted on the vendors listing: remembers the active filter querystring so
 * vendor profiles can offer "back to results" with filters preserved.
 */
export function SearchMemory() {
  const searchParams = useSearchParams();

  useEffect(() => {
    try {
      const qs = searchParams.toString();
      window.sessionStorage.setItem(KEY, qs ? `?${qs}` : "");
    } catch {
      // ignore unavailable storage
    }
  }, [searchParams]);

  return null;
}

export function readLastVendorSearch(): string {
  try {
    return window.sessionStorage.getItem(KEY) ?? "";
  } catch {
    return "";
  }
}
