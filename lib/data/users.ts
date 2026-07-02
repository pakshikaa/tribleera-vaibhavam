import { PlatformUser, VendorApplication } from "@/types";
import { vendors } from "./vendors";

export const users: PlatformUser[] = [
  { id: "u-1", name: "Niranjala & Kajan", email: "niranjala.kajan@example.com", role: "customer", joinedDate: "2026-01-12", status: "active", city: "Jaffna" },
  { id: "u-2", name: "Subasha Thevarajah", email: "subasha.t@example.com", role: "customer", joinedDate: "2026-02-03", status: "active", city: "Trincomalee" },
  { id: "u-3", name: "Hari Gnanasekaran", email: "hari.g@example.com", role: "customer", joinedDate: "2026-03-21", status: "active", city: "Batticaloa" },
  { id: "u-4", name: "Jaffna Frames Studio", email: "contact@jaffnaframes.example.com", role: "vendor", joinedDate: "2024-04-10", status: "active", city: "Jaffna" },
  { id: "u-5", name: "Pushpa Florals & Decor", email: "hello@pushpadecor.example.com", role: "vendor", joinedDate: "2024-07-18", status: "active", city: "Jaffna" },
  { id: "u-6", name: "Pixel & Petal Photography", email: "studio@pixelandpetal.example.com", role: "vendor", joinedDate: "2026-05-02", status: "active", city: "Trincomalee" },
  { id: "u-7", name: "Admin — Karthika S.", email: "karthika@TRIBLEERA.example.com", role: "admin", joinedDate: "2023-11-01", status: "active", city: "Jaffna" },
  { id: "u-8", name: "Revathi Thurairajah", email: "revathi.t@example.com", role: "customer", joinedDate: "2026-04-14", status: "suspended", city: "Colombo" },
];

export const vendorApplications: VendorApplication[] = vendors
  .filter((v) => v.status === "pending")
  .map((v) => ({
    id: `APP-${v.id}`,
    businessName: v.name,
    ownerName: v.name.split(" ")[0] + " Owner",
    categorySlug: v.categorySlug,
    city: v.city,
    submittedAt: v.joinedDate,
    status: v.status,
    phone: v.phone,
    email: `contact@${v.slug.replace(/-/g, "")}.example.com`,
    experienceYears: v.experienceYears,
    about: v.description,
  }));
