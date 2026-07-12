import { categories, getCategoryBySlug } from "@/lib/data/categories";
import { vendors as staticVendors } from "@/lib/data/vendors";
import { Vendor } from "@/types";
import {
  getVendorPackagesStorageKey,
  getVendorPhotoStorageKey,
  readVendorProfile,
} from "@/lib/utils/vendorPortal";

const APPROVED_VENDORS_KEY = "TRIBLEERA-approved-vendors";
const TRUST_BADGES = ["Background checked", "Contract signed", "Insured"];
const TAMIL_VENDOR_IMAGES = [
  "/images/portal/featured-vendors.jpg",
  "/images/portal/vendor-portal-couple.jpg",
  "/images/portal/why-section.jpg",
  "/images/portal/testimonials.jpg",
  "/images/portal/home-hero.jpg",
] as const;

interface ApprovedVendorRecord {
  slug?: string;
  businessName?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  categorySlug?: string;
  city?: string;
  location?: string;
  tagline?: string;
  about?: string;
  experienceYears?: number;
  startingPrice?: number;
  approvedAt?: string;
  status?: string;
}

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function buildPackages(vendorId: string, startingPrice: number) {
  return [
    {
      id: `${vendorId}-essential`,
      name: "Essential",
      tier: "Essential" as const,
      price: startingPrice,
      description: "Core coverage for a focused Tamil wedding celebration.",
      inclusions: [
        "TRIBLEERA-approved service scope",
        "Timeline planning call",
        "Day-of execution aligned to your rituals",
      ],
    },
    {
      id: `${vendorId}-signature`,
      name: "Signature",
      tier: "Signature" as const,
      price: Math.round(startingPrice * 1.6),
      description: "Expanded delivery for couples planning a fuller family celebration.",
      inclusions: [
        "Everything in Essential",
        "Extended service window",
        "Priority coordination with other booked vendors",
      ],
      recommended: true,
    },
    {
      id: `${vendorId}-heritage`,
      name: "Heritage",
      tier: "Heritage" as const,
      price: Math.round(startingPrice * 2.25),
      description: "Premium support for multi-event celebrations and higher guest counts.",
      inclusions: [
        "Everything in Signature",
        "Senior lead assigned",
        "Pre-event finalisation meeting with family stakeholders",
      ],
    },
  ];
}

function rotateGallery(index: number) {
  return Array.from({ length: 4 }, (_, offset) => TAMIL_VENDOR_IMAGES[(index + offset) % TAMIL_VENDOR_IMAGES.length]);
}

export function buildDynamicVendor(record: ApprovedVendorRecord, index: number): Vendor | null {
  if (!record.businessName || !record.categorySlug || !record.city || !record.phone) return null;

  const category = getCategoryBySlug(record.categorySlug);
  const slug = record.slug ? slugify(record.slug) : slugify(record.businessName);
  const startingPrice = Math.max(record.startingPrice ?? 15000, 15000);
  const experienceYears = Math.max(record.experienceYears ?? 1, 1);
  const heroImage = TAMIL_VENDOR_IMAGES[index % TAMIL_VENDOR_IMAGES.length];

  return {
    id: `approved-${slug}`,
    slug,
    name: record.businessName,
    categorySlug: record.categorySlug,
    location: record.location?.trim() || record.city,
    city: record.city,
    tagline: record.tagline?.trim() || `${category?.name ?? "Wedding service"} partner for Tamil celebrations across ${record.city}.`,
    description:
      record.about?.trim() ||
      `${record.businessName} is an approved TRIBLEERA partner serving Tamil weddings in ${record.city}. Their profile is live immediately after admin approval, with package and contact details available for couples to book without a code deployment.`,
    startingPrice,
    trustScore: 4.8,
    verified: true,
    status: "approved",
    experienceYears,
    eventsCompleted: Math.max(12, experienceYears * 8),
    responseTime: "Usually responds within 2 hours",
    tags: [category?.name ?? "Wedding vendor", "Tamil Weddings", record.city],
    motif: categories.find((entry) => entry.slug === record.categorySlug)?.motif ?? "lotus",
    tone: categories.find((entry) => entry.slug === record.categorySlug)?.tone ?? "burgundy",
    gallerySeeds: 4,
    imageUrl: heroImage,
    galleryUrls: rotateGallery(index),
    packages: buildPackages(slug, startingPrice),
    reviews: [],
    trustBadges: [...TRUST_BADGES],
    phone: record.phone,
    whatsapp: record.whatsapp?.trim() || record.phone,
    joinedDate: record.approvedAt ?? new Date().toISOString(),
  };
}

