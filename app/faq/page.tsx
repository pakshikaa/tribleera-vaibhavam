"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { BackButton } from "@/components/ui/BackButton";
import { cn } from "@/lib/utils/cn";

interface FaqItem {
  q: string;
  a: string;
}

interface FaqCategory {
  title: string;
  items: FaqItem[];
}

const FAQ_CATEGORIES: FaqCategory[] = [
  {
    title: "Booking & Payments",
    items: [
      {
        q: "How much do I pay upfront?",
        a: "You pay 20% of the service total as an advance, plus a 3% platform fee. The remaining 80% is paid directly to your vendor after the service is delivered.",
      },
      {
        q: "Is my payment safe?",
        a: "Your advance is held in TRIBLERERA escrow and released only when service milestones are completed. We mediate any disputes.",
      },
      {
        q: "What payment methods are accepted?",
        a: "Credit/debit card and bank transfer. For bank transfers, upload your deposit slip for admin verification.",
      },
      {
        q: "Can I cancel my booking?",
        a: "Yes. 30+ days before: 50% refund. 7–29 days: 25% refund. Under 7 days: platform fee non-refundable. Vendor cancels: 100% refund.",
      },
    ],
  },
  {
    title: "Vendors",
    items: [
      {
        q: "Are all vendors verified?",
        a: "Yes. Every vendor is background-checked, document-verified, and portfolio-reviewed before appearing on the platform.",
      },
      {
        q: "How do I contact a vendor?",
        a: "Every vendor profile has a WhatsApp button for direct chat. You can also send an event request through the platform.",
      },
      {
        q: "Can I book a vendor outside TRIBLERERA?",
        a: "Vendors agree to our terms which prohibit bypassing the platform for bookings. This protects both you and the vendor.",
      },
    ],
  },
  {
    title: "Services",
    items: [
      {
        q: "Which cities are covered?",
        a: "Jaffna, Colombo, Trincomalee, Batticaloa, and Kandy. Vendors may travel beyond their listed city — confirm directly.",
      },
      {
        q: "What are the Phase 1 services?",
        a: "Photography, Bridal Makeup, Decoration, Cakes, and Invitation design. More categories launching in Phase 2.",
      },
    ],
  },
  {
    title: "For Vendors",
    items: [
      {
        q: "How do I list my business?",
        a: 'Click "For Vendors" → "Register" and complete the 3-step form. Our team reviews applications within 24–48 hours.',
      },
      {
        q: "What commission does TRIBLERERA take?",
        a: "The 3% platform fee is paid by the customer, not deducted from your payment. You receive the full agreed package price.",
      },
    ],
  },
];

function FaqAccordionItem({ item, isOpen, onToggle }: { item: FaqItem; isOpen: boolean; onToggle: () => void }) {
  return (
    <div
      className={cn(
        "rounded-[8px] border bg-white transition-colors",
        isOpen ? "border-gold/40" : "border-slate/10"
      )}
    >
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
        aria-expanded={isOpen}
      >
        <span className="text-[15px] font-semibold text-slate">{item.q}</span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          className="shrink-0 text-gold-deep"
        >
          <ChevronDown size={18} />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: "hidden" }}
          >
            <div className="border-t border-gold/20 px-5 pb-5 pt-4">
              <p className="text-[14px] leading-relaxed text-slate-soft">{item.a}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FaqPage() {
  const [openMap, setOpenMap] = useState<Record<string, boolean>>({});

  function toggle(key: string) {
    setOpenMap((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  return (
    <div>
      {/* HERO */}
      <section className="bg-ink py-20 md:py-28">
        <Container className="max-w-2xl text-center">
          <BackButton href="/" label="Home" dark className="mb-6" />
          <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.25em] text-gold">
            Help centre
          </p>
          <h1
            className="font-display font-bold text-cream"
            style={{ fontSize: "clamp(2.2rem, 5vw, 3.6rem)", textShadow: "0 2px 30px rgba(21,4,12,0.8)" }}
          >
            Got questions? We&rsquo;ve got answers.
          </h1>
        </Container>
      </section>

      {/* FAQ */}
      <section className="bg-ivory py-16 md:py-24">
        <Container className="max-w-3xl">
          <div className="space-y-12">
            {FAQ_CATEGORIES.map((cat) => (
              <div key={cat.title}>
                <h2 className="mb-5 font-display text-xl font-semibold text-burgundy-deep">
                  {cat.title}
                </h2>
                <div className="space-y-3">
                  {cat.items.map((item, idx) => {
                    const key = `${cat.title}-${idx}`;
                    return (
                      <FaqAccordionItem
                        key={key}
                        item={item}
                        isOpen={!!openMap[key]}
                        onToggle={() => toggle(key)}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}
