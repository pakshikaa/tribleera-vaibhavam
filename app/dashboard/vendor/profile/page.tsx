"use client";

import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Field";
import { useToast } from "@/components/ui/Toast";
import { getVendorBySlug } from "@/lib/data/vendors";
import { readLocalStorage, writeLocalStorage } from "@/lib/utils/browser-storage";

const STORAGE_KEY = "triblerera-vendor-profile";
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
  const storedProfile =
    typeof window === "undefined"
      ? null
      : readLocalStorage<(typeof DEFAULT_FORM & { tags: string[] }) | null>(STORAGE_KEY, null);
  const [tags, setTags] = useState<string[]>(storedProfile?.tags ?? DEFAULT_VENDOR.tags);
  const [tagInput, setTagInput] = useState("");
  const [form, setForm] = useState(storedProfile ? { ...DEFAULT_FORM, ...storedProfile } : DEFAULT_FORM);

  function saveProfile() {
    writeLocalStorage(STORAGE_KEY, { ...form, tags });
    showToast("Profile updated successfully", "success");
  }

  return (
    <div className="bg-ivory py-10">
      <Container className="max-w-4xl">
        <div className="rounded-[12px] border border-slate/8 bg-white p-6 shadow-soft md:p-8">
          <h1 className="font-display text-3xl text-burgundy-deep">Edit Vendor Profile</h1>
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
