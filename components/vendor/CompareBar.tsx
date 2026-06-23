"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { getVendorBySlug } from "@/lib/data/vendors";
import { useCompare } from "@/context/CompareContext";

export function CompareBar() {
  const { compareList, clear } = useCompare();

  return (
    <AnimatePresence>
      {compareList.length > 0 ? (
        <motion.div
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] as const }}
          className="fixed inset-x-3 bottom-20 z-40 rounded-[10px] border border-gold/20 bg-ink px-4 py-3 shadow-glow md:bottom-6 md:left-auto md:right-6 md:w-auto"
        >
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <p className="text-sm text-cream">
              {compareList
                .map((slug) => getVendorBySlug(slug)?.name ?? slug)
                .slice(0, 3)
                .join(" | ")}
            </p>
            <div className="flex items-center gap-2">
              <Link
                href="/vendors/compare"
                className="inline-flex rounded-[4px] bg-gold px-3 py-2 text-sm font-semibold text-ink transition-transform hover:-translate-y-0.5"
              >
                Compare ({compareList.length})
              </Link>
              <Button variant="glass" size="sm" onClick={clear}>
                Clear
              </Button>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
