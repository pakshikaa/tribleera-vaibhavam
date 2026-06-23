"use client";

import { useState } from "react";
import { Check, X, Clock } from "lucide-react";
import { VendorBookingRequest } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatLKR, relativeTime, formatDate } from "@/lib/utils/format";
import { getCategoryBySlug } from "@/lib/data/categories";

const STATUS_TONE = {
  new: "warning",
  accepted: "success",
  declined: "danger",
} as const;

export function VendorRequestsClient({ initial }: { initial: VendorBookingRequest[] }) {
  const [requests, setRequests] = useState(initial);

  function setStatus(id: string, status: "accepted" | "declined") {
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  }

  const newCount = requests.filter((r) => r.status === "new").length;

  if (requests.length === 0) {
    return <EmptyState icon={<Clock size={28} />} title="No booking requests yet" />;
  }

  return (
    <div className="space-y-4">
      {newCount > 0 && (
        <p className="text-sm text-slate-soft">
          You have <span className="font-semibold text-burgundy">{newCount} new request{newCount !== 1 ? "s" : ""}</span> awaiting a response.
        </p>
      )}
      {requests.map((r) => (
        <div key={r.id} className="rounded-[8px] border border-slate/8 bg-white p-5 shadow-soft">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="font-display text-lg text-slate">{r.customerName}</p>
              <p className="text-xs text-slate-soft">
                {getCategoryBySlug(r.categorySlug)?.name} &middot; {r.packageName} package &middot; Event:{" "}
                {formatDate(r.eventDate)}
              </p>
            </div>
            <Badge tone={STATUS_TONE[r.status]} className="capitalize">
              {r.status}
            </Badge>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-slate-soft">&ldquo;{r.message}&rdquo;</p>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <span className="font-display text-base text-burgundy-deep">{formatLKR(r.price)}</span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-soft">{relativeTime(r.receivedAt)}</span>
              {r.status === "new" && (
                <>
                  <Button size="sm" variant="secondary" icon={<X size={14} />} onClick={() => setStatus(r.id, "declined")}>
                    Decline
                  </Button>
                  <Button size="sm" icon={<Check size={14} />} onClick={() => setStatus(r.id, "accepted")}>
                    Accept
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
