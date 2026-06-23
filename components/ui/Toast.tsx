"use client";

import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

type ToastTone = "success" | "error";

interface ToastItem {
  id: string;
  message: string;
  tone: ToastTone;
}

interface ToastContextValue {
  showToast: (message: string, tone?: ToastTone) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback((message: string, tone: ToastTone = "success") => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setToasts((prev) => [...prev, { id, message, tone }]);
  }, []);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 flex-col gap-3">
        <AnimatePresence>
          {toasts.map((toast) => (
            <ToastItemView key={toast.id} toast={toast} onDone={() => dismiss(toast.id)} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

function ToastItemView({ toast, onDone }: { toast: ToastItem; onDone: () => void }) {
  useEffect(() => {
    const timeoutId = window.setTimeout(onDone, 2500);
    return () => window.clearTimeout(timeoutId);
  }, [onDone]);

  const Icon = toast.tone === "success" ? CheckCircle2 : AlertCircle;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 12, scale: 0.98 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] as const }}
      className="pointer-events-auto flex items-center gap-2 rounded-full bg-ink px-4 py-3 text-sm font-medium text-cream shadow-glow"
      role="status"
      aria-live="polite"
    >
      <Icon size={18} className={toast.tone === "success" ? "text-gold" : "text-rose"} />
      <span>{toast.message}</span>
    </motion.div>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
}

interface LegacyToastProps {
  open: boolean;
  message: string;
  onOpenChange: (open: boolean) => void;
}

export function Toast({ open, message, onOpenChange }: LegacyToastProps) {
  useEffect(() => {
    if (!open) return;
    const timeoutId = window.setTimeout(() => onOpenChange(false), 2500);
    return () => window.clearTimeout(timeoutId);
  }, [message, onOpenChange, open]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.98 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] as const }}
          className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full bg-ink px-4 py-3 text-sm font-medium text-cream shadow-glow"
          role="status"
          aria-live="polite"
        >
          <CheckCircle2 size={18} className="text-gold" />
          <span>{message}</span>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
