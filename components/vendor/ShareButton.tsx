"use client";

import { useState } from "react";
import { Share2, Check } from "lucide-react";

export function ShareButton({ vendorName }: { vendorName: string }) {
  const [copied, setCopied] = useState(false);

  async function share() {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: vendorName, url }).catch(() => {});
    } else {
      await navigator.clipboard.writeText(url).catch(() => {});
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <button
      type="button"
      onClick={share}
      aria-label="Share this vendor"
      className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-cream backdrop-blur-sm transition-colors hover:bg-white/20"
    >
      {copied ? <Check size={17} className="text-gold" /> : <Share2 size={17} />}
    </button>
  );
}
