"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { SmartImage } from "@/components/ui/SmartImage";
import { categories } from "@/lib/data/categories";

export function ServiceShowcase() {
  const [featured, ...rest] = categories;

  return (
    <section className="bg-ink py-24 md:py-32">
      <div className="mx-auto max-w-[1280px] px-5 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
          className="mb-16 max-w-xl"
        >
          <p className="text-overline mb-4 inline-flex items-center gap-2.5 text-gold">
            <span className="h-px w-7 bg-gold" />
            Phase One Services
          </p>
          <h2 className="text-display-md text-cream">
            Five crafts, each
            <br />
            worth celebrating.
          </h2>
          <p className="text-body-sm mt-4 text-cream-dim">
            Every category is hand-vetted for craftsmanship - no directory padding, no unverified listings.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:auto-rows-[220px] lg:grid-cols-3 lg:grid-rows-[260px_260px] lg:auto-rows-auto">
          <ShowcaseCard category={featured} index={0} className="sm:col-span-2 sm:h-[300px] lg:col-span-1 lg:row-span-2 lg:h-full" big />
          {rest.map((category, index) => (
            <ShowcaseCard key={category.slug} category={category} index={index + 1} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ShowcaseCard({
  category,
  index,
  big = false,
  className = "",
}: {
  category: (typeof categories)[number];
  index: number;
  big?: boolean;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94, y: 30 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] as const }}
      className={`group relative h-[240px] overflow-hidden rounded-[14px] border border-gold/15 transition-colors duration-500 hover:border-gold/55 sm:h-full ${className}`}
    >
      <Link href={`/vendors?category=${category.slug}`} className="absolute inset-0 z-10" aria-label={category.name} />
      <motion.div className="absolute inset-0 h-full w-full" whileHover={{ scale: 1.09 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}>
        <SmartImage
          src={category.imageUrl}
          alt={category.description}
          fallbackVariant={category.motif}
          fallbackTone={category.tone}
          fallbackSeed={category.id.length}
          sizes={big ? "(max-width: 1024px) 100vw, 38vw" : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 22vw"}
        />
      </motion.div>
      <motion.div
        className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/8 to-transparent"
        initial={{ x: "-100%", opacity: 0 }}
        whileHover={{ x: "100%", opacity: 1 }}
        transition={{ duration: 0.7, ease: "easeInOut" }}
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-ink via-ink/10 to-transparent"
        style={{ backgroundImage: "linear-gradient(180deg, transparent 35%, rgba(21,4,12,0.94) 100%)" }}
      />
      <div className="absolute inset-x-0 bottom-0 z-10 p-5">
        <p className="text-overline text-gold">{category.name}</p>
        {big ? <h3 className="text-display-sm mt-2 text-cream">{category.tamilName}</h3> : null}
        <span className="mt-2 flex translate-y-1.5 items-center gap-1.5 text-xs text-cream-dim opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:text-gold-light group-hover:opacity-100">
          Explore studios →
        </span>
      </div>
    </motion.div>
  );
}
