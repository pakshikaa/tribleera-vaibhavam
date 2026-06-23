"use client";

import { motion } from "framer-motion";

const STEPS = [
  { n: "1", title: "Select services", body: "Choose from photography, makeup, decor, cakes and invitations." },
  { n: "2", title: "Choose vendors", body: "Compare verified studios by trust score, portfolio and price." },
  { n: "3", title: "Pay advance", body: "20% advance plus 3% platform fee, held securely in escrow." },
  { n: "4", title: "Confirm celebration", body: "Every vendor is notified and your date is locked in." },
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

export function BookingJourney() {
  return (
    <section id="how-it-works" className="bg-ink py-24 md:py-32">
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
            The Booking Journey
            <span className="h-px w-7 bg-gold" />
          </p>
          <h2 className="text-display-md text-cream">From idea to celebration, in four steps.</h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={containerVariants}
          className="relative grid grid-cols-2 gap-y-12 lg:grid-cols-4 lg:gap-0"
        >
          <div className="absolute left-[12.5%] right-[12.5%] top-[23px] hidden h-px bg-gradient-to-r from-transparent via-gold to-transparent lg:block" />
          {STEPS.map((step) => (
            <motion.div key={step.n} variants={itemVariants} className="relative px-3 text-center">
              <div className="relative z-10 mx-auto mb-6 flex h-[46px] w-[46px] items-center justify-center rounded-full border border-gold/35 bg-ink font-display text-lg font-bold text-gold-light">
                {step.n}
              </div>
              <h3 className="text-display-sm text-cream">{step.title}</h3>
              <p className="text-caption mt-2.5 text-cream-faint">{step.body}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
