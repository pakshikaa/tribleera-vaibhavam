"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

export function useCountUp(target: number, duration = 1500) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = window.setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        window.clearInterval(timer);
        return;
      }
      setCount(Math.floor(start * 10) / 10);
    }, 16);
    return () => window.clearInterval(timer);
  }, [duration, isInView, target]);

  return { ref, count };
}
