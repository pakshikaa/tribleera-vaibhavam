"use client";

import Link from "next/link";
import { useState } from "react";
import { CheckCircle2, Clock3, MapPin, Users, Wallet } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { BackButton } from "@/components/ui/BackButton";
import { readLocalStorage } from "@/lib/utils/browser-storage";
import { categories } from "@/lib/data/categories";

interface StoredEventRequest {
  id: string;
  eventDate: string;
  eventDateLabel?: string;
  eventMonth?: string;
  isFlexibleDate?: boolean;
  eventLocation: string;
  guestCount: number;
  budgetRange?: string;
  selectedServices: string[];
}

export default function EventRequestSubmittedPage() {
  const [request] = useState<StoredEventRequest | null>(() =>
    typeof window === "undefined" ? null : readLocalStorage<StoredEventRequest | null>("TRIBLEERA-event-request", null)
  );

  return (
    <div className="bg-ivory py-16">
      <Container className="max-w-3xl">
        <BackButton href="/event-request" label="Request form" className="mb-6" />
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
            <div className="mt-6 rounded-[10px] border border-slate/8 bg-ivory p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-burgundy-deep">{request.id}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.14em] text-slate-soft">Request summary</p>
                </div>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-burgundy">
                  Awaiting vendor responses
                </span>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-[8px] bg-white px-4 py-3">
                  <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-soft">
                    <Clock3 size={14} /> Event timing
                  </p>
                  <p className="mt-2 text-sm font-medium text-slate">{request.eventDateLabel ?? request.eventDate}</p>
                </div>
                <div className="rounded-[8px] bg-white px-4 py-3">
                  <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-soft">
                    <MapPin size={14} /> Location
                  </p>
                  <p className="mt-2 text-sm font-medium text-slate">{request.eventLocation}</p>
                </div>
                <div className="rounded-[8px] bg-white px-4 py-3">
                  <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-soft">
                    <Users size={14} /> Guest count
                  </p>
                  <p className="mt-2 text-sm font-medium text-slate">{request.guestCount} guests</p>
                </div>
                <div className="rounded-[8px] bg-white px-4 py-3">
                  <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-soft">
                    <Wallet size={14} /> Budget
                  </p>
                  <p className="mt-2 text-sm font-medium text-slate">{request.budgetRange ?? "Not selected"}</p>
                </div>
              </div>

              <div className="mt-5">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-soft">Requested services</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {request.selectedServices.map((service) => (
                    <span key={service} className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate">
                      {categories.find((category) => category.slug === service)?.name ?? service}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 rounded-[10px] border border-gold/20 bg-gold/10 p-5">
            <p className="text-sm font-semibold text-burgundy-deep">What happens next</p>
            <div className="mt-4 space-y-3">
              <div className="rounded-[8px] bg-white/70 px-4 py-3">
                <p className="text-sm font-semibold text-slate">1. Priority 1 vendors receive the request first</p>
                <p className="mt-1 text-sm text-slate-soft">
                  Your first-ranked vendor for each selected service is notified now and can accept or decline.
                </p>
              </div>
              <div className="rounded-[8px] bg-white/70 px-4 py-3">
                <p className="text-sm font-semibold text-slate">2. You&apos;ll get a dashboard notification when a vendor accepts</p>
                <p className="mt-1 text-sm text-slate-soft">
                  Once a vendor confirms availability, you can review the response and pay the advance to secure the booking.
                </p>
              </div>
              <div className="rounded-[8px] bg-white/70 px-4 py-3">
                <p className="text-sm font-semibold text-slate">3. If a vendor declines, the request moves to your next priority</p>
                <p className="mt-1 text-sm text-slate-soft">
                  When you have added backup vendors, the request automatically routes to Priority 2, then the next ranked vendor if needed.
                </p>
              </div>
              <div className="rounded-[8px] bg-white/70 px-4 py-3">
                <p className="text-sm font-semibold text-slate">4. You can still update your choice later</p>
                <p className="mt-1 text-sm text-slate-soft">
                  If none of the responses fit, you can return to the vendor directory, shortlist another vendor, and place a booking from there.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/dashboard/customer#responses" variant="gold">
              Open response center →
            </Button>
            <Link href="/services" className="inline-flex items-center text-sm font-semibold text-burgundy hover:underline">
              Browse more services
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
