import type { Metadata } from "next";
import { getVendorBySlug, vendors } from "@/lib/data/vendors";
import { ResolvedPackageSelectionClient } from "@/components/vendor/ResolvedPackageSelectionClient";

export function generateStaticParams() {
  return vendors.map((vendor) => ({ id: vendor.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const vendor = getVendorBySlug(id);
  if (!vendor) return {};
  return { title: `Packages — ${vendor.name}` };
}

export default async function PackageSelectionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const vendor = getVendorBySlug(id) ?? null;
  return <ResolvedPackageSelectionClient slug={id} initialVendor={vendor} />;
}
