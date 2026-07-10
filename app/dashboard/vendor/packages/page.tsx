"use client";

import { useEffect, useState } from "react";
import { Plus, X } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Field";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { SmartImage } from "@/components/ui/SmartImage";
import { useToast } from "@/components/ui/Toast";
import { getVendorBySlug } from "@/lib/data/vendors";
import { PACKAGE_TEMPLATES, type PackageTemplate } from "@/lib/data/packageTemplates";
import { readLocalStorage, writeLocalStorage } from "@/lib/utils/browser-storage";
import type { VendorPackage } from "@/types";
import { BackButton } from "@/components/ui/BackButton";

const FALLBACK_VENDOR_SLUG = "pushpa-florals-and-decor";

function buildTemplatePackage(template: PackageTemplate, suffix: string): VendorPackage {
  return {
    id: `package-${suffix}`,
    name: template.name,
    tier: template.tier,
    price: template.basePrice,
    description: `${template.tier} package for this service category.`,
    inclusions: ["Customize the service-specific fields below."],
    customFields: Object.fromEntries(
      template.fields.map((field) => [field.id, field.options?.[0] ?? field.placeholder ?? ""])
    ),
  };
}

export default function VendorPackagesPage() {
  const { showToast } = useToast();
  const [vendorSlug] = useState(() => {
    if (typeof window === "undefined") return FALLBACK_VENDOR_SLUG;
    return window.sessionStorage.getItem("vendor-slug") ?? FALLBACK_VENDOR_SLUG;
  });
  const vendor = getVendorBySlug(vendorSlug) ?? getVendorBySlug(FALLBACK_VENDOR_SLUG)!;
  const templates = PACKAGE_TEMPLATES[vendor.categorySlug] ?? [];
  const packageStorageKey = `TRIBLEERA-vendor-packages-${vendor.slug}`;
  const galleryStorageKey = `TRIBLEERA-vendor-gallery-${vendor.slug}`;

  const [packages, setPackages] = useState<VendorPackage[]>(() => {
    if (typeof window === "undefined") return vendor.packages;
    const stored = readLocalStorage<VendorPackage[]>(packageStorageKey, []);
    if (stored.length > 0) return stored.filter((pkg) => !pkg.archived);
    if (templates.length > 0) {
      return templates.map((template, index) => buildTemplatePackage(template, `${vendor.slug}-${index}`));
    }
    return vendor.packages;
  });
  const [createOpen, setCreateOpen] = useState(false);
  const [templateChoice, setTemplateChoice] = useState("0");
  const [galleryImages, setGalleryImages] = useState<string[]>(() =>
    typeof window === "undefined" ? [] : readLocalStorage<string[]>(galleryStorageKey, [])
  );

  useEffect(() => {
    writeLocalStorage(packageStorageKey, packages);
  }, [packageStorageKey, packages]);

  const availableTemplateOptions = templates.map((template, index) => ({
    value: String(index),
    label: `${template.tier} - ${template.name}`,
  }));

  function handleGalleryAdd(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        if (!url) return;
        setGalleryImages((prev) => {
          const next = [...prev, url].slice(0, 12);
          writeLocalStorage(galleryStorageKey, next);
          return next;
        });
      };
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  }

  function updatePackage(packageId: string, updates: Partial<VendorPackage>) {
    setPackages((prev) =>
      prev.map((pkg) => (pkg.id === packageId ? { ...pkg, ...updates } : pkg))
    );
  }

  function updatePackageField(packageId: string, fieldId: string, value: string) {
    setPackages((prev) =>
      prev.map((pkg) =>
        pkg.id === packageId
          ? {
              ...pkg,
              customFields: { ...(pkg.customFields ?? {}), [fieldId]: value },
            }
          : pkg
      )
    );
  }

  function createPackage() {
    const template = templates[Number(templateChoice)] ?? templates[0];
    if (!template) return;
    setPackages((prev) => [...prev, buildTemplatePackage(template, `${vendor.slug}-${Date.now()}`)]);
    setCreateOpen(false);
    showToast("Package created.", "success");
  }

  return (
    <div className="bg-ivory py-8 md:py-10" data-portal="true">
      <Container>
        <BackButton href="/dashboard/vendor" label="Dashboard" className="mb-4" />
        <div className="mb-6 flex flex-col items-stretch justify-between gap-3 sm:flex-row sm:items-center">
          <h1 className="font-display text-3xl text-burgundy-deep">Package Management</h1>
          <Button variant="gold" fullWidth onClick={() => setCreateOpen(true)} className="sm:w-auto">
            Add New Package
          </Button>
        </div>

        <div className="mb-6 rounded-[8px] border border-[#E8D5BF] bg-[#F5EDE3] px-4 py-3 text-[13px] text-burgundy">
          <strong>Your package template:</strong> Fields below are specific to{" "}
          <strong>{vendor.categorySlug.replace(/-/g, " ")}</strong> and sync directly to your public profile.
        </div>

        <div className="mb-8 rounded-lg border border-slate/10 bg-white p-6 shadow-soft">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="font-display text-xl font-semibold text-slate">Portfolio gallery</h2>
            <span className="text-xs text-slate-soft">Shown on your public profile</span>
          </div>
          <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-6">
            {galleryImages.map((url, index) => (
              <div key={index} className="group relative aspect-square overflow-hidden rounded-lg border border-slate/10 bg-ivory-deep">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt={`Portfolio ${index + 1}`} className="h-full w-full object-cover" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/30">
                  <button
                    type="button"
                    onClick={() => {
                      const next = galleryImages.filter((_, imageIndex) => imageIndex !== index);
                      setGalleryImages(next);
                      writeLocalStorage(galleryStorageKey, next);
                    }}
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-red-500 text-white opacity-100 transition-opacity sm:h-7 sm:w-7 sm:opacity-0 sm:group-hover:opacity-100"
                    aria-label="Remove photo"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            ))}
            {galleryImages.length < 12 && (
              <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate/20 bg-[#FAF7F2] transition-colors hover:border-burgundy/40">
                <Plus size={20} className="text-slate/40" />
                <span className="mt-1 text-[11px] text-slate-soft">Add photo</span>
                <input type="file" accept="image/*" multiple className="sr-only" onChange={handleGalleryAdd} />
              </label>
            )}
          </div>
          <p className="mt-2 text-[11px] text-slate-soft">Upload up to 12 photos. First photo is your profile cover image.</p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {packages.map((pkg, index) => {
            const template = templates.find((entry) => entry.tier === pkg.tier) ?? templates[index % Math.max(templates.length, 1)];

            return (
              <div key={pkg.id} className="rounded-lg border border-slate/8 bg-white p-5 shadow-soft">
                <div className="aspect-[4/3] overflow-hidden rounded-[8px]">
                  <SmartImage src={pkg.coverImageUrl} alt={pkg.name} fallbackVariant={vendor.motif} fallbackTone={vendor.tone} />
                </div>
                <Input
                  className="mt-4"
                  label="Package name"
                  value={pkg.name}
                  onChange={(event) => updatePackage(pkg.id, { name: event.target.value })}
                />
                <Input
                  className="mt-3"
                  label="Price"
                  type="number"
                  value={String(pkg.price)}
                  onChange={(event) => updatePackage(pkg.id, { price: Number(event.target.value) })}
                />
                <Input
                  className="mt-3"
                  label="Description"
                  value={pkg.description}
                  onChange={(event) => updatePackage(pkg.id, { description: event.target.value })}
                />

                {template && (
                  <div className="mt-4 rounded-[8px] border border-slate/10 bg-ivory p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-burgundy">
                      {template.tier} template fields
                    </p>
                    <div className="mt-3 space-y-3">
                      {template.fields.map((field) =>
                        field.type === "select" ? (
                          <Select
                            key={field.id}
                            label={field.label}
                            value={pkg.customFields?.[field.id] ?? field.options?.[0] ?? ""}
                            onChange={(event) => updatePackageField(pkg.id, field.id, event.target.value)}
                          >
                            {(field.options ?? []).map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </Select>
                        ) : (
                          <Input
                            key={field.id}
                            label={`${field.label}${field.unit ? ` (${field.unit})` : ""}`}
                            type={field.type}
                            placeholder={field.placeholder}
                            value={pkg.customFields?.[field.id] ?? ""}
                            onChange={(event) => updatePackageField(pkg.id, field.id, event.target.value)}
                          />
                        )
                      )}
                    </div>
                  </div>
                )}

                <div className="mt-4 space-y-2">
                  {pkg.inclusions.map((inclusion, inclusionIndex) => (
                    <div key={`${pkg.id}-${inclusionIndex}`} className="flex items-start gap-2">
                      <Input
                        value={inclusion}
                        onChange={(event) =>
                          updatePackage(pkg.id, {
                            inclusions: pkg.inclusions.map((entry, entryIndex) =>
                              entryIndex === inclusionIndex ? event.target.value : entry
                            ),
                          })
                        }
                      />
                      <button
                        type="button"
                        aria-label={`Remove inclusion ${inclusionIndex + 1}`}
                        className="min-h-11 rounded-[4px] border border-slate/15 px-3 text-sm text-slate-soft"
                        onClick={() =>
                          updatePackage(pkg.id, {
                            inclusions: pkg.inclusions.filter((_, entryIndex) => entryIndex !== inclusionIndex),
                          })
                        }
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>

                <div className="mt-4 grid grid-cols-1 gap-2 sm:flex sm:flex-wrap">
                  <Button
                    size="sm"
                    variant="secondary"
                    fullWidth
                    onClick={() =>
                      updatePackage(pkg.id, { inclusions: [...pkg.inclusions, "New inclusion"] })
                    }
                  >
                    Add inclusion
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    fullWidth
                    onClick={() =>
                      setPackages((prev) => prev.filter((entry) => entry.id !== pkg.id))
                    }
                  >
                    Archive package
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </Container>

      <Sheet open={createOpen} onOpenChange={setCreateOpen}>
        <SheetContent className="w-full max-w-lg">
          <SheetTitle>Create Package</SheetTitle>
          <div className="mt-6 space-y-4">
            <Select label="Package template" value={templateChoice} onChange={(event) => setTemplateChoice(event.target.value)}>
              {availableTemplateOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
            <Button variant="gold" fullWidth onClick={createPackage}>
              Create Package
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
