"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, clipPath: "inset(0 0 8% 0)" }}
        animate={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }}
        exit={{ opacity: 0, clipPath: "inset(8% 0 0 0)" }}
        transition={{ duration: 0.45, ease: [0.76, 0, 0.24, 1] as const }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
