"use client";

import { vendors } from "@/lib/data/vendors";
import type { VendorPackage } from "@/types";

function packageStorageKeys(slug: string) {
  return [`TRIBLEERA-vendor-packages-${slug}`, "TRIBLEERA-vendor-packages"];
}

export function getVendorPackages(slug: string, fallback?: VendorPackage[]): VendorPackage[] {
  const staticPackages = fallback ?? vendors.find((vendor) => vendor.slug === slug)?.packages ?? [];

  if (typeof window === "undefined") {
    return staticPackages.filter((pkg) => !pkg.archived);
  }

  try {
    for (const key of packageStorageKeys(slug)) {
      const raw = window.localStorage.getItem(key);
      if (!raw) continue;
      const parsed = JSON.parse(raw) as VendorPackage[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.filter((pkg) => !pkg.archived);
      }
    }
  } catch {
    // fall back to static data
  }

  return staticPackages.filter((pkg) => !pkg.archived);
}
