"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ShieldCheck, Star } from "lucide-react";
import { SmartImage } from "@/components/ui/SmartImage";
import { getCategoryBySlug } from "@/lib/data/categories";
import { vendors } from "@/lib/data/vendors";
import { formatLKR } from "@/lib/utils/format";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 32, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export function FeaturedVendors() {
  const featured = [...vendors]
    .filter((vendor) => vendor.status === "approved")
    .sort((a, b) => b.trustScore - a.trustScore)
    .slice(0, 5);

  return (
    <section className="bg-ink py-24 md:py-32">
      <div className="mx-auto max-w-[1280px] px-5 md:px-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={itemVariants}
          className="mb-14 flex items-end justify-between gap-4"
        >
          <div className="max-w-lg">
            <p className="text-overline mb-4 inline-flex items-center gap-2.5 text-gold">
              <span className="h-px w-7 bg-gold" />
              Featured Studios
            </p>
            <h2 className="text-display-md text-cream">Loved by couples this season.</h2>
          </div>
          <Link href="/vendors" className="hidden shrink-0 text-sm font-semibold text-gold-light hover:text-gold md:block">
            See all vendors →
          </Link>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={containerVariants}
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {featured.map((vendor) => (
            <motion.div key={vendor.id} variants={itemVariants}>
              <Link
                href={`/vendors/${vendor.slug}`}
                className="group block overflow-hidden rounded-[14px] border border-gold/16 bg-burgundy-950 transition-colors duration-400 hover:border-gold/55"
              >
                <div className="relative h-[230px] overflow-hidden">
                  <div className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.07]">
                    <SmartImage
                      src={vendor.imageUrl}
                      alt={vendor.name}
                      fallbackVariant={vendor.motif}
                      fallbackTone={vendor.tone}
                      fallbackSeed={vendor.id.length}
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
                  {vendor.verified && (
                    <span className="glass absolute left-3.5 top-3.5 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10.5px] font-semibold text-gold-light">
                      <ShieldCheck size={12} /> Verified
                    </span>
                  )}
                </div>
                <div className="p-6">
                  <p className="text-overline text-gold">{getCategoryBySlug(vendor.categorySlug)?.name}</p>
                  <h3 className="text-display-sm mt-2 text-cream">{vendor.name}</h3>
                  <div className="mt-5 flex items-center justify-between border-t border-cream/10 pt-4">
                    <span className="font-display text-lg font-semibold text-gold-light">{formatLKR(vendor.startingPrice)}</span>
                    <span className="flex items-center gap-1 text-sm text-cream-dim">
                      <Star size={13} className="fill-gold text-gold" /> {vendor.trustScore.toFixed(1)}
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
        <div className="mt-8 text-center md:hidden">
          <Link href="/vendors" className="text-sm font-semibold text-gold-light hover:text-gold">
            See all vendors →
          </Link>
        </div>
      </div>
    </section>
  );
}
