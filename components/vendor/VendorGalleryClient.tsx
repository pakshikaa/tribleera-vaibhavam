"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { SmartImage } from "@/components/ui/SmartImage";
import { GalleryLightbox } from "@/components/vendor/GalleryLightbox";
import { MotifVariant, MotifTone } from "@/types";

interface GalleryImage { src?: string; alt: string; }

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
            onClick={() => { setStartIndex(i); setOpen(true); }}
            className="group relative aspect-square overflow-hidden rounded-[8px] shadow-soft"
            aria-label={`Open gallery — ${img.alt}`}
          >
            <div className="h-full w-full transition-transform duration-500 group-hover:scale-[1.06]">
              <SmartImage
                src={img.src}
                alt={img.alt}
                fallbackVariant={motif}
                fallbackTone={tone}
                fallbackSeed={i + 1}
                sizes="(max-width: 768px) 33vw, 220px"
              />
            </div>
            <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/20" />
          </button>
        ))}
      </div>

      <AnimatePresence>
        {open && (
          <GalleryLightbox
            images={lightboxImages}
            initialIndex={startIndex}
            onClose={() => setOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
