"use client";

import { motion } from "framer-motion";
import { Landmark, Lock, ShieldCheck, Sparkles } from "lucide-react";

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
    body: "Every vendor understands Tamil ceremony rhythms - from muhurtham timing to reception flow.",
  },
  {
    icon: Sparkles,
    title: "Premium quality, always",
    body: "Trust scores and verified reviews sit on every profile, so quality is never a guess.",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 32, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export function WhyTribleera() {
  return (
    <section className="bg-gradient-to-b from-ink via-burgundy-950 to-ink py-24 md:py-32">
      <div className="mx-auto max-w-[1280px] px-5 md:px-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={itemVariants}
          className="mx-auto mb-16 max-w-lg text-center"
        >
          <p className="text-overline mb-4 inline-flex items-center justify-center gap-2.5 text-gold">
            <span className="h-px w-7 bg-gold" />
            Why Tribleera
            <span className="h-px w-7 bg-gold" />
          </p>
          <h2 className="text-display-md text-cream">Trust, built into every booking.</h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={containerVariants}
          className="grid grid-cols-1 gap-px overflow-hidden rounded-[16px] border border-gold/15 bg-gold/15 sm:grid-cols-2 lg:grid-cols-4"
        >
          {FEATURES.map((feature) => (
            <motion.div key={feature.title} variants={itemVariants} className="bg-burgundy-950 p-8">
              <feature.icon size={28} className="mb-6 text-gold" strokeWidth={1.5} />
              <h3 className="text-display-sm text-cream">{feature.title}</h3>
              <p className="text-body-sm mt-2.5 text-cream-faint">{feature.body}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
