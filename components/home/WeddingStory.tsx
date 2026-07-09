"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { SmartImage } from "@/components/ui/SmartImage";
import { trustSectionImage } from "@/lib/data/images";

const STORY_POINTS = [
  "Three verified vendors coordinated in one flow",
  "Transparent milestones from shortlist to payment",
  "A calmer planning journey for the couple and family",
];

export function WeddingStory() {
  return (
    <section className="bg-[linear-gradient(180deg,#210711_0%,#2c0d18_18%,#16050d_100%)] py-18 md:py-24">
      <div className="mx-auto max-w-[1280px] px-5 md:px-10">
        <div className="overflow-hidden rounded-[28px] border border-gold/12 bg-[#1b0710] shadow-[0_24px_80px_rgba(0,0,0,0.28)] lg:grid lg:grid-cols-[1.05fr_0.95fr]">
          <div className="relative min-h-[360px] lg:min-h-[620px]">
            <SmartImage
              src={trustSectionImage}
              alt="Niranjala and Kajan's Jaffna wedding celebration"
              fallbackVariant="lotus"
              fallbackTone="burgundy"
              sizes="(min-width: 1024px) 52vw, 100vw"
              className="absolute inset-0"
              priority
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(21,4,12,0.18)_0%,rgba(21,4,12,0.38)_42%,rgba(21,4,12,0.82)_100%)] lg:bg-[linear-gradient(90deg,rgba(21,4,12,0.14)_0%,rgba(21,4,12,0.18)_24%,rgba(21,4,12,0.62)_74%,rgba(21,4,12,0.92)_100%)]" />
            <div className="absolute left-0 top-0 h-full w-full bg-[radial-gradient(circle_at_top_left,rgba(212,175,106,0.14),transparent_34%)]" />
          </div>

          <div className="relative flex items-center bg-[linear-gradient(180deg,rgba(31,8,17,0.96)_0%,rgba(21,4,12,1)_100%)] px-6 py-10 sm:px-8 lg:px-12 lg:py-14">
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
              className="max-w-[470px]"
            >
              <p className="mb-5 inline-flex items-center gap-2.5 text-[11.5px] font-semibold uppercase tracking-[0.24em] text-gold-light">
                <span className="h-px w-7 bg-gold" />
                Wedding Stories
              </p>
              <h2
                className="font-display text-[34px] font-semibold italic leading-[1.18] text-cream md:text-[46px]"
                style={{ textShadow: "0 2px 20px rgba(21,4,12,0.45)" }}
              >
                &ldquo;A heritage worth celebrating, a day worth remembering.&rdquo;
              </h2>
              <p className="mt-6 text-[15px] leading-7 text-cream-dim md:text-[16px]">
                Inside Niranjala &amp; Kajan&apos;s Jaffna celebration: three vendors, one vision, and
                a wedding week planned entirely through TRIBLEERA VAIBHAVAM.
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

              <Link
                href="/trust"
                className="mt-8 inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/10 px-5 py-3 text-sm font-semibold text-gold-light transition-all hover:-translate-y-0.5 hover:bg-gold/14 hover:text-gold"
              >
                See how TRIBLEERA protects your celebration
                <ArrowUpRight size={16} />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
