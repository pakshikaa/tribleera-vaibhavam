"use client";

import { useSyncExternalStore } from "react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PackageSelectionClient } from "@/components/vendor/PackageSelectionClient";
import { BackButton } from "@/components/ui/BackButton";
import { Button } from "@/components/ui/Button";
import { Vendor } from "@/types";
import { getLiveVendors, subscribeLiveVendors } from "@/lib/utils/liveVendors";

export function ResolvedPackageSelectionClient({
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
          <h1 className="font-display text-3xl text-burgundy-deep">Packages unavailable</h1>
          <p className="mt-3 text-slate-soft">
            This vendor package page is not currently available.
          </p>
          <div className="mt-6">
            <Button href="/vendors" variant="primary">Browse vendors</Button>
          </div>
        </Container>
      </div>
    );
  }

  if (!vendor) return null;

  return (
    <div className="bg-ivory">
      <div className="border-b border-slate/8 bg-ivory">
        <Container className="py-3">
          <BackButton href={`/vendors/${vendor.slug}`} label={vendor.name} />
        </Container>
      </div>
      <section className="border-b border-slate/8 bg-white py-10 md:py-14">
        <Container>
          <SectionHeading
            eyebrow={vendor.name}
            title="Choose your package."
            description="Every tier includes transparent pricing — add one to your booking cart and continue planning your other categories."
          />
        </Container>
      </section>

      <Container className="py-10 md:py-14">
        <PackageSelectionClient vendor={vendor} />
      </Container>
    </div>
  );
}
