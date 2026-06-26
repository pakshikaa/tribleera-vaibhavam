"use client";

import { motion } from "framer-motion";
import { ArrowRight, CalendarDays, Gem, ScrollText, ShieldCheck, Sparkles } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

const pillars = [
  {
    icon: ShieldCheck,
    title: "Verified without compromise",
    body: "Each studio is screened for consistency, communication quality, and delivery discipline before it appears on the platform.",
    accent: "from-gold/20 via-gold-light/10 to-transparent",
  },
  {
    icon: Gem,
    title: "Luxury, but operationally clear",
    body: "Premium positioning means little without usable pricing, package clarity, and a booking flow that removes friction instead of adding it.",
    accent: "from-burgundy/35 via-burgundy/10 to-transparent",
  },
  {
    icon: ScrollText,
    title: "Built for Tamil wedding nuance",
    body: "From visual taste to family coordination, vendors are surfaced with cultural fit in mind rather than generic marketplace matching.",
    accent: "from-gold-light/20 via-transparent to-transparent",
  },
];

const promises = [
  "Transparent package structure",
  "Milestone-minded booking flow",
  "Refined vendor presentation",
  "Designed for trust before payment",
];

const reveal = {
  hidden: { opacity: 0, y: 28 },
  show: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      delay: index * 0.12,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  }),
};

export function VaibhavamSignature() {
  return (
    <section className="dark-section relative overflow-hidden bg-ink py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_65%_50%_at_20%_15%,rgba(122,31,61,0.28),transparent_72%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_45%_40%_at_82%_18%,rgba(212,175,106,0.14),transparent_72%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
      </div>

      <Container className="relative">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={reveal}
          custom={0}
          className="mx-auto mb-16 max-w-2xl text-center"
        >
          <p className="text-overline mb-4 inline-flex items-center gap-2 text-gold">
            <Sparkles size={14} />
            The Vaibhavam Standard
          </p>
          <h2 className="text-display-lg text-cream">
            A premium vendor marketplace
            <br />
            should feel curated at every layer.
          </h2>
          <p className="text-body-md mt-5 text-cream-dim">
            This section is built to express the product thesis visually: quiet confidence, ceremonial richness,
            and booking clarity wrapped in a dark luxury interface.
          </p>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={reveal}
            custom={1}
            className="glass glow-gold relative overflow-hidden rounded-[28px] border border-gold/25 p-7 md:p-10"
          >
            <motion.div
              className="absolute inset-0 opacity-80"
              animate={{
                background: [
                  "radial-gradient(circle at 18% 18%, rgba(233,206,156,0.18), transparent 28%), radial-gradient(circle at 80% 70%, rgba(122,31,61,0.26), transparent 30%)",
                  "radial-gradient(circle at 28% 24%, rgba(233,206,156,0.16), transparent 30%), radial-gradient(circle at 72% 62%, rgba(122,31,61,0.30), transparent 34%)",
                  "radial-gradient(circle at 18% 18%, rgba(233,206,156,0.18), transparent 28%), radial-gradient(circle at 80% 70%, rgba(122,31,61,0.26), transparent 30%)",
                ],
              }}
              transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
            />

            <div className="relative z-10">
              <div className="mb-8 flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-gold/30 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-gold-light">
                  Concierge-first UX
                </span>
                <span className="rounded-full border border-cream/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-cream-dim">
                  Dark luxury system
                </span>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div className="rounded-[22px] border border-gold/15 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-6">
                  <p className="text-overline text-gold">Signature Feel</p>
                  <p className="mt-3 font-display text-3xl text-cream">Quietly opulent.</p>
                  <p className="mt-3 text-sm leading-7 text-cream-dim">
                    Gold is treated like jewelry, not wallpaper. Motion is restrained. Surfaces feel expensive
                    because they create focus.
                  </p>
                </div>

                <motion.div
                  whileHover={{ y: -4, rotate: -1 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="rounded-[22px] border border-gold/20 bg-[linear-gradient(160deg,rgba(212,175,106,0.16),rgba(34,7,20,0.08))] p-6"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-overline text-gold">Booking Tone</p>
                    <CalendarDays size={18} className="text-gold-light" />
                  </div>
                  <p className="mt-3 font-display text-3xl text-cream">20% to begin.</p>
                  <p className="mt-3 text-sm leading-7 text-cream-dim">
                    The interface can reassure premium couples with milestone language, measured urgency, and no
                    chaotic discount energy.
                  </p>
                </motion.div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {promises.map((promise, index) => (
                  <motion.div
                    key={promise}
                    custom={index + 2}
                    variants={reveal}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-80px" }}
                    whileHover={{ x: 4 }}
                    className="flex items-center gap-3 rounded-[18px] border border-cream/10 bg-white/5 px-4 py-3"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold-light">
                      <ShieldCheck size={15} />
                    </span>
                    <span className="text-sm font-medium text-cream">{promise}</span>
                  </motion.div>
                ))}
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button href="/vendors" variant="gold" size="lg" iconRight={<ArrowRight size={16} />}>
                  Explore premium vendors
                </Button>
                <Button href="/event-request" variant="glass" size="lg">
                  Start concierge request
                </Button>
              </div>
            </div>
          </motion.div>

          <div className="grid gap-4">
            {pillars.map((pillar, index) => {
              const Icon = pillar.icon;

              return (
                <motion.div
                  key={pillar.title}
                  custom={index + 2}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: "-80px" }}
                  variants={reveal}
                  whileHover={{ y: -6, scale: 1.01 }}
                  transition={{ duration: 0.28, ease: "easeOut" }}
                  className="group relative overflow-hidden rounded-[24px] border border-gold/15 bg-[rgba(247,238,226,0.06)] p-6 backdrop-blur-[20px]"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${pillar.accent} opacity-80 transition-opacity duration-300 group-hover:opacity-100`} />
                  <motion.div
                    className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    initial={false}
                    animate={{ backgroundPosition: ["0% 50%", "100% 50%"] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    style={{
                      backgroundImage:
                        "linear-gradient(115deg, transparent 15%, rgba(233,206,156,0.12) 50%, transparent 85%)",
                      backgroundSize: "200% 100%",
                    }}
                  />

                  <div className="relative z-10">
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-[16px] border border-gold/20 bg-[#15040C]/50 text-gold-light shadow-[0_10px_30px_rgba(0,0,0,0.25)]">
                      <Icon size={20} />
                    </div>
                    <h3 className="text-display-sm text-cream">{pillar.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-cream-dim">{pillar.body}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
