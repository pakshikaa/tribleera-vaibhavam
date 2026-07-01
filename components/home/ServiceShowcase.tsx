"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { SmartImage } from "@/components/ui/SmartImage";
import { categories } from "@/lib/data/categories";

const CATEGORY_ALT: Record<string, string> = {
  photography:    "Wedding photography",
  cakes:          "Wedding cake design",
  decoration:     "Wedding venue decoration",
  "bridal-makeup": "Bridal makeup",
  invitation:     "Wedding invitation design",
};

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
          className="mb-14 text-center"
        >
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.22em] text-gold">
            ── Phase One Services ──
          </p>
          <h2
            className="font-display font-bold leading-[1.12] text-cream"
            style={{ fontSize: "clamp(1.9rem, 3.4vw, 2.8rem)" }}
          >
            Five crafts, each worth celebrating.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-cream/65">
            Every category is hand-vetted — no directory padding, no unverified listings.
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
      initial={{ opacity: 0, scale: 0.94, y: 30, filter: "blur(4px)" }}
      whileInView={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] as const }}
      className={`group relative h-[240px] overflow-hidden rounded-[14px] border border-gold/15 transition-colors duration-500 hover:border-gold/55 sm:h-full ${className}`}
    >
      <Link href={`/vendors?category=${category.slug}`} className="absolute inset-0 z-10" aria-label={category.name} />
      <motion.div className="absolute inset-0 h-full w-full" whileHover={{ scale: 1.08 }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] as const }}>
        <SmartImage
          src={category.imageUrl}
          alt={CATEGORY_ALT[category.slug] ?? category.name}
          fallbackVariant={category.motif}
          fallbackTone={category.tone}
          fallbackSeed={category.id.length}
          sizes={big ? "(max-width: 1024px) 100vw, 38vw" : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 22vw"}
        />
      </motion.div>
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ x: "-100%", opacity: 0 }}
        whileHover={{ x: "100%", opacity: 1 }}
        transition={{ duration: 0.65, ease: "easeInOut" }}
        style={{ background: "linear-gradient(105deg,transparent 40%,rgba(255,255,255,0.08) 50%,transparent 60%)" }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "linear-gradient(to top,rgba(21,4,12,0.97) 0%,rgba(21,4,12,0.80) 22%,rgba(21,4,12,0.35) 52%,transparent 100%)" }}
      />
      <div className="absolute inset-x-0 bottom-0 z-10 p-5">
        {!big && <h3 style={{ color: "#D4AF6A", textShadow: "0 1px 8px rgba(21,4,12,1)", letterSpacing: "0.22em", textTransform: "uppercase", fontSize: "11px", fontWeight: "700", margin: 0 }}>{category.name}</h3>}
        {big ? (
          <>
            <h3 className="text-display-sm mt-2" style={{ color: "#F7EEE2", textShadow: "0 2px 16px rgba(21,4,12,1)" }}>{category.name}</h3>
            <p className="mt-1 font-display text-base italic" style={{ color: "#E9CE9C", fontFamily: "'Playfair Display', Georgia, serif", textShadow: "0 1px 8px rgba(21,4,12,1)" }}>{category.tamilName}</p>
          </>
        ) : null}
        <span className="mt-2 flex translate-y-1.5 items-center gap-1 text-xs opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100" style={{ color: "#E9CE9C", textShadow: "0 1px 6px rgba(21,4,12,0.9)" }}>
          Explore studios <ArrowUpRight size={12} />
        </span>
      </div>
    </motion.div>
  );
}
