"use client";

import { Check, Plus } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { MAX_COMPARE, useCompare } from "@/context/CompareContext";

/**
 * Adds a vendor to the comparison tray. Disables (rather than silently
 * ignoring the click) once the tray is full, so the cap is visible.
 */
export function CompareButton({ slug, className }: { slug: string; className?: string }) {
  const { has, toggle, isFull, hydrated } = useCompare();
  const comparing = has(slug);
  const blocked = !comparing && isFull;

  return (
    <button
      type="button"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        toggle(slug);
      }}
      disabled={!hydrated || blocked}
      aria-pressed={comparing}
      title={blocked ? `You can compare up to ${MAX_COMPARE} vendors at a time` : undefined}
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10.5px] font-semibold transition-colors",
        comparing
          ? "border-burgundy bg-burgundy text-gold"
          : "border-slate/20 bg-white/80 text-slate-soft hover:border-burgundy/40 hover:text-burgundy",
        blocked && "cursor-not-allowed opacity-45 hover:border-slate/20 hover:text-slate-soft",
        className
      )}
    >
      {comparing ? <Check size={11} aria-hidden="true" /> : <Plus size={11} aria-hidden="true" />}
      {comparing ? "Comparing" : "Compare"}
    </button>
  );
}
