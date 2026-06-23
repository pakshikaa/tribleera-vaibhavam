"use client";

import Link from "next/link";
import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { readLocalStorage } from "@/lib/utils/browser-storage";

interface StoredEventRequest {
  id: string;
  eventDate: string;
  eventLocation: string;
  guestCount: number;
  budgetRange: string;
  selectedServices: string[];
}

export default function EventRequestSubmittedPage() {
  const [request] = useState<StoredEventRequest | null>(() =>
    typeof window === "undefined" ? null : readLocalStorage<StoredEventRequest | null>("tribleera-event-request", null)
  );

  return (
    <div className="bg-ivory py-16">
      <Container className="max-w-3xl">
        <div className="rounded-[12px] border border-slate/10 bg-white p-8 shadow-soft">
          <div className="flex items-center gap-3 text-burgundy">
            <CheckCircle2 size={28} />
            <p className="text-sm font-semibold uppercase tracking-[0.18em]">Request submitted</p>
          </div>
          <h1 className="mt-4 font-display text-4xl text-slate">Your Request is Live</h1>
          <p className="mt-3 text-base text-slate-soft">
            Vendors matching your criteria will respond within 24 hours.
          </p>

          {request && (
            <div className="mt-6 rounded-[10px] bg-ivory p-5">
              <p className="text-sm font-semibold text-burgundy-deep">{request.id}</p>
              <p className="mt-2 text-sm text-slate-soft">
                {request.eventDate} · {request.eventLocation} · {request.guestCount} guests
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {request.selectedServices.map((service) => (
                  <span key={service} className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate">
                    {service}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 rounded-[10px] border border-gold/20 bg-gold/10 p-5">
            <p className="text-sm font-semibold text-burgundy-deep">What&apos;s Next?</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-soft">
              <li>✓ Request sent to matched vendors</li>
              <li>○ Vendors will respond within 24 hours</li>
              <li>○ You&apos;ll receive responses in your dashboard</li>
              <li>○ Select your preferred vendor and proceed to payment</li>
            </ul>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/dashboard/customer#responses" variant="gold">
              View my responses →
            </Button>
            <Link href="/services" className="inline-flex items-center text-sm font-semibold text-burgundy hover:underline">
              Continue browsing services
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
