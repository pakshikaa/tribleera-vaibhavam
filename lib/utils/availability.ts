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

interface VendorBookingRules {
  serviceAreas?: string[];
  minNoticeDays?: string | number;
}

/** The vendor's saved booking rules (service areas + notice), if any. */
export function readVendorBookingRules(vendorSlug: string): { serviceAreas: string[]; minNoticeDays: number } {
  const profile = readLocalStorage<VendorBookingRules | null>(`TRIBLEERA-vendor-profile-${vendorSlug}`, null);
  return {
    serviceAreas: Array.isArray(profile?.serviceAreas) ? profile.serviceAreas : [],
    minNoticeDays: Math.max(0, Number(profile?.minNoticeDays ?? 30) || 30),
  };
}

export interface BookingDateCheck {
  ok: boolean;
  reason?: "paused" | "booked" | "notice" | "area";
  message?: string;
}

/**
 * Full pre-booking validation for one vendor (V-21, V-22, V-23): the vendor
 * must be accepting, free on the date, given enough notice, and — when a
 * city is provided — serving that area.
 */
export function checkVendorBookable(
  vendorSlug: string,
  vendorName: string,
  isoDate: string,
  city?: string
): BookingDateCheck {
  const status = vendorAvailabilityOn(vendorSlug, isoDate);
  if (status === "paused") {
    return { ok: false, reason: "paused", message: `${vendorName} is not taking new bookings right now.` };
  }
  if (status === "booked") {
    return { ok: false, reason: "booked", message: `${vendorName} is already booked on ${isoDate}. Pick another date or vendor.` };
  }

  const rules = readVendorBookingRules(vendorSlug);
  const daysAhead = Math.floor((new Date(isoDate).getTime() - Date.now()) / 86400000);
  if (daysAhead < rules.minNoticeDays) {
    return {
      ok: false,
      reason: "notice",
      message: `${vendorName} needs at least ${rules.minNoticeDays} days' notice — your date is only ${Math.max(daysAhead, 0)} days away.`,
    };
  }

  if (city && rules.serviceAreas.length > 0 && !rules.serviceAreas.includes(city)) {
    return {
      ok: false,
      reason: "area",
      message: `${vendorName} serves ${rules.serviceAreas.join(", ")} only — ${city} is outside their service area.`,
    };
  }

  return { ok: true };
}
