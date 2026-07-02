"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, CheckCircle2, UploadCloud, X } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Input, Textarea, Select } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { categories } from "@/lib/data/categories";
import { vendorRegisterSchema, type VendorRegisterInput } from "@/lib/schemas";
import { cn } from "@/lib/utils/cn";
import { formatLKR } from "@/lib/utils/format";

const CITIES = ["Jaffna", "Colombo", "Trincomalee", "Batticaloa", "Kandy", "Vavuniya", "Other"] as const;

const STEPS = ["Your Identity", "Your Service", "Portfolio Upload", "Review & Agree"];

const STEP_FIELDS: (keyof VendorRegisterInput)[][] = [
  ["businessName", "ownerName", "phone", "whatsapp", "email"],
  ["category", "city", "location", "tagline", "about", "experienceYears", "startingPrice"],
  ["portfolioCount"],
  ["agreeTerms", "agreeEscrow"],
];

export default function VendorRegisterPage() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [portfolio, setPortfolio] = useState<File[]>([]);
  const [portfolioError, setPortfolioError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    trigger,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(vendorRegisterSchema),
    mode: "onBlur",
    defaultValues: {
      businessName: "",
      ownerName: "",
      phone: "",
      whatsapp: "",
      email: "",
      category: categories[0].slug,
      city: "Jaffna" as const,
      location: "",
      tagline: "",
      about: "",
      experienceYears: 0,
      startingPrice: 15000,
      portfolioCount: 0,
    },
  });

  const values = useWatch({ control });

  async function goNext() {
    const valid = await trigger(STEP_FIELDS[step] as (keyof VendorRegisterInput)[]);
    if (!valid) return;
    if (step === 2 && portfolio.length < 3) {
      setPortfolioError("Please upload at least 3 portfolio photos.");
      return;
    }
    setPortfolioError("");
    setStep((s) => s + 1);
  }

  function handleFiles(files: File[]) {
    const next = [...portfolio, ...files].slice(0, 12);
    setPortfolio(next);
    setValue("portfolioCount", next.length, { shouldValidate: true });
    setPortfolioError("");
  }

  function removeFile(index: number) {
    const next = portfolio.filter((_, i) => i !== index);
    setPortfolio(next);
    setValue("portfolioCount", next.length, { shouldValidate: false });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function onSubmit(data: any) {
    const slug = data.businessName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const application = {
      id: `APP-${Date.now()}`,
      submittedAt: new Date().toISOString(),
      status: "pending",
      slug,
      businessName: data.businessName,
      ownerName: data.ownerName,
      phone: data.phone,
      whatsapp: data.whatsapp,
      email: data.email,
      category: data.category,
      categorySlug: data.category,
      city: data.city,
      location: data.location,
      tagline: data.tagline,
      about: data.about,
      experienceYears: data.experienceYears,
      startingPrice: data.startingPrice,
      portfolioCount: data.portfolioCount,
    };

    try {
      const existing = JSON.parse(
        localStorage.getItem("triblerera-vendor-applications") ?? "[]"
      );
      existing.push(application);
      localStorage.setItem("triblerera-vendor-applications", JSON.stringify(existing));
    } catch {}

    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="bg-ivory min-h-screen">
        <Container className="py-20">
          <div className="mx-auto max-w-lg text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success-pale text-success">
              <CheckCircle2 size={32} />
            </div>
            <h1 className="mt-6 font-display text-3xl text-burgundy-deep">Application received</h1>
            <p className="mt-3 leading-relaxed text-slate-soft">
              Thank you, <strong>{values.businessName || "partner"}</strong>. We&rsquo;ll review your
              application within 24–48 hours. You&rsquo;ll receive credentials to{" "}
              <strong>{values.email || "your inbox"}</strong> once approved.
            </p>

            <div className="mt-8 rounded-[10px] border border-gold/20 bg-gold/[0.06] p-5 text-left">
              <p className="text-sm font-semibold text-slate">What happens next?</p>
              <ol className="mt-3 space-y-2.5 text-sm text-slate-soft">
                {[
                  "Our team reviews your portfolio and business details",
                  "If approved, you’ll receive your login credentials by email",
                  "Log in to complete your profile and add your packages",
                  "Your studio goes live on TRIBLERERA for couples to discover",
                ].map((step, i) => (
                  <li key={i} className="flex gap-2.5">
                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-gold/20 text-[10px] font-bold text-gold-deep">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button
                variant="secondary"
                onClick={() => {
                  setSubmitted(false);
                  setStep(0);
                  setPortfolio([]);
                }}
              >
                Register another studio
              </Button>
              <Button href="/" variant="primary">
                Back to home
              </Button>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="bg-ivory">
      <section className="border-b border-slate/8 bg-white py-10">
        <Container>
          <div className="mx-auto max-w-2xl">
            <p className="label-caps text-gold-deep">For Vendors</p>
            <h1 className="mt-2 font-display text-3xl text-burgundy-deep md:text-4xl">
              List your business on TRIBLERERA
            </h1>
            <p className="mt-2 text-slate-soft">
              Join a curated marketplace of Jaffna&rsquo;s most trusted wedding professionals.
            </p>
          </div>
        </Container>
      </section>

      <Container className="py-10 md:py-14">
        <div className="mx-auto max-w-2xl">
          {/* Step indicator */}
          <div className="mb-10 flex items-center">
            {STEPS.map((label, i) => (
              <div key={label} className="flex flex-1 items-center last:flex-none">
                <div className="flex flex-col items-center gap-1.5">
                  <div
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors",
                      i < step
                        ? "bg-burgundy text-white"
                        : i === step
                          ? "bg-burgundy text-white"
                          : "bg-rose-pale text-rose"
                    )}
                  >
                    {i < step ? <CheckCircle2 size={15} /> : i + 1}
                  </div>
                  <span
                    className={cn(
                      "hidden text-[11px] font-medium sm:block",
                      i === step ? "text-burgundy" : "text-slate-soft"
                    )}
                  >
                    {label}
                  </span>
                </div>
                {i !== STEPS.length - 1 && (
                  <div className={cn("mx-2 h-[2px] flex-1 transition-colors", i < step ? "bg-burgundy" : "bg-rose-pale")} />
                )}
              </div>
            ))}
          </div>

          {/* Progress bar */}
          <div className="mb-8 h-1.5 w-full overflow-hidden rounded-full bg-rose-pale">
            <div
              className="h-full rounded-full bg-burgundy transition-all duration-500"
              style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
            />
          </div>

          <form
            onSubmit={(e) => {
              if (step < STEPS.length - 1) {
                e.preventDefault();
                goNext();
              } else {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                handleSubmit(onSubmit as any)(e);
              }
            }}
            noValidate
            className="rounded-[10px] border border-slate/8 bg-white p-6 shadow-soft md:p-8"
          >
            <h2 className="mb-6 font-display text-xl text-burgundy-deep">{STEPS[step]}</h2>

            {/* STEP 1 — Identity */}
            {step === 0 && (
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    label="Business name"
                    required
                    placeholder="e.g. Sundari Silks Couture"
                    error={errors.businessName?.message}
                    {...register("businessName")}
                  />
                  <Input
                    label="Owner full name"
                    required
                    placeholder="e.g. Kavitha Rajasingham"
                    error={errors.ownerName?.message}
                    {...register("ownerName")}
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    label="Phone number"
                    type="tel"
                    required
                    placeholder="+94 77 410 0012"
                    error={errors.phone?.message}
                    {...register("phone")}
                  />
                  <Input
                    label="WhatsApp number"
                    type="tel"
                    required
                    placeholder="+94 77 410 0012"
                    error={errors.whatsapp?.message}
                    {...register("whatsapp")}
                  />
                </div>
                <Input
                  label="Email address"
                  type="email"
                  required
                  placeholder="studio@example.com"
                  error={errors.email?.message}
                  {...register("email")}
                />
              </div>
            )}

            {/* STEP 2 — Service */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Select
                    label="Primary category"
                    required
                    error={errors.category?.message}
                    {...register("category")}
                  >
                    {categories.map((c) => (
                      <option key={c.slug} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </Select>
                  <Select label="City" required error={errors.city?.message} {...register("city")}>
                    {CITIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </Select>
                </div>
                <Input
                  label="Street / area"
                  required
                  placeholder="e.g. Nallur, Jaffna"
                  error={errors.location?.message}
                  {...register("location")}
                />
                <Input
                  label="Tagline"
                  required
                  placeholder="e.g. Timeless floral designs for your heritage celebration"
                  error={errors.tagline?.message}
                  hint="10–100 characters. Shown on your vendor card."
                  {...register("tagline")}
                />
                <Textarea
                  label="About your business"
                  required
                  rows={4}
                  placeholder="What makes your work distinct? Notable weddings, specialities, awards…"
                  hint={`${(values.about as string | undefined)?.length ?? 0} / 600 characters`}
                  error={errors.about?.message}
                  {...register("about")}
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    label="Years of experience"
                    type="number"
                    min={0}
                    required
                    error={errors.experienceYears?.message}
                    {...register("experienceYears")}
                  />
                  <Input
                    label="Starting price (LKR)"
                    type="number"
                    min={1000}
                    required
                    placeholder="e.g. 45000"
                    error={errors.startingPrice?.message}
                    hint="Minimum package price shown publicly"
                    {...register("startingPrice")}
                  />
                </div>
              </div>
            )}

            {/* STEP 3 — Portfolio Upload */}
            {step === 2 && (
              <div className="space-y-4">
                <p className="text-sm text-slate-soft">
                  Upload your 3–12 best wedding photos. These will be reviewed by TRIBLERERA before
                  your profile goes live.
                </p>

                <label
                  className={cn(
                    "flex cursor-pointer flex-col items-center gap-2 rounded-[8px] border-2 border-dashed px-5 py-8 text-center transition-colors",
                    portfolio.length > 0
                      ? "border-burgundy/30 bg-burgundy/[0.03] hover:bg-burgundy/[0.06]"
                      : "border-slate/20 bg-white hover:border-burgundy/30 hover:bg-burgundy/[0.03]"
                  )}
                >
                  <UploadCloud size={24} className="text-slate/40" />
                  <span className="text-sm font-medium text-slate">
                    {portfolio.length === 0 ? "Click to upload photos" : "Add more photos"}
                  </span>
                  <span className="text-xs text-slate-soft">
                    JPG, PNG or WebP · {portfolio.length}/12 uploaded
                  </span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="sr-only"
                    onChange={(e) => handleFiles(Array.from(e.target.files ?? []))}
                  />
                </label>

                {portfolioError && (
                  <p className="text-sm text-danger">{portfolioError}</p>
                )}

                {portfolio.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                    {portfolio.map((file, i) => (
                      <div key={i} className="group relative aspect-square overflow-hidden rounded-[6px] bg-ivory-deep">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Portfolio ${i + 1}`}
                          className="h-full w-full object-cover"
                        />
                        <button
                          type="button"
                          aria-label={`Remove photo ${i + 1}`}
                          onClick={() => removeFile(i)}
                          className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-ink/70 text-white opacity-0 transition-opacity group-hover:opacity-100"
                        >
                          <X size={10} />
                        </button>
                        {i < 3 && (
                          <span className="absolute bottom-0 inset-x-0 bg-burgundy/80 py-0.5 text-center text-[9px] font-bold text-white">
                            Required
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <p className="text-xs text-slate-soft">
                  At least 3 required · {12 - portfolio.length} more allowed ·
                  Photos are reviewed privately and never shared without approval
                </p>
              </div>
            )}

            {/* STEP 4 — Review & Agree */}
            {step === 3 && (
              <div className="space-y-5">
                <p className="text-sm text-slate-soft">
                  Review your application before submitting for approval.
                </p>

                <dl className="divide-y divide-slate/8 overflow-hidden rounded-[8px] border border-slate/8 text-sm">
                  {[
                    ["Business name", values.businessName],
                    ["Owner", values.ownerName],
                    ["Phone", values.phone],
                    ["WhatsApp", values.whatsapp],
                    ["Email", values.email],
                    ["Category", categories.find((c) => c.slug === values.category)?.name ?? "—"],
                    ["City", values.city],
                    ["Location", values.location],
                    ["Tagline", values.tagline],
                    ["Experience", values.experienceYears ? `${values.experienceYears} years` : "0"],
                    ["Starting price", values.startingPrice ? formatLKR(Number(values.startingPrice)) : "—"],
                    ["Portfolio", `${portfolio.length} photo${portfolio.length !== 1 ? "s" : ""} uploaded`],
                  ].map(([label, value]) => (
                    <div key={label as string} className="flex flex-wrap justify-between px-4 py-2.5">
                      <dt className="text-slate-soft">{label}</dt>
                      <dd className="font-medium text-slate">{value || "—"}</dd>
                    </div>
                  ))}
                </dl>

                <div className="space-y-3 rounded-[8px] border border-slate/8 bg-ivory p-4">
                  <label className="flex cursor-pointer gap-3">
                    <input
                      type="checkbox"
                      className="mt-0.5 h-4 w-4 rounded accent-burgundy"
                      {...register("agreeTerms")}
                    />
                    <span className="text-sm text-slate">
                      I agree to TRIBLERERA&rsquo;s{" "}
                      <Link href="/terms" target="_blank" className="text-burgundy underline underline-offset-2">
                        vendor terms and platform guidelines
                      </Link>
                    </span>
                  </label>
                  {errors.agreeTerms && (
                    <p className="ml-7 text-xs text-danger">{errors.agreeTerms.message}</p>
                  )}

                  <label className="flex cursor-pointer gap-3">
                    <input
                      type="checkbox"
                      className="mt-0.5 h-4 w-4 rounded accent-burgundy"
                      {...register("agreeEscrow")}
                    />
                    <span className="text-sm text-slate">
                      I understand that TRIBLERERA holds customer advances in{" "}
                      <Link href="/trust" target="_blank" className="text-burgundy underline underline-offset-2">
                        escrow
                      </Link>{" "}
                      and releases them after service completion
                    </span>
                  </label>
                  {errors.agreeEscrow && (
                    <p className="ml-7 text-xs text-danger">{errors.agreeEscrow.message}</p>
                  )}
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="mt-8 flex items-center justify-between border-t border-slate/8 pt-5">
              {step > 0 ? (
                <Button
                  type="button"
                  variant="secondary"
                  icon={<ArrowLeft size={15} />}
                  onClick={() => setStep(step - 1)}
                >
                  Back
                </Button>
              ) : (
                <Link
                  href="/"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-soft transition-all hover:-translate-x-0.5 hover:text-burgundy"
                >
                  <ArrowLeft size={15} /> Home
                </Link>
              )}
              <Button
                type="submit"
                variant={step === STEPS.length - 1 ? "primary" : "gold"}
                disabled={isSubmitting}
                iconRight={step < STEPS.length - 1 ? <ArrowRight size={15} /> : undefined}
              >
                {step < STEPS.length - 1
                  ? "Continue"
                  : isSubmitting
                    ? "Submitting…"
                    : "Submit application"}
              </Button>
            </div>
          </form>
        </div>
      </Container>
    </div>
  );
}
