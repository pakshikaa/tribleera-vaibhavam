"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Lock, Landmark, Sparkles } from "lucide-react";

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "Verified vendors",
    body: "Every studio is background-checked and reviewed before going live on the platform.",
  },
  {
    icon: Lock,
    title: "Escrow-secured payments",
    body: "20% advance plus a 3% platform fee, held safely and released only at agreed milestones.",
  },
  {
    icon: Landmark,
    title: "Tamil heritage, curated",
    body: "Every vendor understands Jaffna ceremony traditions — from Poruwa to Kasi Yatra.",
  },
  {
    icon: Sparkles,
    title: "Premium quality, always",
    body: "Trust scores and verified reviews on every profile, so quality is never a guess.",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } },
};

export function WhyTribleera() {
  return (
    <section className="bg-gradient-to-b from-ink via-burgundy-950 to-ink py-24 md:py-32">
      <div className="mx-auto max-w-[1280px] px-5 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="mx-auto mb-16 max-w-lg text-center"
        >
          <p className="mb-4 inline-flex items-center justify-center gap-2.5 text-[11.5px] font-semibold uppercase tracking-[0.22em] text-gold">
            <span className="h-px w-7 bg-gold" />
            Why Tribleera
            <span className="h-px w-7 bg-gold" />
          </p>
          <h2 className="font-display text-[28px] font-bold leading-[1.2] text-cream md:text-[40px]">
            Trust, built into every booking.
          </h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={container}
          className="grid grid-cols-1 gap-px overflow-hidden rounded-[16px] border border-gold/15 bg-gold/15 sm:grid-cols-2 lg:grid-cols-4"
        >
          {FEATURES.map((f) => (
            <motion.div key={f.title} variants={item} className="bg-burgundy-950 p-8">
              <f.icon size={28} className="mb-6 text-gold" strokeWidth={1.5} />
              <h3 className="font-display text-lg font-semibold text-cream">{f.title}</h3>
              <p className="mt-2.5 text-[13.5px] leading-relaxed text-cream-faint">{f.body}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
