"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, CheckCircle2, ChevronDown, ChevronUp, Clock, X } from "lucide-react";
import { VendorBookingRequest } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Modal } from "@/components/ui/Modal";
import { Select, Textarea } from "@/components/ui/Field";
import { formatDate, formatLKR, relativeTime } from "@/lib/utils/format";
import { getCategoryBySlug } from "@/lib/data/categories";
import { getVendorBySlug } from "@/lib/data/vendors";
import { useToast } from "@/components/ui/Toast";
import { generateId, safeGet, safePush, safeSet } from "@/lib/utils/store";

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

const DEFAULT_VENDOR_SLUG = "pushpa-florals-and-decor";

interface InboxEntry {
  id: string;
  requestId?: string;
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
  eventDate: string;
  location?: string;
  guestCount?: number;
  budgetRange?: string;
  requirements?: string;
  categorySlug: string;
  submittedAt: string;
  status: "pending" | "accepted" | "rejected";
  rejectionReason?: string;
  vendorSlug: string;
  rankedVendorSlugs?: string[];
  currentPriorityIndex?: number;
}

function deadlineForRequest(receivedAt: string) {
  return new Date(new Date(receivedAt).getTime() + 24 * 60 * 60 * 1000);
}

function isPastDate(dateStr: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(dateStr) < today;
}

function getVendorSlug(): string {
  try {
    return sessionStorage.getItem("vendor-slug") ?? DEFAULT_VENDOR_SLUG;
  } catch {
    return DEFAULT_VENDOR_SLUG;
  }
}

function buildLiveRequests(vendorSlug: string): VendorBookingRequest[] {
  const inbox = safeGet<Record<string, InboxEntry[]>>("tv-vendor-inbox", {});
  const entries = inbox[vendorSlug] ?? [];

  return entries.map((entry) => ({
    id: entry.id,
    customerName: entry.customerName,
    customerPhone: entry.customerPhone,
    customerEmail: entry.customerEmail,
    eventDate: entry.eventDate,
    location: entry.location,
    guestCount: entry.guestCount,
    budgetRange: entry.budgetRange,
    categorySlug: entry.categorySlug,
    packageName: "Custom request",
    price: 0,
    status: entry.status === "accepted" ? "accepted" : entry.status === "rejected" ? "declined" : "new",
    rejectionReason: entry.rejectionReason,
    receivedAt: entry.submittedAt,
    message: entry.requirements || "No additional requirements provided.",
  }));
}

