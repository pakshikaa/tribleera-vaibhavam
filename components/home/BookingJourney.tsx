"use client";

import { motion } from "framer-motion";

const STEPS = [
  { n: "1", title: "Select services", body: "Choose from photography, makeup, decor, cakes and invitations." },
  { n: "2", title: "Choose vendors", body: "Compare verified studios by trust score, portfolio and price." },
  { n: "3", title: "Pay advance", body: "20% advance plus 3% platform fee, held securely in escrow." },
  { n: "4", title: "Confirm celebration", body: "Every vendor is notified and your date is locked in." },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.12 } } };
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } },
};

export function BookingJourney() {
  return (
    <section id="how-it-works" className="bg-ink py-24 md:py-32">
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
            The Booking Journey
            <span className="h-px w-7 bg-gold" />
          </p>
          <h2 className="font-display text-[28px] font-bold leading-[1.2] text-cream md:text-[40px]">
            From idea to celebration, in four steps.
          </h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={container}
          className="relative grid grid-cols-2 gap-y-12 lg:grid-cols-4 lg:gap-0"
        >
          <div className="absolute left-[12.5%] right-[12.5%] top-[23px] hidden h-px bg-gradient-to-r from-transparent via-gold to-transparent lg:block" />
          {STEPS.map((s) => (
            <motion.div key={s.n} variants={item} className="relative px-3 text-center">
              <div className="relative z-10 mx-auto mb-6 flex h-[46px] w-[46px] items-center justify-center rounded-full border border-gold/35 bg-ink font-display text-lg font-bold text-gold-light">
                {s.n}
              </div>
              <h3 className="font-display text-lg font-semibold text-cream">{s.title}</h3>
              <p className="mt-2.5 text-[13px] leading-relaxed text-cream-faint">{s.body}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
