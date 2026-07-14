"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Camera, CheckCircle2, Plus, X } from "lucide-react";
import { Input, Textarea } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils/cn";
import { MAX_PHOTO_BYTES, readImageAsDataUrl, validateImageFile } from "@/lib/utils/image-upload";
import { generateId, safePush } from "@/lib/utils/store";
import { markVendorProfileComplete, writeVendorPhoto, writeVendorProfile } from "@/lib/utils/vendorPortal";

type ApprovedVendor = {
  slug: string;
  businessName: string;
  tagline: string;
  about: string;
  experienceYears: number;
  startingPrice: number;
  profileComplete: boolean;
  [key: string]: unknown;
};

const STEPS = ["Add your photo", "Complete profile", "Set packages", "Go live"];

export default function VendorSetupPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState(0);
  const [vendor, setVendor] = useState<ApprovedVendor | null>(null);

  // Step 1
  const [photo, setPhoto] = useState<string | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  // Step 2
  const [tagline, setTagline] = useState("");
  const [about, setAbout] = useState("");
  const [experienceYears, setExperienceYears] = useState("0");
  const [startingPrice, setStartingPrice] = useState("15000");
  const [step2Errors, setStep2Errors] = useState<Record<string, string>>({});

  // Step 3
  const [pkgName, setPkgName] = useState("Essential Package");
  const [pkgPrice, setPkgPrice] = useState("45000");
  const [pkgTier, setPkgTier] = useState<"Essential" | "Signature" | "Heritage">("Essential");
  const [pkgDescription, setPkgDescription] = useState("");
  const [inclusion, setInclusionInput] = useState("");
  const [inclusions, setInclusions] = useState<string[]>([
    "Up to 6 hours coverage",
    "100 edited digital photos",
    "Online gallery access",
  ]);
  const [step3Errors, setStep3Errors] = useState<Record<string, string>>({});

  useEffect(() => {
    try {
      const slug = sessionStorage.getItem("vendor-slug");
      if (!slug) { router.replace("/vendor/login"); return; }
      const stored: ApprovedVendor[] = JSON.parse(
        localStorage.getItem("TRIBLEERA-approved-vendors") ?? "[]"
      );
      const v = stored.find((s) => s.slug === slug);
      if (v) {
        /* eslint-disable react-hooks/set-state-in-effect */
        setVendor(v);
        setTagline(v.tagline ?? "");
        setAbout(v.about ?? "");
        setExperienceYears(String(v.experienceYears ?? 0));
        setStartingPrice(String(v.startingPrice ?? 15000));
        /* eslint-enable react-hooks/set-state-in-effect */
      }
      const savedPhoto = localStorage.getItem(`TRIBLEERA-vendor-photo-${slug}`);
      if (savedPhoto) { setPhoto(savedPhoto); setPhotoPreview(savedPhoto); }
    } catch { router.replace("/vendor/login"); }
  }, [router]);

  async function handlePhotoFile(file: File) {
    const invalid = validateImageFile(file, MAX_PHOTO_BYTES);
    if (invalid) {
      showToast(invalid, "error");
      return;
    }
    setPhotoPreview(URL.createObjectURL(file));
    setPhoto(await readImageAsDataUrl(file));
  }

  function validateStep2() {
    const errs: Record<string, string> = {};
    if (tagline.trim().length < 10) errs.tagline = "Min 10 characters";
    if (about.trim().length < 30) errs.about = "Min 30 characters";
    if (isNaN(Number(experienceYears)) || Number(experienceYears) < 0) errs.experienceYears = "Enter a valid number";
    if (isNaN(Number(startingPrice)) || Number(startingPrice) < 1000) errs.startingPrice = "Minimum LKR 1,000";
    setStep2Errors(errs);
    return Object.keys(errs).length === 0;
  }

  function validateStep3() {
    const errs: Record<string, string> = {};
    if (pkgName.trim().length < 3) errs.pkgName = "Enter a package name";
    if (isNaN(Number(pkgPrice)) || Number(pkgPrice) < 1000) errs.pkgPrice = "Minimum LKR 1,000";
    if (inclusions.length < 1) errs.inclusions = "Add at least one inclusion";
    setStep3Errors(errs);
    return Object.keys(errs).length === 0;
  }

  function goNext() {
    if (step === 1 && !validateStep2()) return;
    if (step === 2 && !validateStep3()) return;
    if (step === 3) { handleComplete(); return; }
    setStep((s) => s + 1);
  }

  function handleComplete() {
    if (!vendor) return;
    const slug = vendor.slug;

    // Save photo
    if (photo) {
      writeVendorPhoto(slug, photo);
    }

    // Save profile data
    writeVendorProfile(slug, {
      businessName: vendor.businessName,
      tagline,
      description: about,
      phone: String(vendor.phone ?? ""),
      email: String(vendor.email ?? ""),
      whatsapp: String(vendor.whatsapp ?? vendor.phone ?? ""),
      city: String(vendor.city ?? ""),
      location: String(vendor.location ?? vendor.city ?? ""),
      experienceYears,
      eventsCompleted: String(vendor.eventsCompleted ?? "0"),
      tags: Array.isArray(vendor.tags) ? vendor.tags : [],
    });

    // Save first package
    const firstPackage = {
      id: `pkg-${Date.now()}`,
      name: pkgName,
      tier: pkgTier,
      price: Number(pkgPrice),
      description: pkgDescription,
      inclusions,
    };
    localStorage.setItem(
      `TRIBLEERA-vendor-packages-${slug}`,
      JSON.stringify([firstPackage])
    );

    // Mark profile complete
    try {
      const stored: ApprovedVendor[] = JSON.parse(
        localStorage.getItem("TRIBLEERA-approved-vendors") ?? "[]"
      );
      const updated = stored.map((v) =>
        v.slug === slug ? { ...v, tagline, about, experienceYears: Number(experienceYears), startingPrice: Number(startingPrice), profileComplete: true } : v
      );
      localStorage.setItem("TRIBLEERA-approved-vendors", JSON.stringify(updated));
    } catch {}
    markVendorProfileComplete(slug);

    safePush("tv-admin-notifications", {
      id: generateId("AN"),
      type: "vendor_update",
      message: `${vendor.businessName} completed vendor onboarding`,
      time: new Date().toISOString(),
      icon: "✏️",
    });

    router.push("/dashboard/vendor");
  }

  if (!vendor) return null;

  return (
    <div className="min-h-screen bg-ivory">
      <div className="mx-auto max-w-2xl px-5 py-12">
        {/* Header */}
        <div className="mb-8 flex items-center gap-3">
          <Image src="/logo/tribleera-mark-192.png" alt="TRIBLEERA" width={32} height={32} className="rounded-[6px]" />
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gold-deep">Vendor Portal</p>
            <p className="font-display text-lg font-semibold text-burgundy-deep">
              Welcome, {vendor.businessName}
            </p>
          </div>
        </div>

        {/* Step indicator */}
        <div className="mb-8 flex items-center">
          {STEPS.map((label, i) => (
            <div key={label} className="flex flex-1 items-center last:flex-none">
              <div className="flex flex-col items-center gap-1">
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors",
                    i < step ? "bg-burgundy text-white" : i === step ? "bg-burgundy text-white" : "bg-rose-pale text-rose"
                  )}
                >
                  {i < step ? <CheckCircle2 size={15} /> : i + 1}
                </div>
                <span className={cn("hidden text-[11px] font-medium sm:block", i === step ? "text-burgundy" : "text-slate-soft")}>
                  {label}
                </span>
              </div>
              {i !== STEPS.length - 1 && (
                <div className={cn("mx-2 h-[2px] flex-1 transition-colors", i < step ? "bg-burgundy" : "bg-rose-pale")} />
              )}
            </div>
          ))}
        </div>

        <div className="rounded-[12px] border border-slate/8 bg-white p-6 shadow-soft md:p-8">
          <h2 className="mb-6 font-display text-xl text-burgundy-deep">{STEPS[step]}</h2>

          {/* STEP 1 — Profile photo */}
          {step === 0 && (
            <div className="flex flex-col items-center gap-6">
              <p className="text-sm text-slate-soft">
                This photo appears on your public vendor card. Upload a professional portrait or your studio logo.
              </p>

              <button
                type="button"
                aria-label="Upload profile photo"
                onClick={() => photoInputRef.current?.click()}
                className="group relative h-48 w-48 overflow-hidden rounded-full border-2 border-dashed border-burgundy/25 bg-ivory-deep transition-colors hover:border-burgundy/50"
              >
                {photoPreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={photoPreview} alt="Profile preview" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center gap-2">
                    <Camera size={28} className="text-slate/40" />
                    <span className="text-xs text-slate/50">Upload photo</span>
                  </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                  <Camera size={24} className="text-white" />
                </div>
              </button>
              <input
                ref={photoInputRef}
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handlePhotoFile(f); }}
              />

              {photoPreview && (
                <p className="text-xs text-success">Photo selected — looking great!</p>
              )}

              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs text-slate-soft underline underline-offset-2 hover:text-slate"
              >
                Skip for now
              </button>
            </div>
          )}

          {/* STEP 2 — Service info */}
          {step === 1 && (
            <div className="space-y-4">
              <p className="text-sm text-slate-soft">
                Pre-filled from your registration — review and enhance before going live.
              </p>
              <Input
                label="Tagline"
                required
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="Timeless floral designs for your heritage celebration"
                hint="10–100 characters. Shown on your vendor card."
                error={step2Errors.tagline}
              />
              <Textarea
                label="About your business"
                required
                rows={5}
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                hint={`${about.length} / 600 characters`}
                error={step2Errors.about}
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Years of experience"
                  type="number"
                  min={0}
                  required
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(e.target.value)}
                  error={step2Errors.experienceYears}
                />
                <Input
                  label="Starting price (LKR)"
                  type="number"
                  min={1000}
                  required
                  value={startingPrice}
                  onChange={(e) => setStartingPrice(e.target.value)}
                  hint="Lowest package price shown publicly"
                  error={step2Errors.startingPrice}
                />
              </div>
            </div>
          )}

          {/* STEP 3 — First package */}
          {step === 2 && (
            <div className="space-y-4">
              <p className="text-sm text-slate-soft">
                Add your first package. You can add more from the Packages section later.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Package name"
                  required
                  value={pkgName}
                  onChange={(e) => setPkgName(e.target.value)}
                  placeholder="e.g. Essential Package"
                  error={step3Errors.pkgName}
                />
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate">
                    Tier <span className="text-danger">*</span>
                  </label>
                  <select
                    value={pkgTier}
                    onChange={(e) => setPkgTier(e.target.value as "Essential" | "Signature" | "Heritage")}
                    className="w-full rounded-[6px] border border-slate/20 bg-white px-3 py-2.5 text-sm text-slate focus:border-burgundy/40 focus:outline-none"
                  >
                    <option value="Essential">Essential</option>
                    <option value="Signature">Signature</option>
                    <option value="Heritage">Heritage</option>
                  </select>
                </div>
              </div>
              <Input
                label="Price (LKR)"
                type="number"
                min={1000}
                required
                value={pkgPrice}
                onChange={(e) => setPkgPrice(e.target.value)}
                error={step3Errors.pkgPrice}
              />
              <Textarea
                label="Package description"
                rows={2}
                value={pkgDescription}
                onChange={(e) => setPkgDescription(e.target.value)}
                placeholder="What's included in this package?"
              />

              <div>
                <label className="mb-2 block text-sm font-medium text-slate">
                  Inclusions <span className="text-danger">*</span>
                </label>
                <div className="mb-2 flex flex-wrap gap-2">
                  {inclusions.map((item, i) => (
                    <span
                      key={i}
                      className="flex items-center gap-1.5 rounded-full bg-ivory px-3 py-1 text-xs font-medium text-slate"
                    >
                      {item}
                      <button
                        type="button"
                        aria-label={`Remove ${item}`}
                        onClick={() => setInclusions((prev) => prev.filter((_, j) => j !== i))}
                        className="text-slate/50 hover:text-danger"
                      >
                        <X size={11} />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inclusion}
                    onChange={(e) => setInclusionInput(e.target.value)}
                    placeholder="Add an inclusion and press Enter"
                    className="flex-1 rounded-[6px] border border-slate/20 bg-white px-3 py-2 text-sm text-slate placeholder:text-slate/40 focus:border-burgundy/40 focus:outline-none"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        const val = inclusion.trim();
                        if (val && inclusions.length < 10) {
                          setInclusions((prev) => [...prev, val]);
                          setInclusionInput("");
                        }
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const val = inclusion.trim();
                      if (val && inclusions.length < 10) {
                        setInclusions((prev) => [...prev, val]);
                        setInclusionInput("");
                      }
                    }}
                    className="flex h-9 w-9 items-center justify-center rounded-[6px] bg-ivory hover:bg-ivory-deep"
                    aria-label="Add inclusion"
                  >
                    <Plus size={16} className="text-slate" />
                  </button>
                </div>
                {step3Errors.inclusions && (
                  <p className="mt-1 text-xs text-danger">{step3Errors.inclusions}</p>
                )}
              </div>
            </div>
          )}

          {/* STEP 4 — Go live */}
          {step === 3 && (
            <div className="space-y-4">
              <p className="text-sm text-slate-soft">
                Final review. You have completed the 4-step vendor onboarding flow:
                add your photo, complete your profile, set packages, and go live.
              </p>
              <div className="rounded-[10px] border border-success/20 bg-success-pale p-4">
                <ul className="space-y-2 text-sm text-slate">
                  <li>1. Photo ready {photo ? "for your profile" : "to be added later from profile settings"}.</li>
                  <li>2. Profile details prepared with your service summary and pricing.</li>
                  <li>3. First package configured with inclusions.</li>
                  <li>4. Go live will publish this setup to your vendor dashboard.</li>
                </ul>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="mt-8 flex items-center justify-between border-t border-slate/8 pt-5">
            {step > 0 ? (
              <Button type="button" variant="secondary" onClick={() => setStep(step - 1)}>
                Back
              </Button>
            ) : (
              <span />
            )}
            <Button variant={step === STEPS.length - 1 ? "primary" : "gold"} onClick={goNext}>
              {step === STEPS.length - 1 ? "Complete setup & go live" : "Next â†’"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
