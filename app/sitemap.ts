import type { MetadataRoute } from "next";
import { vendors } from "@/lib/data/vendors";
import { categories } from "@/lib/data/categories";

const BASE_URL = "https://tribleera-vaibhavam.example.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/services", "/vendors", "/vendor/register"].map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
  }));

  const categoryRoutes = categories.map((c) => ({
    url: `${BASE_URL}/vendors?category=${c.slug}`,
    lastModified: new Date(),
  }));

  const vendorRoutes = vendors
    .filter((v) => v.status === "approved")
    .map((v) => ({
      url: `${BASE_URL}/vendors/${v.slug}`,
      lastModified: new Date(v.joinedDate),
    }));

  return [...staticRoutes, ...categoryRoutes, ...vendorRoutes];
}
