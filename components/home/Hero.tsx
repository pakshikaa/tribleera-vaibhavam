"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { HeroSearch } from "@/components/home/HeroSearch";
import { Button } from "@/components/ui/Button";
import { heroImage } from "@/lib/data/images";

const PARTICLES = [
  { size: "h-2.5 w-2.5", top: "14%", left: "10%", path: [-8, 12, -8], duration: 5.5, delay: 0.2 },
  { size: "h-3 w-3", top: "24%", right: "12%", path: [-12, 8, -12], duration: 6.4, delay: 0.8 },
  { size: "h-2 w-2", top: "40%", left: "18%", path: [-10, 10, -10], duration: 4.8, delay: 0.1 },
  { size: "h-3 w-3", top: "46%", right: "22%", path: [-14, 10, -14], duration: 7.2, delay: 0.5 },
  { size: "h-1.5 w-1.5", top: "62%", left: "12%", path: [-6, 6, -6], duration: 4.4, delay: 1.2 },
  { size: "h-2.5 w-2.5", top: "70%", right: "10%", path: [-16, 12, -16], duration: 7.8, delay: 0.3 },
];

const STATS = [
  { value: "25", label: "Verified studios across Sri Lanka" },
  { value: "4.8★", label: "Average trust score" },
  { value: "20%", label: "Advance only — 80% paid after service" },
  { value: "5", label: "Cities — Jaffna, Colombo & beyond" },
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
  return (
    <section className="relative min-h-screen overflow-hidden bg-ink text-white">
      {/* Background image — Ken Burns + parallax */}
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

      {/* Hero content */}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-5 pt-20 pb-8 md:px-10 md:pt-24 md:pb-10 lg:pb-40 lg:px-12">
        <motion.div className="mx-auto flex w-full max-w-5xl flex-col items-center text-center lg:items-start lg:text-left">

          {/* 1 — Eyebrow */}
          <motion.p
            custom={0}
            initial="hidden"
            animate="show"
            variants={reveal}
            className="mb-5 inline-flex items-center gap-2.5 text-[11.5px] font-semibold uppercase tracking-[0.22em] text-gold"
          >
            <span className="h-px w-7 bg-gold" />
            Tamil Heritage · Premium Wedding Concierge
            <span className="h-px w-7 bg-gold" />
          </motion.p>

          {/* 2 — Headline */}
          <motion.h1
            custom={1}
            initial="hidden"
            animate="show"
            variants={reveal}
            className="max-w-4xl text-5xl font-black leading-[0.95] tracking-[-0.04em] text-cream sm:text-6xl md:text-7xl lg:text-7xl"
          >
            Plan Your{" "}
            <em className="font-semibold italic text-gold-light">Perfect</em>
            <br />
            Celebration
          </motion.h1>

          {/* 3 — Subtitle */}
          <motion.p
            custom={2}
            initial="hidden"
            animate="show"
            variants={reveal}
            className="mt-6 max-w-lg text-base leading-relaxed text-cream/80 sm:text-[17px]"
          >
            Jaffna&rsquo;s most trusted photographers, decorators, bridal artists, cake ateliers and invitation houses — verified, bookable, secure.
          </motion.p>

          {/* 4 — Tamil tagline */}
          <motion.p
            custom={3}
            initial="hidden"
            animate="show"
            variants={reveal}
            className="mt-4 font-display text-base italic text-gold/80"
          >
            தேர்வின் செம்மை, வைபவத்தின் பெருமை
          </motion.p>

          {/* 5 — CTA buttons */}
          <motion.div
            custom={4}
            initial="hidden"
            animate="show"
            variants={reveal}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:justify-center lg:justify-start"
          >
            <Button href="/vendors" variant="gold" size="lg" className="min-w-[180px]">
              Find Vendors
            </Button>
            <Button href="/event-request" variant="glass" size="lg" className="min-w-[180px]">
              Plan Your Wedding
            </Button>
          </motion.div>

          {/* 6 — Search bar */}
          <motion.div
            custom={5}
            initial="hidden"
            animate="show"
            variants={reveal}
            className="mt-12 w-full"
          >
            <HeroSearch />
          </motion.div>

          {/* 7 — Helper nudge */}
          <motion.p
            custom={6}
            initial="hidden"
            animate="show"
            variants={reveal}
            className="mt-5 text-sm text-cream/50"
          >
            Not sure where to start?{" "}
            <Link href="/event-request" className="text-gold/80 underline-offset-2 hover:underline">
              Take our 2-minute wedding setup →
            </Link>
          </motion.p>
        </motion.div>
      </div>

      {/* 8 — Stats bar (lg only, absolute bottom) */}
      <motion.div
        initial={{ opacity: 0, y: 36 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-x-0 bottom-7 z-20 hidden px-5 lg:block lg:px-10"
      >
        <div className="mx-auto w-full max-w-6xl rounded-[26px] border border-gold/15 bg-black/30 px-5 py-5 shadow-soft backdrop-blur-xl md:px-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STATS.map((stat) => (
              <div key={stat.value} className="rounded-[18px] bg-white/5 p-4 text-center">
                <p className="text-3xl font-semibold text-gold-light md:text-4xl">{stat.value}</p>
                <p className="mt-2 text-sm text-cream/70">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
