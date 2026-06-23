"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { HeroSearch } from "@/components/home/HeroSearch";
import { heroImage } from "@/lib/data/images";

const STATS = [
  { value: "50+", label: "Verified vendors" },
  { value: "4.8★", label: "Average trust score" },
  { value: "100%", label: "Advance protected by escrow" },
  { value: "5", label: "Cities, North & East" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: 0.2 + i * 0.12, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.06, 1.16]);

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
      </div>

      <div className="relative mx-auto max-w-[920px] px-5 pb-12 pt-32 text-center md:px-10 md:pt-40">
        <motion.div
          initial={{ opacity: 0, scale: 0.7, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] as const }}
          className="mb-7 flex justify-center"
        >
          <motion.div
            animate={{ boxShadow: [
              "0 0 0 1px rgba(212,175,106,.35), 0 20px 60px rgba(212,175,106,.18)",
              "0 0 0 1px rgba(212,175,106,.55), 0 20px 70px rgba(212,175,106,.34)",
              "0 0 0 1px rgba(212,175,106,.35), 0 20px 60px rgba(212,175,106,.18)"
            ]}}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1.1 }}
            className="rounded-[14px]"
          >
            <Image
              src="/logo/tribleera-mark-192.png"
              alt="TRIBLEERA VAIBHAVAM"
              width={84}
              height={84}
              className="rounded-[14px]"
            />
          </motion.div>
        </motion.div>

        <motion.p
          custom={0}
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="mb-5 inline-flex items-center justify-center gap-2.5 text-[11.5px] font-semibold uppercase tracking-[0.22em] text-gold"
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
          className="font-display text-[40px] font-bold leading-[1.05] text-cream md:text-[72px]"
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
          className="mx-auto mt-5 max-w-lg text-[15px] leading-relaxed text-cream-dim md:text-lg"
        >
          Jaffna&rsquo;s most trusted photographers, decorators, bridal artists, cake ateliers and
          invitation houses — verified, bookable, secure.
        </motion.p>

        {/* Airbnb-style search bar */}
        <motion.div
          custom={3}
          initial="hidden"
          animate="show"
          variants={fadeUp}
        >
          <HeroSearch />
        </motion.div>

        <motion.div
          custom={4}
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="mt-5 flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
        >
          <Button href="/services" variant="glass" size="sm">Browse all services</Button>
          <span className="text-xs text-cream-faint">·</span>
          <Button href="/vendor/register" variant="glass" size="sm">Become a vendor</Button>
        </motion.div>

        <motion.p
          custom={5}
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="mt-6 font-display text-base italic text-gold/80"
        >
          தேர்வின் செம்மை, வைபவத்தின் பெருமை
        </motion.p>
      </div>

      {/* Floating glass stat bar */}
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] as const }}
        className="relative px-5 md:px-10"
      >
        <div className="mx-auto max-w-[1280px]">
          <div className="glow-gold glass grid grid-cols-2 gap-y-7 rounded-[14px] px-6 py-7 lg:grid-cols-4 lg:gap-0 lg:px-10">
            {STATS.map((s, i) => (
              <div
                key={s.label}
                className={`px-2 text-center lg:border-l lg:border-cream/10 lg:text-left ${i === 0 ? "lg:border-l-0 lg:pl-0" : ""}`}
              >
                <p className="font-display text-2xl font-bold text-gold-light md:text-3xl">{s.value}</p>
                <p className="mt-1 text-[11px] leading-tight text-cream-faint md:text-xs">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
