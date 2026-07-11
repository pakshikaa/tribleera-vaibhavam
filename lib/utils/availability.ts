"use client";

import { readLocalStorage, writeLocalStorage } from "@/lib/utils/browser-storage";
import { readActiveCustomerProfile } from "@/lib/utils/customer-profile";

export interface VendorAvailability {
  accepting: boolean;
  /** Blocked dates in ISO yyyy-mm-dd form. */
  blockedDates: string[];
}

const DEFAULT_AVAILABILITY: VendorAvailability = { accepting: true, blockedDates: [] };

function availabilityKey(vendorSlug: string) {
  return `TRIBLEERA-vendor-availability:${vendorSlug}`;
}

export function readVendorAvailability(vendorSlug: string): VendorAvailability {
  if (!vendorSlug) return DEFAULT_AVAILABILITY;
  return readLocalStorage<VendorAvailability>(availabilityKey(vendorSlug), DEFAULT_AVAILABILITY);
}

export function writeVendorAvailability(vendorSlug: string, availability: VendorAvailability) {
  if (!vendorSlug) return;
  writeLocalStorage(availabilityKey(vendorSlug), availability);
}

export type AvailabilityStatus = "available" | "booked" | "paused" | "unknown";

/** Availability of a vendor on a specific ISO date; "unknown" when no date given. */
export function vendorAvailabilityOn(vendorSlug: string, isoDate: string | null | undefined): AvailabilityStatus {
  const availability = readVendorAvailability(vendorSlug);
  if (!availability.accepting) return "paused";
  if (!isoDate) return "unknown";
  return availability.blockedDates.includes(isoDate) ? "booked" : "available";
}

/**
 * The customer's event date (ISO yyyy-mm-dd) — the wedding date saved on
 * their profile, if any. Used to personalise availability badges.
 */
export function readCustomerEventDate(): string | null {
  try {
    const date = readActiveCustomerProfile().weddingDate;
    return date && /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : null;
  } catch {
    return null;
  }
}
