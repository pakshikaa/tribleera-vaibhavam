"use client";

import { MotionConfig } from "framer-motion";
import { ReactNode } from "react";

/**
 * Wraps the app so every Framer Motion animation automatically honours
 * prefers-reduced-motion — transforms/opacity still apply instantly,
 * but duration-based motion is skipped, without each component needing
 * its own check.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
