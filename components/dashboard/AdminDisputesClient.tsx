"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { AlertTriangle, CheckCircle2, Search, TimerReset, XCircle } from "lucide-react";
import type { CancellationRecord } from "@/lib/data/cancelledBookings";
import { getCategoryBySlug } from "@/lib/data/categories";
import {
  appendAuditLog,
  calculateRefundFromBooking,
  getAdminSnapshot,
  getDisputeSla,
  subscribeAdminData,
  writeDisputeRecords,
  writeRefundRecords,
} from "@/lib/utils/adminLiveData";
import { formatDate, formatDateShort, formatLKR } from "@/lib/utils/format";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import type { Booking, DisputeStatus, DisputeType } from "@/types";

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

const REFUND_TONE: Record<CancellationRecord["refundStatus"], "warning" | "burgundy" | "success"> = {
  pending: "warning",
  processing: "burgundy",
  credited: "success",
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

function buildRefundRecord(booking: Booking): CancellationRecord {
  const refund = calculateRefundFromBooking(booking);
  return {
    bookingId: booking.id,
    customerId: `customer-${booking.id.toLowerCase()}`,
    vendorName: booking.vendorName ?? booking.items[0]?.vendorName ?? "Unknown vendor",
    reason: "Cancellation requested through customer dashboard",
    cancelledAt: new Date().toISOString(),
    refundAmount: refund.refundAmount,
    refundStatus: "pending",
    daysBeforeEvent: refund.daysBeforeEvent,
  };
}

export function AdminDisputesClient() {
  const snapshot = useSyncExternalStore(subscribeAdminData, getAdminSnapshot, getAdminSnapshot);
  const [filter, setFilter] = useState<DisputeType | "all">("all");

  const visible = filter === "all" ? snapshot.disputes : snapshot.disputes.filter((item) => item.type === filter);
  const openCount = snapshot.disputes.filter((item) => item.status === "open").length;
  const overdueCount = snapshot.disputes.filter((item) => {
    const sla = getDisputeSla(item.raisedAt);
    return item.status !== "resolved" && item.status !== "rejected" && sla.overdue;
  }).length;

  const refundsByBooking = useMemo(
    () => new Map(snapshot.refunds.map((record) => [record.bookingId, record])),
    [snapshot.refunds]
  );

  const refundRows = useMemo(() => {
    const existing = snapshot.refunds.map((record) => ({
      booking: snapshot.bookings.find((item) => item.id === record.bookingId),
      record,
      suggested: null as ReturnType<typeof calculateRefundFromBooking> | null,
    }));

    const missing = snapshot.bookings
      .filter((booking) => booking.status === "cancellation_requested" && !refundsByBooking.has(booking.id))
      .map((booking) => ({
        booking,
        record: null as CancellationRecord | null,
        suggested: calculateRefundFromBooking(booking),
      }));

    return [...existing, ...missing].sort((a, b) => {
      const left = a.record?.cancelledAt ?? a.booking?.createdAt ?? "";
      const right = b.record?.cancelledAt ?? b.booking?.createdAt ?? "";
      return right.localeCompare(left);
    });
  }, [refundsByBooking, snapshot.bookings, snapshot.refunds]);

  function setCaseStatus(id: string, status: DisputeStatus) {
    const current = snapshot.disputes.find((item) => item.id === id);
    if (!current || current.status === status) return;

    writeDisputeRecords(snapshot.disputes.map((item) => (item.id === id ? { ...item, status } : item)));
    appendAuditLog({
      actor: "Admin",
      action: `Marked dispute as ${status}`,
      entityType: "booking",
      entityId: current.bookingId,
      entityLabel: current.id,
      details: `${TYPE_LABEL[current.type]} for ${current.customerName} and ${current.vendorName}.`,
    });
  }

  function createRefundRecord(booking: Booking) {
    const record = buildRefundRecord(booking);
    writeRefundRecords([record, ...snapshot.refunds]);
    appendAuditLog({
      actor: "Admin",
      action: "Created refund case",
      entityType: "booking",
      entityId: booking.id,
      entityLabel: booking.customerName,
      details: `Refund initiated for ${formatLKR(record.refundAmount)} with ${record.daysBeforeEvent} days remaining.`,
    });
  }

  function setRefundStatus(bookingId: string, status: CancellationRecord["refundStatus"]) {
    const current = snapshot.refunds.find((item) => item.bookingId === bookingId);
    if (!current || current.refundStatus === status) return;

    writeRefundRecords(snapshot.refunds.map((item) => (item.bookingId === bookingId ? { ...item, refundStatus: status } : item)));
    appendAuditLog({
      actor: "Admin",
      action: `Updated refund to ${status}`,
      entityType: "payment",
      entityId: bookingId,
      entityLabel: bookingId,
      details: `Refund amount ${formatLKR(current.refundAmount)} for ${current.vendorName}.`,
    });
  }

  return (
    <div className="space-y-6">
      <div className="rounded-[10px] border border-slate/10 bg-white p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h2 className="font-display text-lg text-slate">Dispute SLA timeline</h2>
            <p className="mt-1 text-sm text-slate-soft">Every open case must be resolved within 5 business days of being raised.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-[8px] border border-warning/20 bg-warning-pale px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-warning">Open cases</p>
              <p className="mt-1 font-display text-2xl text-warning">{openCount}</p>
            </div>
            <div className="rounded-[8px] border border-danger/20 bg-danger-pale px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-danger">Overdue cases</p>
              <p className="mt-1 font-display text-2xl text-danger">{overdueCount}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-[10px] border border-slate/10 bg-white p-5">
        <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-display text-lg text-slate">Refund processing</h2>
            <p className="mt-1 text-sm text-slate-soft">Calculate refund amounts, start processing, and track when funds are credited.</p>
          </div>
          <Badge tone="slate">{refundRows.length} tracked items</Badge>
        </div>

        {refundRows.length === 0 ? (
          <EmptyState icon={<TimerReset size={28} />} title="No refund activity yet" description="Cancellation requests and refund cases will appear here." />
        ) : (
          <div className="space-y-3">
            {refundRows.map(({ booking, record, suggested }) => {
              const amount = record?.refundAmount ?? suggested?.refundAmount ?? 0;
              const daysBeforeEvent = record?.daysBeforeEvent ?? suggested?.daysBeforeEvent ?? 0;
              const refundPercent = suggested?.refundPercent;
              const label = booking?.customerName ?? record?.customerId ?? record?.bookingId;

              return (
                <div key={record?.bookingId ?? booking?.id} className="rounded-[8px] border border-slate/10 bg-ivory p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-medium text-slate">{record?.bookingId ?? booking?.id}</p>
                        {record ? (
                          <Badge tone={REFUND_TONE[record.refundStatus]} className="capitalize">
                            {record.refundStatus}
                          </Badge>
                        ) : (
                          <Badge tone="warning">Awaiting admin action</Badge>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-slate-soft">{label}</p>
                      <p className="mt-1 text-xs text-slate-soft">
                        {record?.vendorName ?? booking?.vendorName ?? booking?.items[0]?.vendorName ?? "Vendor pending"} · {daysBeforeEvent} days before event
                        {typeof refundPercent === "number" ? ` · ${refundPercent}% policy refund` : ""}
                      </p>
                      <p className="mt-1 text-xs text-slate-soft">{record?.reason ?? "Cancellation request awaiting refund case creation."}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-display text-xl text-burgundy-deep">{formatLKR(amount)}</p>
                      <p className="text-xs text-slate-soft">{record ? `Updated ${formatDateShort(record.cancelledAt)}` : "Calculated from current booking policy"}</p>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {!record && booking && amount > 0 && (
                      <Button size="sm" onClick={() => createRefundRecord(booking)}>
                        Create refund record
                      </Button>
                    )}
                    {!record && amount === 0 && (
                      <Badge tone="danger">No refund due under current policy</Badge>
                    )}
                    {record && record.refundStatus !== "pending" && (
                      <Button size="sm" variant="secondary" onClick={() => setRefundStatus(record.bookingId, "pending")}>
                        Mark pending
                      </Button>
                    )}
                    {record && record.refundStatus !== "processing" && (
                      <Button size="sm" variant="secondary" onClick={() => setRefundStatus(record.bookingId, "processing")}>
                        Mark processing
                      </Button>
                    )}
                    {record && record.refundStatus !== "credited" && (
                      <Button size="sm" onClick={() => setRefundStatus(record.bookingId, "credited")}>
                        Mark credited
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="mb-6 flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
        {FILTERS.map((item) => (
          <button
            key={item.id}
            onClick={() => setFilter(item.id)}
            className={`shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
              filter === item.id
                ? "border-burgundy bg-burgundy text-white"
                : "border-slate/15 text-slate-soft hover:border-burgundy hover:text-burgundy"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {openCount > 0 && (
        <p className="flex items-center gap-2 text-sm text-slate-soft">
          <AlertTriangle size={14} className="text-warning" />
          <span className="font-semibold text-warning">{openCount} case{openCount !== 1 ? "s" : ""}</span> need attention.
          {overdueCount > 0 && <span className="text-danger">{overdueCount} overdue.</span>}
        </p>
      )}

      {visible.length === 0 ? (
        <EmptyState icon={<Search size={28} />} title="No cases in this filter" />
      ) : (
        <div className="space-y-4">
          {visible.map((item) => {
            const sla = getDisputeSla(item.raisedAt);
            const active = item.status !== "resolved" && item.status !== "rejected";
            const hoursOverdue = Math.max(0, Math.abs(sla.hoursRemaining));

            return (
              <div key={item.id} className="rounded-[8px] border border-slate/8 bg-white p-5 shadow-soft">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-display text-lg text-slate">{item.id}</p>
                      <Badge tone="slate">{TYPE_LABEL[item.type]}</Badge>
                      {active && (
                        <Badge tone={sla.overdue ? "danger" : "warning"}>
                          {sla.overdue ? `Overdue by ${hoursOverdue}h` : `Due ${formatDateShort(sla.dueAt)}`}
                        </Badge>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-slate-soft">
                      Booking {item.bookingId} · {getCategoryBySlug(item.categorySlug)?.name} · {item.customerName} to {item.vendorName}
                    </p>
                  </div>
                  <Badge tone={STATUS_TONE[item.status]} className="capitalize">
                    {item.status}
                  </Badge>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-slate-soft">{item.description}</p>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                  <div className="text-xs text-slate-soft">
                    <p>{item.amount > 0 ? `Amount in question: ${formatLKR(item.amount)}` : "No payment involved"} · Raised {formatDate(item.raisedAt)}</p>
                    {active && <p className="mt-1">Escalation target: resolve within 5 business days. Due on {formatDate(sla.dueAt)}.</p>}
                  </div>
                  {active && (
                    <div className="flex gap-2">
                      {item.status === "open" && (
                        <Button size="sm" variant="secondary" onClick={() => setCaseStatus(item.id, "investigating")}>
                          Investigate
                        </Button>
                      )}
                      <Button size="sm" variant="secondary" icon={<XCircle size={14} />} onClick={() => setCaseStatus(item.id, "rejected")}>
                        Reject
                      </Button>
                      <Button size="sm" icon={<CheckCircle2 size={14} />} onClick={() => setCaseStatus(item.id, "resolved")}>
                        Resolve
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
