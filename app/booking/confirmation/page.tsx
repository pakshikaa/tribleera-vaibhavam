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
  Printer,
  Share2,
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

  // Family members (amma, mamiyar…) can follow progress through the public
  // tracking page — share the link itself, not just the reference number.
  const trackUrl =
    typeof window !== "undefined" ? `${window.location.origin}/booking/track/${bookingId}` : `/booking/track/${bookingId}`;

  function copyLink() {
    navigator.clipboard.writeText(trackUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {});
  }

  function nativeShare() {
    if (navigator.share) {
      navigator
        .share({
          title: "Our TRIBLEERA VAIBHAVAM wedding booking",
          text: `Track our wedding booking (${bookingId}) here:`,
          url: trackUrl,
        })
        .catch(() => {});
    } else {
      copyLink();
    }
  }

  const waText = encodeURIComponent(
    `We booked our Jaffna wedding vendors on TRIBLEERA VAIBHAVAM! 🎊 Track the booking progress here: ${trackUrl}`
  );

  return (
    <div className="rounded-[8px] border border-rose/30 bg-rose-pale/40 p-5 print:hidden">
      <p className="text-xs font-semibold uppercase tracking-wide text-burgundy-deep">Share with family</p>
      <p className="mt-1.5 text-xs leading-relaxed text-slate-soft">
        Anyone with this link can follow the booking status — no sign-in needed.
      </p>
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
          onClick={nativeShare}
          className="flex flex-1 items-center justify-center gap-2 rounded-[4px] border border-slate/15 bg-white py-2.5 text-sm font-semibold text-slate hover:border-burgundy hover:text-burgundy"
        >
          <Share2 size={15} /> Share link
        </button>
        <button
          onClick={copyLink}
          className="flex flex-1 items-center justify-center gap-2 rounded-[4px] border border-slate/15 bg-white py-2.5 text-sm font-semibold text-slate hover:border-burgundy hover:text-burgundy"
        >
          {copied ? "✓ Link copied!" : "Copy tracking link"}
        </button>
      </div>
    </div>
  );
}

/** Clean A4-friendly receipt, visible only when printing. */
function PrintableReceipt({ booking, status }: { booking: LastBooking; status: "pending" | "confirmed" }) {
  return (
    <div className="hidden print:block" style={{ padding: 24, fontFamily: "Georgia, serif", color: "#1F2937" }}>
      <div style={{ textAlign: "center", borderBottom: "2px solid #5C0427", paddingBottom: 16, marginBottom: 20 }}>
        <p style={{ fontSize: 22, fontWeight: 700, letterSpacing: "0.15em", color: "#5C0427" }}>TRIBLEERA</p>
        <p style={{ fontSize: 10, letterSpacing: "0.3em", color: "#6B7280" }}>VAIBHAVAM · BOOKING RECEIPT</p>
      </div>
      <table style={{ width: "100%", fontSize: 13, marginBottom: 18 }}>
        <tbody>
          <tr><td style={{ padding: "3px 0", color: "#6B7280" }}>Booking ID</td><td style={{ textAlign: "right", fontWeight: 700 }}>{booking.id}</td></tr>
          <tr><td style={{ padding: "3px 0", color: "#6B7280" }}>Customer</td><td style={{ textAlign: "right" }}>{booking.customer.name}</td></tr>
          <tr><td style={{ padding: "3px 0", color: "#6B7280" }}>Event date</td><td style={{ textAlign: "right" }}>{booking.customer.eventDate ? formatDate(booking.customer.eventDate) : "To be confirmed"}</td></tr>
          <tr><td style={{ padding: "3px 0", color: "#6B7280" }}>Payment method</td><td style={{ textAlign: "right", textTransform: "capitalize" }}>{booking.paymentMethod}</td></tr>
          <tr><td style={{ padding: "3px 0", color: "#6B7280" }}>Status</td><td style={{ textAlign: "right", fontWeight: 700 }}>{status === "confirmed" ? "CONFIRMED" : "AWAITING VERIFICATION"}</td></tr>
          <tr><td style={{ padding: "3px 0", color: "#6B7280" }}>Issued</td><td style={{ textAlign: "right" }}>{formatDate(booking.createdAt)}</td></tr>
        </tbody>
      </table>
      <table style={{ width: "100%", fontSize: 13, borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid #9CA3AF", textAlign: "left" }}>
            <th style={{ padding: "6px 0" }}>Vendor</th>
            <th style={{ padding: "6px 0" }}>Package</th>
            <th style={{ padding: "6px 0", textAlign: "right" }}>Price</th>
          </tr>
        </thead>
        <tbody>
          {booking.items.map((item) => (
            <tr key={item.categorySlug} style={{ borderBottom: "1px solid #E5E7EB" }}>
              <td style={{ padding: "6px 0" }}>{item.vendorName}</td>
              <td style={{ padding: "6px 0" }}>{item.packageName}</td>
              <td style={{ padding: "6px 0", textAlign: "right" }}>{formatLKR(item.price)}</td>
            </tr>
          ))}
          <tr>
            <td colSpan={2} style={{ padding: "8px 0", fontWeight: 700 }}>Paid now (advance + platform fee)</td>
            <td style={{ padding: "8px 0", textAlign: "right", fontWeight: 700, color: "#5C0427" }}>{formatLKR(booking.totals.payableNow)}</td>
          </tr>
          <tr>
            <td colSpan={2} style={{ padding: "3px 0", color: "#6B7280" }}>Remaining balance (due at milestones)</td>
            <td style={{ padding: "3px 0", textAlign: "right", color: "#6B7280" }}>{formatLKR(booking.totals.remainingBalance)}</td>
          </tr>
        </tbody>
      </table>
      <p style={{ marginTop: 24, fontSize: 11, color: "#6B7280", textAlign: "center" }}>
        Advance held in TRIBLEERA escrow · tribleera-vaibhavam.vercel.app · This receipt is generated for your records.
      </p>
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
      <PrintableReceipt booking={booking} status={orderStatus} />
      <section className="border-b border-slate/8 bg-white py-8 print:hidden md:py-10">
        <Container>
          <BookingSteps current={4} />
        </Container>
      </section>

      <section className="bg-gradient-to-b from-rose-pale/60 to-transparent py-12 print:hidden md:py-16">
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

      <Container className="py-4 pb-16 print:hidden md:pb-20">
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

          <button
            onClick={() => window.print()}
            className="mx-auto flex items-center justify-center gap-2 rounded-[4px] border border-slate/15 bg-white px-5 py-2.5 text-sm font-semibold text-slate transition-colors hover:border-burgundy hover:text-burgundy"
          >
            <Printer size={15} aria-hidden="true" /> Print receipt
          </button>

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
