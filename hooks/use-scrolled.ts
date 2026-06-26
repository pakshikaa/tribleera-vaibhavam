"use client";

import { useCallback, useSyncExternalStore } from "react";

export function useScrolled(threshold = 24): boolean {
  const subscribe = useCallback((onStoreChange: () => void) => {
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
  }, []);

  const getSnapshot = useCallback(() => window.scrollY > threshold, [threshold]);

  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
