"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

interface ToastProps {
  open: boolean;
  message: string;
  onOpenChange: (open: boolean) => void;
}

export function Toast({ open, message, onOpenChange }: ToastProps) {
  useEffect(() => {
    if (!open) return;
    const timeoutId = window.setTimeout(() => onOpenChange(false), 2000);
    return () => window.clearTimeout(timeoutId);
  }, [open, onOpenChange]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.98 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] as const }}
          className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full bg-slate px-4 py-3 text-sm font-medium text-white shadow-lift"
          role="status"
          aria-live="polite"
        >
          <CheckCircle2 size={18} className="text-success-light" />
          <span>{message}</span>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
