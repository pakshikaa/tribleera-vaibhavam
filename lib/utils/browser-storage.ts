"use client";

export function readLocalStorage<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

/**
 * Returns false when the write failed — storage disabled, or (the common case
 * for base64 image uploads) the origin's ~5MB quota is exhausted. Callers that
 * report success to the user should check this instead of assuming it landed.
 */
export function tryWriteLocalStorage<T>(key: string, value: T): boolean {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function writeLocalStorage<T>(key: string, value: T) {
  tryWriteLocalStorage(key, value);
}

export function readSessionStorage<T>(key: string, fallback: T): T {
  try {
    const raw = window.sessionStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function writeSessionStorage<T>(key: string, value: T) {
  try {
    window.sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore unavailable storage
  }
}
