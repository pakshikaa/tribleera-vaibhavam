"use client";

import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { getVendorBySlug } from "@/lib/data/vendors";
import { getCategoryBySlug } from "@/lib/data/categories";

export function WhatsAppFloat() {
  const pathname = usePathname();
  const PORTALS = [
    "/vendor/login",
    "/vendor/register",
    "/dashboard/vendor",
    "/dashboard/admin",
    "/admin/login",
    "/login",
  ];
  const hasMobileActionBar = pathname.startsWith("/vendors/") || pathname.startsWith("/booking/cart");

  if (PORTALS.some((route) => pathname === route || pathname.startsWith(`${route}/`))) {
    return null;
  }

  const vendorSlug = pathname.startsWith("/vendors/") ? pathname.split("/")[2] : "";
  const vendor = vendorSlug ? getVendorBySlug(vendorSlug) : undefined;
  const message = vendor
    ? `Hi TRIBLEERA VAIBHAVAM, I'm interested in ${vendor.name} (${getCategoryBySlug(vendor.categorySlug)?.name ?? "wedding services"}) for my wedding. Can you help me with details?`
    : "Hello TRIBLEERA VAIBHAVAM, I need help planning my wedding.";

  return (
    <motion.a
      href={`https://wa.me/94771234567?text=${encodeURIComponent(message)}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={vendor ? `Ask about ${vendor.name} on WhatsApp` : "Chat with TRIBLEERA on WhatsApp"}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 2, type: "spring", stiffness: 200 }}
      whileHover={{ scale: 1.12 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "fixed bottom-24 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-[0_4px_20px_rgba(37,211,102,0.45)] md:bottom-8 md:right-8",
        hasMobileActionBar && "hidden md:flex"
      )}
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
