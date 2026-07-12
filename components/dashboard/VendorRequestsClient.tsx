"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, Check, CheckCircle2, ChevronDown, ChevronUp, Clock, MessageSquare, Mic, Send, Wallet, X } from "lucide-react";
import type { Booking, VendorBookingRequest } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input, Select, Textarea } from "@/components/ui/Field";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { VendorInvoiceUpload } from "@/components/dashboard/VendorInvoiceUpload";
import { getCategoryBySlug } from "@/lib/data/categories";
import { getVendorBySlug } from "@/lib/data/vendors";
import { formatDate, formatLKR, relativeTime } from "@/lib/utils/format";
import { generateId, safeGet, safePush, safeSet } from "@/lib/utils/store";

const STATUS_TONE = {
  new: "warning",
  accepted: "success",
  countered: "gold",
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
  status: "pending" | "accepted" | "rejected" | "countered";
  rejectionReason?: string;
  vendorSlug: string;
  rankedVendorSlugs?: string[];
  currentPriorityIndex?: number;
  voiceNoteDataUrl?: string;
  hasVoiceNote?: boolean;
  counterOfferPrice?: number;
  counterOfferNote?: string;
}

interface ConversationMessage {
  id: string;
  author: "vendor" | "customer" | "system";
  text: string;
  createdAt: string;
}

const threadKey = (requestId: string, vendorSlug: string) => `tv-request-thread-${requestId}-${vendorSlug}`;

function deadlineForRequest(receivedAt: string) {
  return new Date(new Date(receivedAt).getTime() + 24 * 60 * 60 * 1000);
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
    packageName: entry.status === "countered" ? "Counter offer sent" : "Custom request",
    price: entry.counterOfferPrice ?? 0,
    status:
      entry.status === "accepted"
        ? "accepted"
        : entry.status === "countered"
          ? "accepted"
          : entry.status === "rejected"
            ? "declined"
            : "new",
    rejectionReason: entry.rejectionReason,
    receivedAt: entry.submittedAt,
    message: entry.requirements || "No additional requirements provided.",
  }));
}

function readThread(requestId: string, vendorSlug: string) {
  return safeGet<ConversationMessage[]>(threadKey(requestId, vendorSlug), []);
}

function writeThread(requestId: string, vendorSlug: string, messages: ConversationMessage[]) {
  safeSet(threadKey(requestId, vendorSlug), messages);
}

function isPastDate(dateStr: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(dateStr) < today;
}

