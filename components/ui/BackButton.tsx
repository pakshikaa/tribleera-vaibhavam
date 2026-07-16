"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const PREVIOUS_PATH_KEY = "TRIBLEERA-nav-previous";

interface BackButtonProps {
  href: string;
  label?: string;
  className?: string;
  variant?: "inline" | "floating";
  dark?: boolean;
}

export function BackButton({
  href,
  label = "Back",
  className,
  variant = "inline",
  dark = false,
}: BackButtonProps) {
  const router = useRouter();

  function handleBack(e: React.MouseEvent) {
    if (typeof window === "undefined") return;

    try {
      const previousPath = window.sessionStorage.getItem(PREVIOUS_PATH_KEY);
      const currentPath = `${window.location.pathname}${window.location.search}`;
      const hasInternalReferrer = document.referrer.includes(window.location.origin);
      const canGoBack = window.history.length > 1 && (
        hasInternalReferrer || (previousPath !== null && previousPath !== currentPath)
      );

      if (canGoBack) {
        e.preventDefault();
        router.back();
      }
    } catch {}
  }

  if (variant === "floating") {
    return <FloatingBackButton href={href} label={label} dark={dark} onBack={handleBack} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] as const }}
    >
      <Link
        href={href}
        onClick={handleBack}
        className={cn(
          "inline-flex min-h-11 items-center gap-2 rounded-full border border-transparent px-3 py-2 text-sm font-medium transition-all",
          "hover:-translate-x-0.5",
          dark
            ? "text-cream/75 hover:border-white/10 hover:bg-white/5 hover:text-cream"
            : "text-slate-soft hover:border-burgundy/10 hover:bg-burgundy/5 hover:text-burgundy",
          className
        )}
        aria-label={`Back to ${label}`}
      >
        <ArrowLeft size={16} strokeWidth={2} aria-hidden="true" />
        <span>{label}</span>
      </Link>
    </motion.div>
  );
}

function FloatingBackButton({
  href,
  label,
  dark,
  onBack,
}: {
  href: string;
  label: string;
  dark: boolean;
  onBack: (e: React.MouseEvent) => void;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 120);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
          className="fixed left-4 top-[72px] z-40 md:left-8"
        >
          <Link
            href={href}
            onClick={onBack}
            className={cn(
              "flex min-h-11 items-center gap-2 rounded-full px-3.5 py-2 text-[13px]",
              "font-medium shadow-ambient backdrop-blur-md transition-all",
              "hover:shadow-ambient-lg hover:-translate-y-0.5",
              "border",
              dark
                ? "border-white/20 bg-ink/70 text-cream/90 hover:text-cream"
                : "border-slate/15 bg-white/85 text-slate hover:text-burgundy"
            )}
            aria-label={`Back to ${label}`}
          >
            <ArrowLeft size={14} strokeWidth={2} aria-hidden="true" />
            {label}
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
