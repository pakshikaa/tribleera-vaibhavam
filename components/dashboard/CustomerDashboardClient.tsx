"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarClock, ClipboardList, MapPin, Wallet } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input, Select, Textarea } from "@/components/ui/Field";
import { Modal } from "@/components/ui/Modal";
import { StatCard } from "@/components/ui/StatCard";
import { Tabs } from "@/components/ui/Tabs";
import { SubmitReviewSheet } from "@/components/dashboard/SubmitReviewSheet";
import { BookingStatusBadge } from "@/components/dashboard/StatusBadge";
import { useToast } from "@/components/ui/Toast";
import { bookings as seedBookings } from "@/lib/data/bookings";
import { cancelledBookings as seedCancelledBookings, type CancellationRecord } from "@/lib/data/cancelledBookings";
import { eventRequests as seedEventRequests, type EventRequest } from "@/lib/data/eventRequests";
import { getCategoryBySlug } from "@/lib/data/categories";
import { getVendorBySlug } from "@/lib/data/vendors";
import { formatDate, formatLKR } from "@/lib/utils/format";
import { readLocalStorage, writeLocalStorage } from "@/lib/utils/browser-storage";
import type { Booking } from "@/types";

const CUSTOMER_NAME = "Niranjala & Kajan";
const BOOKING_STORAGE_KEY = "tribleera-customer-bookings";
const CANCELLATION_STORAGE_KEY = "tribleera-cancellations";

function calculateRefund(booking: Booking) {
  const eventDate = new Date(booking.eventDate).getTime();
  const daysBeforeEvent = Math.max(0, Math.ceil((eventDate - Date.now()) / (1000 * 60 * 60 * 24)));

  if (daysBeforeEvent >= 30) {
    return { amount: Math.round(booking.payableNow * 0.5), label: "You qualify for a 50% refund" };
  }
  if (daysBeforeEvent >= 7) {
    return { amount: Math.round(booking.payableNow * 0.25), label: "You qualify for a 25% refund" };
  }

  return { amount: booking.platformFee, label: "Platform fee is non-refundable" };
}

function getRefundStatus(cancelledAt: string): CancellationRecord["refundStatus"] {
  const daysSinceCancellation = (Date.now() - new Date(cancelledAt).getTime()) / (1000 * 60 * 60 * 24);
  if (daysSinceCancellation >= 2) return "credited";
  if (daysSinceCancellation >= 1) return "processing";
  return "pending";
}

