"use client";

import { useEffect, useState } from "react";
import { Lock, Phone, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface Props {
  vendorId: string;
  phone: string;
  whatsapp: string;
  packagesHref: string;
}

function checkBooked(vendorId: string): boolean {
  try {
    const raw = window.localStorage.getItem("TRIBLEERA-last-booking");
    if (!raw) return false;
    const record = JSON.parse(raw) as {
      items?: { vendorId: string }[];
      adminVerified?: boolean;
      status?: string;
    };
    return (
      record.adminVerified === true &&
      record.status === "confirmed" &&
      (record.items ?? []).some((item) => item.vendorId === vendorId)
    );
  } catch {
    return false;
  }
}

export function VendorContactClient({ vendorId, phone, whatsapp, packagesHref }: Props) {
  const [booked, setBooked] = useState(false);

  useEffect(() => {
    // One-time hydration from a browser-only store; see CartContext for the
    // same documented exception to the set-state-in-effect rule.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setBooked(checkBooked(vendorId));
    const interval = setInterval(() => setBooked(checkBooked(vendorId)), 5000);
    return () => clearInterval(interval);
  }, [vendorId]);

  if (!booked) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-[8px] border border-slate/10 bg-ivory px-4 py-5 text-center">
        <Lock size={20} className="text-slate-soft" />
        <p className="text-xs font-medium text-slate-soft">Contact revealed after booking</p>
        <Button href={packagesHref} variant="gold" fullWidth size="sm" className="mt-1">
          View packages to book
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2.5">
      <a
        href={`https://wa.me/${whatsapp.replace(/\D/g, "")}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex w-full items-center justify-center gap-2 rounded-[4px] bg-[#25D366] px-5 py-2.5 text-[15px] font-semibold text-white transition-all hover:bg-[#22C55E] hover:-translate-y-0.5"
      >
        <MessageCircle size={16} /> Chat on WhatsApp
      </a>
      <Button href={`tel:${phone}`} variant="secondary" icon={<Phone size={15} />} fullWidth>
        Call vendor
      </Button>
    </div>
  );
}
