export type AdminRole = "super_admin" | "finance_admin" | "content_admin";

export interface AdminUserRecord {
  username: string;
  password: string;
  role: AdminRole;
  displayName: string;
}

export interface AdminSession {
  username: string;
  role: AdminRole;
  displayName: string;
  loginAt: string;
  lastActivityAt: string;
  expiresAt: string;
}

interface AdminLoginAttempts {
  count: number;
  firstFailedAt: string;
  lockedUntil?: string;
}

export const ADMIN_LOGIN_PATH = "/admin/secure-n7k2xq4m-login";
export const ADMIN_SESSION_KEY = "tv-admin-session";
const ADMIN_LOGIN_ATTEMPTS_KEY = "tv-admin-login-attempts";
const IDLE_TIMEOUT_MS = 30 * 60 * 1000;
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_WINDOW_MS = 15 * 60 * 1000;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000;

export const ADMIN_USERS: AdminUserRecord[] = [
  {
    username: "superadmin",
    password: "TribleeraSuper2026",
    role: "super_admin",
    displayName: "Super Admin",
  },
  {
    username: "admin",
    password: "Tribleera2026",
    role: "super_admin",
    displayName: "Super Admin",
  },
  {
    username: "financeadmin",
    password: "TribleeraFinance2026",
    role: "finance_admin",
    displayName: "Finance Admin",
  },
  {
    username: "contentadmin",
    password: "TribleeraContent2026",
    role: "content_admin",
    displayName: "Content Admin",
  },
];

const ACCESS: Array<{ prefix: string; roles: AdminRole[] }> = [
  { prefix: "/dashboard/admin/payments", roles: ["super_admin", "finance_admin"] },
  { prefix: "/dashboard/admin/bookings", roles: ["super_admin", "finance_admin"] },
  { prefix: "/dashboard/admin/disputes", roles: ["super_admin", "finance_admin"] },
  { prefix: "/dashboard/admin/reports", roles: ["super_admin", "finance_admin"] },
  { prefix: "/dashboard/admin/vendors", roles: ["super_admin", "content_admin"] },
  { prefix: "/dashboard/admin/categories", roles: ["super_admin", "content_admin"] },
  { prefix: "/dashboard/admin/moderation", roles: ["super_admin", "content_admin"] },
  { prefix: "/dashboard/admin/reminders", roles: ["super_admin", "content_admin"] },
  { prefix: "/dashboard/admin", roles: ["super_admin", "finance_admin", "content_admin"] },
];

function nowIso() {
  return new Date().toISOString();
}

function safeParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function readAttempts(): AdminLoginAttempts {
  if (typeof window === "undefined") {
    return { count: 0, firstFailedAt: nowIso() };
  }
  return safeParse<AdminLoginAttempts>(window.localStorage.getItem(ADMIN_LOGIN_ATTEMPTS_KEY)) ?? {
    count: 0,
    firstFailedAt: nowIso(),
  };
}

function writeAttempts(attempts: AdminLoginAttempts) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ADMIN_LOGIN_ATTEMPTS_KEY, JSON.stringify(attempts));
}

export function clearAdminLoginAttempts() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(ADMIN_LOGIN_ATTEMPTS_KEY);
}

export function getAdminLockout() {
  const attempts = readAttempts();
  if (!attempts.lockedUntil) return { locked: false, remainingMs: 0 };
  const remainingMs = new Date(attempts.lockedUntil).getTime() - Date.now();
  if (remainingMs <= 0) {
    clearAdminLoginAttempts();
    return { locked: false, remainingMs: 0 };
  }
  return { locked: true, remainingMs };
}

export function recordAdminLoginFailure() {
  const attempts = readAttempts();
  const now = Date.now();
  const firstFailedAt = new Date(attempts.firstFailedAt).getTime();
  const resetWindow = Number.isNaN(firstFailedAt) || now - firstFailedAt > LOCKOUT_WINDOW_MS;
  const nextCount = resetWindow ? 1 : attempts.count + 1;

  const next: AdminLoginAttempts = {
    count: nextCount,
    firstFailedAt: resetWindow ? nowIso() : attempts.firstFailedAt,
  };

  if (nextCount >= MAX_FAILED_ATTEMPTS) {
    next.lockedUntil = new Date(now + LOCKOUT_DURATION_MS).toISOString();
  }

  writeAttempts(next);
  return getAdminLockout();
}

export function createAdminSession(user: AdminUserRecord): AdminSession {
  const timestamp = nowIso();
  return {
    username: user.username,
    role: user.role,
    displayName: user.displayName,
    loginAt: timestamp,
    lastActivityAt: timestamp,
    expiresAt: new Date(Date.now() + IDLE_TIMEOUT_MS).toISOString(),
  };
}

export function persistAdminSession(session: AdminSession) {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
  window.sessionStorage.setItem("admin-auth", "true");
}

export function readAdminSession() {
  if (typeof window === "undefined") return null;
  const session = safeParse<AdminSession>(window.sessionStorage.getItem(ADMIN_SESSION_KEY));
  if (!session) return null;
  if (new Date(session.expiresAt).getTime() <= Date.now()) {
    clearAdminSession();
    return null;
  }
  return session;
}

export function refreshAdminSessionActivity() {
  const current = readAdminSession();
  if (!current) return null;
  const refreshed: AdminSession = {
    ...current,
    lastActivityAt: nowIso(),
    expiresAt: new Date(Date.now() + IDLE_TIMEOUT_MS).toISOString(),
  };
  persistAdminSession(refreshed);
  return refreshed;
}

export function clearAdminSession() {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(ADMIN_SESSION_KEY);
  window.sessionStorage.removeItem("admin-auth");
}

export function authenticateAdmin(username: string, password: string) {
  const lockout = getAdminLockout();
  if (lockout.locked) {
    return {
      ok: false as const,
      reason: "locked",
      remainingMs: lockout.remainingMs,
    };
  }

  // Case-insensitive on purpose: the demo credentials have been documented
  // in both "Tribleera2026" and "tribleera2026" forms, and an exact-case
  // match silently locked admins out (same bug the old login had).
  const user = ADMIN_USERS.find(
    (item) =>
      item.username.toLowerCase() === username.trim().toLowerCase() &&
      item.password.toLowerCase() === password.trim().toLowerCase()
  );

  if (!user) {
    const failed = recordAdminLoginFailure();
    return {
      ok: false as const,
      reason: failed.locked ? "locked" : "invalid",
      remainingMs: failed.remainingMs,
    };
  }

  clearAdminLoginAttempts();
  const session = createAdminSession(user);
  persistAdminSession(session);
  return {
    ok: true as const,
    session,
  };
}

export function formatLockoutRemaining(remainingMs: number) {
  const totalMinutes = Math.max(1, Math.ceil(remainingMs / (60 * 1000)));
  return `${totalMinutes} minute${totalMinutes === 1 ? "" : "s"}`;
}

export function canAccessAdminPath(role: AdminRole, pathname: string) {
  const matched = ACCESS.find((item) => pathname.startsWith(item.prefix));
  return matched ? matched.roles.includes(role) : false;
}

export function getDefaultAdminPath(role: AdminRole) {
  if (role === "finance_admin") return "/dashboard/admin/payments";
  if (role === "content_admin") return "/dashboard/admin/vendors";
  return "/dashboard/admin";
}

export function getRoleLabel(role: AdminRole) {
  if (role === "super_admin") return "Super admin";
  if (role === "finance_admin") return "Finance admin";
  return "Content admin";
}
