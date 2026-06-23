"use client";

import { useState } from "react";
import { Check, X, Phone, Mail } from "lucide-react";
import { VendorApplication } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { EmptyState } from "@/components/ui/EmptyState";
import { ShieldCheck } from "lucide-react";
import { formatDate } from "@/lib/utils/format";
import { getCategoryBySlug } from "@/lib/data/categories";

export function AdminVendorApprovalClient({ initial }: { initial: VendorApplication[] }) {
  const [apps, setApps] = useState(initial);

  function decide(id: string, status: "approved" | "suspended") {
    setApps((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
  }

  const pending = apps.filter((a) => a.status === "pending");
  const decided = apps.filter((a) => a.status !== "pending");

  if (apps.length === 0) {
    return <EmptyState icon={<ShieldCheck size={28} />} title="No applications right now" description="New vendor sign-ups will appear here for review." />;
  }

  return (
    <div className="space-y-8">
      {pending.length > 0 && (
        <div>
          <p className="mb-3 text-sm font-semibold text-slate">Awaiting review ({pending.length})</p>
          <div className="space-y-4">
            {pending.map((a) => (
              <div key={a.id} className="rounded-[8px] border border-slate/8 bg-white p-5 shadow-soft">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Avatar name={a.businessName} size={44} />
                    <div>
                      <p className="font-display text-lg text-slate">{a.businessName}</p>
                      <p className="text-xs text-slate-soft">
                        {getCategoryBySlug(a.categorySlug)?.name} &middot; {a.city} &middot; {a.experienceYears} yrs experience
                      </p>
                    </div>
                  </div>
                  <Badge tone="warning">Pending review</Badge>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-slate-soft">{a.about}</p>
                <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-soft">
                  <span className="flex items-center gap-1">
                    <Phone size={12} /> {a.phone}
                  </span>
                  <span className="flex items-center gap-1">
                    <Mail size={12} /> {a.email}
                  </span>
                  <span>Submitted {formatDate(a.submittedAt)}</span>
                </div>
                <div className="mt-4 flex justify-end gap-2">
                  <Button size="sm" variant="secondary" icon={<X size={14} />} onClick={() => decide(a.id, "suspended")}>
                    Reject
                  </Button>
                  <Button size="sm" icon={<Check size={14} />} onClick={() => decide(a.id, "approved")}>
                    Approve
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {decided.length > 0 && (
        <div>
          <p className="mb-3 text-sm font-semibold text-slate">Recently decided</p>
          <div className="space-y-2.5">
            {decided.map((a) => (
              <div key={a.id} className="flex items-center justify-between rounded-lg border border-slate/8 bg-white px-4 py-3">
                <div className="flex items-center gap-3">
                  <Avatar name={a.businessName} size={32} />
                  <p className="text-sm font-medium text-slate">{a.businessName}</p>
                </div>
                <Badge tone={a.status === "approved" ? "success" : "danger"} className="capitalize">
                  {a.status}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
