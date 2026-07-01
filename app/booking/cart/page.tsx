"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck, PlusCircle, ShoppingBag, ChevronUp, ChevronDown, AlertCircle, X } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { CartItemCard } from "@/components/booking/CartItemCard";
import { PriceSummary } from "@/components/booking/PriceSummary";
import { BookingSteps } from "@/components/booking/BookingSteps";
import { formatLKR } from "@/lib/utils/format";
import { useCart } from "@/context/CartContext";

export default function BookingCartPage() {
  const { items, removeItem, totals, hydrated } = useCart();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [conflictCategory, setConflictCategory] = useState("");

  useEffect(() => {
    try {
      const conflict = sessionStorage.getItem("cart-category-conflict");
      if (conflict) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setConflictCategory(conflict);
        sessionStorage.removeItem("cart-category-conflict");
      }
    } catch {}
  }, []);
  const groupedItems = items.reduce<Record<string, typeof items>>((acc, item) => {
    const current = acc[item.categorySlug] ?? [];
    acc[item.categorySlug] = [...current, item];
    return acc;
  }, {});

  return (
    <div className="bg-ivory">
      <section className="border-b border-slate/8 bg-white py-8 md:py-10">
        <Container>
          <SectionHeading eyebrow="Step 2 of 4" title="Your booking cart" className="mb-6" />
          <BookingSteps current={2} />
        </Container>
      </section>

      <Container className="py-10 pb-28 md:py-14 md:pb-14">
        {!hydrated ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_360px]">
            <div className="space-y-4">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="h-28 animate-pulse rounded-[8px] bg-white shadow-soft" />
              ))}
            </div>
            <div className="h-72 animate-pulse rounded-[8px] bg-white shadow-soft" />
          </div>
        ) : items.length === 0 ? (
          <EmptyState
            icon={<ShoppingBag size={32} />}
            title="Your cart is empty"
            description="Browse services and add a vendor package from each category you need — photography, cakes, decoration, bridal makeup or invitations."
            action={<Button href="/services">Browse services</Button>}
          />
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-[1fr_360px]">
            <div>
              {conflictCategory && (
                <div className="mb-4 flex items-start gap-3 rounded-[8px] border border-warning bg-warning-pale p-4">
                  <AlertCircle size={16} className="mt-0.5 shrink-0 text-warning" aria-hidden="true" />
                  <div>
                    <p className="text-sm font-semibold text-warning">Only 1 vendor per service allowed</p>
                    <p className="mt-0.5 text-xs text-slate-soft">
                      Remove the existing {conflictCategory.replace(/-/g, " ")} vendor before adding another.
                    </p>
                  </div>
                  <button
                    onClick={() => setConflictCategory("")}
                    aria-label="Dismiss"
                    className="ml-auto text-slate-soft hover:text-slate"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
              <p className="mb-4 text-sm text-slate-soft">
                {items.length} categor{items.length !== 1 ? "ies" : "y"} selected
              </p>
              <div className="space-y-4">
                {Object.entries(groupedItems).map(([categorySlug, categoryItems]) => (
                  <div key={categorySlug} className="space-y-3">
                    <div className="flex items-center gap-3">
                      <h3 className="text-sm font-semibold capitalize text-burgundy-deep">{categorySlug.replace("-", " ")}</h3>
                      <div className="h-px flex-1 bg-slate/10" />
                    </div>
                    {categoryItems.map((item) => (
                      <CartItemCard key={item.categorySlug} item={item} onRemove={() => removeItem(item.categorySlug)} />
                    ))}
                  </div>
                ))}
              </div>

              <Link
                href="/services"
                className="mt-5 flex items-center gap-2 rounded-[8px] border border-dashed border-slate/20 px-5 py-4 text-sm font-medium text-slate-soft transition-colors hover:border-burgundy hover:text-burgundy"
              >
                <PlusCircle size={18} /> Add another category
              </Link>
              <p className="mt-3 text-xs text-slate-soft">Only one vendor per category can be booked in a single checkout.</p>

              <div className="mt-8 flex items-start gap-3 rounded-[8px] border border-burgundy/15 bg-burgundy/5 p-5">
                <ShieldCheck size={20} className="mt-0.5 shrink-0 text-burgundy" />
                <div>
                  <p className="text-sm font-semibold text-burgundy-deep">Secure payments, held in escrow</p>
                  <p className="mt-1 text-sm leading-relaxed text-slate-soft">
                    Your advance and platform fee are held safely by TRIBLERERA and released to each vendor only as
                    milestones are completed — full mediation support included.
                  </p>
                </div>
              </div>

              {/* Payment milestones */}
              <div className="mt-6 rounded-[8px] border border-slate/8 bg-white p-5 shadow-soft">
                <p className="mb-5 text-sm font-semibold text-slate">Payment milestones</p>
                <div className="relative flex items-start justify-between">
                  <div className="absolute left-5 right-5 top-[18px] h-px bg-gradient-to-r from-gold via-gold/40 to-slate/20" />
                  {[
                    { label: "Advance", sub: "Pay 20% + 3% fee today", active: true, done: false },
                    { label: "Service", sub: "Vendor delivers on your date", active: false, done: false },
                    { label: "Final", sub: "Release 80% to vendor", active: false, done: false },
                  ].map((step, i) => (
                    <div key={step.label} className="relative z-10 flex flex-1 flex-col items-center text-center">
                      <div className={`flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-bold transition-colors ${step.active ? "border-gold bg-gold text-burgundy-deep" : "border-slate/20 bg-white text-slate-soft"}`}>
                        {i + 1}
                      </div>
                      <p className={`mt-2 text-xs font-semibold ${step.active ? "text-burgundy-deep" : "text-slate-soft"}`}>{step.label}</p>
                      <p className="mt-0.5 text-[11px] leading-tight text-slate-soft">{step.sub}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <aside className="hidden md:block">
              <div className="sticky top-28 space-y-4">
                <PriceSummary breakdown={totals} />
                <Button href="/booking/payment" fullWidth size="lg" iconRight={<ArrowRight size={16} />}>
                  Proceed to payment
                </Button>
              </div>
            </aside>
          </div>
        )}
      </Container>

      {/* Mobile bottom-sheet booking summary */}
      {hydrated && items.length > 0 && (
        <div className="fixed inset-x-0 bottom-16 z-30 md:hidden">
          {sheetOpen && (
            <div className="animate-slide-up space-y-2 border-t border-slate/10 bg-white px-4 pb-3 pt-4 shadow-lift">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-soft">Service total</span>
                <span className="font-medium text-slate">{formatLKR(totals.serviceTotal)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-soft">Advance (20%) + platform fee (3%)</span>
                <span className="font-medium text-slate">{formatLKR(totals.payableNow)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-soft">Remaining balance</span>
                <span className="font-medium text-slate">{formatLKR(totals.remainingBalance)}</span>
              </div>
            </div>
          )}
          <button
            onClick={() => setSheetOpen((o) => !o)}
            className="flex w-full items-center justify-between border-t border-slate/10 bg-white px-4 py-2 text-xs font-medium text-slate-soft"
          >
            <span className="flex items-center gap-1">
              {sheetOpen ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
              {sheetOpen ? "Hide breakdown" : "View price breakdown"}
            </span>
            <span className="font-display text-sm text-burgundy-deep">{formatLKR(totals.payableNow)} now</span>
          </button>
          <div className="flex gap-2 border-t border-slate/10 bg-white p-3">
            <Button href="/booking/payment" fullWidth size="md" iconRight={<ArrowRight size={15} />}>
              Proceed to payment
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
