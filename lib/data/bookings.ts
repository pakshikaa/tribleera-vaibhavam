import { Booking, BookingLineItem } from "@/types";
import { cartBreakdown } from "@/lib/utils/booking";
import { getVendorBySlug } from "./vendors";

function item(vendorSlug: string, packageId: string): BookingLineItem {
  const v = getVendorBySlug(vendorSlug)!;
  const pkg = v.packages.find((p) => p.id === packageId) ?? v.packages[1];
  return {
    vendorId: v.id,
    vendorName: v.name,
    categorySlug: v.categorySlug,
    packageId: pkg.id,
    packageName: pkg.name,
    price: pkg.price,
  };
}

function buildBooking(
  id: string,
  customerName: string,
  customerCity: string,
  eventDate: string,
  createdAt: string,
  status: Booking["status"],
  items: BookingLineItem[]
): Booking {
  const totals = cartBreakdown(items.map((i) => i.price));
  return { id, customerName, customerCity, eventDate, createdAt, status, items, ...totals };
}

export const bookings: Booking[] = [
  buildBooking(
    "TRB-20260114",
    "Niranjala & Kajan",
    "Jaffna",
    "2026-12-04",
    "2026-06-02T10:30:00+05:30",
    "advance_paid",
    [
      item("jaffna-frames-studio", "jaffna-frames-studio-signature"),
      item("anjali-bridal-studio", "anjali-bridal-studio-signature"),
      item("royal-icing-cake-house", "royal-icing-cake-house-signature"),
    ]
  ),
  buildBooking(
    "TRB-20260098",
    "Niranjala & Kajan",
    "Jaffna",
    "2026-12-04",
    "2026-05-20T16:05:00+05:30",
    "confirmed",
    [item("pushpa-florals-and-decor", "pushpa-florals-and-decor-signature")]
  ),
  buildBooking(
    "TRB-20260052",
    "Niranjala & Kajan",
    "Jaffna",
    "2026-12-04",
    "2026-04-30T09:15:00+05:30",
    "completed",
    [item("yaazh-invites-and-stationery", "yaazh-invites-and-stationery-essential")]
  ),
  buildBooking(
    "TRB-20259981",
    "Subasha Thevarajah",
    "Trincomalee",
    "2026-08-22",
    "2026-03-11T14:00:00+05:30",
    "pending",
    [item("lumiere-wedding-films", "lumiere-wedding-films-essential")]
  ),
];

export function getBookingsForCustomer(name: string) {
  return bookings.filter((b) => b.customerName === name);
}

export function getBookingById(id: string) {
  return bookings.find((b) => b.id === id);
}
