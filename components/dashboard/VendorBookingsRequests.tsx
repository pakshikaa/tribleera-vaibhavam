"use client";

import { useState } from "react";
import { VendorRequestsClient } from "@/components/dashboard/VendorRequestsClient";
import { vendorRequests } from "@/lib/data/vendorRequests";

const DEMO_VENDOR_SLUG = "pushpa-florals-and-decor";

/**
 * Client bridge for the server-rendered bookings page — resolves the
 * signed-in vendor and mounts the full request workflow (accept, reject,
 * counter-offer, threads) instead of a static list.
 */
export function VendorBookingsRequests() {
  const [slug] = useState(() => {
    try {
      return sessionStorage.getItem("vendor-slug") ?? DEMO_VENDOR_SLUG;
    } catch {
      return DEMO_VENDOR_SLUG;
    }
  });

  return <VendorRequestsClient initial={slug === DEMO_VENDOR_SLUG ? vendorRequests : []} />;
}
