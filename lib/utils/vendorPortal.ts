import { getVendorBySlug } from "@/lib/data/vendors";
import { emitAdminDataChanged } from "@/lib/utils/adminLiveData";
import { readLocalStorage, writeLocalStorage } from "@/lib/utils/browser-storage";
import type { VendorApplication, VendorPackage } from "@/types";

export type ApprovedVendorRecord = {
  slug: string;
  businessName: string;
  phone: string;
  password?: string;
  profileComplete?: boolean;
  status?: string;
  suspensionReason?: string;
  email?: string;
  tagline?: string;
  about?: string;
  experienceYears?: number;
  startingPrice?: number;
  emailVerified?: boolean;
};

export interface VendorProfileDraft {
  businessName: string;
  tagline: string;
  description: string;
  phone: string;
  email: string;
  whatsapp: string;
  city: string;
  location: string;
  experienceYears: string;
  eventsCompleted?: string;
  tags?: string[];
}

interface VerificationTokenRecord {
  token: string;
  email: string;
  slug: string;
  applicationId?: string;
  createdAt: string;
  usedAt?: string;
}

interface PasswordResetTokenRecord {
  token: string;
  email: string;
  slug: string;
  createdAt: string;
  usedAt?: string;
}

export interface VendorCompletionMetric {
  id: string;
  label: string;
  done: boolean;
  href: string;
}

const APPLICATIONS_KEY = "TRIBLEERA-vendor-applications";
const APPROVED_VENDORS_KEY = "TRIBLEERA-approved-vendors";
const VENDOR_PROFILES_KEY = "TRIBLEERA-vendor-profiles";
const EMAIL_TOKENS_KEY = "tv-vendor-email-verification-tokens";
const RESET_TOKENS_KEY = "tv-vendor-password-reset-tokens";
const EMAIL_OUTBOX_KEY = "tv-vendor-email-outbox";
const VERIFICATION_TTL_MS = 72 * 60 * 60 * 1000;
const RESET_TTL_MS = 60 * 60 * 1000;

function safeJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function setJson(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

function emitVendorPortalChanged() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event("tribleera-vendor-portal"));
}

function token(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
}

export function normalisePhone(raw: string) {
  return raw.replace(/[\s\-()]/g, "");
}

export function getVendorLoginPath() {
  return "/vendor/login";
}

export function getCurrentVendorSlug() {
  if (typeof window === "undefined") return null;
  return window.sessionStorage.getItem("vendor-slug");
}

export function readApprovedVendors() {
  return safeJson<ApprovedVendorRecord[]>(APPROVED_VENDORS_KEY, []);
}

export function writeApprovedVendors(records: ApprovedVendorRecord[]) {
  setJson(APPROVED_VENDORS_KEY, records);
  emitAdminDataChanged();
  emitVendorPortalChanged();
}

export function readVendorApplications() {
  return safeJson<VendorApplication[]>(APPLICATIONS_KEY, []);
}

export function writeVendorApplications(records: VendorApplication[]) {
  setJson(APPLICATIONS_KEY, records);
  emitAdminDataChanged();
  emitVendorPortalChanged();
}

export function queueVendorEmail(params: {
  to: string;
  vendorSlug: string;
  subject: string;
  message: string;
  ctaHref?: string;
  ctaLabel?: string;
}) {
  const outbox = safeJson<Array<Record<string, string>>>(EMAIL_OUTBOX_KEY, []);
  outbox.unshift({
    id: token("EMAIL"),
    to: params.to,
    vendorSlug: params.vendorSlug,
    subject: params.subject,
    message: params.message,
    ctaHref: params.ctaHref ?? "",
    ctaLabel: params.ctaLabel ?? "",
    sentAt: new Date().toISOString(),
  });
  setJson(EMAIL_OUTBOX_KEY, outbox.slice(0, 100));
}

export function getVendorProfileStorageKey(slug: string) {
  return `TRIBLEERA-vendor-profile-${slug}`;
}

export function getVendorPhotoStorageKey(slug: string) {
  return `TRIBLEERA-vendor-photo-${slug}`;
}

export function getVendorPackagesStorageKey(slug: string) {
  return `TRIBLEERA-vendor-packages-${slug}`;
}

export function readVendorProfile(slug: string) {
  const perVendor = readLocalStorage<VendorProfileDraft | null>(getVendorProfileStorageKey(slug), null);
  if (perVendor) return perVendor;
  return readLocalStorage<VendorProfileDraft | null>("TRIBLEERA-vendor-profile", null);
}

