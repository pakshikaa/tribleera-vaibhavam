"use client";

import { useMemo } from "react";
import { PackageCard } from "@/components/vendor/PackageCard";
import { getVendorPackages } from "@/lib/utils/vendorData";
import type { MotifTone, MotifVariant, VendorPackage } from "@/types";

interface VendorPackagesSectionProps {
  vendorSlug: string;
  staticPackages: VendorPackage[];
  motif: MotifVariant;
  tone: MotifTone;
  seed: number;
}

export function VendorPackagesSection({
  vendorSlug,
  staticPackages,
  motif,
  tone,
  seed,
}: VendorPackagesSectionProps) {
  const packages = useMemo(
    () => getVendorPackages(vendorSlug, staticPackages),
    [staticPackages, vendorSlug]
  );

  if (packages.length === 0) {
    return (
      <div className="rounded-[10px] border border-slate/10 bg-[#FAF7F2] px-6 py-8 text-center">
        <p className="text-sm text-slate-soft">Packages coming soon. Contact vendor directly.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
      {packages.map((pkg, index) => (
        <PackageCard
          key={pkg.id ?? `${vendorSlug}-${index}`}
          pkg={pkg}
          motif={motif}
          tone={tone}
          seed={seed}
        />
      ))}
    </div>
  );
}
