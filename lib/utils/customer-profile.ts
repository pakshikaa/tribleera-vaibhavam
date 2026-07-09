"use client";

import { users } from "@/lib/data/users";
import { readLocalStorage, writeLocalStorage } from "@/lib/utils/browser-storage";
import type { CustomerProfile } from "@/types";

export const DEFAULT_CUSTOMER_PROFILE: CustomerProfile = {
  name: "Niranjala & Kajan",
  email: "niranjala.kajan@example.com",
  city: "Jaffna",
  phone: "+94 77 410 0012",
};

function profileKey(email: string) {
  return `TRIBLEERA-customer-profile:${email.toLowerCase()}`;
}

function titleCaseNameFromEmail(email: string) {
  const base = email.split("@")[0] ?? "Customer";
  return base
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function fallbackCustomerProfile(email: string, name?: string): CustomerProfile {
  const matchedUser = users.find((user) => user.role === "customer" && user.email.toLowerCase() === email.toLowerCase());

  return {
    name: name?.trim() || matchedUser?.name || titleCaseNameFromEmail(email) || DEFAULT_CUSTOMER_PROFILE.name,
    email,
    city: matchedUser?.city || DEFAULT_CUSTOMER_PROFILE.city,
    phone: DEFAULT_CUSTOMER_PROFILE.phone,
  };
}

export function readCustomerProfile(email: string, name?: string): CustomerProfile {
  if (!email) return DEFAULT_CUSTOMER_PROFILE;
  return readLocalStorage<CustomerProfile>(profileKey(email), fallbackCustomerProfile(email, name));
}

export function writeCustomerProfile(profile: CustomerProfile) {
  writeLocalStorage(profileKey(profile.email), profile);
}

export function readActiveCustomerProfile(): CustomerProfile {
  try {
    const email = window.sessionStorage.getItem("customer-auth");
    const name = window.sessionStorage.getItem("customer-name") ?? undefined;
    if (!email) return DEFAULT_CUSTOMER_PROFILE;
    return readCustomerProfile(email, name);
  } catch {
    return DEFAULT_CUSTOMER_PROFILE;
  }
}

export function writeActiveCustomerProfile(profile: CustomerProfile) {
  writeCustomerProfile(profile);
  try {
    window.sessionStorage.setItem("customer-auth", profile.email);
    window.sessionStorage.setItem("customer-name", profile.name);
  } catch {
    // ignore unavailable storage
  }
}