export function writeVendorProfile(slug: string, profile: VendorProfileDraft) {
  writeLocalStorage(getVendorProfileStorageKey(slug), profile);

  const records = safeJson<Record<string, VendorProfileDraft>>(VENDOR_PROFILES_KEY, {});
  records[slug] = profile;
  setJson(VENDOR_PROFILES_KEY, records);
  emitVendorPortalChanged();
}

export function readVendorPhoto(slug: string) {
  const perVendor = readLocalStorage<string | null>(getVendorPhotoStorageKey(slug), null);
  if (perVendor) return perVendor;
  return readLocalStorage<string | null>("TRIBLEERA-vendor-photo", null);
}

export function writeVendorPhoto(slug: string, photo: string) {
  writeLocalStorage(getVendorPhotoStorageKey(slug), photo);
  emitVendorPortalChanged();
}

export function getVendorGalleryStorageKey(slug: string) {
  return `TRIBLEERA-vendor-gallery-${slug}`;
}

export function readVendorGallery(slug: string) {
  return readLocalStorage<string[]>(getVendorGalleryStorageKey(slug), []);
}

/** Publish an approved gallery photo — liveVendors merges this into galleryUrls. */
export function appendVendorGalleryPhoto(slug: string, photo: string) {
  const gallery = readVendorGallery(slug);
  writeLocalStorage(getVendorGalleryStorageKey(slug), [...gallery, photo]);
  emitVendorPortalChanged();
}

export function removeVendorGalleryPhoto(slug: string, index: number) {
  const gallery = readVendorGallery(slug);
  writeLocalStorage(
    getVendorGalleryStorageKey(slug),
    gallery.filter((_, i) => i !== index)
  );
  emitVendorPortalChanged();
}

export function readVendorPackages(slug: string, fallback: VendorPackage[] = []) {
  return readLocalStorage<VendorPackage[]>(getVendorPackagesStorageKey(slug), fallback);
}

export function createVendorEmailVerification(params: {
  slug: string;
  email: string;
  applicationId?: string;
}) {
  const record: VerificationTokenRecord = {
    token: token("verify"),
    slug: params.slug,
    email: params.email,
    applicationId: params.applicationId,
    createdAt: new Date().toISOString(),
  };
  const existing = safeJson<VerificationTokenRecord[]>(EMAIL_TOKENS_KEY, []);
  existing.unshift(record);
  setJson(EMAIL_TOKENS_KEY, existing.slice(0, 100));

  const href = `/vendor/verify-email?token=${record.token}`;
  queueVendorEmail({
    to: params.email,
    vendorSlug: params.slug,
    subject: "Verify your vendor email",
    message: "Confirm your email address to keep your TRIBLEERA vendor application active.",
    ctaHref: href,
    ctaLabel: "Verify email",
  });
  return { token: record.token, href };
}

export function verifyVendorEmailToken(rawToken: string) {
  const tokens = safeJson<VerificationTokenRecord[]>(EMAIL_TOKENS_KEY, []);
  const match = tokens.find((item) => item.token === rawToken);
  if (!match) return { ok: false as const, reason: "invalid" };
  if (match.usedAt) return { ok: false as const, reason: "used" };
  if (Date.now() - new Date(match.createdAt).getTime() > VERIFICATION_TTL_MS) {
    return { ok: false as const, reason: "expired" };
  }

  setJson(
    EMAIL_TOKENS_KEY,
    tokens.map((item) => (item.token === rawToken ? { ...item, usedAt: new Date().toISOString() } : item))
  );

  const applications = readVendorApplications().map((item) =>
    item.id === match.applicationId || item.slug === match.slug ? { ...item, emailVerified: true } : item
  );
  writeVendorApplications(applications);

  const approved = readApprovedVendors().map((item) =>
    item.slug === match.slug ? { ...item, emailVerified: true } : item
  );
  writeApprovedVendors(approved);

  return { ok: true as const, email: match.email, slug: match.slug };
}

