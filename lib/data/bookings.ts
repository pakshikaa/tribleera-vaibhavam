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
  buildBooking(
    "TRB-20260135",
    "Kavitha & Murali",
    "Colombo",
    "2026-11-15",
    "2026-06-05T11:00:00+05:30",
    "confirmed",
    [item("jaffna-frames-studio", "jaffna-frames-studio-essential")]
  ),
  buildBooking(
    "TRB-20260122",
    "Priya & Vasan",
    "Jaffna",
    "2026-10-28",
    "2026-05-28T09:30:00+05:30",
    "advance_paid",
    [
      item("anjali-bridal-studio", "anjali-bridal-studio-essential"),
      item("lotus-patisserie", "lotus-patisserie-signature"),
    ]
  ),
  buildBooking(
    "TRB-20260109",
    "Thiviya & Sathees",
    "Jaffna",
    "2026-12-20",
    "2026-06-01T14:00:00+05:30",
    "pending",
    [item("vanam-decor-co", "vanam-decor-co-signature")]
  ),
  buildBooking(
    "TRB-20260088",
    "Malini & Rajan",
    "Batticaloa",
    "2026-09-12",
    "2026-04-15T10:00:00+05:30",
    "completed",
    [item("lumiere-wedding-films", "lumiere-wedding-films-signature")]
  ),
  buildBooking(
    "TRB-20260071",
    "Ananthi & Suresh",
    "Vavuniya",
    "2026-11-22",
    "2026-04-02T16:30:00+05:30",
    "confirmed",
    [
      item("koovagam-press", "koovagam-press-signature"),
      item("thiruvizha-decor-studio", "thiruvizha-decor-studio-essential"),
    ]
  ),
  buildBooking(
    "TRB-20260043",
    "Dhivya & Kumar",
    "Kandy",
    "2026-10-05",
    "2026-03-20T08:45:00+05:30",
    "cancelled",
    [item("glow-by-niranjana", "glow-by-niranjana-essential")]
  ),
];

export function getBookingsForCustomer(name: string) {
  return bookings.filter((b) => b.customerName === name);
}

export function getBookingById(id: string) {
  return bookings.find((b) => b.id === id);
}
