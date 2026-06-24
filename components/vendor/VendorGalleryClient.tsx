"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SmartImage } from "@/components/ui/SmartImage";
import { GalleryLightbox } from "@/components/vendor/GalleryLightbox";
import { MotifVariant, MotifTone } from "@/types";

interface GalleryImage {
  src?: string;
  alt: string;
}

export function VendorGalleryClient({
  images,
  motif = "lotus",
  tone = "burgundy",
}: {
  images: GalleryImage[];
  motif?: MotifVariant;
  tone?: MotifTone;
}) {
  const [open, setOpen] = useState(false);
  const [startIndex, setStartIndex] = useState(0);

  const lightboxImages = images.map((img) => ({
    src: img.src ?? "",
    alt: img.alt,
  }));

  return (
    <>
      <div className="mt-4 grid grid-cols-3 gap-2 md:gap-3">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => {
              setStartIndex(i);
              setOpen(true);
            }}
            className="rounded-[8px]"
            aria-label={`Open gallery - ${img.alt}`}
          >
            <motion.div whileHover="hover" className="group relative aspect-square overflow-hidden rounded-[8px] shadow-soft">
              <motion.div
                variants={{ hover: { scale: 1.08 } }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
                className="h-full w-full"
              >
                <SmartImage
                  src={img.src}
                  alt={img.alt}
                  fallbackVariant={motif}
                  fallbackTone={tone}
                  fallbackSeed={i + 1}
                  sizes="(max-width: 768px) 33vw, 220px"
                />
              </motion.div>

              <motion.div
                variants={{ hover: { opacity: 1 } }}
                initial={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 flex items-center justify-center bg-ink/50"
              >
                <span className="font-display text-sm text-cream">View ↗</span>
              </motion.div>
            </motion.div>
          </button>
        ))}
      </div>

      <AnimatePresence>
        {open && <GalleryLightbox images={lightboxImages} initialIndex={startIndex} onClose={() => setOpen(false)} />}
      </AnimatePresence>
    </>
  );
}
