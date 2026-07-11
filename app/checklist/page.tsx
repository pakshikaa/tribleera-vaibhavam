import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { WeddingChecklistClient } from "@/components/planning/WeddingChecklistClient";

export const metadata: Metadata = {
  title: "Wedding Checklist",
  description:
    "Plan your Tamil wedding step by step — track photographers, decorators, makeup, cakes and invitations from six months out to the final week.",
  robots: { index: false, follow: false },
};

export default function ChecklistPage() {
  return (
    <div className="bg-ivory">
      <section className="relative overflow-hidden bg-ink py-14 md:py-18">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_30%_0%,rgba(122,31,61,0.3),transparent_60%)]" />
        <Container className="relative z-10">
          <p className="mb-3 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
            <span className="h-px w-5 bg-gold" />
            Plan Your Wedding
          </p>
          <h1 className="font-display text-[30px] font-bold leading-[1.15] text-cream md:text-[42px]">
            Your wedding checklist.
          </h1>
          <p className="mt-3 max-w-xl text-[15px] text-cream-dim">
            Every task from six months out to the final week — tick things off as you book, and jump straight to the
            right vendors for what&rsquo;s pending.
          </p>
        </Container>
      </section>
      <WeddingChecklistClient />
    </div>
  );
}
