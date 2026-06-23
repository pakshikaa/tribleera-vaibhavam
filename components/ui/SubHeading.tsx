import { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export function SubHeading({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <h2 className={cn("flex items-center gap-2 font-display text-xl text-burgundy-deep md:text-2xl", className)}>
      <span aria-hidden className="text-gold">
        —
      </span>
      {children}
    </h2>
  );
}