export function VendorRequestsClient({ initial }: { initial: VendorBookingRequest[] }) {
  const [vendorSlug] = useState(getVendorSlug);
  const vendor = useMemo(() => getVendorBySlug(vendorSlug), [vendorSlug]);
  const [requests, setRequests] = useState<VendorBookingRequest[]>(() => [
    ...buildLiveRequests(vendorSlug),
    ...initial,
  ]);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [currentTime] = useState(() => Date.now());
  const [acceptTarget, setAcceptTarget] = useState<VendorBookingRequest | null>(null);
  const [rejectTarget, setRejectTarget] = useState<VendorBookingRequest | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState(REJECTION_REASONS[0]);
  const [rejectionNotes, setRejectionNotes] = useState("");
  const { showToast } = useToast();

  useEffect(() => {
    const interval = setInterval(() => {
      setRequests((prev) => {
        const live = buildLiveRequests(vendorSlug);
        const liveIds = new Set(live.map((r) => r.id));
        const rest = prev.filter((r) => !liveIds.has(r.id));
        return [...live, ...rest];
      });
    }, 10000);
    return () => clearInterval(interval);
  }, [vendorSlug]);

  const newCount = useMemo(() => requests.filter((request) => request.status === "new").length, [requests]);

  function isLiveRequest(id: string): InboxEntry | undefined {
    const inbox = safeGet<Record<string, InboxEntry[]>>("tv-vendor-inbox", {});
    return (inbox[vendorSlug] ?? []).find((entry) => entry.id === id);
  }

  function acceptRequest() {
    if (!acceptTarget) return;
    const liveEntry = isLiveRequest(acceptTarget.id);

    if (liveEntry && vendor) {
      const inbox = safeGet<Record<string, InboxEntry[]>>("tv-vendor-inbox", {});
      inbox[vendorSlug] = (inbox[vendorSlug] ?? []).map((entry) =>
        entry.id === acceptTarget.id ? { ...entry, status: "accepted" as const } : entry
      );
      safeSet("tv-vendor-inbox", inbox);

      safePush("tv-responses", {
        id: generateId("RES"),
        requestId: liveEntry.requestId ?? acceptTarget.id,
        vendorSlug,
        vendorName: vendor.name,
        categorySlug: liveEntry.categorySlug,
        startingPrice: vendor.startingPrice,
        status: "accepted",
        respondedAt: new Date().toISOString(),
      });

      safePush("tv-notifications-cust-demo", {
        id: generateId("N"),
        type: "vendor_accepted",
        title: `${vendor.name} accepted your request`,
        message: `${vendor.name} is available for your event on ${formatDate(acceptTarget.eventDate)}.`,
        href: "/dashboard/customer",
        read: false,
        createdAt: new Date().toISOString(),
      });
    }

    setRequests((prev) => prev.map((request) => (request.id === acceptTarget.id ? { ...request, status: "accepted" } : request)));
    showToast("Request accepted. Customer has been notified.", "success");
    setAcceptTarget(null);
  }

  function rejectRequest() {
    if (!rejectTarget) return;
    const reason = rejectionReason === "Other" && rejectionNotes.trim() ? rejectionNotes.trim() : rejectionReason;
    const liveEntry = isLiveRequest(rejectTarget.id);

    if (liveEntry && vendor) {
      const inbox = safeGet<Record<string, InboxEntry[]>>("tv-vendor-inbox", {});
      inbox[vendorSlug] = (inbox[vendorSlug] ?? []).map((entry) =>
        entry.id === rejectTarget.id ? { ...entry, status: "rejected" as const, rejectionReason: reason } : entry
      );
      safeSet("tv-vendor-inbox", inbox);

      const rankedVendorSlugs = liveEntry.rankedVendorSlugs ?? [];
      const nextPriorityIndex = (liveEntry.currentPriorityIndex ?? 0) + 1;
      const nextVendorSlug = rankedVendorSlugs[nextPriorityIndex];
      const categoryLabel = getCategoryBySlug(liveEntry.categorySlug)?.name ?? "vendor";

      safePush("tv-responses", {
        id: generateId("RES"),
        requestId: liveEntry.requestId ?? rejectTarget.id,
        vendorSlug,
        vendorName: vendor.name,
        categorySlug: liveEntry.categorySlug,
        status: "rejected",
        rejectionReason: reason,
        respondedAt: new Date().toISOString(),
      });

      if (nextVendorSlug) {
        if (!inbox[nextVendorSlug]) inbox[nextVendorSlug] = [];
        inbox[nextVendorSlug].unshift({
          ...liveEntry,
          vendorSlug: nextVendorSlug,
          currentPriorityIndex: nextPriorityIndex,
          status: "pending",
          rejectionReason: undefined,
        });
        safeSet("tv-vendor-inbox", inbox);

        safePush("tv-admin-notifications", {
          id: generateId("AN"),
          type: "request_rerouted",
          message: `${liveEntry.customerName}'s ${categoryLabel} request was rerouted to the next preferred vendor`,
          time: new Date().toISOString(),
          icon: "🔁",
        });

        safePush("tv-notifications-cust-demo", {
          id: generateId("N"),
          type: "vendor_rerouted",
          title: `${vendor.name} is not available`,
          message: `Reason: ${reason}. Your request is now moving to your next preferred ${categoryLabel} vendor.`,
          href: "/dashboard/customer",
          read: false,
          createdAt: new Date().toISOString(),
        });
      } else {
        safePush("tv-notifications-cust-demo", {
          id: generateId("N"),
          type: "vendor_rejected",
          title: `${vendor.name} is not available`,
          message: `Reason: ${reason}. No more ranked ${categoryLabel} vendors are left for this service.`,
          href: "/dashboard/customer",
          read: false,
          createdAt: new Date().toISOString(),
        });
      }
    }

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

  function markComplete(request: VendorBookingRequest) {
    if (!vendor) return;

    const bookings = safeGet<Array<Record<string, unknown>>>("tv-bookings", []);
    const updated = bookings.map((booking) => {
      const items = (booking.items as Array<{ vendorId?: string; vendorSlug?: string }> | undefined) ?? [];
      const matchesVendor = items.some((item) => item.vendorId === vendorSlug || item.vendorSlug === vendorSlug);
      if (matchesVendor && booking.customerName === request.customerName) {
        return { ...booking, status: "completed", completedAt: new Date().toISOString() };
      }
      return booking;
    });
    safeSet("tv-bookings", updated);

    safePush("tv-notifications-cust-demo", {
      id: generateId("N"),
      type: "review_prompt",
      title: `How was ${vendor.name}?`,
      message: "Your event is complete! Leave a review to help other couples.",
      href: "/dashboard/customer",
      read: false,
      createdAt: new Date().toISOString(),
    });

    safePush("tv-admin-notifications", {
      id: generateId("AN"),
      type: "event_completed",
      message: `${vendor.name} marked event complete for ${request.customerName}`,
      time: new Date().toISOString(),
      icon: "🎉",
    });

    setCompletedIds((prev) => [...prev, request.id]);
    showToast("Event marked as complete. Customer will be prompted to review.", "success");
  }

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

      {requests.map((request) => {
        const deadline = deadlineForRequest(request.receivedAt);
        const hoursLeft = Math.max(0, Math.ceil((deadline.getTime() - currentTime) / (1000 * 60 * 60)));
        const showWarning = request.status === "new" && hoursLeft < 6;
        const expanded = expandedId === request.id;
        const isComplete = completedIds.includes(request.id);

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
                {request.price > 0 && <p className="font-display text-base text-burgundy-deep">{formatLKR(request.price)}</p>}
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
                  <>
                    <button
                      type="button"
                      onClick={() => setExpandedId(expanded ? null : request.id)}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-burgundy"
                    >
                      View Customer Details {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                    {isComplete ? (
                      <span className="flex items-center gap-1.5 text-xs font-medium text-success">
                        <CheckCircle2 size={14} /> Marked complete
                      </span>
                    ) : !isPastDate(request.eventDate) ? (
                      <p className="text-xs italic text-slate-soft">
                        Available after {formatDate(request.eventDate)}
                      </p>
                    ) : (
                      <Button size="sm" variant="secondary" icon={<CheckCircle2 size={14} />} onClick={() => markComplete(request)}>
                        Mark Complete
                      </Button>
                    )}
                  </>
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
