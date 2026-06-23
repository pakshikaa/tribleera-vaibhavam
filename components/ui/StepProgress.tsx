"use client";

import { cn } from "@/lib/utils/cn";

export function StepProgress({
  steps,
  current,
}: {
  steps: string[];
  current: number;
}) {
  return (
    <div aria-label="Progress" className="space-y-3">
      <div className="grid grid-cols-[repeat(var(--step-count),minmax(0,1fr))] gap-2" style={{ ["--step-count" as string]: steps.length }}>
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const active = stepNumber === current;
          const complete = stepNumber < current;

          return (
            <div key={step} className="space-y-2">
              <div className={cn("h-1 rounded-full", complete || active ? "bg-gold" : "bg-white/15")} />
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "flex h-6 w-6 items-center justify-center rounded-full border text-xs font-semibold",
                    complete || active
                      ? "border-gold bg-gold text-ink"
                      : "border-white/20 bg-transparent text-cream-dim"
                  )}
                >
                  {stepNumber}
                </span>
                <span className={cn("text-xs font-medium", active || complete ? "text-cream" : "text-cream-faint")}>
                  {step}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
