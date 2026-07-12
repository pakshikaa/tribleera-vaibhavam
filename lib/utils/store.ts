// Shared localStorage helpers for the cross-page mock data bridges
// (event requests -> vendor inbox -> responses -> payments -> bookings).
// A real backend replaces every call site here without reshaping callers.

/**
 * Defined at module scope (not inside a component) so ID generation stays
 * an opaque call from the caller's perspective — mirrors generateBookingId()
 * in lib/utils/booking.ts, which keeps the React Compiler's purity check
 * from flagging Date.now() as an impure call inside render/event-handler code.
 */
export function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}`;
}

export function safeGet<T>(key: string, fallback: T): T {
  try {
    if (typeof window === "undefined") return fallback;
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function safePush(key: string, item: unknown): void {
  try {
    const arr = safeGet<unknown[]>(key, []);
    arr.unshift(item); // newest first
    window.localStorage.setItem(key, JSON.stringify(arr.slice(0, 100)));
    window.dispatchEvent(new Event("tribleera-admin-data"));
  } catch {
    // storage unavailable — caller's UI still updates for this session
  }
}

export function safeSet(key: string, value: unknown): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new Event("tribleera-admin-data"));
  } catch {
    // storage unavailable — caller's UI still updates for this session
  }
}

export function safeUpdate<T extends Record<string, unknown>>(
  key: string,
  id: string,
  idField: string,
  updates: Partial<T>
): void {
  try {
    const arr = safeGet<T[]>(key, []);
    const idx = arr.findIndex((item) => item[idField] === id);
    if (idx !== -1) {
      arr[idx] = { ...arr[idx], ...updates };
      window.localStorage.setItem(key, JSON.stringify(arr));
      window.dispatchEvent(new Event("tribleera-admin-data"));
    }
  } catch {
    // storage unavailable — caller's UI still updates for this session
  }
}
