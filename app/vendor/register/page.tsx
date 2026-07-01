"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, ArrowRight, ArrowLeft, UploadCloud } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Input, Textarea, Select } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { categories } from "@/lib/data/categories";
import { vendorRegisterSchema, type VendorRegisterInput } from "@/lib/schemas";
import { cn } from "@/lib/utils/cn";

const STEPS = ["Business details", "Category & location", "Review & submit"];
const STEP_FIELDS: (keyof VendorRegisterInput)[][] = [
  ["businessName", "ownerName", "phone", "email"],
  ["category", "city", "experienceYears", "about"],
  [],
];

export default function VendorRegisterPage() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [portfolio, setPortfolio] = useState<File[]>([]);
  const [portfolioError, setPortfolioError] = useState("");

  const {
    register,
    handleSubmit,
    trigger,
    control,
    formState: { errors, isSubmitting },
  } = useForm<VendorRegisterInput>({
    resolver: zodResolver(vendorRegisterSchema),
    mode: "onBlur",
    defaultValues: {
      businessName: "",
      ownerName: "",
      phone: "",
      email: "",
      category: categories[0].slug,
      city: "",
      experienceYears: 0,
      about: "",
    },
  });

  const values = useWatch({
    control,
    defaultValue: {
      businessName: "",
      ownerName: "",
      phone: "",
      email: "",
      category: categories[0].slug,
      city: "",
      experienceYears: 0,
      about: "",
    },
  });

  async function goNext() {
    const valid = await trigger(STEP_FIELDS[step]);
    if (!valid) return;
    if (step === 1 && portfolio.length < 3) {
      setPortfolioError("Please upload at least 3 portfolio images.");
      return;
    }
    setPortfolioError("");
    setStep((s) => s + 1);
  }

  function onSubmit() {
    // Application is queued for admin review — see lib/data/users.ts vendorApplications
    // for how pending vendors surface in /dashboard/admin/vendors once a backend exists.
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <Container className="py-20">
        <div className="mx-auto max-w-md text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success-pale text-success">
            <CheckCircle2 size={32} />
          </div>
          <h1 className="mt-6 font-display text-2xl">Application submitted</h1>
          <p className="mt-3 text-sm text-slate-soft">
            Thank you, {values.businessName || "partner"}. Our team typically reviews new vendor applications within
            24&ndash;48 hours. You&rsquo;ll receive an email at <strong>{values.email || "your inbox"}</strong> once approved.
          </p>
          <Button href="/" className="mt-7">
            Back to home
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <div className="bg-ivory">
      <section className="border-b border-slate/8 bg-white py-10 md:py-14">
        <Container>
          <SectionHeading
            eyebrow="For Vendors"
            title="List your business on TRIBLERERA."
            description="Join a curated marketplace of Jaffna's most trusted wedding professionals."
          />
        </Container>
      </section>

      <Container className="py-10 md:py-14">
        <div className="mx-auto max-w-2xl">
          <div className="mb-10 flex items-center">
            {STEPS.map((label, i) => (
              <div key={label} className="flex flex-1 items-center last:flex-none">
                <div className="flex flex-col items-center gap-1.5">
                  <div
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold",
                      i <= step ? "bg-burgundy text-white" : "bg-rose-pale text-rose"
                    )}
                  >
                    {i + 1}
                  </div>
                  <span className={cn("hidden text-[11px] font-medium sm:block", i === step ? "text-burgundy" : "text-slate-soft")}>
                    {label}
                  </span>
                </div>
                {i !== STEPS.length - 1 && (
                  <div className={cn("mx-2 h-[2px] flex-1", i < step ? "bg-burgundy" : "bg-rose")} />
                )}
              </div>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              if (step < STEPS.length - 1) {
                e.preventDefault();
                goNext();
              } else {
                handleSubmit(onSubmit as (v: VendorRegisterInput) => void)(e);
              }
            }}
            noValidate
            className="space-y-6 rounded-[8px] border border-slate/8 bg-white p-6 shadow-soft md:p-8"
          >
            {step === 0 && (
              <>
                <Input
                  label="Business name"
                  required
                  placeholder="e.g. Sundari Silks Couture"
                  error={errors.businessName?.message}
                  {...register("businessName")}
                />
                <Input label="Owner / contact name" required error={errors.ownerName?.message} {...register("ownerName")} />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input
                    label="Phone number"
                    type="tel"
                    required
                    placeholder="+94 77 410 0012"
                    error={errors.phone?.message}
                    {...register("phone")}
                  />
                  <Input
                    label="Email address"
                    type="email"
                    required
                    error={errors.email?.message}
                    {...register("email")}
                  />
                </div>
              </>
            )}

            {step === 1 && (
              <>
                <Select label="Primary category" required error={errors.category?.message} {...register("category")}>
                  {categories.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </Select>
                <Input
                  label="City / service area"
                  required
                  placeholder="e.g. Jaffna"
                  error={errors.city?.message}
                  {...register("city")}
                />
                <Input
                  label="Years of experience"
                  type="number"
                  min={0}
                  required
                  error={errors.experienceYears?.message}
                  {...register("experienceYears")}
                />
                <Textarea
                  label="Tell us about your business"
                  required
                  rows={4}
                  placeholder="What makes your work distinct? Notable weddings, specialities, awards…"
                  hint="At least 20 characters."
                  error={errors.about?.message}
                  {...register("about")}
                />
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate">
                    Portfolio images <span className="text-danger">*</span>{" "}
                    <span className="font-normal text-slate-soft">(minimum 3)</span>
                  </label>
                  <label className="flex cursor-pointer flex-col items-center gap-2 rounded-[8px] border border-dashed border-burgundy/30 bg-burgundy/[0.03] px-5 py-6 text-center transition-colors hover:bg-burgundy/[0.06]">
                    <UploadCloud size={22} className="text-burgundy/50" />
                    <span className="text-sm font-medium text-slate">Upload your best work</span>
                    <span className="text-xs text-slate-soft">JPG, PNG, WebP — upload at least 3 photos</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="sr-only"
                      onChange={(e) => {
                        const files = Array.from(e.target.files ?? []);
                        setPortfolio(files);
                        setPortfolioError("");
                      }}
                    />
                  </label>
                  {portfolio.length > 0 && (
                    <p className="mt-2 text-xs text-slate-soft">
                      {portfolio.length} file{portfolio.length !== 1 ? "s" : ""} selected
                    </p>
                  )}
                  {portfolioError && (
                    <p className="mt-1 text-sm text-danger">{portfolioError}</p>
                  )}
                </div>
              </>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <p className="text-sm text-slate-soft">Review your details before submitting for approval.</p>
                <dl className="divide-y divide-slate/8 rounded-lg border border-slate/8">
                  {[
                    ["Business name", values.businessName],
                    ["Owner", values.ownerName],
                    ["Phone", values.phone],
                    ["Email", values.email],
                    ["Category", categories.find((c) => c.slug === values.category)?.name],
                    ["City", values.city],
                    ["Experience", values.experienceYears ? `${values.experienceYears} years` : ""],
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between px-4 py-2.5 text-sm">
                      <dt className="text-slate-soft">{label}</dt>
                      <dd className="font-medium text-slate">{value || "—"}</dd>
                    </div>
                  ))}
                </dl>
                <p className="text-xs text-slate-soft">
                  By submitting, you agree that a TRIBLERERA admin will review your application before your profile
                  goes live to customers.
                </p>
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              {step > 0 ? (
                <Button type="button" variant="secondary" icon={<ArrowLeft size={15} />} onClick={() => setStep(step - 1)}>
                  Back
                </Button>
              ) : (
                <span />
              )}
              <Button type="submit" disabled={isSubmitting} iconRight={step < STEPS.length - 1 ? <ArrowRight size={15} /> : undefined}>
                {step < STEPS.length - 1 ? "Continue" : isSubmitting ? "Submitting…" : "Submit application"}
              </Button>
            </div>
          </form>
        </div>
      </Container>
    </div>
  );
}
