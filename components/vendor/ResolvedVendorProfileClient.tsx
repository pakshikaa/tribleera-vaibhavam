"use client";

import { useSyncExternalStore } from "react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Vendor } from "@/types";
import { getLiveVendors, subscribeLiveVendors } from "@/lib/utils/liveVendors";
import { VendorProfileContent } from "@/components/vendor/VendorProfileContent";

export function ResolvedVendorProfileClient({
  slug,
  initialVendor,
}: {
  slug: string;
  initialVendor: Vendor | null;
}) {
  const liveVendors = useSyncExternalStore(subscribeLiveVendors, getLiveVendors, () => initialVendor ? [initialVendor] : []);
  const vendor = liveVendors.find((entry) => entry.slug === slug) ?? initialVendor;
  const isServerRender = typeof window === "undefined";

  if (!vendor && isServerRender) {
    return null;
  }

  if (!vendor) {
    return (
      <div className="bg-ivory py-20">
        <Container className="max-w-2xl text-center">
          <h1 className="font-display text-3xl text-burgundy-deep">Vendor not found</h1>
          <p className="mt-3 text-slate-soft">
            This profile is no longer live or has not been approved for customer bookings yet.
          </p>
          <div className="mt-6">
            <Button href="/vendors" variant="primary">Browse vendors</Button>
          </div>
        </Container>
      </div>
    );
  }

  if (!vendor) return null;
  return <VendorProfileContent vendor={vendor} />;
}
