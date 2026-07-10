// Core domain types for TRIBLEERA VAIBHAVAM
// These mirror the future Prisma schema closely so backend integration
// later does not require reshaping the frontend data model.

export type MotifVariant = "knot" | "arch" | "lotus" | "paisley" | "diya" | "garland";
export type MotifTone = "burgundy" | "gold" | "rose" | "slate";

export interface Category {
  id: string;
  slug: string;
  name: string;
  tamilName: string;
  description: string;
  motif: MotifVariant;
  tone: MotifTone;
  vendorCount: number;
  imageUrl?: string;
  comingSoon?: boolean;
}

export type VendorStatus = "approved" | "pending" | "suspended";

export interface PackageInclusion {
  label: string;
}

export interface VendorPackage {
  id: string;
  name: string;
  tier: "Essential" | "Signature" | "Heritage";
  price: number;
  description: string;
  inclusions: string[];
  coverImageUrl?: string;
  recommended?: boolean;
  archived?: boolean;
  customFields?: Record<string, string>;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
}

export interface Vendor {
  id: string;
  slug: string;
  name: string;
  categorySlug: string;
  location: string;
  city: string;
  tagline: string;
  description: string;
  startingPrice: number;
  trustScore: number;
  verified: boolean;
  status: VendorStatus;
  experienceYears: number;
  eventsCompleted: number;
  responseTime: string;
  tags: string[];
  motif: MotifVariant;
  tone: MotifTone;
  gallerySeeds: number;
  imageUrl?: string;
  galleryUrls?: string[];
  packages: VendorPackage[];
  reviews: Review[];
  phone: string;
  whatsapp: string;
  joinedDate: string;
}

export type BookingStatus =
  | "pending"
  | "confirmed"
  | "advance_paid"
  | "cancellation_requested"
  | "completed"
  | "cancelled";

export interface BookingLineItem {
  vendorId: string;
  vendorName: string;
  categorySlug: string;
  packageId: string;
  packageName: string;
  price: number;
}

export interface Booking {
  id: string;
  customerName: string;
  customerCity: string;
  eventDate: string;
  createdAt: string;
  status: BookingStatus;
  items: BookingLineItem[];
  serviceTotal: number;
  advanceAmount: number;
  platformFee: number;
  payableNow: number;
  remainingBalance: number;
  // Flat-booking fields (populated for single-vendor bookings)
  categorySlug?: string;
  vendorName?: string;
  vendorSlug?: string;
  location?: string;
  eventType?: string;
}

export interface VendorBookingRequest {
  id: string;
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
  eventDate: string;
  location?: string;
  guestCount?: number;
  budgetRange?: string;
  categorySlug: string;
  packageName: string;
  price: number;
  status: "new" | "accepted" | "declined";
  rejectionReason?: string;
  receivedAt: string;
  message: string;
}

export type DisputeType =
  | "cancellation"
  | "refund"
  | "vendor_no_response"
  | "vendor_cancellation"
  | "duplicate_payment"
  | "user_misuse"
  | "dispute";

export type DisputeStatus = "open" | "investigating" | "resolved" | "rejected";

export interface DisputeCase {
  id: string;
  type: DisputeType;
  bookingId: string;
  customerName: string;
  vendorName: string;
  categorySlug: string;
  amount: number;
  description: string;
  status: DisputeStatus;
  raisedAt: string;
}

export type UserRole = "customer" | "vendor" | "admin";

export interface PlatformUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  joinedDate: string;
  status: "active" | "suspended";
  city: string;
}

export interface CustomerProfile {
  name: string;
  email: string;
  city: string;
  phone: string;
  partnerName?: string;
  weddingDate?: string;
}

export interface VendorApplication {
  id: string;
  slug?: string;
  businessName: string;
  ownerName: string;
  categorySlug: string;
  category?: string;
  city: string;
  location?: string;
  tagline?: string;
  whatsapp?: string;
  submittedAt: string;
  status: VendorStatus;
  phone: string;
  email: string;
  experienceYears: number;
  startingPrice?: number;
  portfolioCount?: number;
  about: string;
  adminNotes?: string;
}