export function VendorRequestsClient({ initial }: { initial: VendorBookingRequest[] }) {
  const [vendorSlug] = useState(getVendorSlug);
  const vendor = useMemo(() => getVendorBySlug(vendorSlug), [vendorSlug]);
  const [requests, setRequests] = useState<VendorBookingRequest[]>(() => [...buildLiveRequests(vendorSlug), ...initial]);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [currentTime, setCurrentTime] = useState(() => Date.now());
  const [acceptTarget, setAcceptTarget] = useState<VendorBookingRequest | null>(null);
  const [rejectTarget, setRejectTarget] = useState<VendorBookingRequest | null>(null);
  const [counterTarget, setCounterTarget] = useState<VendorBookingRequest | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState(REJECTION_REASONS[0]);
  const [rejectionNotes, setRejectionNotes] = useState("");
  const [counterPrice, setCounterPrice] = useState("");
  const [counterNote, setCounterNote] = useState("");
  const [bulkMonth, setBulkMonth] = useState(() => {
    const initialLive = [...buildLiveRequests(vendorSlug), ...initial];
    return initialLive.find((request) => request.status === "new")?.eventDate.slice(0, 7) ?? "";
  });
  const [messageDrafts, setMessageDrafts] = useState<Record<string, string>>({});
  const { showToast } = useToast();

  useEffect(() => {
    const sync = () => {
      setRequests((prev) => {
        const live = buildLiveRequests(vendorSlug);
        const liveIds = new Set(live.map((request) => request.id));
        const rest = prev.filter((request) => !liveIds.has(request.id));
        return [...live, ...rest];
      });
    };

    sync();
    const interval = setInterval(sync, 10000);
    const tick = setInterval(() => setCurrentTime(Date.now()), 60000);
    return () => {
      clearInterval(interval);
      clearInterval(tick);
    };
  }, [vendorSlug]);

  const newCount = useMemo(() => requests.filter((request) => request.status === "new").length, [requests]);

  const monthOptions = useMemo(
    () =>
      Array.from(
        new Set(
          requests
            .filter((request) => request.status === "new")
            .map((request) => request.eventDate.slice(0, 7))
        )
      ),
    [requests]
  );

  function getInboxEntry(id: string): InboxEntry | undefined {
    const inbox = safeGet<Record<string, InboxEntry[]>>("tv-vendor-inbox", {});
    return (inbox[vendorSlug] ?? []).find((entry) => entry.id === id);
  }

  function getDateConflicts(request: VendorBookingRequest) {
    const inbox = safeGet<Record<string, InboxEntry[]>>("tv-vendor-inbox", {});
    const acceptedInbox = (inbox[vendorSlug] ?? []).filter(
      (entry) => entry.id !== request.id && (entry.status === "accepted" || entry.status === "countered") && entry.eventDate === request.eventDate
    );
    const bookings = safeGet<Array<Booking & { customerName?: string }>>("tv-bookings", []);
    const acceptedBookings = bookings.filter(
      (booking) =>
        booking.eventDate === request.eventDate &&
        booking.status !== "cancelled" &&
        booking.items?.some((item) => item.vendorId === vendorSlug || item.vendorSlug === vendorSlug)
    );
    return { acceptedInbox, acceptedBookings };
  }

  function pushSystemThread(requestId: string, text: string) {
    const current = readThread(requestId, vendorSlug);
    writeThread(requestId, vendorSlug, [
      {
        id: generateId("MSG"),
        author: "system",
        text,
        createdAt: new Date().toISOString(),
      },
      ...current,
    ]);
  }

  function acceptRequest() {
    if (!acceptTarget || !vendor) return;
    const liveEntry = getInboxEntry(acceptTarget.id);
    if (liveEntry) {
      const inbox = safeGet<Record<string, InboxEntry[]>>("tv-vendor-inbox", {});
      inbox[vendorSlug] = (inbox[vendorSlug] ?? []).map((entry) =>
        entry.id === acceptTarget.id ? { ...entry, status: "accepted" as const, counterOfferPrice: undefined, counterOfferNote: undefined } : entry
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

      pushSystemThread(liveEntry.requestId ?? acceptTarget.id, `${vendor.name} accepted the request. Keep all event coordination inside this thread.`);

      safePush("tv-notifications-cust-demo", {
        id: generateId("N"),
        type: "vendor_accepted",
        title: `${vendor.name} accepted your request`,
        message: `${vendor.name} is available for your event on ${formatDate(acceptTarget.eventDate)}. You can continue coordination through the platform thread.`,
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
    if (!rejectTarget || !vendor) return;
    const reason = rejectionReason === "Other" && rejectionNotes.trim() ? rejectionNotes.trim() : rejectionReason;
    const liveEntry = getInboxEntry(rejectTarget.id);

    if (liveEntry) {
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
          counterOfferPrice: undefined,
          counterOfferNote: undefined,
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

    setRequests((prev) => prev.map((request) => (request.id === rejectTarget.id ? { ...request, status: "declined", rejectionReason: reason } : request)));
    showToast("Request rejected.", "success");
    setRejectTarget(null);
    setRejectionNotes("");
    setRejectionReason(REJECTION_REASONS[0]);
  }

  function sendCounterOffer() {
    if (!counterTarget || !vendor) return;
    const liveEntry = getInboxEntry(counterTarget.id);
    const parsedPrice = Number(counterPrice);
    if (!liveEntry || Number.isNaN(parsedPrice) || parsedPrice < 1000 || !counterNote.trim()) {
      showToast("Add a valid counter-offer amount and note.", "error");
      return;
    }

    const inbox = safeGet<Record<string, InboxEntry[]>>("tv-vendor-inbox", {});
    inbox[vendorSlug] = (inbox[vendorSlug] ?? []).map((entry) =>
      entry.id === counterTarget.id
        ? {
            ...entry,
            status: "countered" as const,
            counterOfferPrice: parsedPrice,
            counterOfferNote: counterNote.trim(),
          }
        : entry
    );
    safeSet("tv-vendor-inbox", inbox);

    safePush("tv-responses", {
      id: generateId("RES"),
      requestId: liveEntry.requestId ?? counterTarget.id,
      vendorSlug,
      vendorName: vendor.name,
      categorySlug: liveEntry.categorySlug,
      status: "countered",
      counterOfferPrice: parsedPrice,
      counterOfferNote: counterNote.trim(),
      respondedAt: new Date().toISOString(),
    });

    pushSystemThread(liveEntry.requestId ?? counterTarget.id, `${vendor.name} sent a counter-offer for ${formatLKR(parsedPrice)}.`);
    pushSystemThread(liveEntry.requestId ?? counterTarget.id, counterNote.trim());

    safePush("tv-notifications-cust-demo", {
      id: generateId("N"),
      type: "vendor_counter_offer",
      title: `${vendor.name} sent a counter-offer`,
      message: `${vendor.name} proposed ${formatLKR(parsedPrice)} for your ${getCategoryBySlug(liveEntry.categorySlug)?.name ?? "service"} request.`,
      href: "/dashboard/customer",
      read: false,
      createdAt: new Date().toISOString(),
    });

    showToast("Counter-offer sent to customer.", "success");
    setCounterTarget(null);
    setCounterPrice("");
    setCounterNote("");
  }

  function declineAllForMonth() {
    if (!bulkMonth || !vendor) return;
    const monthRequests = requests.filter((request) => request.status === "new" && request.eventDate.startsWith(bulkMonth));
    if (monthRequests.length === 0) return;

    monthRequests.forEach((request) => {
      setRejectTarget(request);
      const liveEntry = getInboxEntry(request.id);
      if (!liveEntry) return;
      const inbox = safeGet<Record<string, InboxEntry[]>>("tv-vendor-inbox", {});
      inbox[vendorSlug] = (inbox[vendorSlug] ?? []).map((entry) =>
        entry.id === request.id ? { ...entry, status: "rejected" as const, rejectionReason: `Bulk decline for ${bulkMonth}` } : entry
      );
      safeSet("tv-vendor-inbox", inbox);
      safePush("tv-responses", {
        id: generateId("RES"),
        requestId: liveEntry.requestId ?? request.id,
        vendorSlug,
        vendorName: vendor.name,
        categorySlug: liveEntry.categorySlug,
        status: "rejected",
        rejectionReason: `Bulk decline for ${bulkMonth}`,
        respondedAt: new Date().toISOString(),
      });
    });

    setRequests((prev) =>
      prev.map((request) =>
        request.status === "new" && request.eventDate.startsWith(bulkMonth)
          ? { ...request, status: "declined", rejectionReason: `Bulk decline for ${bulkMonth}` }
          : request
      )
    );
    showToast(`Declined ${monthRequests.length} request${monthRequests.length !== 1 ? "s" : ""} for ${bulkMonth}.`, "success");
  }

  function sendThreadMessage(request: VendorBookingRequest) {
    const requestId = getInboxEntry(request.id)?.requestId ?? request.id;
    const draft = messageDrafts[request.id]?.trim();
    if (!draft) return;
    const current = readThread(requestId, vendorSlug);
    writeThread(requestId, vendorSlug, [
      {
        id: generateId("MSG"),
        author: "vendor",
        text: draft,
        createdAt: new Date().toISOString(),
      },
      ...current,
    ]);
    setMessageDrafts((prev) => ({ ...prev, [request.id]: "" }));
    showToast("Message sent to the request thread.", "success");
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
        <div className="rounded-[8px] border border-gold/20 bg-gold/[0.06] p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-slate-soft">
              You have <span className="font-semibold text-burgundy">{newCount} new request{newCount !== 1 ? "s" : ""}</span> that must be handled within 24 hours.
            </p>
            {monthOptions.length > 0 && (
              <div className="flex flex-col gap-2 sm:flex-row">
                <Input type="month" value={bulkMonth} onChange={(event) => setBulkMonth(event.target.value)} />
                <Button size="sm" variant="secondary" onClick={declineAllForMonth}>
                  Decline all for month
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {requests.map((request) => {
        const liveEntry = getInboxEntry(request.id);
        const requestId = liveEntry?.requestId ?? request.id;
        const deadline = deadlineForRequest(request.receivedAt);
        const msLeft = deadline.getTime() - currentTime;
        const hoursLeft = Math.max(0, Math.floor(msLeft / (1000 * 60 * 60)));
        const minutesLeft = Math.max(0, Math.floor((msLeft % (1000 * 60 * 60)) / (1000 * 60)));
        const overdue = msLeft <= 0 && request.status === "new";
        const showWarning = request.status === "new" && msLeft > 0 && msLeft < 6 * 60 * 60 * 1000;
        const expanded = expandedId === request.id;
        const isComplete = completedIds.includes(request.id);
        const conflicts = getDateConflicts(request);
        const thread = readThread(requestId, vendorSlug);
        const conflictCount = conflicts.acceptedInbox.length + conflicts.acceptedBookings.length;

        return (
          <div key={request.id} className="rounded-[8px] border border-slate/8 bg-white p-5 shadow-soft">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-display text-lg text-slate">{request.customerName}</p>
                <p className="text-xs text-slate-soft">
                  {getCategoryBySlug(request.categorySlug)?.name} · {request.packageName} · Event {formatDate(request.eventDate)}
                </p>
              </div>
              <Badge tone={STATUS_TONE[liveEntry?.status === "countered" ? "countered" : request.status]} className="capitalize">
                {liveEntry?.status === "countered" ? "countered" : request.status === "declined" ? "rejected" : request.status}
              </Badge>
            </div>

            <div className="mt-4 grid gap-3 rounded-[8px] bg-ivory p-4 text-sm text-slate-soft md:grid-cols-4">
              <p>Name <span className="ml-2 font-medium text-slate">{request.customerName}</span></p>
              <p>Location <span className="ml-2 font-medium text-slate">{request.location ?? "Jaffna"}</span></p>
              <p>Guests <span className="ml-2 font-medium text-slate">{request.guestCount ?? 250}</span></p>
              <p>Budget <span className="ml-2 font-medium text-slate">{request.budgetRange ?? formatLKR(request.price)}</span></p>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-slate-soft">&ldquo;{request.message}&rdquo;</p>

            {liveEntry?.voiceNoteDataUrl && (
              <div className="mt-4 rounded-[8px] border border-burgundy/10 bg-burgundy/[0.03] p-4">
                <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate">
                  <Mic size={14} className="text-burgundy" /> Customer voice note
                </p>
                <audio src={liveEntry.voiceNoteDataUrl} controls className="h-10 w-full" />
              </div>
            )}

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <div className="space-y-1">
                {liveEntry?.counterOfferPrice ? (
                  <p className="font-display text-base text-burgundy-deep">Countered at {formatLKR(liveEntry.counterOfferPrice)}</p>
                ) : request.price > 0 ? (
                  <p className="font-display text-base text-burgundy-deep">{formatLKR(request.price)}</p>
                ) : null}
                <p className={`text-xs ${overdue ? "font-semibold text-danger" : showWarning ? "font-semibold text-amber-900" : "text-slate-soft"}`}>
                  {overdue
                    ? "Response deadline missed - escalate or decline immediately"
                    : `Respond within 24h · ${hoursLeft}h ${minutesLeft}m left`}
                </p>
                {conflictCount > 0 && (
                  <p className="flex items-center gap-1.5 text-xs font-semibold text-danger">
                    <AlertTriangle size={12} /> {conflictCount} same-date booking conflict{conflictCount !== 1 ? "s" : ""} detected
                  </p>
                )}
                {request.status === "declined" && request.rejectionReason && (
                  <p className="text-xs text-slate-soft">Rejected - {request.rejectionReason}</p>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-slate-soft">{relativeTime(request.receivedAt)}</span>
                {request.status === "new" && (
                  <>
                    <Button size="sm" variant="secondary" icon={<Wallet size={14} />} onClick={() => setCounterTarget(request)}>
                      Counter offer
                    </Button>
                    <Button size="sm" variant="secondary" icon={<X size={14} />} onClick={() => setRejectTarget(request)}>
                      Reject
                    </Button>
                    <Button size="sm" variant="gold" icon={<Check size={14} />} onClick={() => setAcceptTarget(request)}>
                      Accept
                    </Button>
                  </>
                )}
                {(request.status === "accepted" || liveEntry?.status === "countered") && (
                  <>
                    <button
                      type="button"
                      onClick={() => setExpandedId(expanded ? null : request.id)}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-burgundy"
                    >
                      View details {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                    {isComplete ? (
                      <span className="flex flex-wrap items-center gap-3">
                        <span className="flex items-center gap-1.5 text-xs font-medium text-success">
                          <CheckCircle2 size={14} /> Marked complete
                        </span>
                        <VendorInvoiceUpload
                          bookingId={request.id}
                          vendorSlug={vendorSlug}
                          vendorName={vendor?.name ?? "Vendor"}
                        />
                      </span>
                    ) : !isPastDate(request.eventDate) ? (
                      <p className="text-xs italic text-slate-soft">Available after {formatDate(request.eventDate)}</p>
                    ) : (
                      <Button size="sm" variant="secondary" icon={<CheckCircle2 size={14} />} onClick={() => markComplete(request)}>
                        Mark complete
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>

            {expanded && (
              <div className="mt-4 space-y-4 rounded-[8px] border border-burgundy/10 bg-burgundy/[0.03] p-4">
                <div className="grid gap-3 text-sm text-slate-soft md:grid-cols-2">
                  <p>Customer name <span className="ml-2 font-medium text-slate">{request.customerName}</span></p>
                  <p>Phone <span className="ml-2 font-medium text-slate">{request.customerPhone ?? "+94 77 000 0000"}</span></p>
                  <p>Email <span className="ml-2 font-medium text-slate">{request.customerEmail ?? "cus***@example.com"}</span></p>
                  <p>Event date <span className="ml-2 font-medium text-slate">{formatDate(request.eventDate)}</span></p>
                  <p>Location <span className="ml-2 font-medium text-slate">{request.location ?? "Jaffna"}</span></p>
                  <p>Guest count <span className="ml-2 font-medium text-slate">{request.guestCount ?? 250}</span></p>
                </div>

                {conflictCount > 0 && (
                  <div className="rounded-[8px] border border-danger/20 bg-danger-pale p-4 text-sm text-danger">
                    <p className="font-semibold">Double-booking risk</p>
                    <p className="mt-1">This request shares the same event date as existing accepted work. Review before confirming.</p>
                  </div>
                )}

                <div>
                  <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate">
                    <MessageSquare size={14} className="text-burgundy" /> Conversation thread
                  </p>
                  <div className="space-y-2">
                    {thread.length === 0 ? (
                      <p className="rounded-[8px] bg-white px-3 py-3 text-sm text-slate-soft">No messages yet. Keep your coordination inside TRIBLEERA once the request is accepted or countered.</p>
                    ) : (
                      thread.map((message) => (
                        <div key={message.id} className="rounded-[8px] bg-white px-3 py-3 text-sm">
                          <p className="font-semibold capitalize text-slate">{message.author}</p>
                          <p className="mt-1 text-slate-soft">{message.text}</p>
                        </div>
                      ))
                    )}
                  </div>
                  {(request.status === "accepted" || liveEntry?.status === "countered") && (
                    <div className="mt-3 flex gap-2">
                      <Textarea
                        rows={2}
                        value={messageDrafts[request.id] ?? ""}
                        onChange={(event) => setMessageDrafts((prev) => ({ ...prev, [request.id]: event.target.value }))}
                        placeholder="Send a message about timing, logistics, or next steps"
                      />
                      <Button size="sm" icon={<Send size={14} />} onClick={() => sendThreadMessage(request)}>
                        Send
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}

      <Modal title="Accept this request?" description="This will notify the customer that you are available for the event." open={!!acceptTarget} onOpenChange={(open) => !open && setAcceptTarget(null)}>
        <div className="space-y-4">
          <p className="text-sm text-slate-soft">
            Confirm that you want to accept the request from <span className="font-semibold text-slate">{acceptTarget?.customerName}</span>.
          </p>
          {acceptTarget && (() => {
            const conflicts = getDateConflicts(acceptTarget);
            const conflictCount = conflicts.acceptedInbox.length + conflicts.acceptedBookings.length;
            return conflictCount > 0 ? (
              <div className="rounded-[8px] border border-danger/20 bg-danger-pale p-4 text-sm text-danger">
                <p className="font-semibold">Warning: double-booking risk</p>
                <p className="mt-1">You already have {conflictCount} same-date accepted booking or request on {formatDate(acceptTarget.eventDate)}.</p>
              </div>
            ) : null;
          })()}
          <Button variant="gold" fullWidth onClick={acceptRequest}>
            Confirm acceptance
          </Button>
        </div>
      </Modal>

      <Modal title="Reject this request?" description="Provide a reason so the customer understands why this request cannot proceed." open={!!rejectTarget} onOpenChange={(open) => {
        if (!open) {
          setRejectTarget(null);
          setRejectionNotes("");
          setRejectionReason(REJECTION_REASONS[0]);
        }
      }}>
        <div className="space-y-4">
          <Select label="Reason" value={rejectionReason} onChange={(event) => setRejectionReason(event.target.value)}>
            {REJECTION_REASONS.map((reason) => (
              <option key={reason} value={reason}>{reason}</option>
            ))}
          </Select>
          <Textarea label="Additional notes" rows={4} value={rejectionNotes} onChange={(event) => setRejectionNotes(event.target.value)} />
          <Button variant="secondary" fullWidth onClick={rejectRequest}>
            Confirm rejection
          </Button>
        </div>
      </Modal>

      <Modal title="Send counter-offer" description="Propose a revised price and note instead of rejecting the request." open={!!counterTarget} onOpenChange={(open) => {
        if (!open) {
          setCounterTarget(null);
          setCounterPrice("");
          setCounterNote("");
        }
      }}>
        <div className="space-y-4">
          <Input
            label="Counter-offer amount (LKR)"
            type="number"
            min={1000}
            value={counterPrice}
            onChange={(event) => setCounterPrice(event.target.value)}
          />
          <Textarea
            label="Note to customer"
            rows={4}
            value={counterNote}
            onChange={(event) => setCounterNote(event.target.value)}
            placeholder="Explain the revised scope, minimum price, or inclusions."
          />
          <Button variant="gold" fullWidth onClick={sendCounterOffer}>
            Send counter-offer
          </Button>
        </div>
      </Modal>
    </div>
  );
}
