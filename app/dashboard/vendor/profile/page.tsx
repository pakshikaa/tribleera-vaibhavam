"use client";

import { useRef, useState } from "react";
import { Camera, ImagePlus, Trash2 } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Field";
import { useToast } from "@/components/ui/Toast";
import { getVendorBySlug } from "@/lib/data/vendors";
import { readLocalStorage } from "@/lib/utils/browser-storage";
import { generateId, safePush } from "@/lib/utils/store";
import { BackButton } from "@/components/ui/BackButton";
import { cn } from "@/lib/utils/cn";
import {
  getCurrentVendorSlug,
  getVendorPhotoStorageKey,
  markVendorProfileComplete,
  readVendorGallery,
  readVendorProfile,
  removeVendorGalleryPhoto,
  writeVendorPhoto,
  writeVendorProfile,
} from "@/lib/utils/vendorPortal";

const DEFAULT_VENDOR = getVendorBySlug("pushpa-florals-and-decor")!;

// Cities offered in the event-request flow — a vendor can restrict requests
// to the areas they actually serve (V-22).
const SERVICE_AREA_OPTIONS = ["Jaffna", "Colombo", "Trincomalee", "Batticaloa", "Kandy", "Vavuniya"];

export default function VendorProfilePage() {
  const { showToast } = useToast();
  const photoInputRef = useRef<HTMLInputElement>(null);
  const vendorSlug =
    typeof window === "undefined" ? DEFAULT_VENDOR.slug : getCurrentVendorSlug() ?? DEFAULT_VENDOR.slug;
  const liveVendor = getVendorBySlug(vendorSlug) ?? DEFAULT_VENDOR;
  const defaultForm = {
    businessName: liveVendor.name,
    tagline: liveVendor.tagline,
    description: liveVendor.description,
    phone: liveVendor.phone,
    email: "vendor@example.com",
    whatsapp: liveVendor.whatsapp,
    city: liveVendor.city,
    location: liveVendor.location,
    experienceYears: String(liveVendor.experienceYears),
    eventsCompleted: String(liveVendor.eventsCompleted),
    serviceAreas: [liveVendor.city] as string[],
    minNoticeDays: "30",
  };
  const storedProfile =
    typeof window === "undefined"
      ? null
      : (readVendorProfile(vendorSlug) as ((typeof defaultForm & { tags: string[] }) | null));
  const [photo, setPhoto] = useState<string | null>(
    typeof window === "undefined" ? null : readLocalStorage<string | null>(getVendorPhotoStorageKey(vendorSlug), null)
  );
  const [photoPending, setPhotoPending] = useState(false);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const [gallery, setGallery] = useState<string[]>(
    typeof window === "undefined" ? [] : readVendorGallery(vendorSlug)
  );
  const [galleryPendingCount, setGalleryPendingCount] = useState(0);
  const [tags, setTags] = useState<string[]>(storedProfile?.tags ?? liveVendor.tags);
  const [tagInput, setTagInput] = useState("");
  const [form, setForm] = useState(storedProfile ? { ...defaultForm, ...storedProfile } : defaultForm);

  // New photos are NOT published directly — they enter the admin moderation
  // queue first, so stolen/fake portfolio images never go live unreviewed.
  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setPhoto(dataUrl);
      setPhotoPending(true);
      let activeVendorSlug = vendorSlug;
      try {
        activeVendorSlug = sessionStorage.getItem("vendor-slug") || activeVendorSlug;
      } catch {}
      safePush("tv-moderation-queue", {
        id: generateId("MOD"),
        vendorSlug: activeVendorSlug,
        vendorName: form.businessName,
        photo: dataUrl,
        submittedAt: new Date().toISOString(),
      });
      safePush("tv-admin-notifications", {
        id: generateId("AN"),
        type: "moderation",
        message: `${form.businessName} submitted a new profile photo for review`,
        time: new Date().toISOString(),
        icon: "🖼️",
        urgent: false,
      });
      showToast("Photo sent for admin review — it goes live once approved.", "success");
    };
    reader.readAsDataURL(file);
  }

  // Gallery photos follow the same moderation path as the profile photo —
  // they appear on the public profile only after admin approval (V-18).
  function handleGalleryChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []).slice(0, 6);
    if (files.length === 0) return;
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        safePush("tv-moderation-queue", {
          id: generateId("MOD"),
          vendorSlug,
          vendorName: form.businessName,
          photo: reader.result as string,
          submittedAt: new Date().toISOString(),
          kind: "gallery",
        });
        setGalleryPendingCount((count) => count + 1);
      };
      reader.readAsDataURL(file);
    });
    safePush("tv-admin-notifications", {
      id: generateId("AN"),
      type: "moderation",
      message: `${form.businessName} submitted ${files.length} gallery photo${files.length !== 1 ? "s" : ""} for review`,
      time: new Date().toISOString(),
      icon: "🖼️",
      urgent: false,
    });
    showToast(`${files.length} photo${files.length !== 1 ? "s" : ""} sent for admin review.`, "success");
    e.target.value = "";
  }

  function removeGalleryPhoto(index: number) {
    removeVendorGalleryPhoto(vendorSlug, index);
    setGallery(readVendorGallery(vendorSlug));
  }

  function toggleServiceArea(area: string) {
    setForm((prev) => {
      const current = prev.serviceAreas ?? [];
      const next = current.includes(area) ? current.filter((a) => a !== area) : [...current, area];
      // Never allow zero areas — a vendor always serves somewhere.
      return { ...prev, serviceAreas: next.length > 0 ? next : current };
    });
  }

  function saveProfile() {
    writeVendorProfile(vendorSlug, { ...form, tags });
    if (photo) writeVendorPhoto(vendorSlug, photo);
    markVendorProfileComplete(vendorSlug);
    safePush("tv-admin-notifications", {
      id: generateId("AN"),
      type: "vendor_update",
      message: `${form.businessName} updated their profile`,
      time: new Date().toISOString(),
      icon: "✏️",
    });
    showToast("Profile updated successfully", "success");
  }

  return (
    <div className="bg-ivory py-8 md:py-10" data-portal="true">
      <Container className="max-w-4xl">
        <BackButton href="/dashboard/vendor" label="Dashboard" className="mb-4" />
        <div className="rounded-[12px] border border-slate/8 bg-white p-6 shadow-soft md:p-8">
          <h1 className="font-display text-3xl text-burgundy-deep">Edit Vendor Profile</h1>

          {/* Photo upload */}
          <div className="mt-6 flex flex-wrap items-center gap-4 md:gap-5">
            <button
              type="button"
              aria-label="Change profile photo"
              onClick={() => photoInputRef.current?.click()}
              className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border-2 border-slate/15 bg-ivory-deep hover:border-burgundy/40 transition-colors"
            >
              {photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={photo} alt="Profile photo" className="h-full w-full object-cover" />
              ) : (
                <span className="flex h-full w-full items-center justify-center text-slate-soft">
                  <Camera size={24} />
                </span>
              )}
              <span className="absolute bottom-0 right-0 flex h-11 w-11 items-center justify-center rounded-full border-2 border-white bg-ink/75 text-white">
                <Camera size={13} aria-hidden="true" />
              </span>
            </button>
            <input
              ref={photoInputRef}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={handlePhotoChange}
              aria-label="Upload profile photo"
            />
            <div>
              <p className="flex items-center gap-2 text-sm font-semibold text-slate">
                Profile photo
                {photoPending && (
                  <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-800">
                    Pending admin review
                  </span>
                )}
              </p>
              <p className="mt-1 text-xs text-slate-soft">
                JPG or PNG — new photos go live after TRIBLEERA reviews them
              </p>
              <button
                type="button"
                onClick={() => photoInputRef.current?.click()}
                className="mt-2 inline-block py-1 text-xs font-semibold text-burgundy underline underline-offset-2 hover:text-burgundy-deep"
              >
                Upload photo
              </button>
            </div>
          </div>

          {/* Gallery photos — moderated before publishing (V-18) */}
          <div className="mt-8 border-t border-slate/8 pt-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="flex items-center gap-2 text-sm font-semibold text-slate">
                  Gallery photos
                  {galleryPendingCount > 0 && (
                    <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-800">
                      {galleryPendingCount} pending review
                    </span>
                  )}
                </p>
                <p className="mt-1 text-xs text-slate-soft">
                  Shown on your public profile after TRIBLEERA approves them — up to 6 per upload
                </p>
              </div>
              <Button variant="secondary" size="sm" icon={<ImagePlus size={14} />} onClick={() => galleryInputRef.current?.click()}>
                Add photos
              </Button>
              <input
                ref={galleryInputRef}
                type="file"
                accept="image/*"
                multiple
                className="sr-only"
                onChange={handleGalleryChange}
                aria-label="Upload gallery photos"
              />
            </div>
            {gallery.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-2.5 sm:grid-cols-6">
                {gallery.map((src, index) => (
                  <div key={index} className="group relative aspect-square overflow-hidden rounded-[8px] border border-slate/10">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt={`Gallery photo ${index + 1}`} className="h-full w-full object-cover" />
                    <button
                      type="button"
                      aria-label={`Remove gallery photo ${index + 1}`}
                      onClick={() => removeGalleryPhoto(index)}
                      className="absolute right-1 top-1 flex h-7 w-7 items-center justify-center rounded-full bg-ink/70 text-white opacity-0 transition-opacity hover:bg-danger group-hover:opacity-100"
                    >
                      <Trash2 size={12} aria-hidden="true" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Booking rules — service area + notice (V-22, V-23) */}
          <div className="mt-8 border-t border-slate/8 pt-6">
            <p className="text-sm font-semibold text-slate">Booking rules</p>
            <p className="mt-1 text-xs text-slate-soft">
              Requests outside your service area or below your notice period are flagged to customers before they book.
            </p>
            <div className="mt-4 grid gap-5 md:grid-cols-2">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-soft">Service areas</p>
                <div className="flex flex-wrap gap-2">
                  {SERVICE_AREA_OPTIONS.map((area) => {
                    const active = (form.serviceAreas ?? []).includes(area);
                    return (
                      <button
                        key={area}
                        type="button"
                        aria-pressed={active}
                        onClick={() => toggleServiceArea(area)}
                        className={cn(
                          "rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors",
                          active
                            ? "border-burgundy bg-burgundy text-white"
                            : "border-slate/20 bg-white text-slate-soft hover:border-burgundy/40 hover:text-burgundy"
                        )}
                      >
                        {area}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="max-w-[220px]">
                <Input
                  label="Minimum booking notice (days)"
                  type="number"
                  min={0}
                  max={365}
                  value={form.minNoticeDays ?? "30"}
                  onChange={(event) => setForm({ ...form, minNoticeDays: event.target.value })}
                  hint="e.g. 45 for large Tamil weddings"
                />
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <Input label="Business name" value={form.businessName} onChange={(event) => setForm({ ...form, businessName: event.target.value })} />
            <Input label="Tagline" value={form.tagline} onChange={(event) => setForm({ ...form, tagline: event.target.value })} />
            <div className="md:col-span-2">
              <Textarea label="Description" rows={5} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} hint={`${form.description.length} characters`} />
            </div>
            <Input label="Phone" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} />
            <Input label="Email" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
            <Input label="WhatsApp" value={form.whatsapp} onChange={(event) => setForm({ ...form, whatsapp: event.target.value })} />
            <Input label="City" value={form.city} onChange={(event) => setForm({ ...form, city: event.target.value })} />
            <Input label="Street / area" value={form.location} onChange={(event) => setForm({ ...form, location: event.target.value })} />
            <Input label="Experience years" type="number" value={form.experienceYears} onChange={(event) => setForm({ ...form, experienceYears: event.target.value })} />
            <Input label="Events completed" type="number" value={form.eventsCompleted} onChange={(event) => setForm({ ...form, eventsCompleted: event.target.value })} />
          </div>

          <div className="mt-6">
            <p className="text-sm font-semibold text-slate">Tags</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  aria-label={`Remove tag: ${tag}`}
                  onClick={() => setTags((prev) => prev.filter((item) => item !== tag))}
                  className="rounded-full bg-ivory px-3 py-1 text-xs font-semibold text-slate"
                >
                  {tag} ×
                </button>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap gap-3">
              <Input className="min-w-[100px] flex-1" value={tagInput} onChange={(event) => setTagInput(event.target.value)} placeholder="Add a tag and press Enter" onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  if (tagInput.trim() && tags.length < 5) {
                    setTags((prev) => [...prev, tagInput.trim()]);
                    setTagInput("");
                  }
                }
              }} />
            </div>
          </div>

          <Button className="mt-8 w-full md:w-auto" variant="gold" fullWidth onClick={saveProfile}>
            Save changes
          </Button>
        </div>
      </Container>
    </div>
  );
}
