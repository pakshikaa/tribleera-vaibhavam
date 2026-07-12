"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { getCurrentVendorSlug, getVendorCompletion } from "@/lib/utils/vendorPortal";

export function VendorOnboardingCard() {
  const [slug] = useState<string | null>(() => getCurrentVendorSlug());
  const [, setRefreshTick] = useState(0);

  useEffect(() => {
    const handleFocus = () => setRefreshTick((value) => value + 1);
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  const completion = slug ? getVendorCompletion(slug) : null;

  if (!slug || !completion) return null;

  return (
    <div className="mb-8 rounded-[12px] border border-burgundy/10 bg-white p-5 shadow-soft">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="flex items-center gap-2 text-sm font-semibold text-burgundy">
            <Sparkles size={16} /> Vendor onboarding
          </p>
          <h2 className="mt-1 font-display text-xl text-burgundy-deep">
            Your profile is {completion.percent}% complete
          </h2>
          <p className="mt-1 text-sm text-slate-soft">
            Finish the 4-step setup before going live to couples on TRIBLEERA.
          </p>
        </div>
        <Button href={completion.readyToGoLive ? "/dashboard/vendor/profile" : "/dashboard/vendor/setup"} variant="gold">
          {completion.readyToGoLive ? "Review live profile" : "Continue setup"}
        </Button>
      </div>

      <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-rose-pale">
        <div className="h-full rounded-full bg-burgundy transition-all" style={{ width: `${completion.percent}%` }} />
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {completion.metrics.map((item, index) => (
          <div key={item.id} className={`rounded-[8px] border px-4 py-3 ${item.done ? "border-success/20 bg-success-pale" : "border-slate/10 bg-ivory"}`}>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-soft">Step {index + 1}</p>
            <p className="mt-1 flex items-center gap-2 text-sm font-medium text-slate">
              {item.done && <CheckCircle2 size={14} className="text-success" />}
              {item.label}
            </p>
            <Button href={item.href} variant="secondary" size="sm" className="mt-3">
              {item.done ? "Edit" : "Complete"}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