export function CustomerDashboardClient() {
  const router = useRouter();
  const { showToast } = useToast();
  const initialBookings = seedBookings.filter((booking) => booking.customerName === CUSTOMER_NAME);
  const initialCancellations = seedCancelledBookings.filter((record) => record.customerId === "customer-niranjala-kajan");
  const initialEventRequest = seedEventRequests[0] ?? null;
  const [currentTime] = useState(() => Date.now());
  const [bookings, setBookings] = useState<Booking[]>(() =>
    typeof window === "undefined" ? initialBookings : readLocalStorage<Booking[]>(BOOKING_STORAGE_KEY, initialBookings)
  );
  const [cancellations, setCancellations] = useState<CancellationRecord[]>(() =>
    typeof window === "undefined"
      ? initialCancellations
      : readLocalStorage<CancellationRecord[]>(CANCELLATION_STORAGE_KEY, initialCancellations)
  );
  const [eventRequest] = useState<EventRequest | null>(() =>
    typeof window === "undefined" ? initialEventRequest : readLocalStorage<EventRequest | null>("tribleera-event-request", initialEventRequest)
  );
  const [cancelBooking, setCancelBooking] = useState<Booking | null>(null);
  const [cancelStep, setCancelStep] = useState(1);
  const [cancelReason, setCancelReason] = useState("Change of plans");
  const [cancelNotes, setCancelNotes] = useState("");
  const [reviewTarget, setReviewTarget] = useState<{ bookingId: string; vendorId: string } | null>(null);
  const [reviewedBookingIds, setReviewedBookingIds] = useState<string[]>(() =>
    typeof window === "undefined"
      ? []
      : readLocalStorage<{ bookingId: string }[]>("tribleera-reviews", []).map((review) => review.bookingId)
  );

  useEffect(() => {
    writeLocalStorage(BOOKING_STORAGE_KEY, bookings);
  }, [bookings]);

  useEffect(() => {
    writeLocalStorage(CANCELLATION_STORAGE_KEY, cancellations);
  }, [cancellations]);

  const activeBookings = bookings.filter((booking) => booking.status !== "completed" && booking.status !== "cancelled");
  const totalPaid = bookings.reduce((sum, booking) => sum + booking.payableNow, 0);
  const nextEvent = bookings[0]?.eventDate;
  const requestExpiryDays = useMemo(() => {
    if (!eventRequest) return null;
    const expiryMs = new Date(eventRequest.createdAt).getTime() + 3 * 24 * 60 * 60 * 1000;
    return Math.max(0, Math.ceil((expiryMs - currentTime) / (1000 * 60 * 60 * 24)));
  }, [currentTime, eventRequest]);

  function resetCancellation() {
    setCancelBooking(null);
    setCancelStep(1);
    setCancelReason("Change of plans");
    setCancelNotes("");
  }

  function confirmCancellation() {
    if (!cancelBooking) return;

    const refund = calculateRefund(cancelBooking);
    setBookings((prev) => prev.map((booking) => (booking.id === cancelBooking.id ? { ...booking, status: "cancelled" } : booking)));
    setCancellations(() => [
      {
        bookingId: cancelBooking.id,
        customerId: "customer-niranjala-kajan",
        vendorName: cancelBooking.items[0]?.vendorName ?? "Vendor",
        reason: cancelReason,
        cancelledAt: new Date().toISOString(),
        refundAmount: refund.amount,
        refundStatus: "pending",
        daysBeforeEvent: Math.max(
          0,
          Math.ceil((new Date(cancelBooking.eventDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
        ),
      },
      ...cancellations,
    ]);
    showToast("Booking cancelled. Refund tracking is now available.", "success");
    const bookingId = cancelBooking.id;
    resetCancellation();
    router.push(`/dashboard/customer/cancellation/${bookingId}`);
  }

  function handleReviewSubmitted() {
    if (!reviewTarget) return;
    setReviewedBookingIds((prev) => [...prev, reviewTarget.bookingId]);
    setReviewTarget(null);
  }

  return (
    <div className="bg-ivory">
      <section className="border-b border-slate/8 bg-white py-10">
        <Container className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <Avatar name={CUSTOMER_NAME} size={56} />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-soft">Welcome back</p>
              <h1 className="font-display text-2xl">{CUSTOMER_NAME}</h1>
              <p className="flex items-center gap-1 text-sm text-slate-soft">
                <MapPin size={13} /> Jaffna
              </p>
            </div>
          </div>
          <Button href="/event-request" size="md" variant="gold">
            Plan Your Wedding
          </Button>
        </Container>
      </section>

      <Container className="py-10 md:py-14">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard label="Active bookings" value={String(activeBookings.length)} icon={<ClipboardList size={18} />} />
          <StatCard label="Total paid to date" value={formatLKR(totalPaid)} icon={<Wallet size={18} />} />
          <StatCard label="Next event" value={nextEvent ? formatDate(nextEvent) : "-"} icon={<CalendarClock size={18} />} />
        </div>

        <div className="mt-10">
          <Tabs
            defaultTab="bookings"
            tabs={[
              { id: "bookings", label: "My Bookings", count: bookings.length },
              { id: "responses", label: "Vendor Responses", count: eventRequest?.responses.length ?? 0 },
              { id: "refunds", label: "Refunds", count: cancellations.length },
              { id: "profile", label: "Profile" },
            ]}
            panels={{
              bookings:
                bookings.length === 0 ? (
                  <EmptyState
                    icon={<ClipboardList size={28} />}
                    title="No bookings yet"
                    description="Once you book a vendor, it will show up here with full payment tracking."
                    action={<Button href="/services">Start planning</Button>}
                  />
                ) : (
                  <div className="space-y-4">
                    {bookings.map((booking) => {
                      const refund = calculateRefund(booking);
                      const reviewVendorId = booking.items[0]?.vendorId;
                      return (
                        <div key={booking.id} className="rounded-[8px] border border-slate/8 bg-white p-5 shadow-soft md:p-6">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div>
                              <p className="font-display text-lg text-slate">{booking.id}</p>
                              <p className="text-xs text-slate-soft">Event date: {formatDate(booking.eventDate)}</p>
                            </div>
                            <BookingStatusBadge status={booking.status} />
                          </div>
                          <div className="mt-4 divide-y divide-slate/8 border-y border-slate/8">
                            {booking.items.map((item) => (
                              <div key={item.categorySlug} className="flex items-center justify-between py-2.5 text-sm">
                                <div>
                                  <span className="text-slate-soft">{getCategoryBySlug(item.categorySlug)?.name}: </span>
                                  <span className="font-medium text-slate">{item.vendorName}</span>
                                </div>
                                <span className="text-slate-soft">{formatLKR(item.price)}</span>
                              </div>
                            ))}
                          </div>
                          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm">
                            <span className="text-slate-soft">
                              Paid now <span className="font-semibold text-burgundy-deep">{formatLKR(booking.payableNow)}</span> · Remaining{" "}
                              <span className="font-semibold text-slate">{formatLKR(booking.remainingBalance)}</span>
                            </span>
                            <div className="flex flex-wrap gap-2">
                              <Button href={`/booking/track/${booking.id}`} variant="tertiary" size="sm">
                                Track booking
                              </Button>
                              {booking.status !== "cancelled" && booking.status !== "completed" && (
                                <Button size="sm" variant="secondary" onClick={() => setCancelBooking(booking)}>
                                  Cancel Booking
                                </Button>
                              )}
                              {booking.status === "completed" && reviewVendorId && !reviewedBookingIds.includes(booking.id) && (
                                <Button size="sm" onClick={() => setReviewTarget({ bookingId: booking.id, vendorId: reviewVendorId })}>
                                  Leave a Review
                                </Button>
                              )}
                            </div>
                          </div>
                          {booking.status === "completed" && reviewedBookingIds.includes(booking.id) && (
                            <p className="mt-3 text-sm font-medium text-burgundy">✓ Review submitted</p>
                          )}
                          {booking.status !== "completed" && booking.status !== "cancelled" && (
                            <div className="mt-4 rounded-[8px] border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                              {refund.label} ({formatLKR(refund.amount)})
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ),
              responses: !eventRequest ? (
                <EmptyState
                  icon={<ClipboardList size={28} />}
                  title="No event request yet"
                  description="Create a full event request to receive vendor responses in one place."
                  action={<Button href="/event-request">Create event request</Button>}
                />
              ) : (
                <div className="space-y-5" id="responses">
                  <div className="rounded-[8px] border border-slate/8 bg-white p-5 shadow-soft">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="font-display text-xl text-slate">{eventRequest.id}</p>
                        <p className="mt-1 text-sm text-slate-soft">
                          {eventRequest.location} · {eventRequest.guestCount} guests · {eventRequest.budgetRange}
                        </p>
                      </div>
                      {requestExpiryDays !== null && (
                        <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-900">
                          Request expires in {requestExpiryDays} day{requestExpiryDays === 1 ? "" : "s"}
                        </span>
                      )}
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {eventRequest.selectedServices.map((service) => (
                        <span key={service} className="rounded-full bg-ivory px-3 py-1 text-xs font-semibold text-slate">
                          {getCategoryBySlug(service)?.name ?? service}
                        </span>
                      ))}
                    </div>
                  </div>

                  {eventRequest.responses.map((response) => {
                    const vendor = getVendorBySlug(response.vendorSlug);
                    const statusClass =
                      response.status === "accepted"
                        ? "bg-emerald-50 text-emerald-700"
                        : response.status === "pending"
                          ? "bg-amber-50 text-amber-900"
                          : "bg-slate-100 text-slate-600";

                    return (
                      <div key={response.vendorSlug} className="rounded-[8px] border border-slate/8 bg-white p-5 shadow-soft">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <p className="font-display text-lg text-slate">{vendor?.name ?? response.vendorSlug}</p>
                            <p className="mt-1 text-sm text-slate-soft">{vendor ? getCategoryBySlug(vendor.categorySlug)?.name : "Vendor"}</p>
                          </div>
                          <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase ${statusClass}`}>
                            {response.status}
                          </span>
                        </div>
                        <p className="mt-3 text-sm text-slate-soft">
                          {response.status === "accepted"
                            ? `Starting price ${formatLKR(response.startingPrice ?? vendor?.startingPrice ?? 0)}`
                            : response.status === "pending"
                              ? "Awaiting response - usually within 24 hours"
                              : response.rejectionReason ?? "Not available for your date"}
                        </p>
                        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                          <p className="text-xs text-slate-soft">
                            Responds by {formatDate(new Date(new Date(eventRequest.createdAt).getTime() + 24 * 60 * 60 * 1000))}
                          </p>
                          {response.status === "accepted" && (
                            <Button
                              size="sm"
                              variant="gold"
                              onClick={() => {
                                writeLocalStorage("tribleera-payment-selection", response);
                                router.push("/booking/payment");
                              }}
                            >
                              Select & Proceed to Payment
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ),
              refunds: cancellations.length === 0 ? (
                <EmptyState icon={<Wallet size={28} />} title="No refund activity yet" />
              ) : (
                <div className="space-y-4" id="refunds">
                  {cancellations.map((record) => {
                    const status = getRefundStatus(record.cancelledAt);
                    const completedSteps = status === "credited" ? 4 : status === "processing" ? 3 : 2;
                    return (
                      <div key={record.bookingId} className="rounded-[8px] border border-slate/8 bg-white p-5 shadow-soft">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <p className="font-display text-lg text-slate">{record.bookingId}</p>
                            <p className="text-sm text-slate-soft">{record.vendorName}</p>
                          </div>
                          <span className="rounded-full bg-ivory px-3 py-1 text-xs font-semibold capitalize text-burgundy">
                            {status}
                          </span>
                        </div>
                        <p className="mt-3 text-sm text-slate-soft">
                          Cancelled on {formatDate(record.cancelledAt)} · Refund {formatLKR(record.refundAmount)}
                        </p>
                        <div className="mt-4 grid grid-cols-2 gap-2 text-center text-[11px] text-slate-soft md:grid-cols-4">
                          {["Cancellation Requested", "Admin Reviewed", "Refund Initiated", "Credited"].map((label, index) => (
                            <div
                              key={label}
                              className={`rounded-[6px] px-2 py-2 ${index < completedSteps ? "bg-burgundy text-white" : "bg-ivory"}`}
                            >
                              {label}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ),
              profile: (
                <div className="max-w-lg rounded-[8px] border border-slate/8 bg-white p-6 shadow-soft">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Input label="Full name" defaultValue={CUSTOMER_NAME} />
                    <Input label="City" defaultValue="Jaffna" />
                    <Input label="Phone" defaultValue="+94 77 410 0012" />
                    <Input label="Email" defaultValue="niranjala.kajan@example.com" type="email" />
                  </div>
                  <Button className="mt-5">Save changes</Button>
                </div>
              ),
            }}
          />
        </div>
      </Container>

      <Modal
        title={cancelStep === 1 ? "Are you sure?" : cancelStep === 2 ? "Cancellation Reason" : "Confirm Cancellation"}
        description="Review your refund eligibility before confirming."
        open={!!cancelBooking}
        onOpenChange={(open) => {
          if (!open) resetCancellation();
        }}
      >
        {cancelBooking && (
          <div className="space-y-5">
            {cancelStep === 1 && (
              <div className="space-y-4">
                <div className="rounded-[8px] bg-ivory p-4 text-sm text-slate-soft">
                  <p>{cancelBooking.items[0]?.vendorName}</p>
                  <p>{formatDate(cancelBooking.eventDate)}</p>
                  <p>{formatLKR(cancelBooking.payableNow)} paid</p>
                </div>
                <div className="rounded-[8px] border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                  {calculateRefund(cancelBooking).label} ({formatLKR(calculateRefund(cancelBooking).amount)})
                </div>
                <Button onClick={() => setCancelStep(2)} variant="gold" fullWidth>
                  Continue
                </Button>
              </div>
            )}

            {cancelStep === 2 && (
              <div className="space-y-4">
                <Select label="Reason" value={cancelReason} onChange={(event) => setCancelReason(event.target.value)}>
                  {[
                    "Change of plans",
                    "Found another vendor",
                    "Event postponed",
                    "Financial reasons",
                    "Vendor performance concern",
                    "Other",
                  ].map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </Select>
                <Textarea label="Additional details" rows={4} value={cancelNotes} onChange={(event) => setCancelNotes(event.target.value)} />
                <div className="flex gap-3">
                  <Button variant="secondary" onClick={() => setCancelStep(1)} fullWidth>
                    Back
                  </Button>
                  <Button variant="gold" onClick={() => setCancelStep(3)} fullWidth>
                    Continue
                  </Button>
                </div>
              </div>
            )}

            {cancelStep === 3 && (
              <div className="space-y-4">
                <div className="rounded-[8px] bg-ivory p-4 text-sm text-slate-soft">
                  Refund amount: <span className="font-semibold text-slate">{formatLKR(calculateRefund(cancelBooking).amount)}</span>
                </div>
                <div className="flex gap-3">
                  <Button variant="secondary" onClick={resetCancellation} fullWidth>
                    Keep my booking
                  </Button>
                  <button
                    type="button"
                    onClick={confirmCancellation}
                    className="inline-flex w-full items-center justify-center rounded-[4px] bg-danger px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-danger/90"
                  >
                    Confirm Cancellation
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      <SubmitReviewSheet
        bookingId={reviewTarget?.bookingId ?? ""}
        vendorId={reviewTarget?.vendorId ?? ""}
        author={CUSTOMER_NAME}
        open={!!reviewTarget}
        onOpenChange={(open) => {
          if (!open) setReviewTarget(null);
        }}
        onSubmitted={handleReviewSubmitted}
      />
    </div>
  );
}
