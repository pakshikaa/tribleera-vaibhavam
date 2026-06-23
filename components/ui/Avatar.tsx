import { initials } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";

export function Avatar({ name, size = 40, className }: { name: string; size?: number; className?: string }) {
  return (
    <div
      style={{ width: size, height: size, fontSize: size * 0.36 }}
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-burgundy text-white font-semibold font-display",
        className
      )}
    >
      {initials(name)}
    </div>
  );
}
