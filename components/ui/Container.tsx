import { cn } from "@/lib/utils/cn";
import { ReactNode } from "react";

export function Container({
  children,
  className,
  as: As = "div",
}: {
  children?: ReactNode;
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
}) {
  const As2 = As as React.ElementType;
  return (
    <As2 className={cn("mx-auto w-full max-w-[1280px] px-5 md:px-10", className)}>
      {children}
    </As2>
  );
}
