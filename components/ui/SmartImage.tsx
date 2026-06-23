"use client";

import { useState } from "react";
import Image from "next/image";
import { MotifArt } from "./MotifArt";
import { MotifTone, MotifVariant } from "@/types";
import { cn } from "@/lib/utils/cn";

/**
 * Drop-in image component for category/vendor imagery. Tries the real
 * (Unsplash-hosted) photo first; if it fails to load for any reason, it
 * falls back to the brand's MotifArt illustration instead of a broken
 * image icon — so the UI degrades gracefully even with placeholder URLs.
 */
export function SmartImage({
  src,
  alt,
  fallbackVariant,
  fallbackTone,
  fallbackSeed = 0,
  className,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  priority = false,
}: {
  src?: string;
  alt: string;
  fallbackVariant: MotifVariant;
  fallbackTone: MotifTone;
  fallbackSeed?: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const [errored, setErrored] = useState(false);

  return (
    <div className={cn("relative h-full w-full", className)}>
      {!src || errored ? (
        <MotifArt variant={fallbackVariant} tone={fallbackTone} seed={fallbackSeed} label={alt} />
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
          onError={() => setErrored(true)}
        />
      )}
    </div>
  );
}
