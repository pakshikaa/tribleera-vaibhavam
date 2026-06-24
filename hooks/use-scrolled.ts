"use client";

import { useSyncExternalStore } from "react";

/** True once the page has scrolled past `threshold` px. Passive-listener, rAF-throttled. */
export function useScrolled(threshold = 24): boolean {
  const subscribe = (onStoreChange: () => void) => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(onStoreChange);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  };

  const getSnapshot = () => window.scrollY > threshold;
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
