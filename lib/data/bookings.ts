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

function flatBooking(b: Omit<Booking, "items"> & { items?: BookingLineItem[] }): Booking {
  return { items: [], ...b };
}

export const bookings: Booking[] = [
  // Multi-vendor bookings (created from cart)
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

  // Flat single-vendor bookings — used by admin reminders & service-wise views
  flatBooking({
    id: "TRB-20261001",
    customerName: "Kavitha & Rajan",
    customerCity: "Jaffna",
    eventDate: "2026-10-15",
    createdAt: "2026-06-10T10:00:00+05:30",
    status: "confirmed",
    serviceTotal: 66000,
    advanceAmount: 13200,
    platformFee: 1980,
    payableNow: 15180,
    remainingBalance: 52800,
    categorySlug: "photography",
    vendorName: "Jaffna Frames Studio",
    vendorSlug: "jaffna-frames-studio",
    location: "Jaffna",
    eventType: "Wedding Reception",
  }),
  flatBooking({
    id: "TRB-20261002",
    customerName: "Anusha & Prabu",
    customerCity: "Colombo",
    eventDate: "2026-11-08",
    createdAt: "2026-06-12T11:00:00+05:30",
    status: "confirmed",
    serviceTotal: 55000,
    advanceAmount: 11000,
    platformFee: 1650,
    payableNow: 12650,
    remainingBalance: 44000,
    categorySlug: "photography",
    vendorName: "Lumiere Wedding Films",
    vendorSlug: "lumiere-wedding-films",
    location: "Colombo",
    eventType: "Wedding Photography",
  }),
  flatBooking({
    id: "TRB-20261003",
    customerName: "Meena & Siva",
    customerCity: "Jaffna",
    eventDate: "2026-10-22",
    createdAt: "2026-06-08T09:30:00+05:30",
    status: "confirmed",
    serviceTotal: 38000,
    advanceAmount: 7600,
    platformFee: 1140,
    payableNow: 8740,
    remainingBalance: 30400,
    categorySlug: "cakes",
    vendorName: "Royal Icing Cake House",
    vendorSlug: "royal-icing-cake-house",
    location: "Jaffna",
    eventType: "Wedding Cake",
  }),
  flatBooking({
    id: "TRB-20261004",
    customerName: "Thilaga & Vimal",
    customerCity: "Trincomalee",
    eventDate: "2026-12-12",
    createdAt: "2026-06-15T14:00:00+05:30",
    status: "confirmed",
    serviceTotal: 42000,
    advanceAmount: 8400,
    platformFee: 1260,
    payableNow: 9660,
    remainingBalance: 33600,
    categorySlug: "cakes",
    vendorName: "Lotus Patisserie",
    vendorSlug: "lotus-patisserie",
    location: "Trincomalee",
    eventType: "Wedding Cake & Dessert Table",
  }),
  flatBooking({
    id: "TRB-20261005",
    customerName: "Piriya & Karthik",
    customerCity: "Jaffna",
    eventDate: "2026-11-03",
    createdAt: "2026-06-11T10:30:00+05:30",
    status: "confirmed",
    serviceTotal: 95000,
    advanceAmount: 19000,
    platformFee: 2850,
    payableNow: 21850,
    remainingBalance: 76000,
    categorySlug: "decoration",
    vendorName: "Pushpa Florals & Decor",
    vendorSlug: "pushpa-florals-and-decor",
    location: "Jaffna",
    eventType: "Wedding Hall Decoration",
  }),
  flatBooking({
    id: "TRB-20261006",
    customerName: "Suba & Dinesh",
    customerCity: "Vavuniya",
    eventDate: "2026-12-05",
    createdAt: "2026-06-18T15:00:00+05:30",
    status: "confirmed",
    serviceTotal: 88000,
    advanceAmount: 17600,
    platformFee: 2640,
    payableNow: 20240,
    remainingBalance: 70400,
    categorySlug: "decoration",
    vendorName: "Vanam Decor Co.",
    vendorSlug: "vanam-decor-co",
    location: "Vavuniya",
    eventType: "Mandap & Stage Decor",
  }),
  flatBooking({
    id: "TRB-20261007",
    customerName: "Ramya & Selvam",
    customerCity: "Jaffna",
    eventDate: "2026-10-29",
    createdAt: "2026-06-09T08:00:00+05:30",
    status: "confirmed",
    serviceTotal: 35000,
    advanceAmount: 7000,
    platformFee: 1050,
    payableNow: 8050,
    remainingBalance: 28000,
    categorySlug: "bridal-makeup",
    vendorName: "Anjali Bridal Studio",
    vendorSlug: "anjali-bridal-studio",
    location: "Jaffna",
    eventType: "Bridal Makeup & Hair",
  }),
  flatBooking({
    id: "TRB-20261008",
    customerName: "Aarthi & Muthu",
    customerCity: "Batticaloa",
    eventDate: "2026-11-20",
    createdAt: "2026-06-14T13:00:00+05:30",
    status: "confirmed",
    serviceTotal: 28000,
    advanceAmount: 5600,
    platformFee: 840,
    payableNow: 6440,
    remainingBalance: 22400,
    categorySlug: "bridal-makeup",
    vendorName: "Glow by Niranjana",
    vendorSlug: "glow-by-niranjana",
    location: "Batticaloa",
    eventType: "Bridal Makeup & Mehendi",
  }),
  flatBooking({
    id: "TRB-20261009",
    customerName: "Nirmala & Suresh",
    customerCity: "Jaffna",
    eventDate: "2026-10-18",
    createdAt: "2026-06-07T09:00:00+05:30",
    status: "confirmed",
    serviceTotal: 22000,
    advanceAmount: 4400,
    platformFee: 660,
    payableNow: 5060,
    remainingBalance: 17600,
    categorySlug: "invitation",
    vendorName: "Yaazh Invites & Stationery",
    vendorSlug: "yaazh-invites-and-stationery",
    location: "Jaffna",
    eventType: "Wedding Invitations",
  }),
  flatBooking({
    id: "TRB-20261010",
    customerName: "Kamala & Ravi",
    customerCity: "Jaffna",
    eventDate: "2026-12-08",
    createdAt: "2026-06-20T11:30:00+05:30",
    status: "confirmed",
    serviceTotal: 18000,
    advanceAmount: 3600,
    platformFee: 540,
    payableNow: 4140,
    remainingBalance: 14400,
    categorySlug: "invitation",
    vendorName: "Koovagam Press",
    vendorSlug: "koovagam-press",
    location: "Jaffna",
    eventType: "Wedding Invitations & Printing",
  }),
];

export function getBookingsForCustomer(name: string) {
  return bookings.filter((b) => b.customerName === name);
}

export function getBookingById(id: string) {
  return bookings.find((b) => b.id === id);
}
