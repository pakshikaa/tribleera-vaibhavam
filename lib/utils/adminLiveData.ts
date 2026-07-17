import { bookings as staticBookings } from "@/lib/data/bookings";
import { cancelledBookings, type CancellationRecord } from "@/lib/data/cancelledBookings";
import { disputeCases } from "@/lib/data/disputes";
import { users, vendorApplications as staticVendorApplications } from "@/lib/data/users";
import { vendors as staticVendors } from "@/lib/data/vendors";
import { VendorApplication, Booking, DisputeCase, PlatformUser, Vendor } from "@/types";
import { getLiveVendors } from "@/lib/utils/liveVendors";

export interface AdminNotificationItem {
  type: string;
  title?: string;
  message: string;
  time: string;
  icon?: string;
  href?: string;
  read?: boolean;
}

export interface PendingPaymentRecord {
  id: string;
  bookingId: string;
  customerName: string;
  customerCity?: string;
  eventDate?: string;
  submittedAt: string;
  paymentMethod?: string;
  bankTransferReference?: string;
  depositSlipName?: string | null;
  depositSlipDataUrl?: string | null;
  depositSlipMimeType?: string | null;
  totals: {
    serviceTotal: number;
    advanceAmount: number;
    platformFee: number;
    payableNow: number;
    remainingBalance: number;
  };
}

export interface AuditLogEntry {
  id: string;
  actor: string;
  action: string;
  entityType: "vendor" | "payment" | "booking" | "profile" | "category" | "system";
  entityId: string;
  entityLabel: string;
  at: string;
  details?: string;
}

export interface ApprovedVendorRecord {
  slug: string;
  businessName: string;
  ownerName?: string;
  phone: string;
  whatsapp?: string;
  email?: string;
  category?: string;
  categorySlug: string;
  city: string;
  location?: string;
  tagline?: string;
  about?: string;
  experienceYears?: number;
  startingPrice?: number;
  password?: string;
  status?: string;
  approvedAt?: string;
  profileComplete?: boolean;
  emailVerified?: boolean;
  suspensionReason?: string;
  additionalCategoryRequests?: string[];
}

export interface AdminSnapshot {
  bookings: Booking[];
  vendors: Vendor[];
  applications: VendorApplication[];
  approvedVendorRecords: ApprovedVendorRecord[];
  notifications: AdminNotificationItem[];
  pendingPayments: PendingPaymentRecord[];
  auditLog: AuditLogEntry[];
  disputes: DisputeCase[];
  refunds: CancellationRecord[];
  users: PlatformUser[];
}

export const ADMIN_NOTIFICATIONS_KEY = "tv-admin-notifications";
export const ADMIN_AUDIT_LOG_KEY = "tv-admin-audit-log";
const PAYMENTS_PENDING_KEY = "tv-payments-pending";
const VENDOR_APPLICATIONS_KEY = "TRIBLEERA-vendor-applications";
const LIVE_BOOKINGS_KEY = "tv-bookings";
const APPROVED_VENDORS_KEY = "TRIBLEERA-approved-vendors";
const REFUNDS_KEY = "tv-refunds";
const DISPUTES_KEY = "tv-disputes";

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function mergeById<T extends { id: string }>(base: T[], live: T[]) {
  const map = new Map(base.map((item) => [item.id, item]));
  live.forEach((item) => map.set(item.id, item));
  return Array.from(map.values());
}

export function emitAdminDataChanged() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event("tribleera-admin-data"));
}

export function subscribeAdminData(onStoreChange: () => void) {
  if (typeof window === "undefined") return () => {};
  const handler = () => onStoreChange();
  window.addEventListener("storage", handler);
  window.addEventListener("tribleera-admin-data", handler);
  window.addEventListener("tribleera-live-vendors", handler);
  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener("tribleera-admin-data", handler);
    window.removeEventListener("tribleera-live-vendors", handler);
  };
}

export function readAdminNotifications() {
  return readJson<AdminNotificationItem[]>(ADMIN_NOTIFICATIONS_KEY, []);
}

/**
 * Marks every admin notification read. Pending applications and payments are
 * deliberately untouched — they stay in the badge because they are still
 * outstanding work, not merely unseen messages.
 */
