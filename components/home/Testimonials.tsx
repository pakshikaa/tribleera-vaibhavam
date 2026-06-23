"use client";

import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";

const REVIEWS = [
  {
    quote: "From the first shortlist to the final payment, everything felt transparent. We never worried about where the advance was going.",
    name: "Priya & Kajan",
    location: "Jaffna",
    service: "Photography",
    stars: 5,
  },
  {
    quote: "We booked three vendors through TRIBLEERA, and the consistency in communication made the whole week feel much less chaotic.",
    name: "Janani & Arun",
    location: "Colombo",
    service: "Decoration & Makeup",
    stars: 5,
  },
  {
    quote: "Every vendor understood our ceremony flow. The decorators, cake studio, and photographer all felt aligned before the event even started.",
    name: "Malar & Krishnan",
    location: "Batticaloa",
    service: "Multi-service booking",
    stars: 5,
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

export function Testimonials() {
  return (
    <section className="bg-gradient-to-b from-burgundy-950 to-ink py-24 md:py-32">
      <div className="mx-auto max-w-[1280px] px-5 md:px-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={itemVariants}
          className="mb-14 max-w-lg"
        >
          <p className="text-overline mb-4 inline-flex items-center gap-2.5 text-gold">
            <span className="h-px w-7 bg-gold" />
            Couples who trusted us
          </p>
          <h2 className="text-display-md text-cream">
            Celebrations planned.
            <br />
            Memories made.
          </h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={containerVariants}
          className="grid grid-cols-1 gap-6 md:grid-cols-3"
        >
          {REVIEWS.map((review) => (
            <motion.div
              key={review.name}
              variants={itemVariants}
              className="relative flex flex-col rounded-[14px] border border-gold/15 bg-burgundy-950/60 p-7 backdrop-blur-sm"
            >
              <Quote size={22} className="mb-5 text-gold/40" />
              <p className="text-body-sm flex-1 leading-relaxed text-cream-dim">&ldquo;{review.quote}&rdquo;</p>
              <div className="mt-7 flex items-center justify-between border-t border-cream/10 pt-5">
                <div>
                  <p className="text-sm font-semibold text-cream">{review.name}</p>
                  <p className="mt-0.5 text-xs text-cream-faint">
                    {review.location} · {review.service}
                  </p>
                </div>
                <div className="flex gap-0.5">
                  {Array.from({ length: review.stars }).map((_, index) => (
                    <Star key={index} size={13} className="fill-gold text-gold" />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
