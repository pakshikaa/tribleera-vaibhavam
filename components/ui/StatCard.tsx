import { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export function StatCard({
  label,
  value,
  delta,
  deltaTone = "success",
  icon,
  className,
}: {
  label: string;
  value: string;
  delta?: string;
  deltaTone?: "success" | "danger" | "slate";
  icon?: ReactNode;
  className?: string;
}) {
  const deltaColor =
    deltaTone === "success" ? "text-success" : deltaTone === "danger" ? "text-danger" : "text-slate-soft";
  return (
    <div className={cn("rounded-[8px] border border-slate/8 bg-white p-5 shadow-soft", className)}>
      <div className="flex items-start justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-soft">{label}</p>
        {icon && <div className="text-gold-deep">{icon}</div>}
      </div>
      <p className="mt-2 font-display text-2xl text-slate md:text-[28px]">{value}</p>
      {delta && <p className={cn("mt-1 text-xs font-medium", deltaColor)}>{delta}</p>}
    </div>
  );
}
