"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ShieldCheck, Star } from "lucide-react";
import { SmartImage } from "@/components/ui/SmartImage";
import { vendors } from "@/lib/data/vendors";
import { getCategoryBySlug } from "@/lib/data/categories";
import { formatLKR } from "@/lib/utils/format";

const fadeUp = {
  hidden: { opacity: 0, y: 26 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

export function FeaturedVendors() {
  const featured = [...vendors]
    .filter((v) => v.status === "approved")
    .sort((a, b) => b.trustScore - a.trustScore)
    .slice(0, 3);

  return (
    <section className="bg-ink py-24 md:py-32">
      <div className="mx-auto max-w-[1280px] px-5 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="mb-14 flex items-end justify-between gap-4"
        >
          <div className="max-w-lg">
            <p className="mb-4 inline-flex items-center gap-2.5 text-[11.5px] font-semibold uppercase tracking-[0.22em] text-gold">
              <span className="h-px w-7 bg-gold" />
              Featured Studios
            </p>
            <h2 className="font-display text-[28px] font-bold leading-[1.2] text-cream md:text-[40px]">
              Loved by couples this season.
            </h2>
          </div>
          <Link href="/vendors" className="hidden shrink-0 text-sm font-semibold text-gold-light hover:text-gold md:block">
            See all vendors →
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((v, i) => (
            <motion.div
              key={v.id}
              custom={i}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              variants={fadeUp}
              whileHover={{ y: -8 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
            >
              <Link
                href={`/vendors/${v.slug}`}
                className="group block overflow-hidden rounded-[14px] border border-gold/16 bg-burgundy-950 transition-colors duration-400 hover:border-gold/55"
              >
                <div className="relative h-[230px] overflow-hidden">
                  <div className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.07]">
                    <SmartImage
                      src={v.imageUrl}
                      alt={v.name}
                      fallbackVariant={v.motif}
                      fallbackTone={v.tone}
                      fallbackSeed={v.id.length}
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
                  {v.verified && (
                    <span className="glass absolute left-3.5 top-3.5 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10.5px] font-semibold text-gold-light">
                      <ShieldCheck size={12} /> Verified
                    </span>
                  )}
                </div>
                <div className="p-6">
                  <p className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-gold">
                    {getCategoryBySlug(v.categorySlug)?.name}
                  </p>
                  <h3 className="mt-2 font-display text-xl font-semibold text-cream">{v.name}</h3>
                  <div className="mt-5 flex items-center justify-between border-t border-cream/10 pt-4">
                    <span className="font-display text-lg font-semibold text-gold-light">{formatLKR(v.startingPrice)}</span>
                    <span className="flex items-center gap-1 text-sm text-cream-dim">
                      <Star size={13} className="fill-gold text-gold" /> {v.trustScore.toFixed(1)}
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
        <div className="mt-8 text-center md:hidden">
          <Link href="/vendors" className="text-sm font-semibold text-gold-light hover:text-gold">
            See all vendors →
          </Link>
        </div>
      </div>
    </section>
  );
}
