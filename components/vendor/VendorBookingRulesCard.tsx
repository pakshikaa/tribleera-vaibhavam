"use client";

import { useEffect, useState } from "react";
import { CalendarClock, MapPinned } from "lucide-react";
import { readVendorBookingRules } from "@/lib/utils/availability";

/**
 * Public "before you book" facts: where the vendor works and how much
 * notice they need (V-22, V-23). Reads the vendor's saved booking rules.
 */
export function VendorBookingRulesCard({ vendorSlug, fallbackCity }: { vendorSlug: string; fallbackCity: string }) {
  const [rules, setRules] = useState<{ serviceAreas: string[]; minNoticeDays: number } | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRules(readVendorBookingRules(vendorSlug));
  }, [vendorSlug]);

  if (!rules) return null;

  const areas = rules.serviceAreas.length > 0 ? rules.serviceAreas : [fallbackCity];

  return (
    <div className="rounded-[8px] border border-slate/8 bg-white p-5 shadow-soft">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-soft">Before you book</p>
      <div className="mt-3 space-y-2.5 text-sm">
        <p className="flex items-start gap-2 text-slate">
          <MapPinned size={15} className="mt-0.5 shrink-0 text-burgundy" aria-hidden="true" />
          <span>
            Serves <strong>{areas.join(", ")}</strong>
          </span>
        </p>
        <p className="flex items-start gap-2 text-slate">
          <CalendarClock size={15} className="mt-0.5 shrink-0 text-burgundy" aria-hidden="true" />
          <span>
            Needs <strong>{rules.minNoticeDays} days&rsquo;</strong> booking notice
          </span>
        </p>
      </div>
    </div>
  );
}
