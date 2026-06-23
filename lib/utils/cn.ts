import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * shadcn/ui's canonical class combiner: clsx for conditional joining,
 * tailwind-merge to resolve conflicting utilities (e.g. "p-4 p-2" -> "p-2")
 * deterministically instead of relying on stylesheet source order.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
