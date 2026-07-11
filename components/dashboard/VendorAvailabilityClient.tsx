"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarX2, Plus, Trash2, CheckCircle2, PauseCircle } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Field";
import { bookings } from "@/lib/data/bookings";
import { getVendorBySlug } from "@/lib/data/vendors";
import { formatDate } from "@/lib/utils/format";
import { readVendorAvailability, writeVendorAvailability } from "@/lib/utils/availability";

const FALLBACK_SLUG = "jaffna-frames-studio";

// Demo seed, stored the first time a vendor opens this page (ISO form so the
// customer-facing availability badge can match against event dates).
const INITIAL_BLOCKED = ["2026-12-04", "2026-12-12", "2027-01-18", "2027-02-02"];

function formatBlockedDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-LK", { day: "numeric", month: "short", year: "numeric" });
}

export function VendorAvailabilityClient() {
  const [vendorSlug, setVendorSlug] = useState(FALLBACK_SLUG);
  const [accepting, setAccepting] = useState(true);
  const [blocked, setBlocked] = useState<string[]>([]);
  const [newDate, setNewDate] = useState("");
  const [hydrated, setHydrated] = useState(false);

  // Load the signed-in vendor's persisted availability; what's saved here is
  // what customers see on vendor cards and profiles.
  useEffect(() => {
    let slug = FALLBACK_SLUG;
    try {
      slug = sessionStorage.getItem("vendor-slug") || FALLBACK_SLUG;
    } catch {}
    const stored = readVendorAvailability(slug);
    const blockedDates = stored.blockedDates.length > 0 ? stored.blockedDates : INITIAL_BLOCKED;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVendorSlug(slug);
    setAccepting(stored.accepting);
    setBlocked(blockedDates);
    setHydrated(true);
    if (stored.blockedDates.length === 0) {
      writeVendorAvailability(slug, { accepting: stored.accepting, blockedDates });
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    writeVendorAvailability(vendorSlug, { accepting, blockedDates: blocked });
  }, [hydrated, vendorSlug, accepting, blocked]);

  const vendorId = getVendorBySlug(vendorSlug)?.id ?? "";

  const confirmedBookings = useMemo(() => {
    return bookings
      .filter(
        (b) =>
          (b.status === "confirmed" || b.status === "advance_paid") &&
          b.items.some((item) => item.vendorId === vendorId)
      )
      .map((b) => ({
        bookingId: b.id,
        customerName: b.customerName,
        eventDate: b.eventDate,
        formatted: new Date(b.eventDate).toLocaleDateString("en-LK", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
        status: b.status,
      }));
  }, [vendorId]);

  function addDate(e: React.FormEvent) {
    e.preventDefault();
    if (!newDate || blocked.includes(newDate)) return;
    setBlocked((prev) => [...prev, newDate].sort());
    setNewDate("");
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-[8px] border border-slate/8 bg-white p-5 shadow-soft">
        <div className="flex items-center gap-3">
          <div className={`flex h-11 w-11 items-center justify-center rounded-full ${accepting ? "bg-success-pale text-success" : "bg-warning-pale text-warning"}`}>
            {accepting ? <CheckCircle2 size={20} /> : <PauseCircle size={20} />}
          </div>
          <div>
            <p className="font-display text-lg text-slate">{accepting ? "Accepting new bookings" : "Paused — not accepting bookings"}</p>
            <p className="text-sm text-slate-soft">
              {accepting ? "Customers can send you booking requests right now." : "Your profile stays visible, but new requests are paused."}
            </p>
          </div>
        </div>
        <Button variant={accepting ? "secondary" : "primary"} onClick={() => setAccepting((a) => !a)}>
          {accepting ? "Pause bookings" : "Resume bookings"}
        </Button>
      </div>

      <div className="rounded-[8px] border border-slate/8 bg-white p-6 shadow-soft">
        <div className="flex items-center gap-2.5">
          <CalendarX2 size={18} className="text-gold-deep" />
          <p className="font-display text-lg text-slate">Blocked dates</p>
        </div>
        <p className="mt-1 text-sm text-slate-soft">
          Dates you mark here are hidden from customers automatically, so you never get double-booked.
        </p>

        {confirmedBookings.length > 0 && (
          <div className="mt-5">
            <p className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-slate-soft">Confirmed bookings</p>
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
              {confirmedBookings.map((entry) => (
                <div key={entry.bookingId} className="flex items-center justify-between rounded-lg border border-burgundy/20 bg-burgundy/5 px-3.5 py-2.5 text-sm">
                  <div>
                    <p className="font-medium text-slate">{entry.formatted}</p>
                    <p className="text-xs text-slate-soft">{entry.customerName}</p>
                  </div>
                  <Badge tone="rose">{entry.status === "advance_paid" ? "Paid" : "Confirmed"}</Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-5">
          {blocked.length > 0 && (
            <p className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-slate-soft">Manually blocked</p>
          )}
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {blocked.map((d) => (
              <div key={d} className="flex items-center justify-between rounded-lg border border-slate/10 px-3.5 py-2.5 text-sm">
                {formatBlockedDate(d)}
                <div className="flex items-center gap-2">
                  <Badge tone="danger">Blocked</Badge>
                  <button
                    aria-label={`Remove ${formatBlockedDate(d)}`}
                    onClick={() => setBlocked((prev) => prev.filter((x) => x !== d))}
                    className="text-slate-soft hover:text-danger"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={addDate} className="mt-5 flex flex-col gap-2.5 sm:flex-row sm:items-end">
          <div className="flex-1">
            <Input label="Block a new date" type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} />
          </div>
          <Button type="submit" icon={<Plus size={15} />}>
            Add date
          </Button>
        </form>
      </div>

      {confirmedBookings.length > 0 && (
        <div className="rounded-[8px] border border-slate/8 bg-white p-6 shadow-soft">
          <p className="font-display text-lg text-slate">Upcoming confirmed bookings</p>
          <div className="mt-4 divide-y divide-slate/8">
            {confirmedBookings.map((entry) => (
              <div key={entry.bookingId} className="flex items-center justify-between py-3 text-sm">
                <div>
                  <p className="font-medium text-slate">{entry.bookingId}</p>
                  <p className="text-xs text-slate-soft">{entry.customerName} · {formatDate(entry.eventDate)}</p>
                </div>
                <Badge tone={entry.status === "advance_paid" ? "gold" : "rose"}>
                  {entry.status === "advance_paid" ? "Advance paid" : "Confirmed"}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
