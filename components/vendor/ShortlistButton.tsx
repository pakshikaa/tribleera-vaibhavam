"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useShortlist } from "@/context/ShortlistContext";
import { cn } from "@/lib/utils/cn";

export function ShortlistButton({
  slug,
  className,
  size = 18,
}: {
  slug: string;
  className?: string;
  size?: number;
}) {
  const { has, toggle } = useShortlist();
  const saved = has(slug);

  return (
    <motion.button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(slug);
      }}
      whileTap={{ scale: 1.3 }}
      transition={{ duration: 0.2 }}
      aria-label={saved ? "Remove from shortlist" : "Save to shortlist"}
      aria-pressed={saved}
      className={cn(
        "flex items-center justify-center rounded-full transition-colors",
        className
      )}
    >
      <motion.div
        animate={{ scale: saved ? [1, 1.35, 1] : 1 }}
        transition={{ duration: 0.3 }}
      >
        <Heart
          size={size}
          className={cn(
            "transition-colors duration-200",
            saved ? "fill-burgundy text-burgundy" : "fill-transparent text-white"
          )}
          strokeWidth={2}
        />
      </motion.div>
    </motion.button>
  );
}
