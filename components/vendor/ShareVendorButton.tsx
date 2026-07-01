"use client";

import { Share2 } from "lucide-react";
import { useToast } from "@/components/ui/Toast";

export function ShareVendorButton({ vendorName }: { vendorName: string }) {
  const { showToast } = useToast();

  function handleShare() {
    if (typeof navigator === "undefined") return;
    if (navigator.share) {
      navigator.share({
        title: vendorName,
        text: `Check out ${vendorName} on TRIBLERERA VAIBHAVAM`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href).then(() => {
        showToast("Link copied!", "success");
      });
    }
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      aria-label="Share vendor"
      className="mb-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-cream backdrop-blur-sm hover:bg-white/20"
    >
      <Share2 size={18} />
    </button>
  );
}
