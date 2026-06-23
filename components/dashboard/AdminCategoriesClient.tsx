"use client";

import { useState } from "react";
import { Users, ToggleLeft, ToggleRight } from "lucide-react";
import { Category } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { MotifArt } from "@/components/ui/MotifArt";

export function AdminCategoriesClient({ active, comingSoon }: { active: Category[]; comingSoon: Category[] }) {
  const [enabled, setEnabled] = useState<Record<string, boolean>>(
    Object.fromEntries([...active.map((c) => [c.slug, true]), ...comingSoon.map((c) => [c.slug, false])])
  );

  function toggle(slug: string) {
    setEnabled((prev) => ({ ...prev, [slug]: !prev[slug] }));
  }

  const all = [...active, ...comingSoon];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {all.map((cat, i) => {
        const isOn = enabled[cat.slug];
        return (
          <div key={cat.slug} className="overflow-hidden rounded-[8px] border border-slate/8 bg-white shadow-soft">
            <div className="relative h-28 overflow-hidden">
              <MotifArt variant={cat.motif} tone={cat.tone} seed={i} />
              <Badge tone={isOn ? "success" : "slate"} className="absolute left-3 top-3 bg-white/90">
                {isOn ? "Live" : "Hidden"}
              </Badge>
            </div>
            <div className="p-4">
              <p className="font-display text-lg text-slate">{cat.name}</p>
              <p className="mt-1 line-clamp-2 text-xs text-slate-soft">{cat.description}</p>
              <p className="mt-2 flex items-center gap-1 text-xs text-slate-soft">
                <Users size={12} /> {cat.vendorCount} vendor{cat.vendorCount !== 1 ? "s" : ""}
              </p>
              <Button
                variant="secondary"
                size="sm"
                fullWidth
                className="mt-4"
                icon={isOn ? <ToggleRight size={15} /> : <ToggleLeft size={15} />}
                onClick={() => toggle(cat.slug)}
              >
                {isOn ? "Visible to customers" : "Hidden from customers"}
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
