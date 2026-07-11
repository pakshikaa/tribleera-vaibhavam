"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { readLastVendorSearch } from "@/components/vendor/SearchMemory";

/**
 * "Back to results" link that restores the last-used vendor filters,
 * so leaving a profile does not lose the search the customer built.
 */
export function BackToResults({ className }: { className?: string }) {
  const [search, setSearch] = useState<string | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSearch(readLastVendorSearch());
  }, []);

  if (!search) return null;

  return (
    <Link
      href={`/vendors${search}`}
      className={className ?? "inline-flex items-center gap-1 text-xs font-semibold text-burgundy transition-colors hover:text-burgundy-deep"}
    >
      <ArrowLeft size={12} aria-hidden="true" /> Back to results
    </Link>
  );
}
