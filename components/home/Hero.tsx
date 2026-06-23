"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { HeroSearch } from "@/components/home/HeroSearch";
import { Button } from "@/components/ui/Button";
import { useCountUp } from "@/hooks/useCountUp";
import { heroImage } from "@/lib/data/images";

const STATS = [
  { value: 25, label: "Verified studios across Sri Lanka", suffix: "", decimals: false },
  { value: 4.8, label: "Average trust score", suffix: "★", decimals: true },
  { value: 0, label: "Disputes on the platform so far", prefix: "LKR ", decimals: false },
  { value: 5, label: "Cities - Jaffna, Colombo & beyond", suffix: "", decimals: false },
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

function formatStat(value: number, prefix = "", suffix = "", decimals = false) {
  const rendered = decimals ? value.toFixed(1) : Math.round(value).toString();
  return `${prefix}${rendered}${suffix}`;
}

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.06, 1.16]);

  const countVendors = useCountUp(25);
  const countScore = useCountUp(4.8);
  const countDisputes = useCountUp(0);
  const countCities = useCountUp(5);
  const counters = [countVendors, countScore, countDisputes, countCities];

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-ink pb-28 md:pb-36">
      <div className="absolute inset-0 overflow-hidden">
        <motion.div style={{ y, scale }} className="absolute inset-0 will-change-transform">
          <Image
            src={heroImage}
            alt="A Jaffna wedding celebration, richly decorated with flowers and warm light"
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-55"
          />
        </motion.div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_8%,rgba(122,31,61,0.35),transparent_60%)]" />
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
        >
          <span className="h-px w-7 bg-gold" />
          Tamil Heritage · Premium Wedding Concierge
          <span className="h-px w-7 bg-gold" />
        </motion.p>

        <motion.h1 custom={1} initial="hidden" animate="show" variants={fadeUp} className="text-display-xl text-cream">
          Plan Your <em className="font-semibold italic text-gold-light">Perfect</em>
          <br />
          Celebration
        </motion.h1>

        <motion.p
          custom={2}
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="text-body-lg mx-auto mt-5 max-w-xl text-cream-dim"
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
            {STATS.map((stat, index) => (
              <div
                key={stat.label}
                className={`px-2 text-center lg:border-l lg:border-cream/10 lg:text-left ${index === 0 ? "lg:border-l-0 lg:pl-0" : ""}`}
              >
                <p className="font-display text-3xl font-bold text-gold-light md:text-4xl">
                  <span ref={counters[index].ref}>{formatStat(counters[index].count, stat.prefix, stat.suffix, stat.decimals)}</span>
                </p>
                <p className="text-caption mt-1 text-cream-faint">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
