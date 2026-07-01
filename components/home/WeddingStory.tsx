"use client";

import Link from "next/link";
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
        <div
          className="absolute inset-0"
          style={{ backgroundImage: "linear-gradient(to right, rgba(21,4,12,0.97) 0%, rgba(21,4,12,0.80) 35%, rgba(21,4,12,0.40) 60%, rgba(21,4,12,0.10) 100%)" }}
        />
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
          <h2
            className="font-display text-[28px] font-semibold italic leading-[1.35] text-cream md:text-[40px]"
            style={{ textShadow: "0 2px 20px rgba(21,4,12,0.6)" }}
          >
            &ldquo;A heritage worth celebrating, a day worth remembering.&rdquo;
          </h2>
          <p className="mt-6 text-[15px] leading-relaxed text-cream-dim">
            Inside Niranjala &amp; Kajan&apos;s Jaffna celebration - three vendors, one vision, and a
            wedding week planned entirely through TRIBLERERA.
          </p>
          <Link href="/trust" className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-gold-light hover:text-gold">
            See how TRIBLERERA protects your celebration →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
