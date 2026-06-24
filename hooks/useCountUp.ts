"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { useInView } from "framer-motion";

export function useCountUp(target: number, duration = 1800, decimals = 0) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref as RefObject<Element>, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    let frame = 0;
    let startTime = 0;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Number((eased * target).toFixed(decimals)));

      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      }
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [decimals, duration, isInView, target]);

  return { ref, count };
}
