"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";

export function PremiumCTA() {
  return (
    <section className="bg-ink px-5 pb-24 md:px-10 md:pb-32">
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
        className="relative mx-auto max-w-[1280px] overflow-hidden rounded-[20px] border border-gold/25 px-8 py-20 text-center md:py-28"
        style={{
          background: "radial-gradient(ellipse 80% 100% at 50% 0%, rgba(122,31,61,0.55), #220714 65%)",
        }}
      >
        <svg
          viewBox="0 0 200 200"
          className="pointer-events-none absolute left-1/2 top-[-40px] w-[340px] -translate-x-1/2 text-gold/[0.12]"
          fill="none"
        >
          <path d="M40 180 V100 C40 50 65 15 100 15 C135 15 160 50 160 100 V180" stroke="currentColor" strokeWidth="5" />
          <path d="M62 180 V104 C62 68 78 38 100 38 C122 38 138 68 138 104 V180" stroke="currentColor" strokeWidth="5" />
        </svg>

        <h2 className="relative z-10 mx-auto max-w-xl font-display text-[28px] font-bold leading-[1.25] text-cream md:text-[42px]">
          Your celebration deserves
          <br />
          this kind of care.
        </h2>
        <p className="relative z-10 mx-auto mt-4 max-w-md text-[15px] text-cream-dim">
          Start exploring vendors today — no deposit, no commitment until you choose
          your package and confirm your date.
        </p>
        <div className="relative z-10 mt-9 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button href="/services" variant="gold" size="lg">
            Explore Services
          </Button>
          <Button href="/vendors" variant="glass" size="lg">
            Browse Vendors
          </Button>
        </div>
      </motion.div>
    </section>
  );
}
