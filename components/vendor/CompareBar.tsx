"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { ArrowRight, Scale, X } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { CompareTable } from "@/components/vendor/CompareTable";
import { useCompare } from "@/context/CompareContext";
import { vendors } from "@/lib/data/vendors";
import { getLiveVendors, subscribeLiveVendors } from "@/lib/utils/liveVendors";

/**
 * Floating tray for the vendors directory: appears once two vendors are
 * selected, opens a side-by-side CompareTable. Selections survive navigation
 * (CompareContext persists them), so a customer can pick across filter changes.
 */
export function CompareBar() {
  const { slugs, clear, remove, count } = useCompare();
  const [open, setOpen] = useState(false);
  const liveVendors = useSyncExternalStore(subscribeLiveVendors, getLiveVendors, () => vendors);

  const selected = useMemo(
    () =>
      slugs
        .map((slug) => liveVendors.find((vendor) => vendor.slug === slug))
        .filter((vendor): vendor is (typeof liveVendors)[number] => Boolean(vendor)),
    [slugs, liveVendors]
  );

  if (selected.length === 0) return null;

  return (
    <>
      <div className="fixed inset-x-0 bottom-[68px] z-40 flex justify-center px-4 md:bottom-8">
        <div className="flex w-full max-w-lg items-center gap-3 rounded-[10px] border border-gold/30 bg-ink/95 px-4 py-3 shadow-lift backdrop-blur-md">
          <Scale size={16} className="shrink-0 text-gold" aria-hidden="true" />

          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-semibold text-cream">
              {count} vendor{count !== 1 ? "s" : ""} selected
            </p>
            <ul className="mt-0.5 flex flex-wrap gap-x-2 gap-y-0.5">
              {selected.map((vendor) => (
                <li key={vendor.slug} className="flex items-center gap-0.5 text-[11px] text-cream-faint">
                  <span className="max-w-[110px] truncate">{vendor.name}</span>
                  <button
                    type="button"
                    onClick={() => remove(vendor.slug)}
                    aria-label={`Remove ${vendor.name} from comparison`}
                    className="text-cream-faint transition-colors hover:text-gold"
                  >
                    <X size={11} aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <button
            type="button"
            onClick={() => setOpen(true)}
            disabled={count < 2}
            className="shrink-0 rounded-[6px] bg-gold px-3.5 py-2 text-xs font-bold text-burgundy-deep transition-colors hover:bg-gold-deep disabled:cursor-not-allowed disabled:opacity-50"
          >
            {count < 2 ? "Add 1 more" : "Compare"}
            {count >= 2 && <ArrowRight size={12} className="ml-1 inline" aria-hidden="true" />}
          </button>

          <button
            type="button"
            onClick={clear}
            className="shrink-0 text-[11px] text-cream-faint transition-colors hover:text-gold"
          >
            Clear
          </button>
        </div>
      </div>

      <Modal
        open={open}
        onOpenChange={setOpen}
        title="Compare vendors"
        description="Price, trust, packages and responsiveness side by side."
        className="max-w-4xl"
      >
        <CompareTable vendors={selected} />
      </Modal>
    </>
  );
}
