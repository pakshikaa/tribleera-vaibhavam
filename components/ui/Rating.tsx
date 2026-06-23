import { Star } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function Rating({ value, size = 14, showValue = true, className }: { value: number; size?: number; showValue?: boolean; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1", className)}>
      <Star size={size} className="fill-gold text-gold" />
      {showValue && <span className="text-sm font-semibold text-slate">{value.toFixed(1)}</span>}
    </span>
  );
}
