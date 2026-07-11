"use client";

import { useEffect, useState } from "react";
import { CalendarCheck2, CalendarX2, PauseCircle } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import {
  readCustomerEventDate,
  vendorAvailabilityOn,
  type AvailabilityStatus,
} from "@/lib/utils/availability";
import { formatDate } from "@/lib/utils/format";

/**
 * Personalised availability signal: checks the vendor's (mock) calendar
 * against the customer's saved wedding date. Renders nothing until the
 * client-side check resolves, and nothing at all when there is no saved
 * date and the vendor is accepting bookings (the default, uninteresting
 * case).
 */
export function AvailabilityBadge({ vendorSlug, className }: { vendorSlug: string; className?: string }) {
  const [status, setStatus] = useState<AvailabilityStatus | null>(null);
  const [eventDate, setEventDate] = useState<string | null>(null);

  useEffect(() => {
    const date = readCustomerEventDate();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEventDate(date);
    setStatus(vendorAvailabilityOn(vendorSlug, date));
  }, [vendorSlug]);

  if (!status || (status === "unknown" && !eventDate)) return null;

  if (status === "paused") {
    return (
      <span className={cn("inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[10.5px] font-semibold text-amber-800", className)}>
        <PauseCircle size={11} aria-hidden="true" /> Not taking new bookings
      </span>
    );
  }

  if (status === "booked") {
    return (
      <span className={cn("inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-[10.5px] font-semibold text-red-700", className)}>
        <CalendarX2 size={11} aria-hidden="true" /> Booked on {eventDate ? formatDate(eventDate) : "your date"}
      </span>
    );
  }

  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full bg-success-pale px-2.5 py-1 text-[10.5px] font-semibold text-success", className)}>
      <CalendarCheck2 size={11} aria-hidden="true" /> Available for your date
    </span>
  );
}
