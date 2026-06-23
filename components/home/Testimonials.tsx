"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const REVIEWS = [
  {
    quote: "From the first call to the big day, everything was effortless. The escrow payment meant we never felt anxious about losing our money.",
    name: "Priya & Kajan",
    location: "Jaffna",
    service: "Photography",
    stars: 5,
  },
  {
    quote: "We booked three vendors through Tribleera. One dashboard, one advance payment process, zero chaos. I can't imagine doing it any other way.",
    name: "Niranjala & Vishnu",
    location: "Colombo",
    service: "Decoration & Makeup",
    stars: 5,
  },
  {
    quote: "Every vendor understood our Jaffna traditions. The team at Pushpa Florals knew exactly how the Poruwa setup should look. Exceptional.",
    name: "Suresh & Anitha",
    location: "Trincomalee",
    service: "Decoration",
    stars: 5,
  },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.12 } } };
const item = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const } },
};

export function Testimonials() {
  return (
    <section className="bg-gradient-to-b from-burgundy-950 to-ink py-24 md:py-32">
      <div className="mx-auto max-w-[1280px] px-5 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="mb-14 max-w-lg"
        >
          <p className="mb-4 inline-flex items-center gap-2.5 text-[11.5px] font-semibold uppercase tracking-[0.22em] text-gold">
            <span className="h-px w-7 bg-gold" />
            Couples who trusted us
          </p>
          <h2 className="font-display text-[28px] font-bold leading-[1.2] text-cream md:text-[40px]">
            Celebrations planned.<br />Memories made.
          </h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          variants={container}
          className="grid grid-cols-1 gap-6 md:grid-cols-3"
        >
          {REVIEWS.map((r) => (
            <motion.div
              key={r.name}
              variants={item}
              className="relative flex flex-col rounded-[14px] border border-gold/15 bg-burgundy-950/60 p-7 backdrop-blur-sm"
            >
              <Quote size={22} className="mb-5 text-gold/40" />
              <p className="flex-1 text-[15px] leading-relaxed text-cream-dim">&ldquo;{r.quote}&rdquo;</p>
              <div className="mt-7 flex items-center justify-between border-t border-cream/10 pt-5">
                <div>
                  <p className="text-sm font-semibold text-cream">{r.name}</p>
                  <p className="mt-0.5 text-xs text-cream-faint">{r.location} · {r.service}</p>
                </div>
                <div className="flex gap-0.5">
                  {Array.from({ length: r.stars }).map((_, i) => (
                    <Star key={i} size={13} className="fill-gold text-gold" />
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
