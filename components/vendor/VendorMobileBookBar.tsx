"use client";

import { useEffect, useState } from "react";
import { Lock, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Sheet, SheetTrigger, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { formatLKR } from "@/lib/utils/format";
import { Vendor } from "@/types";

export function VendorMobileBookBar({ vendor }: { vendor: Vendor }) {
  const [booked, setBooked] = useState(false);

  useEffect(() => {
    let found = false;
    try {
      const raw = window.localStorage.getItem("triblerera-last-booking");
      if (raw) {
        const record = JSON.parse(raw) as { items?: { vendorId: string }[] };
        found = (record.items ?? []).some((item) => item.vendorId === vendor.id);
      }
    } catch {}
    if (found) {
      const id = window.setTimeout(() => setBooked(true), 0);
      return () => window.clearTimeout(id);
    }
  }, [vendor.id]);

  return (
    <div className="fixed inset-x-0 bottom-[56px] z-30 border-t border-slate/10 bg-white px-4 py-3 shadow-lift md:hidden">
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <p className="text-[10px] uppercase tracking-wide text-slate-soft">Starting at</p>
          <p className="font-display text-lg font-bold text-burgundy-deep">{formatLKR(vendor.startingPrice)}</p>
        </div>

        {booked ? (
          <a
            href={`https://wa.me/${vendor.whatsapp.replace(/\D/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white"
          >
            <MessageCircle size={18} />
          </a>
        ) : (
          <div
            title="Contact unlocked after booking"
            aria-hidden="true"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate/15 bg-ivory text-slate-soft"
          >
            <Lock size={16} />
          </div>
        )}

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="gold" size="sm">
              View packages
            </Button>
          </SheetTrigger>
          <SheetContent className="overflow-y-auto">
            <SheetTitle>Choose a package</SheetTitle>
            <p className="mt-1 text-sm text-slate-soft">{vendor.name}</p>
            <div className="mt-6 space-y-4">
              {vendor.packages.map((pkg) => (
                <div
                  key={pkg.id}
                  className={`rounded-[8px] border p-4 ${pkg.recommended ? "border-burgundy bg-burgundy/5" : "border-slate/10 bg-white"}`}
                >
                  {pkg.recommended && (
                    <span className="mb-2 inline-block rounded-full bg-gold px-2.5 py-0.5 text-[10px] font-bold text-burgundy-deep">
                      Most booked
                    </span>
                  )}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-display text-base font-semibold text-slate">{pkg.name}</p>
                      <p className="mt-0.5 text-xs text-slate-soft">{pkg.description}</p>
                    </div>
                    <p className="shrink-0 font-display text-lg font-bold text-burgundy-deep">{formatLKR(pkg.price)}</p>
                  </div>
                  <ul className="mt-3 space-y-1">
                    {pkg.inclusions.slice(0, 3).map((inc) => (
                      <li key={inc} className="flex items-center gap-1.5 text-xs text-slate-soft">
                        <span className="text-success">✓</span> {inc}
                      </li>
                    ))}
                  </ul>
                  <Button
                    href={`/vendors/${vendor.slug}/packages`}
                    variant="primary"
                    size="sm"
                    fullWidth
                    className="mt-3"
                  >
                    Select this package
                  </Button>
                </div>
              ))}
            </div>

            {booked ? (
              <a
                href={`https://wa.me/${vendor.whatsapp.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-[4px] bg-[#25D366] py-3 text-sm font-semibold text-white hover:bg-[#22C55E]"
              >
                <MessageCircle size={16} /> Chat on WhatsApp
              </a>
            ) : (
              <div className="mt-4 flex items-center gap-2 rounded-[8px] border border-slate/10 bg-ivory px-4 py-3 text-center">
                <Lock size={15} className="shrink-0 text-slate-soft" />
                <p className="text-xs text-slate-soft">WhatsApp contact unlocked after booking confirmation</p>
              </div>
            )}
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
