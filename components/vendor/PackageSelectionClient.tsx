"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Info } from "lucide-react";
import { Vendor } from "@/types";
import { PackageCard } from "@/components/vendor/PackageCard";
import { PriceSummary } from "@/components/booking/PriceSummary";
import { Button } from "@/components/ui/Button";
import { Toast } from "@/components/ui/Toast";
import { useCart } from "@/context/CartContext";
import { lineItemBreakdown } from "@/lib/utils/booking";

export function PackageSelectionClient({ vendor }: { vendor: Vendor }) {
  const router = useRouter();
  const { addItem, isInCart, items } = useCart();
  const alreadyInCart = isInCart(vendor.categorySlug);
  const existingItem = items.find((i) => i.categorySlug === vendor.categorySlug);
  const [selectedId, setSelectedId] = useState<string | null>(
    existingItem && existingItem.vendorId === vendor.id ? existingItem.packageId : null
  );
  const [showToast, setShowToast] = useState(false);

  const selectedPackage = vendor.packages.find((p) => p.id === selectedId);

  function handleSelect(pkgId: string) {
    const pkg = vendor.packages.find((p) => p.id === pkgId);
    if (!pkg) return;
    setSelectedId(pkgId);
    addItem({
      vendorId: vendor.id,
      vendorName: vendor.name,
      categorySlug: vendor.categorySlug,
      packageId: pkg.id,
      packageName: pkg.name,
      price: pkg.price,
    });
    setShowToast(true);
    window.setTimeout(() => {
      router.push("/booking/cart");
    }, 800);
  }

  return (
    <>
      <Toast open={showToast} onOpenChange={setShowToast} message="Added to cart!" />
      <div className="grid grid-cols-1 gap-10 md:grid-cols-[1fr_320px]">
        <div>
        {alreadyInCart && existingItem && existingItem.vendorId !== vendor.id && (
          <div className="mb-6 flex items-start gap-2.5 rounded-lg border border-warning/30 bg-warning-pale px-4 py-3 text-sm text-warning">
            <Info size={16} className="mt-0.5 shrink-0" />
            <span>
              You already have <strong>{existingItem.vendorName}</strong> selected for{" "}
              {vendor.categorySlug.replace(/-/g, " ")}. Choosing a package here will replace that selection.
            </span>
          </div>
        )}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {vendor.packages.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} selected={selectedId === pkg.id} onSelect={() => handleSelect(pkg.id)} />
          ))}
        </div>
        </div>

        <aside>
          <div className="sticky top-28 space-y-5">
            {selectedPackage ? (
              <>
                <PriceSummary breakdown={lineItemBreakdown(selectedPackage.price)} title={`${selectedPackage.name} package`} />
                <Button href="/booking/cart" fullWidth size="lg" iconRight={<ArrowRight size={16} />}>
                  Go to booking cart
                </Button>
                <Link href="/vendors" className="block text-center text-sm font-medium text-slate-soft hover:text-burgundy">
                  Continue browsing other categories
                </Link>
              </>
            ) : (
              <div className="rounded-[8px] border border-dashed border-slate/15 bg-white/60 p-6 text-center">
                <p className="text-sm text-slate-soft">Select a package to see the full payment breakdown.</p>
              </div>
            )}
          </div>
        </aside>
      </div>
    </>
  );
}
