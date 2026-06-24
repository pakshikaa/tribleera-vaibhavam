"use client";

import Image from "next/image";
import { useRef, type RefObject } from "react";
import { motion } from "framer-motion";
import { HeroSearch } from "@/components/home/HeroSearch";
import { Button } from "@/components/ui/Button";
import { useCountUp } from "@/hooks/useCountUp";
import { heroImage } from "@/lib/data/images";

const STATS = [
  { value: "25", label: "Verified studios across Sri Lanka" },
  { value: "4.8", label: "Average trust score" },
  { value: "20%", label: "Advance only - 80% paid after service" },
  { value: "5", label: "Cities - Jaffna, Colombo & beyond" },
];

const PARTICLES = [
  { size: "h-2.5 w-2.5", top: "18%", left: "8%", path: [-8, 12, -8], duration: 5.5, delay: 0.2 },
  { size: "h-3 w-3", top: "22%", right: "12%", path: [-12, 8, -12], duration: 6.4, delay: 0.8 },
  { size: "h-2 w-2", top: "38%", left: "16%", path: [-10, 10, -10], duration: 4.8, delay: 0.1 },
  { size: "h-3 w-3", top: "44%", right: "20%", path: [-14, 10, -14], duration: 7.2, delay: 0.5 },
  { size: "h-1.5 w-1.5", top: "62%", left: "12%", path: [-6, 6, -6], duration: 4.4, delay: 1.2 },
  { size: "h-2.5 w-2.5", top: "68%", right: "10%", path: [-16, 12, -16], duration: 7.8, delay: 0.3 },
];

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: 0.2 + index * 0.12, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { ref: ref1, count: c1 } = useCountUp(25);
  const { ref: ref2, count: c2 } = useCountUp(4.8, 1500, 1);
  const { ref: ref3, count: c3 } = useCountUp(20);
  const { ref: ref4, count: c4 } = useCountUp(5);

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-ink pb-28 md:pb-36">
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute inset-0 will-change-transform"
          animate={{ scale: [1.06, 1.18], x: ["0%", "-3%"] }}
          transition={{ duration: 18, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
        >
          <Image
            src={heroImage}
            alt="A Jaffna wedding celebration"
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-60"
          />
        </motion.div>
        <motion.div
          className="pointer-events-none absolute inset-0"
          animate={{
            background: [
              "radial-gradient(ellipse 60% 50% at 30% 30%, rgba(122,31,61,0.5), transparent 70%)",
              "radial-gradient(ellipse 60% 50% at 70% 60%, rgba(122,31,61,0.4), transparent 70%)",
              "radial-gradient(ellipse 60% 50% at 30% 30%, rgba(122,31,61,0.5), transparent 70%)",
            ],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink via-burgundy-950/55 to-ink" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/70 via-transparent to-ink/70" />
        {PARTICLES.map((particle, index) => (
          <motion.div
            key={index}
            className={`pointer-events-none absolute rounded-full bg-gold/25 ${particle.size}`}
            style={{
              top: particle.top,
              left: "left" in particle ? particle.left : undefined,
              right: "right" in particle ? particle.right : undefined,
            }}
            animate={{ y: particle.path }}
            transition={{ duration: particle.duration, repeat: Infinity, ease: "easeInOut", delay: particle.delay }}
          />
        ))}
      </div>

      <div className="relative mx-auto max-w-[920px] px-5 pb-12 pt-32 text-center md:px-10 md:pt-40">
        <motion.div
          initial={{ opacity: 0, scale: 0.7, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] as const }}
          className="mb-7 flex justify-center"
        >
          <div className="rounded-[14px]">
            <Image
              src="/logo/tribleera-mark-192.png"
              alt="TRIBLEERA VAIBHAVAM"
              width={84}
              height={84}
              className="rounded-[14px]"
            />
          </div>
        </motion.div>

        <motion.p
          custom={0}
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="text-overline mb-5 inline-flex items-center justify-center gap-2.5 text-gold"
          style={{ color: "#D4AF6A" }}
        >
          <span className="h-px w-7 bg-gold" />
          Tamil Heritage · Premium Wedding Concierge
          <span className="h-px w-7 bg-gold" />
        </motion.p>

        <motion.h1
          custom={1}
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="text-display-xl text-cream"
          style={{ color: "#F7EEE2", textShadow: "0 2px 20px rgba(0,0,0,0.5)" }}
        >
          Plan Your <em className="font-semibold italic text-gold-light">Perfect</em>
          <br />
          Celebration
        </motion.h1>

        <motion.p
          custom={2}
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="text-body-lg mx-auto mt-5 max-w-xl text-white/75"
          style={{ color: "rgba(247,238,226,0.8)" }}
        >
          Discover 25 verified Tamil wedding vendors across Sri Lanka - from photographers and decorators to bridal artists, invitation studios, and luxury cake makers.
        </motion.p>

        <motion.div custom={3} initial="hidden" animate="show" variants={fadeUp}>
          <HeroSearch />
        </motion.div>

        <motion.p custom={4} initial="hidden" animate="show" variants={fadeUp} className="mt-4 text-center text-xs text-cream-faint">
          Planning multiple services?{" "}
          <Button href="/event-request" variant="tertiary" size="sm" className="px-0 py-0 text-xs text-gold-light hover:text-gold">
            Create a full event request
          </Button>
        </motion.p>

        <motion.div
          custom={5}
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="mt-5 flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
        >
          <Button href="/services" variant="glass" size="sm">
            Browse all services
          </Button>
          <span className="text-xs text-cream-faint">·</span>
          <Button href="/vendor/register" variant="glass" size="sm">
            Become a vendor
          </Button>
        </motion.div>

        <motion.p
          custom={6}
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="mt-6 font-display text-base italic text-gold/80"
          style={{ color: "#D4AF6A" }}
        >
          Tradition in every choice, confidence in every booking
        </motion.p>
      </div>

      <div className="pointer-events-none absolute bottom-[180px] left-1/2 -translate-x-1/2">
        <div className="relative h-14 w-px bg-gold/20">
          <motion.div
            className="absolute w-px bg-gold/80"
            animate={{ top: ["0%", "100%"], height: ["0%", "40%", "0%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] as const }}
        className="relative px-5 md:px-10"
      >
        <div className="mx-auto max-w-[1280px]">
          <div className="glow-gold glass grid grid-cols-2 gap-y-7 rounded-[14px] px-6 py-7 lg:grid-cols-4 lg:gap-0 lg:px-10">
            <div className="px-2 text-center lg:pl-0 lg:text-left">
              <p
                ref={ref1 as RefObject<HTMLParagraphElement>}
                className="font-display text-2xl font-bold text-gold-light md:text-3xl"
                style={{ color: "#E9CE9C" }}
              >
                {c1}+
              </p>
              <p className="text-caption mt-1 text-white/60" style={{ color: "rgba(255,255,255,0.6)" }}>
                {STATS[0].label}
              </p>
            </div>
            <div className="px-2 text-center lg:border-l lg:border-cream/10 lg:text-left">
              <p
                ref={ref2 as RefObject<HTMLParagraphElement>}
                className="font-display text-2xl font-bold text-gold-light md:text-3xl"
                style={{ color: "#E9CE9C" }}
              >
                {c2}★
              </p>
              <p className="text-caption mt-1 text-white/60" style={{ color: "rgba(255,255,255,0.6)" }}>
                {STATS[1].label}
              </p>
            </div>
            <div className="px-2 text-center lg:border-l lg:border-cream/10 lg:text-left">
              <p
                ref={ref3 as RefObject<HTMLParagraphElement>}
                className="font-display text-2xl font-bold text-gold-light md:text-3xl"
                style={{ color: "#E9CE9C" }}
              >
                {c3}%
              </p>
              <p className="text-caption mt-1 text-white/60" style={{ color: "rgba(255,255,255,0.6)" }}>
                {STATS[2].label}
              </p>
            </div>
            <div className="px-2 text-center lg:border-l lg:border-cream/10 lg:text-left">
              <p
                ref={ref4 as RefObject<HTMLParagraphElement>}
                className="font-display text-2xl font-bold text-gold-light md:text-3xl"
                style={{ color: "#E9CE9C" }}
              >
                {c4}
              </p>
              <p className="text-caption mt-1 text-white/60" style={{ color: "rgba(255,255,255,0.6)" }}>
                {STATS[3].label}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
