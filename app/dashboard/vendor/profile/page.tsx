"use client";

import { useRef, useState } from "react";
import { Camera } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Field";
import { useToast } from "@/components/ui/Toast";
import { getVendorBySlug } from "@/lib/data/vendors";
import { readLocalStorage, writeLocalStorage } from "@/lib/utils/browser-storage";
import { BackButton } from "@/components/ui/BackButton";

const STORAGE_KEY = "TRIBLEERA-vendor-profile";
const PHOTO_KEY = "TRIBLEERA-vendor-photo";
const DEFAULT_VENDOR = getVendorBySlug("pushpa-florals-and-decor")!;

const DEFAULT_FORM = {
  businessName: DEFAULT_VENDOR.name,
  tagline: DEFAULT_VENDOR.tagline,
  description: DEFAULT_VENDOR.description,
  phone: DEFAULT_VENDOR.phone,
  email: "pushpa@example.com",
  whatsapp: DEFAULT_VENDOR.whatsapp,
  city: DEFAULT_VENDOR.city,
  location: DEFAULT_VENDOR.location,
  experienceYears: String(DEFAULT_VENDOR.experienceYears),
  eventsCompleted: String(DEFAULT_VENDOR.eventsCompleted),
};

export default function VendorProfilePage() {
  const { showToast } = useToast();
  const photoInputRef = useRef<HTMLInputElement>(null);
  const storedProfile =
    typeof window === "undefined"
      ? null
      : readLocalStorage<(typeof DEFAULT_FORM & { tags: string[] }) | null>(STORAGE_KEY, null);
  const [photo, setPhoto] = useState<string | null>(
    typeof window === "undefined" ? null : readLocalStorage<string | null>(PHOTO_KEY, null)
  );
  const [tags, setTags] = useState<string[]>(storedProfile?.tags ?? DEFAULT_VENDOR.tags);
  const [tagInput, setTagInput] = useState("");
  const [form, setForm] = useState(storedProfile ? { ...DEFAULT_FORM, ...storedProfile } : DEFAULT_FORM);

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setPhoto(dataUrl);
      writeLocalStorage(PHOTO_KEY, dataUrl);
    };
    reader.readAsDataURL(file);
  }

  function saveProfile() {
    writeLocalStorage(STORAGE_KEY, { ...form, tags });
    try {
      const notifs = JSON.parse(window.localStorage.getItem("TRIBLEERA-admin-notifications") ?? "[]");
      notifs.unshift({
        type: "vendor_update",
        message: `${form.businessName} updated their profile`,
        time: new Date().toISOString(),
        icon: "✏️",
      });
      window.localStorage.setItem("TRIBLEERA-admin-notifications", JSON.stringify(notifs.slice(0, 20)));
    } catch {
      // storage unavailable — profile save still succeeds
    }
    showToast("Profile updated successfully", "success");
  }

  return (
    <div className="bg-ivory py-10">
      <Container className="max-w-4xl">
        <BackButton href="/dashboard/vendor" label="Dashboard" className="mb-4" />
        <div className="rounded-[12px] border border-slate/8 bg-white p-6 shadow-soft md:p-8">
          <h1 className="font-display text-3xl text-burgundy-deep">Edit Vendor Profile</h1>

          {/* Photo upload */}
          <div className="mt-6 flex items-center gap-5">
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
              <span className="absolute bottom-0 inset-x-0 flex h-7 items-center justify-center bg-ink/60 text-white">
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
              <p className="text-sm font-semibold text-slate">Profile photo</p>
              <p className="mt-1 text-xs text-slate-soft">JPG or PNG, shown on your public listing</p>
              <button
                type="button"
                onClick={() => photoInputRef.current?.click()}
                className="mt-2 text-xs font-semibold text-burgundy underline underline-offset-2 hover:text-burgundy-deep"
              >
                Upload photo
              </button>
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
            <div className="mt-3 flex gap-3">
              <Input value={tagInput} onChange={(event) => setTagInput(event.target.value)} placeholder="Add a tag and press Enter" onKeyDown={(event) => {
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

          <Button className="mt-8" variant="gold" onClick={saveProfile}>
            Save changes
          </Button>
        </div>
      </Container>
    </div>
  );
}
