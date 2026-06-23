import { Check } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const STEPS = ["Browse", "Cart", "Payment", "Confirmed"];

export function BookingSteps({ current }: { current: number }) {
  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-2">
      {STEPS.map((step, i) => {
        const index = i + 1;
        const done = index < current;
        const active = index === current;
        return (
          <div key={step} className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <span
                className={cn(
                  "flex h-5 w-5 shrink-0 items-center justify-center rounded-full transition-colors",
                  done && "bg-burgundy text-white",
                  active && "bg-burgundy text-white",
                  !done && !active && "bg-rose-pale text-rose"
                )}
              >
                {done ? <Check size={11} /> : active ? <span className="h-1.5 w-1.5 rounded-full bg-white" /> : null}
              </span>
              <span className={cn("text-xs font-semibold", active || done ? "text-burgundy-deep" : "text-slate-soft")}>
                {step}
              </span>
            </div>
            {index !== STEPS.length && <span className={cn("h-px w-6 sm:w-10", done ? "bg-burgundy" : "bg-rose")} />}
          </div>
        );
      })}
    </div>
  );
}
