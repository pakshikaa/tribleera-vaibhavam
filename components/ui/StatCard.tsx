import { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

const ACCENT_BORDERS = {
  burgundy: "border-l-burgundy",
  gold: "border-l-gold",
  success: "border-l-success",
  info: "border-l-sky-500",
} as const;

export function StatCard({
  label,
  value,
  delta,
  deltaTone = "success",
  icon,
  accent,
  className,
}: {
  label: string;
  value: string;
  delta?: string;
  deltaTone?: "success" | "danger" | "slate";
  icon?: ReactNode;
  accent?: keyof typeof ACCENT_BORDERS;
  className?: string;
}) {
  const deltaColor =
    deltaTone === "success" ? "text-success" : deltaTone === "danger" ? "text-danger" : "text-slate-soft";
  return (
    <div
      className={cn(
        "rounded-[8px] border border-slate/8 bg-white p-5 shadow-soft",
        accent && cn("border-l-4", ACCENT_BORDERS[accent]),
        className
      )}
    >
      <div className="flex items-start justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-soft">{label}</p>
        {icon && <div className="text-gold-deep">{icon}</div>}
      </div>
      <p className="mt-2 font-display text-2xl text-slate md:text-[28px]">{value}</p>
      {delta && <p className={cn("mt-1 text-xs font-medium", deltaColor)}>{delta}</p>}
    </div>
  );
}
