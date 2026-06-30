"use client";

import { useEffect, useState } from "react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Field";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { SmartImage } from "@/components/ui/SmartImage";
import { useToast } from "@/components/ui/Toast";
import { getVendorBySlug } from "@/lib/data/vendors";
import { readLocalStorage, writeLocalStorage } from "@/lib/utils/browser-storage";
import type { VendorPackage } from "@/types";

const STORAGE_KEY = "tribleera-vendor-packages";
const DEFAULT_PACKAGES = getVendorBySlug("pushpa-florals-and-decor")!.packages;

export default function VendorPackagesPage() {
  const { showToast } = useToast();
  const [packages, setPackages] = useState<VendorPackage[]>(() =>
    typeof window === "undefined" ? DEFAULT_PACKAGES : readLocalStorage<VendorPackage[]>(STORAGE_KEY, DEFAULT_PACKAGES)
  );
  const [createOpen, setCreateOpen] = useState(false);
  const [newPackage, setNewPackage] = useState({ name: "", price: "", inclusions: ["", "", ""] });

  useEffect(() => {
    writeLocalStorage(STORAGE_KEY, packages);
  }, [packages]);

  function createPackage() {
    setPackages((prev) => [
      ...prev,
      {
        id: `package-${Date.now()}`,
        name: newPackage.name || "New Package",
        tier: "Essential",
        price: Number(newPackage.price) || 0,
        description: "Custom package",
        inclusions: newPackage.inclusions.filter(Boolean),
      },
    ]);
    setCreateOpen(false);
    setNewPackage({ name: "", price: "", inclusions: ["", "", ""] });
    showToast("Package created.", "success");
  }

  return (
    <div className="bg-ivory py-10">
      <Container>
        <div className="mb-6 flex items-center justify-between gap-3">
          <h1 className="font-display text-3xl text-burgundy-deep">Package Management</h1>
          <Button variant="gold" onClick={() => setCreateOpen(true)}>
            Add New Package
          </Button>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {packages.map((pkg) => (
            <div key={pkg.id} className="rounded-[10px] border border-slate/8 bg-white p-5 shadow-soft">
              <div className="aspect-[4/3] overflow-hidden rounded-[8px]">
                <SmartImage src={pkg.coverImageUrl} alt={pkg.name} fallbackVariant="lotus" fallbackTone="gold" />
              </div>
              <Input className="mt-4" value={pkg.name} onChange={(event) => setPackages((prev) => prev.map((item) => item.id === pkg.id ? { ...item, name: event.target.value } : item))} />
              <Input className="mt-3" type="number" value={String(pkg.price)} onChange={(event) => setPackages((prev) => prev.map((item) => item.id === pkg.id ? { ...item, price: Number(event.target.value) } : item))} />
              <div className="mt-4 space-y-2">
                {pkg.inclusions.map((inclusion, index) => (
                  <div key={`${pkg.id}-${index}`} className="flex gap-2">
                    <Input
                      value={inclusion}
                      onChange={(event) =>
                        setPackages((prev) =>
                          prev.map((item) =>
                            item.id === pkg.id
                              ? {
                                  ...item,
                                  inclusions: item.inclusions.map((entry, entryIndex) => (entryIndex === index ? event.target.value : entry)),
                                }
                              : item
                          )
                        )
                      }
                    />
                    <button
                      type="button"
                      aria-label={`Remove inclusion ${index + 1}`}
                      className="rounded-[4px] border border-slate/15 px-3 text-sm text-slate-soft"
                      onClick={() =>
                        setPackages((prev) =>
                          prev.map((item) =>
                            item.id === pkg.id ? { ...item, inclusions: item.inclusions.filter((_, entryIndex) => entryIndex !== index) } : item
                          )
                        )
                      }
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() =>
                    setPackages((prev) =>
                      prev.map((item) => (item.id === pkg.id ? { ...item, inclusions: [...item.inclusions, "New inclusion"] } : item))
                    )
                  }
                >
                  Add inclusion
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => setPackages((prev) => prev.filter((item) => item.id !== pkg.id))}
                >
                  Archive package
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Container>

      <Sheet open={createOpen} onOpenChange={setCreateOpen}>
        <SheetContent className="w-full max-w-lg">
          <SheetTitle>Create Package</SheetTitle>
          <div className="mt-6 space-y-4">
            <Input label="Package name" value={newPackage.name} onChange={(event) => setNewPackage({ ...newPackage, name: event.target.value })} />
            <Input label="Price" type="number" value={newPackage.price} onChange={(event) => setNewPackage({ ...newPackage, price: event.target.value })} />
            {newPackage.inclusions.map((inclusion, index) => (
              <Input
                key={index}
                label={`Inclusion ${index + 1}`}
                value={inclusion}
                onChange={(event) =>
                  setNewPackage((prev) => ({
                    ...prev,
                    inclusions: prev.inclusions.map((entry, entryIndex) => (entryIndex === index ? event.target.value : entry)),
                  }))
                }
              />
            ))}
            <Button variant="gold" fullWidth onClick={createPackage}>
              Create Package
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