export function markAdminNotificationsRead() {
  if (typeof window === "undefined") return;
  const next = readAdminNotifications().map((item) => ({ ...item, read: true }));
  window.localStorage.setItem(ADMIN_NOTIFICATIONS_KEY, JSON.stringify(next));
  emitAdminDataChanged();
}

export function readPendingPayments() {
  return readJson<PendingPaymentRecord[]>(PAYMENTS_PENDING_KEY, []);
}

export function readLiveBookings() {
  return mergeById(staticBookings, readJson<Booking[]>(LIVE_BOOKINGS_KEY, []));
}

export function readVendorApplications() {
  return mergeById(staticVendorApplications, readJson<VendorApplication[]>(VENDOR_APPLICATIONS_KEY, []));
}

export function readApprovedVendorRecords() {
  return readJson<ApprovedVendorRecord[]>(APPROVED_VENDORS_KEY, []);
}

export function readAuditLog() {
  return readJson<AuditLogEntry[]>(ADMIN_AUDIT_LOG_KEY, []);
}

export function readRefundRecords() {
  return mergeById(
    cancelledBookings.map((record) => ({ id: record.bookingId, ...record })),
    readJson<Array<CancellationRecord & { id?: string }>>(REFUNDS_KEY, []).map((record) => ({
      ...record,
      id: record.id ?? record.bookingId,
    }))
  ).map((record) => ({
    bookingId: record.bookingId,
    customerId: record.customerId,
    vendorName: record.vendorName,
    reason: record.reason,
    cancelledAt: record.cancelledAt,
    refundAmount: record.refundAmount,
    refundStatus: record.refundStatus,
    daysBeforeEvent: record.daysBeforeEvent,
  }));
}

export function readDisputeRecords() {
  return mergeById(disputeCases, readJson<DisputeCase[]>(DISPUTES_KEY, []));
}

export function appendAuditLog(entry: Omit<AuditLogEntry, "id" | "at">) {
  if (typeof window === "undefined") return;
  const nextEntry: AuditLogEntry = {
    ...entry,
    id: `audit-${Date.now()}`,
    at: new Date().toISOString(),
  };
  const current = readAuditLog();
  window.localStorage.setItem(ADMIN_AUDIT_LOG_KEY, JSON.stringify([nextEntry, ...current].slice(0, 250)));
  emitAdminDataChanged();
}

// useSyncExternalStore requires getSnapshot to return a REFERENTIALLY STABLE
// value when nothing changed — building a fresh object every call sends React
// into an infinite re-render loop that crashes the tab. Cache and only hand
// out a new snapshot when the underlying data actually differs.
let cachedAdminSnapshot: AdminSnapshot | null = null;
let cachedAdminSignature = "";

const SERVER_ADMIN_SNAPSHOT: AdminSnapshot = {
  bookings: [],
  vendors: staticVendors,
  applications: [],
  approvedVendorRecords: [],
  notifications: [],
  pendingPayments: [],
  auditLog: [],
  disputes: [],
  refunds: [],
  users,
};

export function getAdminSnapshot(): AdminSnapshot {
  if (typeof window === "undefined") return SERVER_ADMIN_SNAPSHOT;

  const next: AdminSnapshot = {
    bookings: readLiveBookings(),
    vendors: getLiveVendors(),
    applications: readVendorApplications(),
    approvedVendorRecords: readApprovedVendorRecords(),
    notifications: readAdminNotifications(),
    pendingPayments: readPendingPayments(),
    auditLog: readAuditLog(),
    disputes: readDisputeRecords(),
    refunds: readRefundRecords(),
    users,
  };
  const signature = JSON.stringify(next);
  if (cachedAdminSnapshot && signature === cachedAdminSignature) return cachedAdminSnapshot;
  cachedAdminSignature = signature;
  cachedAdminSnapshot = next;
  return next;
}

