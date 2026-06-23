"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { SmartImage } from "@/components/ui/SmartImage";
import { categories } from "@/lib/data/categories";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const } },
};

export function ServiceShowcase() {
  const [featured, ...rest] = categories;

  return (
    <section className="bg-ink py-24 md:py-32">
      <div className="mx-auto max-w-[1280px] px-5 md:px-10">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
          className="mb-16 max-w-xl"
        >
          <p className="mb-4 inline-flex items-center gap-2.5 text-[11.5px] font-semibold uppercase tracking-[0.22em] text-gold">
            <span className="h-px w-7 bg-gold" />
            Phase One Services
          </p>
          <h2 className="font-display text-[30px] font-bold leading-[1.15] text-cream md:text-[44px]">
            Five crafts, each
            <br />
            worth celebrating.
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-cream-dim">
            Every category is hand-vetted for craftsmanship &mdash; no directory padding, no
            unverified listings.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:auto-rows-[220px] lg:grid-cols-3 lg:grid-rows-[260px_260px] lg:auto-rows-auto">
          <ShowcaseCard category={featured} className="sm:col-span-2 sm:row-span-1 sm:h-[300px] lg:col-span-1 lg:row-span-2 lg:h-full" big />
          {rest.map((c, i) => (
            <ShowcaseCard key={c.slug} category={c} delay={(i + 1) * 0.08} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ShowcaseCard({
  category,
  big = false,
  className = "",
  delay = 0,
}: {
  category: (typeof categories)[number];
  big?: boolean;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      variants={{ hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] as const } } }}
      className={`group relative h-[240px] overflow-hidden rounded-[14px] border border-gold/15 transition-colors duration-500 hover:border-gold/55 sm:h-full ${className}`}
    >
      <Link href={`/vendors?category=${category.slug}`} className="absolute inset-0 z-10" aria-label={category.name} />
      <motion.div className="absolute inset-0" whileHover="zoom">
        <motion.div
          variants={{ zoom: { scale: 1.08 } }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] as const }}
          className="h-full w-full"
        >
          <SmartImage
            src={category.imageUrl}
            alt={category.description}
            fallbackVariant={category.motif}
            fallbackTone={category.tone}
            fallbackSeed={category.id.length}
            sizes={big ? "(max-width: 1024px) 100vw, 38vw" : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 22vw"}
          />
        </motion.div>
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/10 to-transparent" style={{ backgroundImage: "linear-gradient(180deg, transparent 35%, rgba(21,4,12,0.94) 100%)" }} />
      <div className="absolute inset-x-0 bottom-0 z-10 p-5">
        <p className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-gold">{category.name}</p>
        {big ? (
          <h3 className="mt-2 font-display text-2xl font-semibold text-cream">{category.tamilName}</h3>
        ) : null}
        <span className="mt-2 flex translate-y-1.5 items-center gap-1.5 text-xs text-cream-dim opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:text-gold-light group-hover:opacity-100">
          Explore studios →
        </span>
      </div>
    </motion.div>
  );
}
