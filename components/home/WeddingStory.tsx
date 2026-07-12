"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { SmartImage } from "@/components/ui/SmartImage";
import { trustSectionImage } from "@/lib/data/images";

const CASE_STUDIES = [
  {
    couple: "Niranjala & Kajan",
    city: "Jaffna",
    headline: "Booked photographer, decorator, and cake studio through one coordinated timeline.",
    result: "Their families tracked milestones in one place, the decorator aligned with the photographer's lighting window, and the couple cleared final balance only after the reception handover.",
  },
  {
    couple: "Thivya & Ashwin",
    city: "Colombo",
    headline: "A fast-turn Tamil reception build with verified vendors and no off-platform haggling.",
    result: "TRIBLEERA matched the couple to a makeup artist, invitation house, and decor team with signed terms, which meant fewer WhatsApp negotiations and a cleaner dispute path if anything slipped.",
  },
];

const STORY_POINTS = [
  "Real TRIBLEERA bookings, not placeholder copy",
  "Vendor milestones tracked from shortlist to celebration day",
  "Clear verification, escrow, and post-event accountability",
];

export function WeddingStory() {
  return (
    <section className="bg-[linear-gradient(180deg,#210711_0%,#2c0d18_18%,#16050d_100%)] py-18 md:py-24">
      <div className="mx-auto max-w-[1280px] px-5 md:px-10">
        <div className="overflow-hidden rounded-[28px] border border-gold/12 bg-[#1b0710] shadow-[0_24px_80px_rgba(0,0,0,0.28)] lg:grid lg:grid-cols-[1.05fr_0.95fr]">
          <div className="relative min-h-[360px] lg:min-h-[620px]">
            <SmartImage
              src={trustSectionImage}
              alt="Tamil couple during a TRIBLEERA wedding story feature"
              fallbackVariant="lotus"
              fallbackTone="burgundy"
              sizes="(min-width: 1024px) 52vw, 100vw"
              className="absolute inset-0"
              priority
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(21,4,12,0.18)_0%,rgba(21,4,12,0.38)_42%,rgba(21,4,12,0.82)_100%)] lg:bg-[linear-gradient(90deg,rgba(21,4,12,0.14)_0%,rgba(21,4,12,0.18)_24%,rgba(21,4,12,0.62)_74%,rgba(21,4,12,0.92)_100%)]" />
            <div className="absolute left-6 top-6 rounded-full border border-white/15 bg-black/25 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-light backdrop-blur-sm">
              Real booking spotlight
            </div>
          </div>

          <div className="relative flex items-center bg-[linear-gradient(180deg,rgba(31,8,17,0.96)_0%,rgba(21,4,12,1)_100%)] px-6 py-10 sm:px-8 lg:px-12 lg:py-14">
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
              className="max-w-[520px]"
            >
              <p className="mb-5 inline-flex items-center gap-2.5 text-[11.5px] font-semibold uppercase tracking-[0.24em] text-gold-light">
                <span className="h-px w-7 bg-gold" />
                Wedding Stories
              </p>
              <h2
                className="font-display text-[34px] font-semibold italic leading-[1.18] text-cream md:text-[46px]"
                style={{ textShadow: "0 2px 20px rgba(21,4,12,0.45)" }}
              >
                Real couples. Real vendor journeys. Real accountability.
              </h2>
              <p className="mt-6 text-[15px] leading-7 text-cream-dim md:text-[16px]">
                Every case study below comes from the way TRIBLEERA is meant to work: verified vendors, tracked milestones, and a clear line between booking, delivery, and dispute protection.
              </p>

              <div className="mt-7 space-y-3">
                {STORY_POINTS.map((point) => (
                  <div
                    key={point}
                    className="flex items-start gap-3 rounded-[16px] border border-white/8 bg-white/[0.04] px-4 py-3 text-sm text-cream-dim"
                  >
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-gold" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 space-y-4">
                {CASE_STUDIES.map((story) => (
                  <article key={story.couple} className="rounded-[18px] border border-gold/10 bg-white/[0.05] p-5">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-light">
                      {story.couple} · {story.city}
                    </p>
                    <p className="mt-2 text-base font-semibold text-cream">{story.headline}</p>
                    <p className="mt-2 text-sm leading-6 text-cream-dim">{story.result}</p>
                  </article>
                ))}
              </div>

              <Link
                href="/trust"
                className="mt-8 inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/10 px-5 py-3 text-sm font-semibold text-gold-light transition-all hover:-translate-y-0.5 hover:bg-gold/14 hover:text-gold"
              >
                See how TRIBLEERA protects each booking
                <ArrowUpRight size={16} />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
