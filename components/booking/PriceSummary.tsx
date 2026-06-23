import { MoneyBreakdown } from "@/lib/utils/booking";
import { formatLKR } from "@/lib/utils/format";
import { ADVANCE_RATE, PLATFORM_FEE_RATE } from "@/lib/utils/booking";
import { cn } from "@/lib/utils/cn";

export function PriceSummary({
  breakdown,
  title = "Payment summary",
  className,
  compact = false,
}: {
  breakdown: MoneyBreakdown;
  title?: string;
  className?: string;
  compact?: boolean;
}) {
  const rows: { label: string; value: string; muted?: boolean }[] = [
    { label: "Service total", value: formatLKR(breakdown.serviceTotal) },
    { label: `Advance due now (${Math.round(ADVANCE_RATE * 100)}%)`, value: formatLKR(breakdown.advanceAmount) },
    { label: `Platform service fee (${Math.round(PLATFORM_FEE_RATE * 100)}%)`, value: formatLKR(breakdown.platformFee) },
  ];

  return (
    <div className={cn("rounded-[8px] border border-slate/8 bg-white p-5 shadow-soft md:p-6", className)}>
      {title && <p className="font-display text-lg text-slate">{title}</p>}
      <div className={cn("mt-4 space-y-3", compact && "mt-3 space-y-2.5")}>
        {rows.map((r) => (
          <div key={r.label} className="flex items-center justify-between text-sm">
            <span className="text-slate-soft">{r.label}</span>
            <span className="font-medium text-slate">{r.value}</span>
          </div>
        ))}
      </div>

      <div className="my-4 h-px bg-slate/8" />

      <div className="rounded-lg bg-burgundy/5 p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-burgundy-deep">Total payable now</span>
          <span className="font-display text-2xl text-burgundy-deep">{formatLKR(breakdown.payableNow)}</span>
        </div>
        <p className="mt-1 text-[11px] text-slate-soft">Advance + platform fee, secured in escrow until your event.</p>
      </div>

      <div className="mt-3 flex items-center justify-between text-sm">
        <span className="text-slate-soft">Remaining balance (paid to vendor later)</span>
        <span className="font-medium text-slate">{formatLKR(breakdown.remainingBalance)}</span>
      </div>
    </div>
  );
}
