"use client";

import { ReactNode, useState } from "react";
import { cn } from "@/lib/utils/cn";

export function Tabs({
  tabs,
  panels,
  defaultTab,
}: {
  tabs: { id: string; label: string; count?: number }[];
  panels: Record<string, ReactNode>;
  defaultTab?: string;
}) {
  const [active, setActive] = useState(defaultTab ?? tabs[0]?.id);
  return (
    <div>
      <div className="flex gap-1 overflow-x-auto rounded-lg bg-slate/5 p-1 scrollbar-hide">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActive(t.id)}
            className={cn(
              "flex shrink-0 items-center gap-1.5 rounded-md px-4 py-2 text-sm font-semibold transition-colors",
              active === t.id ? "bg-white text-burgundy shadow-soft" : "text-slate-soft hover:text-slate"
            )}
          >
            {t.label}
            {typeof t.count === "number" && (
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.5 text-[11px]",
                  active === t.id ? "bg-burgundy/10 text-burgundy" : "bg-slate/10 text-slate-soft"
                )}
              >
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>
      <div className="mt-6">{panels[active]}</div>
    </div>
  );
}
