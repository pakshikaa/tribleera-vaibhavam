import type { Metadata } from "next";
import { getVendorBySlug, vendors } from "@/lib/data/vendors";
import { ResolvedVendorProfileClient } from "@/components/vendor/ResolvedVendorProfileClient";

export function generateStaticParams() {
  return vendors.map((vendor) => ({ id: vendor.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const vendor = getVendorBySlug(id);
  if (!vendor) return {};

  return {
    title: vendor.name,
    description: `${vendor.tagline} ${vendor.description}`.slice(0, 155),
    openGraph: {
      title: `${vendor.name} | TRIBLEERA VAIBHAVAM`,
      description: vendor.tagline,
    },
  };
}

export default async function VendorProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const vendor = getVendorBySlug(id) ?? null;
  return <ResolvedVendorProfileClient slug={id} initialVendor={vendor} />;
}
