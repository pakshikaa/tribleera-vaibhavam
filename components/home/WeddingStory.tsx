"use client";

import { motion } from "framer-motion";
import { SmartImage } from "@/components/ui/SmartImage";
import { trustSectionImage } from "@/lib/data/images";

export function WeddingStory() {
  return (
    <section className="relative flex min-h-[640px] items-center overflow-hidden">
      <div className="absolute inset-0">
        <SmartImage
          src={trustSectionImage}
          alt="Niranjala and Kajan's Jaffna wedding celebration"
          fallbackVariant="lotus"
          fallbackTone="burgundy"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/55 to-ink/10" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1280px] px-5 md:px-10">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
          className="max-w-md"
        >
          <p className="mb-5 inline-flex items-center gap-2.5 text-[11.5px] font-semibold uppercase tracking-[0.22em] text-gold-light">
            <span className="h-px w-7 bg-gold" />
            Wedding Stories
          </p>
          <h2 className="font-display text-[28px] font-semibold italic leading-[1.35] text-cream md:text-[40px]">
            &ldquo;A heritage worth celebrating, a day worth remembering.&rdquo;
          </h2>
          <p className="mt-6 text-[15px] leading-relaxed text-cream-dim">
            Inside Niranjala &amp; Kajan&rsquo;s Jaffna celebration &mdash; three vendors, one vision, and a
            wedding week planned entirely through Tribleera.
          </p>
          <a href="#" className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-gold-light hover:text-gold">
            Read the full story →
          </a>
        </motion.div>
      </div>
    </section>
  );
}