export function createVendorPasswordReset(identifier: string) {
  const approved = readApprovedVendors();
  const value = identifier.trim().toLowerCase();
  const vendor = approved.find(
    (item) =>
      item.email?.toLowerCase() === value ||
      normalisePhone(item.phone) === normalisePhone(identifier)
  );
  if (!vendor?.email) return { ok: false as const };

  const record: PasswordResetTokenRecord = {
    token: token("reset"),
    slug: vendor.slug,
    email: vendor.email,
    createdAt: new Date().toISOString(),
  };
  const existing = safeJson<PasswordResetTokenRecord[]>(RESET_TOKENS_KEY, []);
  existing.unshift(record);
  setJson(RESET_TOKENS_KEY, existing.slice(0, 100));

  const href = `/vendor/reset-password?token=${record.token}`;
  queueVendorEmail({
    to: vendor.email,
    vendorSlug: vendor.slug,
    subject: "Reset your vendor portal password",
    message: "Use the secure link below to choose a new vendor portal password.",
    ctaHref: href,
    ctaLabel: "Reset password",
  });
  return { ok: true as const, email: vendor.email, slug: vendor.slug, href };
}

export function resetVendorPassword(rawToken: string, nextPassword: string) {
  const tokens = safeJson<PasswordResetTokenRecord[]>(RESET_TOKENS_KEY, []);
  const match = tokens.find((item) => item.token === rawToken);
  if (!match) return { ok: false as const, reason: "invalid" };
  if (match.usedAt) return { ok: false as const, reason: "used" };
  if (Date.now() - new Date(match.createdAt).getTime() > RESET_TTL_MS) {
    return { ok: false as const, reason: "expired" };
  }

  setJson(
    RESET_TOKENS_KEY,
    tokens.map((item) => (item.token === rawToken ? { ...item, usedAt: new Date().toISOString() } : item))
  );

  writeApprovedVendors(
    readApprovedVendors().map((item) =>
      item.slug === match.slug ? { ...item, password: nextPassword } : item
    )
  );

  return { ok: true as const, slug: match.slug };
}

export function signInVendorSession(params: { slug: string; businessName: string }) {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem("vendor-auth", "true");
  window.sessionStorage.setItem("vendor-slug", params.slug);
  window.sessionStorage.setItem("vendor-name", params.businessName);
}

export function clearVendorSession() {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem("vendor-auth");
  window.sessionStorage.removeItem("vendor-slug");
  window.sessionStorage.removeItem("vendor-name");
}

export function loginVendor(identifier: string, password: string) {
  const approved = readApprovedVendors();
  // Vendors sign in with the email they registered with, or their phone
  // number — both identify the same account.
  const emailInput = identifier.trim().toLowerCase();
  const normInput = normalisePhone(identifier);
  const match = approved.find(
    (item) =>
      ((item.email && item.email.toLowerCase() === emailInput) ||
        (normInput.length > 5 && normalisePhone(item.phone) === normInput)) &&
      item.password === password
  );
  if (!match) return { ok: false as const, reason: "invalid" };
  if (match.status === "suspended") return { ok: false as const, reason: "suspended", vendor: match };
  if (!match.emailVerified) return { ok: false as const, reason: "email_unverified", vendor: match };
  signInVendorSession({ slug: match.slug, businessName: match.businessName });
  return { ok: true as const, vendor: match };
}

export function getVendorCompletion(slug: string) {
  const approved = readApprovedVendors().find((item) => item.slug === slug);
  const vendorSeed = getVendorBySlug(slug);
  const profile = readVendorProfile(slug);
  const photo = readVendorPhoto(slug);
  const packages = readVendorPackages(slug, vendorSeed?.packages ?? []);

  const metrics: VendorCompletionMetric[] = [
    { id: "photo", label: "Add your photo", done: Boolean(photo), href: "/dashboard/vendor/profile" },
    {
      id: "profile",
      label: "Complete profile",
      done: Boolean(
        (profile?.tagline ?? approved?.tagline)?.trim() &&
          (profile?.description ?? approved?.about)?.trim() &&
          Number(profile?.experienceYears ?? approved?.experienceYears ?? 0) >= 0
      ),
      href: "/dashboard/vendor/profile",
    },
    {
      id: "packages",
      label: "Set packages",
      done: packages.filter((item) => !item.archived).length > 0,
      href: "/dashboard/vendor/packages",
    },
    {
      id: "verification",
      label: "Verify email",
      done: Boolean(approved?.emailVerified),
      href: "/vendor/login",
    },
  ];

  const percent = Math.round((metrics.filter((item) => item.done).length / metrics.length) * 100);
  return {
    percent,
    metrics,
    readyToGoLive: metrics.every((item) => item.done),
  };
}

export function markVendorProfileComplete(slug: string) {
  writeApprovedVendors(
    readApprovedVendors().map((item) =>
      item.slug === slug
        ? { ...item, profileComplete: getVendorCompletion(slug).readyToGoLive }
        : item
    )
  );
}
