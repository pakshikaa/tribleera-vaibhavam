import { bookings as staticBookings } from "@/lib/data/bookings";
import { vendorRequests as staticVendorRequests } from "@/lib/data/vendorRequests";
import type { Booking, Vendor, VendorBookingRequest } from "@/types";
import { getLiveVendors, subscribeLiveVendors } from "@/lib/utils/liveVendors";
import { getCurrentVendorSlug } from "@/lib/utils/vendorPortal";

const VIEWS_KEY = "tv-vendor-profile-views";

type DailyCounts = Record<string, number>;
type ViewMap = Record<string, DailyCounts>;

function safeJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function dateKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

function shiftDays(base: Date, days: number) {
  const next = new Date(base);
  next.setDate(next.getDate() + days);
  return next;
}

function addBusinessDays(baseIso: string, days: number) {
  const next = new Date(baseIso);
  let added = 0;
  while (added < days) {
    next.setDate(next.getDate() + 1);
    const weekday = next.getDay();
    if (weekday !== 0 && weekday !== 6) added += 1;
  }
  return next.toISOString();
}

function readLiveBookings() {
  const live = safeJson<Booking[]>("tv-bookings", []);
  const map = new Map(staticBookings.map((booking) => [booking.id, booking]));
  live.forEach((booking) => map.set(booking.id, booking));
  return Array.from(map.values());
}

function readVendorRequests(slug: string) {
  const inbox = safeJson<Record<string, Array<Record<string, unknown>>>>("tv-vendor-inbox", {});
  const live = (inbox[slug] ?? []).map((entry) => ({
    id: String(entry.id),
    customerName: String(entry.customerName ?? "Customer"),
    customerPhone: entry.customerPhone ? String(entry.customerPhone) : undefined,
    customerEmail: entry.customerEmail ? String(entry.customerEmail) : undefined,
    eventDate: String(entry.eventDate),
    location: entry.location ? String(entry.location) : undefined,
    guestCount: entry.guestCount ? Number(entry.guestCount) : undefined,
    budgetRange: entry.budgetRange ? String(entry.budgetRange) : undefined,
    categorySlug: String(entry.categorySlug),
    packageName: "Custom request",
    price: 0,
    status: entry.status === "accepted" ? "accepted" as const : entry.status === "rejected" ? "declined" as const : "new" as const,
    rejectionReason: entry.rejectionReason ? String(entry.rejectionReason) : undefined,
    receivedAt: String(entry.submittedAt ?? new Date().toISOString()),
    message: entry.requirements ? String(entry.requirements) : "No additional requirements provided.",
  }));

  const merged = new Map<string, VendorBookingRequest>();
  if (slug === "pushpa-florals-and-decor") {
    staticVendorRequests.forEach((request) => merged.set(request.id, request));
  }
  live.forEach((request) => merged.set(request.id, request));
  return Array.from(merged.values());
}

function readViewMap() {
  return safeJson<ViewMap>(VIEWS_KEY, {});
}

function sumViewsForRange(counts: DailyCounts, start: Date, end: Date) {
  let total = 0;
  for (let cursor = new Date(start); cursor <= end; cursor = shiftDays(cursor, 1)) {
    total += counts[dateKey(cursor)] ?? 0;
  }
  return total;
}

export function recordVendorProfileView(slug: string) {
  if (typeof window === "undefined") return;
  const sessionKey = `tv-vendor-profile-viewed-${slug}-${dateKey()}`;
  if (window.sessionStorage.getItem(sessionKey) === "true") return;

  const map = readViewMap();
  const daily = map[slug] ?? {};
  const key = dateKey();
  daily[key] = (daily[key] ?? 0) + 1;
  map[slug] = daily;
  window.localStorage.setItem(VIEWS_KEY, JSON.stringify(map));
  window.sessionStorage.setItem(sessionKey, "true");
  window.dispatchEvent(new Event("tribleera-vendor-metrics"));
}

export function subscribeVendorMetrics(onStoreChange: () => void) {
  if (typeof window === "undefined") return () => {};
  const handler = () => onStoreChange();
  window.addEventListener("storage", handler);
  window.addEventListener("tribleera-vendor-metrics", handler);
  const unsubscribeLive = subscribeLiveVendors(handler);
  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener("tribleera-vendor-metrics", handler);
    unsubscribeLive();
  };
}