export function readDynamicApprovedVendors(): Vendor[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = JSON.parse(window.localStorage.getItem(APPROVED_VENDORS_KEY) ?? "[]") as ApprovedVendorRecord[];
    return raw
      .filter((record) => (record.status ?? "approved") === "approved")
      .map((record, index) => buildDynamicVendor(record, index))
      .filter((vendor): vendor is Vendor => Boolean(vendor));
  } catch {
    return [];
  }
}

export function mergeVendors(base: Vendor[], dynamic: Vendor[]) {
  const merged = new Map(base.map((vendor) => [vendor.slug, vendor]));
  dynamic.forEach((vendor) => merged.set(vendor.slug, vendor));
  return Array.from(merged.values()).map((vendor) => {
    if (typeof window === "undefined") return vendor;

    try {
      const profile = readVendorProfile(vendor.slug);
      const photo = window.localStorage.getItem(getVendorPhotoStorageKey(vendor.slug)) ?? vendor.imageUrl;
      const gallery = JSON.parse(window.localStorage.getItem(`TRIBLEERA-vendor-gallery-${vendor.slug}`) ?? "[]") as string[];
      const packages = JSON.parse(window.localStorage.getItem(getVendorPackagesStorageKey(vendor.slug)) ?? "null") as Vendor["packages"] | null;

      return {
        ...vendor,
        name: profile?.businessName?.trim() || vendor.name,
        tagline: profile?.tagline?.trim() || vendor.tagline,
        description: profile?.description?.trim() || vendor.description,
        phone: profile?.phone?.trim() || vendor.phone,
        whatsapp: profile?.whatsapp?.trim() || vendor.whatsapp,
        city: profile?.city?.trim() || vendor.city,
        location: profile?.location?.trim() || vendor.location,
        experienceYears: Number(profile?.experienceYears ?? vendor.experienceYears),
        eventsCompleted: Number(profile?.eventsCompleted ?? vendor.eventsCompleted),
        tags: profile?.tags?.length ? profile.tags : vendor.tags,
        imageUrl: photo ?? vendor.imageUrl,
        galleryUrls: gallery.length > 0 ? gallery : vendor.galleryUrls,
        packages: Array.isArray(packages) && packages.length > 0 ? packages.filter((item) => !item.archived) : vendor.packages,
      };
    } catch {
      return vendor;
    }
  });
}

export function getLiveVendors() {
  return mergeVendors(staticVendors, readDynamicApprovedVendors());
}

export function subscribeLiveVendors(onStoreChange: () => void) {
  if (typeof window === "undefined") return () => {};

  const handler = () => onStoreChange();
  window.addEventListener("storage", handler);
  window.addEventListener("tribleera-live-vendors", handler);
  window.addEventListener("tribleera-vendor-portal", handler);

  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener("tribleera-live-vendors", handler);
    window.removeEventListener("tribleera-vendor-portal", handler);
  };
}

export function emitLiveVendorsChanged() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event("tribleera-live-vendors"));
}

export function getVendorCities(vendors: Vendor[]) {
  return Array.from(new Set(vendors.filter((vendor) => vendor.status === "approved").map((vendor) => vendor.city))).sort();
}

export function getVendorCountByCategory(vendors: Vendor[], categorySlug: string) {
  return vendors.filter((vendor) => vendor.status === "approved" && vendor.categorySlug === categorySlug).length;
}
