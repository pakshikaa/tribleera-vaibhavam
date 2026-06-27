"use client";

import { useMemo, useState } from "react";
import { CalendarX2, Plus, Trash2, CheckCircle2, PauseCircle } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Field";
import { bookings } from "@/lib/data/bookings";
import { getVendorBySlug } from "@/lib/data/vendors";
import { formatDate } from "@/lib/utils/format";

const VENDOR_SLUG = "jaffna-frames-studio";
const vendorId = getVendorBySlug(VENDOR_SLUG)?.id ?? "";

const INITIAL_BLOCKED = ["Dec 4, 2026", "Dec 12, 2026", "Jan 18, 2027", "Feb 2, 2027"];

export function VendorAvailabilityClient() {
  const [accepting, setAccepting] = useState(true);
  const [blocked, setBlocked] = useState(INITIAL_BLOCKED);
  const [newDate, setNewDate] = useState("");

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
  }, []);

  function addDate(e: React.FormEvent) {
    e.preventDefault();
    if (!newDate) return;
    const formatted = new Date(newDate).toLocaleDateString("en-LK", { day: "numeric", month: "short", year: "numeric" });
    setBlocked((prev) => [...prev, formatted]);
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
                {d}
                <div className="flex items-center gap-2">
                  <Badge tone="danger">Blocked</Badge>
                  <button
                    aria-label={`Remove ${d}`}
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
