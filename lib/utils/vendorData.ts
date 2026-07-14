"use client";

import { useEffect, useState } from "react";
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

/**
 * getVendorPackages branches on `typeof window`, so calling it during render
 * makes the server and the first client render disagree the moment a vendor has
 * saved packages — React then throws the whole tree away and re-renders it.
 * Start from the static packages (what the server sent) and swap in the stored
 * ones after mount, so the two renders always agree.
 */
export function useVendorPackages(slug: string, staticPackages: VendorPackage[]): VendorPackage[] {
  const [packages, setPackages] = useState<VendorPackage[]>(() =>
    staticPackages.filter((pkg) => !pkg.archived)
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPackages(getVendorPackages(slug, staticPackages));
  }, [slug, staticPackages]);

  return packages;
}
