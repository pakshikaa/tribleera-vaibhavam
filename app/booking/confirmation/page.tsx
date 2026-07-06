"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Calendar,
  Sparkles,
  Phone,
  MessageCircle,
  ArrowRight,
  Circle,
  ShieldCheck,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { BookingSteps } from "@/components/booking/BookingSteps";
import { SmartImage } from "@/components/ui/SmartImage";
import { formatLKR, formatDate } from "@/lib/utils/format";
import { BookingLineItem } from "@/types";
import { MoneyBreakdown } from "@/lib/utils/booking";
import { getVendorBySlug } from "@/lib/data/vendors";
import { getCategoryBySlug } from "@/lib/data/categories";

interface LastBooking {
  id: string;
  items: BookingLineItem[];
  totals: MoneyBreakdown;
  customer: { name: string; phone: string; email: string; eventDate: string };
  paymentMethod: string;
  createdAt: string;
  status?: "pending" | "confirmed";
  adminVerified?: boolean;
}

function ShareBookingSection({ bookingId }: { bookingId: string }) {
  const [copied, setCopied] = useState(false);

  function copyId() {
    navigator.clipboard.writeText(bookingId).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {});
  }

  const waText = encodeURIComponent(`I just booked my Jaffna wedding vendors on TRIBLEERA VAIBHAVAM! 🎊 Booking ref: ${bookingId}`);

  return (
    <div className="rounded-[8px] border border-rose/30 bg-rose-pale/40 p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-burgundy-deep">Share &amp; save</p>
      <div className="mt-3 flex flex-col gap-2.5 sm:flex-row">
        <a
          href={`https://wa.me/?text=${waText}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-1 items-center justify-center gap-2 rounded-[4px] bg-[#25D366] py-2.5 text-sm font-semibold text-white hover:bg-[#22C55E]"
        >
          <MessageCircle size={15} /> Share on WhatsApp
        </a>
        <button
          onClick={copyId}
          className="flex flex-1 items-center justify-center gap-2 rounded-[4px] border border-slate/15 bg-white py-2.5 text-sm font-semibold text-slate hover:border-burgundy hover:text-burgundy"
        >
          {copied ? "✓ Copied!" : `Copy ref: ${bookingId}`}
        </button>
      </div>
    </div>
  );
}

const NEXT_STEPS = [
  { label: "Advance payment received and held in escrow", done: true },
  { label: "Each vendor has been notified to block your date", done: true },
  { label: "Track responses and milestones from your dashboard", done: false },
];

export default function BookingConfirmationPage() {
  const [booking, setBooking] = useState<LastBooking | null | undefined>(undefined);
  const [orderStatus, setOrderStatus] = useState<"pending" | "confirmed">("pending");

  useEffect(() => {
    // One-time hydration from a browser-only store; see CartContext for the
    // same documented exception to the set-state-in-effect rule.
    try {
      const raw = window.localStorage.getItem("TRIBLEERA-last-booking");
      const parsed: LastBooking | null = raw ? JSON.parse(raw) : null;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setBooking(parsed);
      setOrderStatus(parsed?.adminVerified ? "confirmed" : "pending");
    } catch {
      setBooking(null);
    }
  }, []);

  // Poll for the admin's verification action (see AdminPendingVerificationClient),
  // which flips adminVerified/status on this same localStorage record.
  useEffect(() => {
    if (orderStatus !== "pending" || !booking) return;
    const interval = setInterval(() => {
      try {
        const raw = window.localStorage.getItem("TRIBLEERA-last-booking");
        if (raw) {
          const record = JSON.parse(raw);
          if (record.adminVerified) {
            setOrderStatus("confirmed");
          }
        }
      } catch {
        // storage unavailable — status stays pending for this session
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [orderStatus, booking]);

  if (booking === undefined) {
    return <Container className="py-20" />;
  }

  if (!booking) {
    return (
      <Container className="py-20">
        <EmptyState
          icon={<CheckCircle2 size={32} />}
          title="No recent booking found"
          description="Once you complete a payment, your confirmation will appear here."
          action={<Button href="/services">Start planning</Button>}
        />
      </Container>
    );
  }

  return (
    <div className="bg-ivory">
      <section className="border-b border-slate/8 bg-white py-8 md:py-10">
        <Container>
          <BookingSteps current={4} />
        </Container>
      </section>

      <section className="bg-gradient-to-b from-rose-pale/60 to-transparent py-12 md:py-16">
        <Container>
          <div className="mx-auto max-w-xl text-center">
            <Image
              src="/logo/tribleera-mark-192.png"
              alt="TRIBLEERA VAIBHAVAM"
              width={56}
              height={56}
              className="mx-auto rounded-[4px] shadow-soft"
            />
            <div className="mt-5 flex items-center justify-center gap-1.5 text-gold">
              <Sparkles size={18} />
              <span className="h-1.5 w-1.5 rounded-full bg-burgundy-deep" />
            </div>
            <h1 className="mt-4 font-display text-3xl text-burgundy-deep md:text-4xl">Your Dream is Now a Plan</h1>
            <p className="mt-3 text-[15px] italic text-slate-soft">
              Booking complete. Your curated celebration has been secured.
            </p>
            <p className="mt-4 inline-block rounded-full bg-burgundy/8 px-4 py-1.5 font-display text-sm text-burgundy-deep">
              Booking ID: {booking.id}
            </p>
          </div>
        </Container>
      </section>

      <Container className="py-4 pb-16 md:pb-20">
        <div className="mx-auto max-w-2xl space-y-6">
          {orderStatus === "pending" ? (
            <div className="rounded-[10px] border border-amber-200 bg-amber-50 p-6 text-center">
              <div className="mb-3 flex items-center justify-center gap-2">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
                <p className="font-semibold text-amber-800">Payment received — awaiting admin verification</p>
              </div>
              <p className="text-sm text-amber-700">
                Your advance payment is being verified. This usually takes under 2 minutes. You will be notified
                once confirmed.
              </p>
            </div>
          ) : (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="rounded-[10px] border border-success/30 bg-success-pale/40 p-6 text-center"
            >
              <CheckCircle2 size={40} className="mx-auto mb-3 text-success" />
              <p className="font-display text-2xl font-bold text-slate">Order Confirmed ✅</p>
              <p className="mt-2 text-sm text-slate-soft">
                All vendors have been notified. Your booking is locked in.
              </p>
            </motion.div>
          )}

          <div className="rounded-[8px] border border-slate/8 bg-white p-6 shadow-soft">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <Badge tone={orderStatus === "confirmed" ? "success" : "gold"}>
                {orderStatus === "confirmed" ? "Confirmed" : "Awaiting verification"}
              </Badge>
              <span className="flex items-center gap-1.5 text-sm text-slate-soft">
                <Calendar size={14} className="text-gold-deep" />
                {booking.customer.eventDate ? formatDate(booking.customer.eventDate) : "Date to be confirmed"}
              </span>
            </div>
            <div className="mt-4 divide-y divide-slate/8 border-t border-slate/8">
              {booking.items.map((item) => (
                <div key={item.categorySlug} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-semibold text-slate">{item.vendorName}</p>
                    <p className="text-xs text-slate-soft">{item.packageName} package</p>
                  </div>
                  <p className="font-display text-base text-burgundy-deep">{formatLKR(item.price)}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-slate/8 pt-4">
              <span className="text-sm font-semibold text-slate">Total paid now</span>
              <span className="font-display text-xl text-burgundy-deep">{formatLKR(booking.totals.payableNow)}</span>
            </div>
            <div className="mt-1 flex items-center justify-between text-xs text-slate-soft">
              <span>Remaining balance, due to vendors at milestones</span>
              <span>{formatLKR(booking.totals.remainingBalance)}</span>
            </div>
          </div>

          <div className="space-y-4">
            {booking.items.map((item) => {
              const vendor = getVendorBySlug(item.vendorId);
              if (!vendor) return null;
              return (
                <div key={item.categorySlug} className="overflow-hidden rounded-[8px] border border-slate/8 bg-white shadow-soft">
                  <div className="relative h-32">
                    <SmartImage
                      src={vendor.imageUrl}
                      alt={vendor.name}
                      fallbackVariant={vendor.motif}
                      fallbackTone={vendor.tone}
                      fallbackSeed={vendor.id.length}
                      sizes="600px"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <p className="font-display text-lg text-slate">{vendor.name}</p>
                      <Badge tone="success">{getCategoryBySlug(vendor.categorySlug)?.name}</Badge>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-slate-soft">
                      <a href={`tel:${vendor.phone}`} className="flex items-center gap-1.5 hover:text-burgundy">
                        <Phone size={13} /> {vendor.phone}
                      </a>
                      <a
                        href={`https://wa.me/${vendor.whatsapp.replace(/[^\d]/g, "")}`}
                        className="flex items-center gap-1.5 hover:text-burgundy"
                      >
                        <MessageCircle size={13} /> WhatsApp
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="rounded-[8px] bg-burgundy-deep p-6 text-white">
            <p className="font-display text-xl">What&rsquo;s Next?</p>
            <ul className="mt-4 space-y-3">
              {NEXT_STEPS.map((step) => (
                <li key={step.label} className="flex items-start gap-2.5 text-sm text-white/85">
                  {step.done ? (
                    <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-gold" />
                  ) : (
                    <Circle size={16} className="mt-0.5 shrink-0 text-white/50" />
                  )}
                  {step.label}
                </li>
              ))}
            </ul>
            <Button href="/dashboard/customer" variant="ghost-light" fullWidth className="mt-5" iconRight={<ArrowRight size={15} />}>
              Go to Dashboard
            </Button>
          </div>

          <ShareBookingSection bookingId={booking.id} />

          <div className="flex justify-center">
            <Badge tone="success" icon={<ShieldCheck size={13} />} className="px-3.5 py-1.5">
              TRIBLEERA Verified Booking
            </Badge>
          </div>
        </div>
      </Container>
    </div>
  );
}
