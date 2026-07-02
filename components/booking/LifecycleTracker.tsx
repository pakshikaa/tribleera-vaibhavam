import { Check, X } from "lucide-react";
import { BookingStatus } from "@/types";
import { cn } from "@/lib/utils/cn";

const STAGES = ["Draft", "Request", "Payment", "Booked", "Completed"];

function stageIndex(status: BookingStatus): number {
  switch (status) {
    case "pending":
      return 2; // request submitted, awaiting vendor
    case "confirmed":
      return 3; // vendor accepted, payment in progress
    case "advance_paid":
      return 4; // booked
    case "completed":
      return 5;
    case "cancelled":
      return -1;
    default:
      return 1;
  }
}

const STAGE_DESCRIPTIONS: Record<BookingStatus, string> = {
  pending: "Your request has been sent to the vendor and is awaiting a response.",
  confirmed: "The vendor accepted your request — complete payment to confirm the booking.",
  advance_paid: "Advance received. Your date is locked in and the vendor has been notified.",
  completed: "This event has been delivered. Thank you for celebrating with TRIBLEERA.",
  cancelled: "This booking was cancelled. See the case notes below for details.",
};

export function LifecycleTracker({ status }: { status: BookingStatus }) {
  if (status === "cancelled") {
    return (
      <div className="flex items-center gap-3 rounded-[8px] border border-danger/20 bg-danger-pale px-5 py-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-danger text-white">
          <X size={16} />
        </div>
        <div>
          <p className="text-sm font-semibold text-danger">Booking cancelled</p>
          <p className="text-xs text-danger/80">{STAGE_DESCRIPTIONS.cancelled}</p>
        </div>
      </div>
    );
  }

  const current = stageIndex(status);

  return (
    <div>
      <div className="flex items-center">
        {STAGES.map((label, i) => {
          const index = i + 1;
          const done = index < current;
          const active = index === current;
          return (
            <div key={label} className="flex flex-1 items-center last:flex-none">
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors md:h-9 md:w-9",
                    done && "bg-burgundy text-white",
                    active && "bg-burgundy text-white ring-4 ring-burgundy/15",
                    !done && !active && "bg-rose-pale text-rose"
                  )}
                >
                  {done ? <Check size={14} /> : index}
                </div>
                <span className={cn("font-display text-xs", active ? "text-burgundy-deep font-semibold" : "text-slate-soft")}>
                  {label}
                </span>
              </div>
              {index !== STAGES.length && <div className={cn("mx-2 h-[2px] flex-1", done ? "bg-burgundy" : "bg-rose")} />}
            </div>
          );
        })}
      </div>
      <p className="mt-5 text-sm text-slate-soft">{STAGE_DESCRIPTIONS[status]}</p>
    </div>
  );
}
