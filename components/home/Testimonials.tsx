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
    quote: "We booked three vendors through TRIBLEERA VAIBHAVAM, and the consistency in communication made the whole week feel much less chaotic.",
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

const doubled = [...REVIEWS, ...REVIEWS];

export function Testimonials() {
  return (
    <section className="bg-gradient-to-b from-burgundy-950 to-ink py-24 md:py-32">
      <div className="mx-auto max-w-[1280px] px-5 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] as const }}
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

        <div
          className="overflow-hidden"
          style={{
            maskImage: "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
          }}
        >
          <motion.div
            className="flex gap-6"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 35, ease: "linear", repeat: Infinity }}
            style={{ width: "max-content" }}
          >
            {doubled.map((review, index) => (
              <div
                key={`${review.name}-${index}`}
                className="w-[360px] shrink-0 rounded-[14px] border border-gold/15 bg-burgundy-950/60 p-7 backdrop-blur-sm"
              >
                <Quote size={22} className="mb-5 text-gold/40" />
                <p className="text-body-sm flex-1 italic leading-relaxed text-cream-dim">&ldquo;{review.quote}&rdquo;</p>
                <div className="mt-7 flex items-center justify-between border-t border-cream/10 pt-5">
                  <div>
                    <p className="text-sm font-semibold text-cream">{review.name}</p>
                    <p className="mt-0.5 text-xs text-cream-faint">
                      {review.location} · {review.service}
                    </p>
                  </div>
                  <div className="flex gap-0.5">
                    {Array.from({ length: review.stars }).map((_, starIndex) => (
                      <Star key={starIndex} size={13} className="fill-gold text-gold" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
