"use client";

import { useEffect, useState } from "react";

function getTimeOfDay(hour: number): string {
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  return "evening";
}

export function AdminGreetingBar() {
  // Computed client-side — this page is statically prerendered, so a
  // server-rendered "today" would freeze at build time instead of the
  // visitor's actual date.
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNow(new Date());
  }, []);

  return (
    <div className="flex items-center justify-between rounded-[10px] bg-ink px-6 py-4">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-gold">
          Good {now ? getTimeOfDay(now.getHours()) : "day"}, Admin
        </p>
        <p className="mt-0.5 text-[11px] text-cream-faint">
          {now
            ? now.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
            : ""}
        </p>
      </div>
    </div>
  );
}
