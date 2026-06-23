import { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type Tone = "burgundy" | "gold" | "rose" | "success" | "warning" | "danger" | "slate";

const toneClasses: Record<Tone, string> = {
  burgundy: "bg-burgundy/10 text-burgundy",
  gold: "bg-gold-pale text-gold-deep",
  rose: "bg-rose-pale text-burgundy",
  success: "bg-success-pale text-success",
  warning: "bg-warning-pale text-warning",
  danger: "bg-danger-pale text-danger",
  slate: "bg-slate/8 text-slate-soft",
};

export function Badge({
  children,
  tone = "burgundy",
  icon,
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  icon?: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold",
        toneClasses[tone],
        className
      )}
    >
      {icon}
      {children}
    </span>
  );
}
