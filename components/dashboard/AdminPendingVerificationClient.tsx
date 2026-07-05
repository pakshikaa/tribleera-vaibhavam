"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Clock } from "lucide-react";
import { formatLKR } from "@/lib/utils/format";

interface PendingBooking {
  id: string;
  items: { vendorName: string }[];
  totals: { payableNow: number };
  customer: { name: string; eventDate: string };
  adminVerified?: boolean;
  status?: string;
}

export function AdminPendingVerificationClient() {
  const [booking, setBooking] = useState<PendingBooking | null>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem("TRIBLEERA-last-booking");
      if (raw) {
        const parsed: PendingBooking = JSON.parse(raw);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (!parsed.adminVerified) setBooking(parsed);
      }
    } catch {
      // ignore corrupted storage
    }
  }, []);

  if (!booking) return null;

  function verify() {
    if (!booking) return;
    try {
      const raw = window.localStorage.getItem("TRIBLEERA-last-booking");
      if (raw) {
        const record = JSON.parse(raw);
        record.adminVerified = true;
        record.status = "confirmed";
        window.localStorage.setItem("TRIBLEERA-last-booking", JSON.stringify(record));
      }
    } catch {
      // storage unavailable
    }
    setBooking(null);
  }

  return (
    <div className="rounded-[10px] border border-amber-200 bg-amber-50 p-5">
      <div className="mb-3 flex items-center gap-2">
        <Clock size={16} className="text-amber-600" />
        <p className="text-sm font-semibold text-amber-800">Pending verification</p>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-[8px] bg-white p-4">
        <div>
          <p className="font-medium text-slate">{booking.id} &middot; {booking.customer.name}</p>
          <p className="text-xs text-slate-soft">
            {booking.items.map((item) => item.vendorName).join(", ")} &middot; {formatLKR(booking.totals.payableNow)}
          </p>
        </div>
        <button
          type="button"
          onClick={verify}
          className="flex items-center gap-1.5 rounded-[6px] bg-burgundy px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-burgundy-deep"
        >
          <CheckCircle2 size={14} /> Verify
        </button>
      </div>
    </div>
  );
}
