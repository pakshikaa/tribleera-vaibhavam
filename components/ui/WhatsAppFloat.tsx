"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

export function WhatsAppFloat() {
  return (
    <motion.a
      href="https://wa.me/94771234567?text=Hello%20TRIBLERERA%2C%20I%20need%20help%20planning%20my%20wedding."
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with TRIBLERERA on WhatsApp"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 2, type: "spring", stiffness: 200 }}
      whileHover={{ scale: 1.12 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-24 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-[0_4px_20px_rgba(37,211,102,0.45)] md:bottom-8 md:right-8"
      style={{ backgroundColor: "#25D366" }}
    >
      <MessageCircle size={26} className="text-white" fill="white" />
      <span
        className="absolute inset-0 animate-ping rounded-full opacity-20"
        style={{ backgroundColor: "#25D366" }}
      />
    </motion.a>
  );
}
