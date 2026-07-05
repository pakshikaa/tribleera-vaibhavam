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

export function VendorContactClient({ vendorId, phone, whatsapp, packagesHref }: Props) {
  const [booked, setBooked] = useState(false);

  useEffect(() => {
    let found = false;
    try {
      const raw = window.localStorage.getItem("TRIBLEERA-last-booking");
      if (raw) {
        const record = JSON.parse(raw) as {
          items?: { vendorId: string }[];
          adminVerified?: boolean;
          status?: string;
        };
        found =
          record.adminVerified === true &&
          record.status === "confirmed" &&
          (record.items ?? []).some((item) => item.vendorId === vendorId);
      }
    } catch {
      // ignore parse errors
    }
    if (found) {
      const id = window.setTimeout(() => setBooked(true), 0);
      return () => window.clearTimeout(id);
    }
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
