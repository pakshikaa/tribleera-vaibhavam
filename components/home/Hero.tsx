"use client";

import Image from "next/image";
import { type RefObject } from "react";
import { motion } from "framer-motion";
import { HeroSearch } from "@/components/home/HeroSearch";
import { Button } from "@/components/ui/Button";
import { useCountUp } from "@/hooks/useCountUp";
import { heroImage } from "@/lib/data/images";

const PARTICLES = [
  { size: "h-2.5 w-2.5", top: "14%", left: "10%", path: [-8, 12, -8], duration: 5.5, delay: 0.2 },
  { size: "h-3 w-3", top: "24%", right: "12%", path: [-12, 8, -12], duration: 6.4, delay: 0.8 },
  { size: "h-2 w-2", top: "40%", left: "18%", path: [-10, 10, -10], duration: 4.8, delay: 0.1 },
  { size: "h-3 w-3", top: "46%", right: "22%", path: [-14, 10, -14], duration: 7.2, delay: 0.5 },
  { size: "h-1.5 w-1.5", top: "62%", left: "12%", path: [-6, 6, -6], duration: 4.4, delay: 1.2 },
  { size: "h-2.5 w-2.5", top: "70%", right: "10%", path: [-16, 12, -16], duration: 7.8, delay: 0.3 },
];

const reveal = {
  hidden: { opacity: 0, y: 24 },
  show: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, delay: 0.28 + index * 0.14, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

export function Hero() {
  const { ref: vendorsRef, count: vendors } = useCountUp(25);
  const { ref: ratingRef, count: rating } = useCountUp(4.8, 1800, 1);

  return (
    <section className="relative min-h-screen overflow-hidden bg-ink text-white">
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute inset-0 will-change-transform"
          animate={{ scale: [1.05, 1.18, 1.05], x: ["0%", "-4%", "0%"] }}
          transition={{ duration: 18, ease: "linear", repeat: Infinity }}
        >
          <Image
            src={heroImage}
            alt="Luxury Tamil wedding celebration"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center opacity-90"
          />
        </motion.div>

        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/35 to-black/75" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(212,175,106,0.14),transparent_35%),radial-gradient(circle_at_80%_40%,rgba(212,175,106,0.08),transparent_30%)]" />

        {PARTICLES.map((particle, index) => (
          <motion.span
            key={index}
            className={`pointer-events-none absolute inline-block rounded-full bg-gold ${particle.size} shadow-[0_0_30px_rgba(212,175,106,0.15)]`}
            style={{ top: particle.top, left: particle.left, right: particle.right }}
            animate={{ y: particle.path }}
            transition={{ duration: particle.duration, repeat: Infinity, ease: "easeInOut", delay: particle.delay }}
          />
        ))}
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col justify-between px-5 pt-20 pb-8 md:px-10 md:pt-24 md:pb-10 lg:px-12">
        <motion.div className="flex items-center justify-between gap-4 py-4">
          <motion.div
            className="inline-flex items-center justify-center rounded-full border border-gold/30 bg-black/30 p-4 shadow-[0_0_50px_rgba(212,175,106,0.2)]"
            animate={{
              scale: [1, 1.06, 1],
              boxShadow: [
                "0 0 24px rgba(212,175,106,0.25)",
                "0 0 48px rgba(212,175,106,0.45)",
                "0 0 24px rgba(212,175,106,0.25)",
              ],
            }}
            transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <Image
              src="/logo/tribleera-mark-192.png"
              alt="TRIBLEERA VAIBHAVAM mark"
              width={72}
              height={72}
              className="rounded-full"
            />
          </motion.div>

          <div className="hidden items-center gap-3 rounded-full border border-gold/15 bg-black/25 px-4 py-2 text-xs uppercase tracking-[0.28em] text-gold/80 shadow-soft md:flex">
            Premium Tamil wedding marketplace
          </div>
        </motion.div>

        <motion.div className="mx-auto flex w-full max-w-5xl flex-col items-center text-center lg:items-start lg:text-left">
          <motion.span custom={0} initial="hidden" animate="show" variants={reveal} className="inline-flex rounded-full border border-gold/25 bg-white/10 px-4 py-2 text-[11px] uppercase tracking-[0.28em] text-gold shadow-[0_0_40px_rgba(212,175,106,0.1)]">
            Exclusively curated · Tamil luxury · verified vendors
          </motion.span>

          <motion.h1 custom={1} initial="hidden" animate="show" variants={reveal} className="mt-8 max-w-4xl text-5xl font-black leading-[0.95] tracking-[-0.04em] text-cream sm:text-6xl md:text-7xl lg:text-7xl">
            Cinematic weddings for the modern Tamil couple
          </motion.h1>

          <motion.p custom={2} initial="hidden" animate="show" variants={reveal} className="mt-6 max-w-2xl text-base leading-8 text-cream/80 sm:text-lg">
            Discover premium vendors, seamless planning, and elegant celebrations designed to honour heritage with a luxurious, contemporary edge.
          </motion.p>

          <motion.div custom={3} initial="hidden" animate="show" variants={reveal} className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:justify-center lg:justify-start">
            <Button href="/vendors" variant="gold" size="lg" className="min-w-[180px]">
              Find vendors
            </Button>
            <Button href="/event-request" variant="glass" size="lg" className="min-w-[180px]">
              Request a bespoke plan
            </Button>
          </motion.div>

          <motion.div custom={4} initial="hidden" animate="show" variants={reveal} className="mt-12 w-full">
            <HeroSearch />
          </motion.div>
        </motion.div>

        <div />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 36 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-x-0 bottom-7 z-20 hidden px-5 lg:block lg:px-10"
      >
        <div className="mx-auto w-full max-w-6xl rounded-[26px] border border-gold/15 bg-black/30 px-5 py-5 shadow-soft backdrop-blur-xl md:px-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-[18px] bg-white/5 p-4 text-center">
              <p ref={vendorsRef as RefObject<HTMLParagraphElement>} className="text-3xl font-semibold text-gold-light md:text-4xl">
                {vendors}+
              </p>
              <p className="mt-2 text-sm text-cream/70">Premium verified vendors</p>
            </div>
            <div className="rounded-[18px] bg-white/5 p-4 text-center">
              <p ref={ratingRef as RefObject<HTMLParagraphElement>} className="text-3xl font-semibold text-gold-light md:text-4xl">
                {rating}★
              </p>
              <p className="mt-2 text-sm text-cream/70">Average vendor rating</p>
            </div>
            <div className="rounded-[18px] bg-white/5 p-4 text-center">
              <p className="text-3xl font-semibold text-gold-light md:text-4xl">15+</p>
              <p className="mt-2 text-sm text-cream/70">Luxury services curated</p>
            </div>
            <div className="rounded-[18px] bg-white/5 p-4 text-center">
              <p className="text-3xl font-semibold text-gold-light md:text-4xl">98%</p>
              <p className="mt-2 text-sm text-cream/70">Couples recommend us</p>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

