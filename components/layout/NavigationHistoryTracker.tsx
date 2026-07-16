"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const CURRENT_PATH_KEY = "TRIBLEERA-nav-current";
const PREVIOUS_PATH_KEY = "TRIBLEERA-nav-previous";

export function NavigationHistoryTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.toString();
  const fullPath = query ? `${pathname}?${query}` : pathname;

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const current = window.sessionStorage.getItem(CURRENT_PATH_KEY);
      if (current && current !== fullPath) {
        window.sessionStorage.setItem(PREVIOUS_PATH_KEY, current);
      }
      window.sessionStorage.setItem(CURRENT_PATH_KEY, fullPath);
    } catch {}
  }, [fullPath]);

  return null;
}
