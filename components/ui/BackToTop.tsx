"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function BackToTop() {
  const pathname = usePathname();
  const PORTALS = [
    "/vendor/login",
    "/vendor/register",
    "/dashboard/vendor",
    "/dashboard/admin",
    "/admin/login",
    "/login",
  ];
  const [visible, setVisible] = useState(false);
  const hasMobileActionBar = pathname.startsWith("/vendors/") || pathname.startsWith("/booking/cart");
  const hideOnPortal = PORTALS.some((route) => pathname === route || pathname.startsWith(`${route}/`));

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (hideOnPortal) {
    return null;
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
          className={cn(
            "fixed bottom-44 right-5 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-gold/30 bg-ink/80 text-gold backdrop-blur-sm transition-colors hover:bg-gold hover:text-ink md:bottom-24 md:right-8",
            hasMobileActionBar && "hidden md:flex"
          )}
        >
          <ArrowUp size={18} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
