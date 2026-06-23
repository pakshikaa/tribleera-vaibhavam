"use client";

import { useMemo, useState } from "react";
import { Check, ChevronDown, ChevronUp, Clock, X } from "lucide-react";
import { VendorBookingRequest } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Modal } from "@/components/ui/Modal";
import { Select, Textarea } from "@/components/ui/Field";
import { formatDate, formatLKR, relativeTime } from "@/lib/utils/format";
import { getCategoryBySlug } from "@/lib/data/categories";
import { useToast } from "@/components/ui/Toast";

const STATUS_TONE = {
  new: "warning",
  accepted: "success",
  declined: "danger",
} as const;

const REJECTION_REASONS = [
  "Date not available",
  "Location out of range",
  "Budget below our minimum",
  "At full capacity",
  "Other",
];

function deadlineForRequest(receivedAt: string) {
  return new Date(new Date(receivedAt).getTime() + 24 * 60 * 60 * 1000);
}

export function VendorRequestsClient({ initial }: { initial: VendorBookingRequest[] }) {
  const [requests, setRequests] = useState(initial);
  const [currentTime] = useState(() => Date.now());
  const [acceptTarget, setAcceptTarget] = useState<VendorBookingRequest | null>(null);
  const [rejectTarget, setRejectTarget] = useState<VendorBookingRequest | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState(REJECTION_REASONS[0]);
  const [rejectionNotes, setRejectionNotes] = useState("");
  const { showToast } = useToast();

  const newCount = useMemo(() => requests.filter((request) => request.status === "new").length, [requests]);

  if (requests.length === 0) {
    return <EmptyState icon={<Clock size={28} />} title="No booking requests yet" />;
  }

  function acceptRequest() {
    if (!acceptTarget) return;
    setRequests((prev) => prev.map((request) => (request.id === acceptTarget.id ? { ...request, status: "accepted" } : request)));
    showToast("Request accepted.", "success");
    setAcceptTarget(null);
  }

  function rejectRequest() {
    if (!rejectTarget) return;
    const reason = rejectionReason === "Other" && rejectionNotes.trim() ? rejectionNotes.trim() : rejectionReason;
    setRequests((prev) =>
      prev.map((request) =>
        request.id === rejectTarget.id ? { ...request, status: "declined", rejectionReason: reason } : request
      )
    );
    showToast("Request rejected.", "success");
    setRejectTarget(null);
    setRejectionNotes("");
    setRejectionReason(REJECTION_REASONS[0]);
  }

  return (
    <div className="space-y-4">
      {newCount > 0 && (
        <p className="text-sm text-slate-soft">
          You have <span className="font-semibold text-burgundy">{newCount} new request{newCount !== 1 ? "s" : ""}</span> awaiting a response.
        </p>
      )}

      {requests.map((request) => {
        const deadline = deadlineForRequest(request.receivedAt);
        const hoursLeft = Math.max(0, Math.ceil((deadline.getTime() - currentTime) / (1000 * 60 * 60)));
        const showWarning = request.status === "new" && hoursLeft < 6;
        const expanded = expandedId === request.id;

        return (
          <div key={request.id} className="rounded-[8px] border border-slate/8 bg-white p-5 shadow-soft">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-display text-lg text-slate">{request.customerName}</p>
                <p className="text-xs text-slate-soft">
                  {getCategoryBySlug(request.categorySlug)?.name} · {request.packageName} package · Event {formatDate(request.eventDate)}
                </p>
              </div>
              <Badge tone={STATUS_TONE[request.status]} className="capitalize">
                {request.status === "declined" ? "rejected" : request.status}
              </Badge>
            </div>

            <div className="mt-4 grid gap-3 rounded-[8px] bg-ivory p-4 text-sm text-slate-soft md:grid-cols-4">
              <p>Name <span className="ml-2 font-medium text-slate">{request.customerName}</span></p>
              <p>Location <span className="ml-2 font-medium text-slate">{request.location ?? "Jaffna"}</span></p>
              <p>Guests <span className="ml-2 font-medium text-slate">{request.guestCount ?? 250}</span></p>
              <p>Budget <span className="ml-2 font-medium text-slate">{request.budgetRange ?? formatLKR(request.price)}</span></p>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-slate-soft">“{request.message}”</p>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <div className="space-y-1">
                <p className="font-display text-base text-burgundy-deep">{formatLKR(request.price)}</p>
                <p className={`text-xs ${showWarning ? "font-semibold text-amber-900" : "text-slate-soft"}`}>
                  You must respond by {formatDate(deadline)} {showWarning ? `(${hoursLeft}h left)` : ""}
                </p>
                {request.status === "declined" && request.rejectionReason && (
                  <p className="text-xs text-slate-soft">Rejected - {request.rejectionReason}</p>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-slate-soft">{relativeTime(request.receivedAt)}</span>
                {request.status === "new" && (
                  <>
                    <Button size="sm" variant="secondary" icon={<X size={14} />} onClick={() => setRejectTarget(request)}>
                      Reject Request
                    </Button>
                    <Button size="sm" variant="gold" icon={<Check size={14} />} onClick={() => setAcceptTarget(request)}>
                      Accept Request
                    </Button>
                  </>
                )}
                {request.status === "accepted" && (
                  <button
                    type="button"
                    onClick={() => setExpandedId(expanded ? null : request.id)}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-burgundy"
                  >
                    View Customer Details {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                )}
              </div>
            </div>

            {expanded && request.status === "accepted" && (
              <div className="mt-4 grid gap-3 rounded-[8px] border border-burgundy/10 bg-burgundy/[0.03] p-4 text-sm text-slate-soft md:grid-cols-2">
                <p>Customer name <span className="ml-2 font-medium text-slate">{request.customerName}</span></p>
                <p>Phone <span className="ml-2 font-medium text-slate">{request.customerPhone ?? "+94 77 000 0000"}</span></p>
                <p>Email <span className="ml-2 font-medium text-slate">{request.customerEmail ?? "cus***@example.com"}</span></p>
                <p>Event date <span className="ml-2 font-medium text-slate">{formatDate(request.eventDate)}</span></p>
                <p>Location <span className="ml-2 font-medium text-slate">{request.location ?? "Jaffna"}</span></p>
                <p>Guest count <span className="ml-2 font-medium text-slate">{request.guestCount ?? 250}</span></p>
              </div>
            )}
          </div>
        );
      })}

      <Modal
        title="Accept this request?"
        description="This will notify the customer that you are available for the event."
        open={!!acceptTarget}
        onOpenChange={(open) => {
          if (!open) setAcceptTarget(null);
        }}
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-soft">
            Confirm that you want to accept the request from <span className="font-semibold text-slate">{acceptTarget?.customerName}</span>.
          </p>
          <Button variant="gold" fullWidth onClick={acceptRequest}>
            Confirm acceptance
          </Button>
        </div>
      </Modal>

      <Modal
        title="Reject this request?"
        description="Provide a reason so the customer understands why this request cannot proceed."
        open={!!rejectTarget}
        onOpenChange={(open) => {
          if (!open) {
            setRejectTarget(null);
            setRejectionNotes("");
            setRejectionReason(REJECTION_REASONS[0]);
          }
        }}
      >
        <div className="space-y-4">
          <Select label="Reason" value={rejectionReason} onChange={(event) => setRejectionReason(event.target.value)}>
            {REJECTION_REASONS.map((reason) => (
              <option key={reason} value={reason}>
                {reason}
              </option>
            ))}
          </Select>
          <Textarea label="Additional notes" rows={4} value={rejectionNotes} onChange={(event) => setRejectionNotes(event.target.value)} />
          <Button variant="secondary" fullWidth onClick={rejectRequest}>
            Confirm rejection
          </Button>
        </div>
      </Modal>
    </div>
  );
}