export function computeVendorPerformance(snapshot: AdminSnapshot, vendorSlug: string) {
  const vendor = snapshot.vendors.find((item) => item.slug === vendorSlug);
  const inbox = readJson<Record<string, Array<{ status?: string }>>>("tv-vendor-inbox", {});
  const requests = inbox[vendorSlug] ?? [];
  const received = requests.length;
  const accepted = requests.filter((item) => item.status === "accepted").length;
  const rejected = requests.filter((item) => item.status === "rejected").length;
  const responseRate = received > 0 ? Math.round(((accepted + rejected) / received) * 100) : 0;
  const acceptanceRate = received > 0 ? Math.round((accepted / received) * 100) : 0;
  const vendorBookings = snapshot.bookings.filter((booking) =>
    booking.items.some((item) => item.vendorId === vendor?.id || item.vendorName === vendor?.name)
  );
  const revenueGenerated = vendorBookings.reduce((sum, booking) => {
    const vendorItems = booking.items.filter((item) => item.vendorId === vendor?.id || item.vendorName === vendor?.name);
    return sum + vendorItems.reduce((itemSum, item) => itemSum + item.price, 0);
  }, 0);
  const reviews = vendor?.reviews ?? [];
  const averageReview = reviews.length > 0 ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0;
  const recentReviews = reviews.slice(0, Math.ceil(reviews.length / 2));
  const olderReviews = reviews.slice(Math.ceil(reviews.length / 2));
  const recentAverage = recentReviews.length > 0 ? recentReviews.reduce((sum, review) => sum + review.rating, 0) / recentReviews.length : averageReview;
  const olderAverage = olderReviews.length > 0 ? olderReviews.reduce((sum, review) => sum + review.rating, 0) / olderReviews.length : averageReview;
  const reviewTrend = recentAverage - olderAverage;

  return {
    received,
    accepted,
    rejected,
    responseRate,
    acceptanceRate,
    averageReview,
    reviewTrend,
    revenueGenerated,
    bookingsCount: vendorBookings.length,
  };
}

export type DateRangeFilter = "7d" | "30d" | "month" | "all";

export function isInDateRange(dateValue: string | undefined, range: DateRangeFilter) {
  if (!dateValue) return range === "all";
  if (range === "all") return true;

  const value = new Date(dateValue);
  if (Number.isNaN(value.getTime())) return false;

  const now = new Date();
  const start = new Date(now);

  if (range === "7d") {
    start.setDate(now.getDate() - 7);
    return value >= start;
  }

  if (range === "30d") {
    start.setDate(now.getDate() - 30);
    return value >= start;
  }

  return value.getFullYear() === now.getFullYear() && value.getMonth() === now.getMonth();
}

export function toCsv(rows: Array<Record<string, string | number>>) {
  if (rows.length === 0) return "";
  const headers = Object.keys(rows[0]);
  const escape = (value: string | number) => `"${String(value).replace(/"/g, "\"\"")}"`;
  return [
    headers.join(","),
    ...rows.map((row) => headers.map((header) => escape(row[header] ?? "")).join(",")),
  ].join("\n");
}

export function downloadCsv(filename: string, rows: Array<Record<string, string | number>>) {
  if (typeof window === "undefined") return;
  const csv = toCsv(rows);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = window.URL.createObjectURL(blob);
  const link = window.document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  window.URL.revokeObjectURL(url);
}

export function writeRefundRecords(records: CancellationRecord[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(REFUNDS_KEY, JSON.stringify(records));
  emitAdminDataChanged();
}

export function writeDisputeRecords(records: DisputeCase[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(DISPUTES_KEY, JSON.stringify(records));
  emitAdminDataChanged();
}

function addBusinessDays(date: Date, days: number) {
  const result = new Date(date);
  let added = 0;
  while (added < days) {
    result.setDate(result.getDate() + 1);
    const day = result.getDay();
    if (day !== 0 && day !== 6) added += 1;
  }
  return result;
}

export function getDisputeSla(raisedAt: string) {
  const due = addBusinessDays(new Date(raisedAt), 5);
  const now = new Date();
  const overdue = now > due;
  const hoursRemaining = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60));
  return { dueAt: due.toISOString(), overdue, hoursRemaining };
}

export function calculateRefundFromBooking(booking: Booking) {
  const eventDate = new Date(booking.eventDate).getTime();
  const daysBeforeEvent = Math.max(0, Math.ceil((eventDate - Date.now()) / (1000 * 60 * 60 * 24)));
  const refundPercent = daysBeforeEvent >= 31 ? 50 : daysBeforeEvent >= 7 ? 25 : 0;
  const refundAmount = Math.round(booking.payableNow * (refundPercent / 100));
  return { daysBeforeEvent, refundPercent, refundAmount };
}

// Invoice/bill generation moved to lib/utils/reportExport.ts — branded PDFs
// with the standard TRIBLEERA letterhead replaced the old bare-HTML files.
