import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, Lock, Scale, RefreshCw, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "How TRIBLEERA Protects You",
  description: "Learn how TRIBLEERA VAIBHAVAM's escrow system, vendor verification, and dispute resolution protect every couple and vendor.",
  alternates: { canonical: "/trust" },
  openGraph: {
    title: "How TRIBLEERA Protects You | TRIBLEERA VAIBHAVAM",
    description: "Escrow protection, vendor verification, dispute resolution and refund policy - how TRIBLEERA keeps every booking safe.",
    url: "/trust",
  },
};

const REFUND_ROWS = [
  { scenario: "Vendor cancels after payment", refund: "100% full refund" },
  { scenario: "You cancel 30+ days before event", refund: "50% of advance refunded" },
  { scenario: "You cancel within 7–29 days", refund: "25% of advance refunded" },
  { scenario: "You cancel within 7 days", refund: "Platform fee non-refundable" },
  { scenario: "Vendor fails to deliver service", refund: "100% full refund + dispute compensation" },
];

export default function TrustPage() {
  return (
    <div className="bg-ink">
      {/* Hero */}
      <section className="relative overflow-hidden py-24 md:py-32">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_0%,rgba(122,31,61,0.4),transparent_65%)]" />
        <svg className="pointer-events-none absolute -right-10 top-0 h-[400px] w-[400px] text-gold/[0.07]" viewBox="0 0 200 200" fill="none">
          <path d="M40 180 V100 C40 50 65 15 100 15 C135 15 160 50 160 100 V180" stroke="currentColor" strokeWidth="5" />
          <path d="M62 180 V104 C62 68 78 38 100 38 C122 38 138 68 138 104 V180" stroke="currentColor" strokeWidth="5" />
        </svg>
        <Container className="relative z-10 text-center">
          <p className="mb-4 inline-flex items-center justify-center gap-2.5 text-[11.5px] font-semibold uppercase tracking-[0.22em] text-gold">
            <span className="h-px w-7 bg-gold" />
            Trust &amp; Safety
            <span className="h-px w-7 bg-gold" />
          </p>
          <h1 className="font-display text-[34px] font-bold leading-[1.1] text-cream md:text-[56px]">
            How TRIBLEERA<br />protects you.
          </h1>
          <p className="mx-auto mt-5 max-w-lg text-[15px] leading-relaxed text-cream-dim">
            Every booking on TRIBLEERA is protected by escrow, vendor verification, and a clear
            dispute resolution process — so you can celebrate without worry.
          </p>
        </Container>
      </section>

      {/* Escrow flow */}
      <section className="bg-burgundy-950 py-20 md:py-28">
        <Container>
          <p className="mb-4 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
            <span className="h-px w-5 bg-gold" />
            Escrow protection
          </p>
          <h2 className="mb-14 font-display text-[28px] font-bold leading-[1.2] text-cream md:text-[38px]">
            Your money is never at risk.
          </h2>
          <div className="grid grid-cols-1 gap-px overflow-hidden rounded-[14px] border border-gold/14 bg-gold/14 md:grid-cols-3">
            {[
              { icon: Lock, step: "1", title: "You pay the advance", body: "20% of the service total plus a 3% platform fee. This is the only amount due before your event." },
              { icon: ShieldCheck, step: "2", title: "TRIBLEERA holds it safely", body: "Your advance sits in a protected escrow account — the vendor cannot access it until your service milestones are met." },
              { icon: RefreshCw, step: "3", title: "Released after service", body: "Once your vendor completes the service, you confirm, and TRIBLEERA releases the advance. The remaining 80% is settled directly between you and the vendor." },
            ].map((item) => (
              <div key={item.step} className="bg-burgundy-950 p-7 md:p-9">
                <div className="mb-5 flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border border-gold/30 font-display text-sm font-bold text-gold-light">
                    {item.step}
                  </span>
                  <item.icon size={20} className="text-gold/70" strokeWidth={1.5} />
                </div>
                <h3 className="font-display text-lg font-semibold text-cream">{item.title}</h3>
                <p className="mt-2.5 text-[13.5px] leading-relaxed text-cream-faint">{item.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Vendor verification */}
      <section className="bg-ink py-20 md:py-28">
        <Container>
          <p className="mb-4 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
            <span className="h-px w-5 bg-gold" />
            Vendor verification
          </p>
          <h2 className="mb-12 font-display text-[28px] font-bold leading-[1.2] text-cream md:text-[38px]">
            Every vendor is reviewed<br />before going live.
          </h2>
          <div className="relative pl-8">
            <div className="absolute left-[13px] top-3 bottom-3 w-px bg-gradient-to-b from-gold via-gold/30 to-transparent" />
            {[
              { title: "Application", body: "Vendor submits business details, category, city and a business narrative through the TRIBLEERA registration form." },
              { title: "Background check", body: "Our team verifies business registration, identity documents and professional history before proceeding." },
              { title: "Portfolio review", body: "We review sample work, client references and pricing for alignment with TRIBLEERA's quality standards." },
              { title: "Profile published", body: "Once approved, the vendor receives a TRIBLEERA Verified badge visible on their profile and all search listings." },
            ].map((step, i) => (
              <div key={step.title} className="mb-8 flex gap-5 last:mb-0">
                <div className="relative z-10 mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold text-[11px] font-bold text-burgundy-deep">
                  {i + 1}
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold text-cream">{step.title}</h3>
                  <p className="mt-1.5 text-[13.5px] leading-relaxed text-cream-faint">{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Dispute resolution */}
      <section className="bg-burgundy-950 py-20 md:py-28">
        <Container>
          <p className="mb-4 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
            <span className="h-px w-5 bg-gold" />
            Dispute resolution
          </p>
          <h2 className="mb-4 font-display text-[28px] font-bold leading-[1.2] text-cream md:text-[38px]">
            Problems are rare.<br />Solutions are guaranteed.
          </h2>
          <p className="mb-12 max-w-xl text-[15px] text-cream-dim">
            In the rare case of a dispute between a couple and a vendor, TRIBLEERA mediates and resolves the issue within 48 hours.
          </p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {[
              { icon: Scale, step: "Report", body: "Submit your issue through the customer dashboard — include any evidence, messages and timeline." },
              { icon: ShieldCheck, step: "TRIBLEERA reviews", body: "Our team investigates within 48 hours — we contact both parties and review all booking records." },
              { icon: RefreshCw, step: "Resolution", body: "We issue a fair resolution — including refunds, partial releases, or escrow hold — based on the case facts." },
            ].map((item) => (
              <div key={item.step} className="rounded-[10px] border border-gold/15 bg-ink p-6">
                <item.icon size={24} className="mb-4 text-gold" strokeWidth={1.5} />
                <h3 className="font-display text-lg font-semibold text-cream">{item.step}</h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-cream-faint">{item.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Refund policy */}
      <section className="bg-ink py-20 md:py-28">
        <Container>
          <p className="mb-4 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
            <span className="h-px w-5 bg-gold" />
            Refund policy
          </p>
          <h2 className="mb-10 font-display text-[28px] font-bold leading-[1.2] text-cream md:text-[38px]">
            Clear, fair, no surprises.
          </h2>
          <div className="overflow-hidden rounded-[10px] border border-gold/15">
            {REFUND_ROWS.map((row, i) => (
              <div key={row.scenario} className={`flex flex-col justify-between gap-3 px-5 py-4 sm:flex-row sm:items-center ${i % 2 === 0 ? "bg-burgundy-950/50" : "bg-burgundy-950/30"}`}>
                <p className="text-[14px] text-cream-dim">{row.scenario}</p>
                <span className="shrink-0 rounded-full border border-gold/30 px-3 py-1 text-xs font-semibold text-gold-light">
                  {row.refund}
                </span>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="bg-burgundy-950 py-20">
        <Container className="text-center">
          <h2 className="font-display text-[26px] font-bold text-cream md:text-[36px]">
            Ready to plan with confidence?
          </h2>
          <p className="mx-auto mt-4 max-w-md text-[15px] text-cream-dim">
            Every TRIBLEERA vendor is verified. Every advance is protected. Every dispute is resolved.
          </p>
          <Link
            href="/services"
            className="mt-8 inline-flex items-center gap-2 rounded-[4px] bg-gradient-to-br from-gold-light via-gold to-gold-deep px-7 py-3.5 text-sm font-bold text-burgundy-deep shadow-glow transition-all hover:-translate-y-0.5"
          >
            Explore services <ArrowRight size={16} />
          </Link>
        </Container>
      </section>
    </div>
  );
}