export function getCurrentVendorMetrics() {
  const slug = getCurrentVendorSlug() ?? "pushpa-florals-and-decor";
  return getVendorMetricsBySlug(slug);
}

export function getVendorMetricsBySlug(slug: string) {
  const vendor = getLiveVendors().find((entry) => entry.slug === slug) as Vendor | undefined;
  const bookings = readLiveBookings().filter((booking) =>
    booking.items.some((item) => item.vendorSlug === slug || item.vendorId === vendor?.id || item.vendorName === vendor?.name)
  );
  const requests = readVendorRequests(slug);
  const counts = readViewMap()[slug] ?? {};
  const now = new Date();
  const last30Start = shiftDays(now, -29);
  const prev30Start = shiftDays(now, -59);
  const prev30End = shiftDays(now, -30);
  const views30d = sumViewsForRange(counts, last30Start, now);
  const viewsPrev30d = sumViewsForRange(counts, prev30Start, prev30End);
  const viewsDelta = viewsPrev30d === 0 ? (views30d > 0 ? 100 : 0) : Math.round(((views30d - viewsPrev30d) / viewsPrev30d) * 100);

  const viewsTrend = Array.from({ length: 7 }, (_, index) => {
    const day = shiftDays(now, index - 6);
    return {
      label: day.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      value: counts[dateKey(day)] ?? 0,
    };
  });

  const vendorItemTotal = (booking: Booking) =>
    booking.items
      .filter((item) => item.vendorSlug === slug || item.vendorId === vendor?.id || item.vendorName === vendor?.name)
      .reduce((sum, item) => sum + item.price, 0);

  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const revenueThisMonth = bookings
    .filter((booking) => {
      const created = new Date(booking.createdAt);
      return created.getMonth() === currentMonth && created.getFullYear() === currentYear && booking.status !== "cancelled";
    })
    .reduce((sum, booking) => sum + vendorItemTotal(booking), 0);

  const completedRevenue = bookings
    .filter((booking) => booking.status === "completed")
    .reduce((sum, booking) => sum + vendorItemTotal(booking), 0);

  const activeRevenue = bookings
    .filter((booking) => booking.status === "confirmed" || booking.status === "advance_paid" || booking.status === "completed")
    .reduce((sum, booking) => sum + vendorItemTotal(booking), 0);

  const respondedRequests = requests.filter((request) => request.status !== "new").length;
  const acceptedRequests = requests.filter((request) => request.status === "accepted").length;
  const responseRate = requests.length > 0 ? Math.round((respondedRequests / requests.length) * 100) : 0;
  const conversionRate = requests.length > 0 ? Math.round((acceptedRequests / requests.length) * 100) : 0;

  const payoutHistory = bookings
    .filter((booking) => booking.status === "completed")
    .map((booking) => ({
      bookingId: booking.id,
      customerName: booking.customerName,
      eventDate: booking.eventDate,
      amount: vendorItemTotal(booking),
      payoutDate: addBusinessDays((booking as Booking & { completedAt?: string }).completedAt ?? booking.eventDate, 3),
    }))
    .sort((left, right) => left.payoutDate.localeCompare(right.payoutDate));

  const nextPayout = payoutHistory.find((entry) => new Date(entry.payoutDate).getTime() >= Date.now()) ?? null;

  const earningsTimeline = Array.from({ length: 6 }, (_, index) => {
    const monthDate = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);
    const label = monthDate.toLocaleDateString("en-US", { month: "short" });
    const value = bookings
      .filter((booking) => {
        const created = new Date(booking.createdAt);
        return created.getMonth() === monthDate.getMonth() && created.getFullYear() === monthDate.getFullYear() && booking.status !== "cancelled";
      })
      .reduce((sum, booking) => sum + vendorItemTotal(booking), 0);
    return { label, value };
  });

  return {
    slug,
    vendor,
    bookings,
    requests,
    views30d,
    viewsDelta,
    viewsTrend,
    revenueThisMonth,
    completedRevenue,
    activeRevenue,
    responseRate,
    conversionRate,
    acceptedRequests,
    nextPayout,
    payoutHistory,
    earningsTimeline,
  };
}
