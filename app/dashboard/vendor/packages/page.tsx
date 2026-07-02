"use client";

import { useEffect, useState } from "react";
import { Plus, X } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Field";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { SmartImage } from "@/components/ui/SmartImage";
import { useToast } from "@/components/ui/Toast";
import { getVendorBySlug } from "@/lib/data/vendors";
import { readLocalStorage, writeLocalStorage } from "@/lib/utils/browser-storage";
import type { VendorPackage } from "@/types";
import { BackButton } from "@/components/ui/BackButton";

const STORAGE_KEY = "triblerera-vendor-packages";
const DEFAULT_PACKAGES = getVendorBySlug("pushpa-florals-and-decor")!.packages;

export default function VendorPackagesPage() {
  const { showToast } = useToast();
  const [packages, setPackages] = useState<VendorPackage[]>(() =>
    typeof window === "undefined" ? DEFAULT_PACKAGES : readLocalStorage<VendorPackage[]>(STORAGE_KEY, DEFAULT_PACKAGES)
  );
  const [createOpen, setCreateOpen] = useState(false);
  const [newPackage, setNewPackage] = useState({ name: "", price: "", inclusions: ["", "", ""] });
  const [galleryImages, setGalleryImages] = useState<string[]>(() =>
    typeof window === "undefined" ? [] : readLocalStorage<string[]>("triblerera-vendor-gallery", [])
  );

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

  function handleGalleryAdd(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const url = ev.target?.result as string;
        if (!url) return;
        setGalleryImages((prev) => {
          const next = [...prev, url].slice(0, 12);
          writeLocalStorage("triblerera-vendor-gallery", next);
          return next;
        });
      };
      reader.readAsDataURL(file);
    });
    // Reset input so same file can be re-added after removal
    e.target.value = "";
  }

  return (
    <div className="bg-ivory py-10">
      <Container>
        <BackButton href="/dashboard/vendor" label="Dashboard" className="mb-4" />
        <div className="mb-6 flex items-center justify-between gap-3">
          <h1 className="font-display text-3xl text-burgundy-deep">Package Management</h1>
          <Button variant="gold" onClick={() => setCreateOpen(true)}>
            Add New Package
          </Button>
        </div>

        {/* Portfolio gallery */}
        <div className="mb-8 rounded-lg border border-slate/10 bg-white p-6 shadow-soft">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold text-[#1F2937]">Portfolio gallery</h2>
            <span className="text-xs text-[#4B5563]">Shown on your public profile</span>
          </div>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
            {galleryImages.map((url, i) => (
              <div key={i} className="group relative aspect-square overflow-hidden rounded-lg bg-[#F1EAE0] border border-slate/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt={`Portfolio ${i + 1}`} className="h-full w-full object-cover" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/30">
                  <button
                    type="button"
                    onClick={() => {
                      const next = galleryImages.filter((_, idx) => idx !== i);
                      setGalleryImages(next);
                      writeLocalStorage("triblerera-vendor-gallery", next);
                    }}
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-white opacity-0 transition-opacity group-hover:opacity-100"
                    aria-label="Remove photo"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            ))}
            {galleryImages.length < 12 && (
              <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate/20 bg-[#FAF7F2] transition-colors hover:border-[#7A1F3D]/40">
                <Plus size={20} className="text-slate/40" />
                <span className="mt-1 text-[10px] text-[#4B5563]">Add photo</span>
                <input type="file" accept="image/*" multiple className="sr-only" onChange={handleGalleryAdd} />
              </label>
            )}
          </div>
          <p className="mt-2 text-[11px] text-[#4B5563]">Upload up to 12 photos. First photo is your profile cover image.</p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {packages.map((pkg) => (
            <div key={pkg.id} className="rounded-lg border border-slate/8 bg-white p-5 shadow-soft">
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
