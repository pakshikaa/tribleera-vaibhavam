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
  { value: "Live", label: "Vendor directory updates without redeploys" },
  { value: "4.8+", label: "Average trust score" },
  { value: "20%", label: "Advance, with 80% after service" },
  { value: "5+", label: "Cities across Sri Lanka" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, delay: 0.28 + index * 0.14, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

export function Hero() {
  return (
    <section className="relative min-h-[100svh] overflow-x-hidden bg-ink text-white">
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute inset-0 will-change-transform motion-reduce:animate-none"
          animate={{ scale: [1.05, 1.18], x: ["0%", "-2.5%"] }}
          transition={{ duration: 20, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
        >
          <Image
            src={heroImage}
            alt="Luxury Tamil wedding celebration"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[center_18%] opacity-70"
          />
        </motion.div>

        <div className="absolute inset-0 bg-ink/45" />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to top,rgba(21,4,12,0.95) 0%,rgba(21,4,12,0.60) 30%,rgba(21,4,12,0.20) 60%,transparent 100%)" }}
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to bottom,rgba(21,4,12,0.70) 0%,transparent 30%)" }}
        />
        <div className="absolute inset-0 bg-burgundy-950/20" />

        {PARTICLES.map((particle, index) => (
          <motion.span
            key={index}
            className={`pointer-events-none absolute hidden sm:inline-block rounded-full bg-gold ${particle.size} shadow-[0_0_30px_rgba(212,175,106,0.15)]`}
            style={{ top: particle.top, left: particle.left, right: particle.right }}
            animate={{ y: particle.path }}
            transition={{ duration: particle.duration, repeat: Infinity, ease: "easeInOut", delay: particle.delay }}
          />
        ))}
      </div>

      <div className="relative z-10 mx-auto max-w-[860px] px-5 pb-12 pt-20 text-center md:px-10 md:pb-40 md:pt-36">
        <motion.p
          custom={0}
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="mb-6 inline-flex items-center justify-center gap-3 text-[11px] font-bold uppercase tracking-[0.25em] text-gold"
        >
          <span className="h-px w-8 bg-gold/60" />
          Tamil Heritage · Premium Wedding Concierge
          <span className="h-px w-8 bg-gold/60" />
        </motion.p>

        <motion.h1
          custom={1}
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="font-display font-bold leading-[1.04] tracking-tight text-cream"
          style={{ fontSize: "clamp(2.6rem, 6.5vw, 5.2rem)", textShadow: "0 2px 30px rgba(21,4,12,0.8), 0 4px 60px rgba(21,4,12,0.6)" }}
        >
          Plan Your{" "}
          <em className="italic" style={{ color: "#E9CE9C" }}>
            Perfect
          </em>
          <br className="hidden sm:block" />
          Celebration
        </motion.h1>

        <motion.p
          custom={2}
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="mx-auto mt-5 max-w-[500px] leading-relaxed"
          style={{ fontSize: "clamp(0.95rem, 1.6vw, 1.125rem)", color: "rgba(247,238,226,0.85)", textShadow: "0 1px 12px rgba(21,4,12,0.7)" }}
        >
          Jaffna&apos;s most trusted photographers, decorators, bridal artists, cake ateliers and invitation houses -
          verified, bookable, secure.
        </motion.p>

        <motion.p
          custom={3}
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="mt-4 font-display text-[1.05rem] italic"
          style={{ color: "#D4AF6A", textShadow: "0 1px 12px rgba(21,4,12,0.7)" }}
        >
          தேர்வின் செம்மை, வைபவத்தின் பெருமை
        </motion.p>

        <motion.div
          custom={4}
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="mt-7 flex flex-col items-center gap-3"
        >
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button
              href="/vendors"
              variant="gold"
              className="min-h-0 px-8 py-[13px] text-[15px] font-bold tracking-[0.02em]"
            >
              Find Vendors
            </Button>
            <Button
              href="/event-request"
              variant="glass"
              className="min-h-0 border-white/20 bg-white/10 px-8 py-[13px] text-[15px] font-semibold text-[#F7EEE2] hover:bg-white/15 hover:text-[#F7EEE2]"
            >
              Plan Your Wedding
            </Button>
          </div>
        </motion.div>

        <motion.div
          custom={5}
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="mt-8"
        >
          <HeroSearch />
        </motion.div>

        <motion.p
          custom={6}
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="mt-4 text-center text-[12.5px] text-white/60"
        >
          Not sure where to start?{" "}
          <Link
            href="/event-request"
            className="font-semibold text-gold/80 underline underline-offset-2 transition-colors hover:text-gold"
          >
            Take our 2-minute wedding setup →
          </Link>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 md:absolute md:inset-x-0 md:bottom-7 md:mt-0 md:px-5 lg:px-10"
        >
          <div className="mx-auto w-full max-w-6xl rounded-[26px] border border-gold/15 bg-black/30 px-5 py-5 shadow-soft backdrop-blur-xl md:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4">
              {STATS.map((stat, i) => (
                <div
                  key={stat.value}
                  className={`p-4 text-center md:text-left${i > 0 ? " md:border-l md:border-cream/10" : ""}`}
                >
                  <p
                    className="font-display font-bold"
                    style={{ color: "#E9CE9C", fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: "700", textShadow: "0 1px 8px rgba(21,4,12,0.5)" }}
                  >
                    {stat.value}
                  </p>
                  <p
                    className="mt-2"
                    style={{ color: "rgba(247,238,226,0.55)", fontSize: "11px", letterSpacing: "0.02em" }}
                  >
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
