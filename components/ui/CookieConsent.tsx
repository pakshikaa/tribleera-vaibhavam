"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";

const STORAGE_KEY = "tribleera-cookie-consent";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) {
        const id = window.setTimeout(() => setVisible(true), 800);
        return () => window.clearTimeout(id);
      }
    } catch {}
  }, []);

  function accept() {
    try { localStorage.setItem(STORAGE_KEY, "accepted"); } catch {}
    setVisible(false);
  }

  function decline() {
    try { localStorage.setItem(STORAGE_KEY, "declined"); } catch {}
    setVisible(false);
  }

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      aria-live="polite"
      className={cn(
        "fixed bottom-20 left-4 right-4 z-50 rounded-[10px] border border-gold/20 bg-ink/95 p-4 shadow-[0_8px_32px_rgba(0,0,0,0.45)] backdrop-blur-xl transition-all duration-500 md:bottom-6 md:left-auto md:right-6 md:max-w-sm",
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      )}
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-gold">Cookie notice</p>
      <p className="mt-2 text-[13px] leading-relaxed text-cream-dim">
        We use cookies to improve your experience and keep your cart &amp; shortlist saved.{" "}
        <Link href="/privacy" className="font-medium text-cream underline-offset-2 hover:underline">
          Privacy policy
        </Link>
      </p>
      <div className="mt-4 flex gap-2">
        <button
          onClick={accept}
          className="flex-1 rounded-[6px] bg-gold py-2 text-xs font-bold text-burgundy-deep transition-colors hover:bg-gold-light"
        >
          Accept
        </button>
        <button
          onClick={decline}
          className="flex-1 rounded-[6px] border border-cream/15 py-2 text-xs font-semibold text-cream-dim transition-colors hover:border-cream/30 hover:text-cream"
        >
          Decline
        </button>
      </div>
    </div>
  );
}
