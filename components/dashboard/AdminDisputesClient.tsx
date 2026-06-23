"use client";

import { useState } from "react";
import { CheckCircle2, XCircle, Search, AlertTriangle } from "lucide-react";
import { DisputeCase, DisputeStatus, DisputeType } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatLKR, formatDate } from "@/lib/utils/format";
import { getCategoryBySlug } from "@/lib/data/categories";

const TYPE_LABEL: Record<DisputeType, string> = {
  cancellation: "Cancellation request",
  refund: "Refund request",
  vendor_no_response: "Vendor not responding",
  vendor_cancellation: "Vendor cancelled",
  duplicate_payment: "Duplicate payment",
  user_misuse: "Suspected user misuse",
  dispute: "Service dispute",
};

const STATUS_TONE: Record<DisputeStatus, "warning" | "burgundy" | "success" | "danger"> = {
  open: "warning",
  investigating: "burgundy",
  resolved: "success",
  rejected: "danger",
};

const FILTERS: { id: DisputeType | "all"; label: string }[] = [
  { id: "all", label: "All cases" },
  { id: "cancellation", label: "Cancellations" },
  { id: "refund", label: "Refunds" },
  { id: "vendor_no_response", label: "No response" },
  { id: "vendor_cancellation", label: "Vendor cancelled" },
  { id: "duplicate_payment", label: "Duplicate payment" },
  { id: "user_misuse", label: "User misuse" },
  { id: "dispute", label: "Disputes" },
];

export function AdminDisputesClient({ initial }: { initial: DisputeCase[] }) {
  const [cases, setCases] = useState(initial);
  const [filter, setFilter] = useState<DisputeType | "all">("all");

  function setStatus(id: string, status: DisputeStatus) {
    setCases((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
  }

  const visible = filter === "all" ? cases : cases.filter((c) => c.type === filter);
  const openCount = cases.filter((c) => c.status === "open").length;

  return (
    <div>
      <div className="mb-6 flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
              filter === f.id
                ? "border-burgundy bg-burgundy text-white"
                : "border-slate/15 text-slate-soft hover:border-burgundy hover:text-burgundy"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {openCount > 0 && (
        <p className="mb-4 flex items-center gap-2 text-sm text-slate-soft">
          <AlertTriangle size={14} className="text-warning" />
          <span className="font-semibold text-warning">{openCount} case{openCount !== 1 ? "s" : ""}</span> need attention.
        </p>
      )}

      {visible.length === 0 ? (
        <EmptyState icon={<Search size={28} />} title="No cases in this filter" />
      ) : (
        <div className="space-y-4">
          {visible.map((c) => (
            <div key={c.id} className="rounded-[8px] border border-slate/8 bg-white p-5 shadow-soft">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-display text-lg text-slate">{c.id}</p>
                    <Badge tone="slate">{TYPE_LABEL[c.type]}</Badge>
                  </div>
                  <p className="mt-1 text-xs text-slate-soft">
                    Booking {c.bookingId} &middot; {getCategoryBySlug(c.categorySlug)?.name} &middot;{" "}
                    {c.customerName} &harr; {c.vendorName}
                  </p>
                </div>
                <Badge tone={STATUS_TONE[c.status]} className="capitalize">
                  {c.status}
                </Badge>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-slate-soft">{c.description}</p>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs text-slate-soft">
                  {c.amount > 0 ? `Amount in question: ${formatLKR(c.amount)}` : "No payment involved"} &middot; Raised{" "}
                  {formatDate(c.raisedAt)}
                </span>
                {c.status !== "resolved" && c.status !== "rejected" && (
                  <div className="flex gap-2">
                    {c.status === "open" && (
                      <Button size="sm" variant="secondary" onClick={() => setStatus(c.id, "investigating")}>
                        Investigate
                      </Button>
                    )}
                    <Button size="sm" variant="secondary" icon={<XCircle size={14} />} onClick={() => setStatus(c.id, "rejected")}>
                      Reject
                    </Button>
                    <Button size="sm" icon={<CheckCircle2 size={14} />} onClick={() => setStatus(c.id, "resolved")}>
                      Resolve
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
