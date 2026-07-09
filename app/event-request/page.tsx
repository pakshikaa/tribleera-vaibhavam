"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowDown, ArrowUp, Check, CheckCircle2, Heart, ImageIcon, Mic, Square, Users, X } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Input, Select, Textarea } from "@/components/ui/Field";
import { StepProgress } from "@/components/ui/StepProgress";
import { SmartImage } from "@/components/ui/SmartImage";
import { useShortlist } from "@/context/ShortlistContext";
import { categories } from "@/lib/data/categories";
import { vendors } from "@/lib/data/vendors";
import { writeLocalStorage } from "@/lib/utils/browser-storage";
import { readActiveCustomerProfile } from "@/lib/utils/customer-profile";
import { formatLKR } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";
import { generateId, safeGet, safePush, safeSet } from "@/lib/utils/store";
import { BackButton } from "@/components/ui/BackButton";

const SERVICE_OPTIONS = ["photography", "cakes", "decoration", "bridal-makeup", "invitation"] as const;
const PRIORITIES = ["Quality", "Budget", "Availability", "Heritage Expertise", "Reviews"] as const;
const LOCATIONS = ["Jaffna", "Colombo", "Trincomalee", "Batticaloa", "Kandy", "Vavuniya", "Other"] as const;
const BUDGET_OPTIONS = [
  { value: "under-50k", label: "Under LKR 50,000", midpoint: 50000 },
  { value: "50k-150k", label: "LKR 50K-150K", midpoint: 100000 },
  { value: "150k-350k", label: "LKR 150K-350K", midpoint: 250000 },
  { value: "350k-plus", label: "LKR 350K+", midpoint: 400000 },
] as const;

const eventRequestSchema = z.object({
  eventDate: z.string().min(1).refine((value) => new Date(value).getTime() > Date.now(), "Must be a future date"),
  eventLocation: z.enum(LOCATIONS),
  guestCount: z.number().int().min(10, "At least 10 guests").max(5000),
  budgetRange: z.enum(["under-50k", "50k-150k", "150k-350k", "350k-plus"]),
  isFlexibleDate: z.boolean().optional(),
  selectedServices: z.array(z.enum(SERVICE_OPTIONS)).min(1, "Select at least one service"),
  priorities: z.array(z.enum(PRIORITIES)).max(3),
  specialRequirements: z.string().max(400).optional(),
});

type EventRequestValues = z.infer<typeof eventRequestSchema>;

const STEPS = ["Your Celebration", "Select Services", "Choose Vendors", "Review & Submit"];
const MAX_PRIORITY_VENDORS = 5;
type ServiceOption = (typeof SERVICE_OPTIONS)[number];

type ServiceVendorSelection = {
  categorySlug: ServiceOption;
  rankedVendorSlugs: string[];
  primaryVendorSlug: string;
};

function calculateAdvance(budgetRange: EventRequestValues["budgetRange"]) {
  const selected = BUDGET_OPTIONS.find((option) => option.value === budgetRange) ?? BUDGET_OPTIONS[1];
  const advance = Math.round(selected.midpoint * 0.2);
  const fee = Math.round(selected.midpoint * 0.03);

  return {
    midpoint: selected.midpoint,
    advance,
    fee,
    total: advance + fee,
  };
}

function createEventRequestRecord(
  formValues: EventRequestValues,
  hasVoiceNote: boolean,
  serviceSelections: ServiceVendorSelection[]
) {
  const createdAt = new Date().toISOString();
  const customerProfile = readActiveCustomerProfile();

  return {
    id: `EVT-${new Date(createdAt).getFullYear()}${createdAt.replace(/\D/g, "").slice(-5)}`,
    createdAt,
    customerId: `customer-${customerProfile.email.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    customerName: customerProfile.name,
    customerEmail: customerProfile.email,
    customerPhone: customerProfile.phone,
    status: "pending",
    deadline: new Date(new Date(createdAt).getTime() + 24 * 60 * 60 * 1000).toISOString(),
    hasVoiceNote,
    responses: [],
    serviceSelections,
    ...formValues,
  };
}

export default function EventRequestPage() {
  const router = useRouter();
  const { slugs: shortlistedVendorSlugs, hydrated: shortlistHydrated } = useShortlist();
  const [step, setStep] = useState(1);
  const [inspirationFiles, setInspirationFiles] = useState<File[]>([]);
  const [voiceBlob, setVoiceBlob] = useState<Blob | null>(null);
  const [voiceUrl, setVoiceUrl] = useState<string | null>(null);
  const [recording, setRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [serviceVendorPriorities, setServiceVendorPriorities] = useState<Record<string, string[]>>({});
  const [serviceSelectionError, setServiceSelectionError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const recordingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const today = new Date().toISOString().split("T")[0];
  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    control,
    formState: { errors, isSubmitting },
  } = useForm<EventRequestValues>({
    resolver: zodResolver(eventRequestSchema),
    defaultValues: {
      eventDate: "",
      eventLocation: "Jaffna",
      guestCount: 250,
      budgetRange: "50k-150k",
      isFlexibleDate: false,
      selectedServices: [],
      priorities: [],
      specialRequirements: "",
    },
  });

  const values = useWatch({
    control,
    defaultValue: {
      eventDate: "",
      eventLocation: "Jaffna",
      guestCount: 250,
      budgetRange: "50k-150k",
      isFlexibleDate: false,
      selectedServices: [],
      priorities: [],
      specialRequirements: "",
    },
  });
  const budgetRange = values.budgetRange ?? "50k-150k";
  const selectedServices = useMemo(() => values.selectedServices ?? [], [values.selectedServices]);
  const priorities = useMemo(() => values.priorities ?? [], [values.priorities]);
  const summary = useMemo(() => calculateAdvance(budgetRange), [budgetRange]);
  const vendorOptionsByService = useMemo(() => {
    const shortlistSet = new Set(shortlistedVendorSlugs);

    return selectedServices.reduce<Record<string, typeof vendors>>((acc, service) => {
      acc[service] = vendors
        .filter((vendor) => vendor.categorySlug === service && vendor.status === "approved")
        .sort((a, b) => {
          const aShortlisted = shortlistSet.has(a.slug) ? 1 : 0;
          const bShortlisted = shortlistSet.has(b.slug) ? 1 : 0;
          if (aShortlisted !== bShortlisted) return bShortlisted - aShortlisted;
          if (a.trustScore !== b.trustScore) return b.trustScore - a.trustScore;
          return a.startingPrice - b.startingPrice;
        });
      return acc;
    }, {});
  }, [selectedServices, shortlistedVendorSlugs]);

  const rankedSelections = useMemo(
    () =>
      selectedServices.map((service) => ({
        categorySlug: service,
        rankedVendorSlugs: serviceVendorPriorities[service] ?? [],
      })),
    [selectedServices, serviceVendorPriorities]
  );

  async function nextStep() {
    const fieldsByStep: Record<number, (keyof EventRequestValues)[]> = {
      1: ["eventDate", "eventLocation", "guestCount", "budgetRange"],
      2: ["selectedServices"],
      3: ["priorities", "specialRequirements"],
      4: [],
    };

    const valid = await trigger(fieldsByStep[step]);
    if (!valid) return;

    if (step === 3) {
      const missingSelections = selectedServices.filter((service) => (serviceVendorPriorities[service] ?? []).length === 0);
      if (missingSelections.length > 0) {
        setServiceSelectionError("Select at least one vendor for every chosen service.");
        return;
      }
    }

    setServiceSelectionError(null);
    setStep((current) => Math.min(current + 1, 4));
  }

  function toggleService(service: (typeof SERVICE_OPTIONS)[number]) {
    const current = selectedServices;
    const exists = current.includes(service);
    setServiceSelectionError(null);
    setValue(
      "selectedServices",
      exists ? current.filter((item) => item !== service) : [...current, service],
      { shouldValidate: true }
    );
    if (exists) {
      setServiceVendorPriorities((prev) => {
        const next = { ...prev };
        delete next[service];
        return next;
      });
    }
  }

  function togglePriority(priority: (typeof PRIORITIES)[number]) {
    const current = priorities;
    if (current.includes(priority)) {
      setValue(
        "priorities",
        current.filter((item) => item !== priority),
        { shouldValidate: true }
      );
      return;
    }

    if (current.length < 3) {
      setValue("priorities", [...current, priority], { shouldValidate: true });
    }
  }

  function toggleVendorPriority(categorySlug: ServiceOption, vendorSlug: string) {
    setServiceSelectionError(null);
    setServiceVendorPriorities((prev) => {
      const current = prev[categorySlug] ?? [];
      if (current.includes(vendorSlug)) {
        return { ...prev, [categorySlug]: current.filter((slug) => slug !== vendorSlug) };
      }
      if (current.length >= MAX_PRIORITY_VENDORS) {
        return prev;
      }
      return { ...prev, [categorySlug]: [...current, vendorSlug] };
    });
  }

  function moveVendorPriority(categorySlug: ServiceOption, vendorSlug: string, direction: "up" | "down") {
    setServiceVendorPriorities((prev) => {
      const current = [...(prev[categorySlug] ?? [])];
      const index = current.indexOf(vendorSlug);
      if (index === -1) return prev;
      const swapIndex = direction === "up" ? index - 1 : index + 1;
      if (swapIndex < 0 || swapIndex >= current.length) return prev;
      [current[index], current[swapIndex]] = [current[swapIndex], current[index]];
      return { ...prev, [categorySlug]: current };
    });
  }

  function saveForLater() {
    writeLocalStorage("TRIBLEERA-event-request-draft", values);
  }

  function stopRecording() {
    mediaRecorderRef.current?.stop();
    setRecording(false);
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
      recordingIntervalRef.current = null;
    }
  }

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      mediaRecorderRef.current = mr;
      chunksRef.current = [];
      mr.ondataavailable = (e) => chunksRef.current.push(e.data);
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setVoiceBlob(blob);
        setVoiceUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach((t) => t.stop());
        setRecordingSeconds(0);
      };
      mr.start();
      setRecording(true);
      recordingIntervalRef.current = setInterval(() => {
        setRecordingSeconds((s) => {
          if (s >= 120) {
            stopRecording();
            return 120;
          }
          return s + 1;
        });
      }, 1000);
    } catch {
      alert("Microphone access denied. Please allow microphone to record.");
    }
  }

  function deleteVoiceNote() {
    if (voiceUrl) URL.revokeObjectURL(voiceUrl);
    setVoiceBlob(null);
    setVoiceUrl(null);
  }

  const onSubmit = handleSubmit((formValues) => {
    const incompleteServices = selectedServices.filter((service) => (serviceVendorPriorities[service] ?? []).length === 0);
    if (incompleteServices.length > 0) {
      setServiceSelectionError("Select at least one vendor for every chosen service.");
      setStep(3);
      return;
    }

    const serviceSelections: ServiceVendorSelection[] = selectedServices.map((service) => ({
      categorySlug: service,
      rankedVendorSlugs: serviceVendorPriorities[service] ?? [],
      primaryVendorSlug: (serviceVendorPriorities[service] ?? [])[0],
    }));

    const record = createEventRequestRecord(formValues, Boolean(voiceBlob), serviceSelections);
    writeLocalStorage("TRIBLEERA-event-request", record);

    const bridgeRequest = {
      id: record.id,
      customerId: record.customerId,
      customerName: record.customerName,
      customerEmail: record.customerEmail,
      customerPhone: record.customerPhone,
      status: "pending" as const,
      submittedAt: record.createdAt,
      deadline: record.deadline,
      eventDate: formValues.eventDate,
      location: formValues.eventLocation,
      guestCount: formValues.guestCount,
      budgetRange: formValues.budgetRange,
      requirements: formValues.specialRequirements ?? "",
      selectedServices: formValues.selectedServices,
      serviceSelections,
      priorities: formValues.priorities ?? [],
      hasVoiceNote: Boolean(voiceBlob),
    };

    safePush("tv-requests", bridgeRequest);
    const inbox = safeGet<Record<string, unknown[]>>("tv-vendor-inbox", {});
    serviceSelections.forEach((selection) => {
      const firstVendorSlug = selection.primaryVendorSlug;
      if (!firstVendorSlug) return;
      if (!inbox[firstVendorSlug]) inbox[firstVendorSlug] = [];
      inbox[firstVendorSlug].unshift({
        ...bridgeRequest,
        id: `${record.id}-${selection.categorySlug}`,
        requestId: record.id,
        vendorSlug: firstVendorSlug,
        categorySlug: selection.categorySlug,
        rankedVendorSlugs: selection.rankedVendorSlugs,
        currentPriorityIndex: 0,
      });
    });
    safeSet("tv-vendor-inbox", inbox);

    safePush("tv-admin-notifications", {
      id: generateId("AN"),
      type: "request_submitted",
      message: `${record.customerName} submitted a request for ${serviceSelections.length} selected service${serviceSelections.length !== 1 ? "s" : ""}`,
      time: new Date().toISOString(),
      icon: "📨",
    });

    safePush("tv-notifications-cust-demo", {
      id: generateId("N"),
      type: "request_sent",
      title: "Your wedding request is live",
      message: `Your top-ranked vendors for ${formValues.selectedServices.length} service${formValues.selectedServices.length !== 1 ? "s" : ""} have been notified.`,
      href: "/dashboard/customer",
      read: false,
      createdAt: new Date().toISOString(),
    });

    router.push("/event-request/submitted");
  });

  return (
    <div className="bg-ink">
      <section className="border-b border-gold/10 bg-gradient-to-b from-burgundy-950 via-ink to-ink py-16">
        <Container className="space-y-8">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gold">TRIBLEERA Concierge Flow</p>
            <h1 className="mt-4 font-display text-4xl text-cream md:text-5xl">Tell Us About Your Celebration</h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-cream-dim">
              Share your date, city, services, and vendor priorities. We will route the request to your chosen premium vendors.
            </p>
          </div>
          <StepProgress steps={STEPS} current={step} />
        </Container>
      </section>

      <Container className="py-10 md:py-14">
        <form onSubmit={onSubmit} className="rounded-[10px] bg-white p-6 shadow-soft md:p-8">
          {step === 1 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:items-start">
                <Input
                  label="Wedding date"
                  id="eventDate"
                  type="date"
                  min={today}
                  required
                  aria-label="Wedding event date"
                  error={errors.eventDate?.message}
                  {...register("eventDate")}
                />
                <Select label="Celebration location" required error={errors.eventLocation?.message} {...register("eventLocation")}>
                  {LOCATIONS.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </Select>
                <Input
                  label="Estimated guest count"
                  type="number"
                  min={10}
                  required
                  error={errors.guestCount?.message}
                  {...register("guestCount", { valueAsNumber: true })}
                />
                <div className="rounded-[8px] border border-slate/10 bg-ivory p-4">
                  <p className="mb-3 flex items-center gap-2 text-sm font-medium text-slate">
                    <Users size={16} className="text-burgundy" />
                    Budget range
                  </p>
                  <div className="grid gap-2">
                    {BUDGET_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setValue("budgetRange", option.value, { shouldValidate: true })}
                        className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                          budgetRange === option.value
                            ? "border-burgundy bg-burgundy text-white"
                            : "border-slate/15 text-slate hover:border-burgundy"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <label className="flex items-center gap-3 text-sm text-slate">
                <input type="checkbox" {...register("isFlexibleDate")} className="h-4 w-4 rounded border-slate/20 accent-burgundy" />
                My dates are flexible within this month
              </label>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="font-display text-2xl text-slate">Select Services</h2>
                  <p className="text-sm text-slate-soft">{selectedServices.length} services selected</p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setValue(
                      "selectedServices",
                      selectedServices.length === SERVICE_OPTIONS.length ? [] : [...SERVICE_OPTIONS],
                      { shouldValidate: true }
                    )
                  }
                  className="text-sm font-semibold text-burgundy"
                >
                  {selectedServices.length === SERVICE_OPTIONS.length ? "Clear All" : "Select All"}
                </button>
              </div>
              {errors.selectedServices?.message && (
                <p className="text-sm font-medium text-danger">{errors.selectedServices.message}</p>
              )}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {categories
                  .filter((category) => SERVICE_OPTIONS.includes(category.slug as (typeof SERVICE_OPTIONS)[number]))
                  .map((category) => {
                    const selected = selectedServices.includes(category.slug as (typeof SERVICE_OPTIONS)[number]);
                    return (
                      <button
                        key={category.slug}
                        type="button"
                        onClick={() => toggleService(category.slug as (typeof SERVICE_OPTIONS)[number])}
                        className={`relative overflow-hidden rounded-[10px] border text-left transition-all ${
                          selected ? "border-burgundy shadow-lift" : "border-slate/10 hover:border-burgundy/30"
                        }`}
                      >
                        <div className="relative aspect-[4/3]">
                          <SmartImage
                            src={category.imageUrl}
                            alt={category.name}
                            fallbackVariant={category.motif}
                            fallbackTone={category.tone}
                            sizes="(max-width: 768px) 100vw, 33vw"
                          />
                          {selected && (
                            <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-gold text-ink">
                              <Check size={16} />
                            </span>
                          )}
                        </div>
                        <div className="p-4">
                          <p className="font-display text-lg text-slate">{category.name}</p>
                          <p className="text-sm text-slate-soft">{category.name}</p>
                        </div>
                      </button>
                    );
                  })}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="font-display text-2xl text-slate">Choose Vendors</h2>
                <p className="mt-1 text-sm text-slate-soft">
                  For each selected service, choose at least one vendor. Priority 1 receives the request first, and backup vendors are used only if needed.
                </p>
              </div>

              {serviceSelectionError && (
                <p className="text-sm font-medium text-danger">{serviceSelectionError}</p>
              )}

              <div className="space-y-6">
                {selectedServices.map((service) => {
                  const serviceCategory = categories.find((category) => category.slug === service);
                  const rankedVendorSlugs = serviceVendorPriorities[service] ?? [];
                  const rankedVendors = rankedVendorSlugs
                    .map((slug) => vendorOptionsByService[service]?.find((vendor) => vendor.slug === slug))
                    .filter((vendor): vendor is NonNullable<typeof vendor> => Boolean(vendor));
                  const serviceVendors = vendorOptionsByService[service] ?? [];

                  return (
                    <div key={service} className="rounded-[10px] border border-slate/10 bg-ivory/60 p-4 md:p-5">
                      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                        <div>
                          <h3 className="font-display text-xl text-slate">{serviceCategory?.name ?? service}</h3>
                          <p className="text-sm text-slate-soft">
                            Pick 1 to {MAX_PRIORITY_VENDORS} vendors. The first one is mandatory.
                          </p>
                        </div>
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-burgundy">
                          {rankedVendorSlugs.length}/{MAX_PRIORITY_VENDORS} selected
                        </p>
                      </div>

                      {rankedVendors.length > 0 && (
                        <div className="mt-4 rounded-[8px] border border-burgundy/15 bg-white p-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-burgundy">Priority queue</p>
                          <div className="mt-3 space-y-3">
                            {rankedVendors.map((vendor, index) => (
                              <div key={vendor.slug} className="flex flex-col gap-3 rounded-[8px] border border-slate/10 bg-ivory px-4 py-3 md:flex-row md:items-center md:justify-between">
                                <div className="flex items-center gap-3">
                                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-burgundy text-xs font-bold text-white">
                                    {index + 1}
                                  </span>
                                  <div>
                                    <p className="font-medium text-slate">{vendor.name}</p>
                                    <p className="text-xs text-slate-soft">
                                      {vendor.location} · {formatLKR(vendor.startingPrice)}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => moveVendorPriority(service, vendor.slug, "up")}
                                    disabled={index === 0}
                                    className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate/15 text-slate transition-colors hover:border-burgundy/30 hover:text-burgundy disabled:cursor-not-allowed disabled:opacity-30"
                                  >
                                    <ArrowUp size={14} />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => moveVendorPriority(service, vendor.slug, "down")}
                                    disabled={index === rankedVendors.length - 1}
                                    className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate/15 text-slate transition-colors hover:border-burgundy/30 hover:text-burgundy disabled:cursor-not-allowed disabled:opacity-30"
                                  >
                                    <ArrowDown size={14} />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => toggleVendorPriority(service, vendor.slug)}
                                    className="inline-flex items-center rounded-full border border-rose-200 px-3 py-1.5 text-xs font-semibold text-burgundy transition-colors hover:bg-rose-50"
                                  >
                                    Remove
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="mt-4">
                        <div className="mb-3 flex items-center justify-between gap-3">
                          <p className="text-sm font-semibold text-slate">
                            {shortlistHydrated && shortlistedVendorSlugs.some((slug) => serviceVendors.some((vendor) => vendor.slug === slug))
                              ? "Saved vendors come first"
                              : "Available vendors"}
                          </p>
                          <p className="text-xs text-slate-soft">Tap a vendor card to add or remove it from the queue</p>
                        </div>
                        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                          {serviceVendors.map((vendor) => {
                            const shortlisted = shortlistedVendorSlugs.includes(vendor.slug);
                            const priorityIndex = rankedVendorSlugs.indexOf(vendor.slug);

                            return (
                              <button
                                key={vendor.slug}
                                type="button"
                                onClick={() => toggleVendorPriority(service, vendor.slug)}
                                className={cn(
                                  "overflow-hidden rounded-[10px] border bg-white text-left transition-all",
                                  priorityIndex >= 0
                                    ? "border-burgundy shadow-lift"
                                    : "border-slate/10 hover:border-burgundy/20 hover:shadow-soft"
                                )}
                              >
                                <div className="relative aspect-[4/3]">
                                  <SmartImage
                                    src={vendor.imageUrl}
                                    alt={vendor.name}
                                    fallbackVariant={vendor.motif}
                                    fallbackTone={vendor.tone}
                                    fallbackSeed={vendor.id.length}
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                  />
                                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(21,4,12,0.04)_0%,rgba(21,4,12,0.08)_45%,rgba(21,4,12,0.7)_100%)]" />
                                  <div className="absolute left-3 top-3 flex gap-2">
                                    {shortlisted && (
                                      <span className="inline-flex items-center gap-1 rounded-full bg-white/92 px-2.5 py-1 text-[10.5px] font-semibold text-burgundy">
                                        <Heart size={11} className="fill-burgundy text-burgundy" /> Saved
                                      </span>
                                    )}
                                    {priorityIndex >= 0 && (
                                      <span className="inline-flex rounded-full bg-gold px-2.5 py-1 text-[10.5px] font-bold text-ink">
                                        Priority {priorityIndex + 1}
                                      </span>
                                    )}
                                  </div>
                                  <div className="absolute bottom-3 left-3 right-3">
                                    <p className="font-display text-base text-white">{vendor.name}</p>
                                    <p className="mt-1 text-xs text-white/78">{vendor.location}</p>
                                  </div>
                                </div>
                                <div className="space-y-3 p-4">
                                  <p className="line-clamp-2 text-sm text-slate-soft">{vendor.tagline}</p>
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm font-semibold text-burgundy-deep">
                                      {formatLKR(vendor.startingPrice)}
                                    </span>
                                    <span className="text-xs font-medium text-slate-soft">
                                      Trust {vendor.trustScore.toFixed(1)}
                                    </span>
                                  </div>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div>
                <h3 className="font-display text-xl text-slate">Routing preferences</h3>
                <p className="mt-1 text-sm text-slate-soft">Optional: tell us what matters most while routing your prioritized requests.</p>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {PRIORITIES.map((priority) => {
                  const selectedIndex = priorities.indexOf(priority);
                  return (
                    <button
                      key={priority}
                      type="button"
                      onClick={() => togglePriority(priority)}
                      className={`flex items-center justify-between rounded-[8px] border px-4 py-3 text-left transition-colors ${
                        selectedIndex >= 0 ? "border-burgundy bg-burgundy/[0.03]" : "border-slate/10 hover:border-burgundy/20"
                      }`}
                    >
                      <span className="font-medium text-slate">{priority}</span>
                      <span
                        className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
                          selectedIndex >= 0 ? "bg-gold text-ink" : "bg-ivory text-slate-soft"
                        }`}
                      >
                        {selectedIndex >= 0 ? selectedIndex + 1 : "•"}
                      </span>
                    </button>
                  );
                })}
              </div>
              <Textarea
                label="Special requirements / notes"
                rows={5}
                maxLength={400}
                hint="e.g. Need a vendor who speaks Tamil, travelling from Colombo..."
                error={errors.specialRequirements?.message}
                {...register("specialRequirements")}
              />
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate">
                  Inspiration images{" "}
                  <span className="font-normal text-slate-soft">(optional)</span>
                </label>
                <label className="flex cursor-pointer flex-col items-center gap-2 rounded-[8px] border border-dashed border-burgundy/30 bg-burgundy/[0.03] px-5 py-6 text-center transition-colors hover:bg-burgundy/[0.06]">
                  <ImageIcon size={22} className="text-burgundy/50" />
                  <span className="text-sm font-medium text-slate">Drop inspiration photos here or click to browse</span>
                  <span className="text-xs text-slate-soft">JPG, PNG, WebP — up to 5 images</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="sr-only"
                    onChange={(e) => {
                      const files = Array.from(e.target.files ?? []).slice(0, 5);
                      setInspirationFiles(files);
                    }}
                  />
                </label>
                {inspirationFiles.length > 0 && (
                  <p className="mt-2 text-xs text-slate-soft">
                    {inspirationFiles.length} file{inspirationFiles.length !== 1 ? "s" : ""} selected
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate">
                  Voice note
                  <span className="ml-1.5 text-xs font-normal text-slate-soft">
                    (optional — describe your vision in your own words)
                  </span>
                </label>

                {!voiceBlob ? (
                  <div className="flex items-center gap-3 rounded-[8px] border border-slate/20 bg-white p-4">
                    <button
                      type="button"
                      onClick={recording ? stopRecording : startRecording}
                      className={cn(
                        "flex h-12 w-12 shrink-0 items-center justify-center rounded-full font-medium transition-all",
                        recording ? "animate-pulse bg-red-500 text-white" : "bg-burgundy text-white hover:bg-burgundy-deep"
                      )}
                      aria-label={recording ? "Stop recording" : "Start voice recording"}
                    >
                      {recording ? <Square size={18} aria-hidden="true" /> : <Mic size={18} aria-hidden="true" />}
                    </button>
                    <div>
                      {recording ? (
                        <p className="text-sm font-semibold text-red-600">Recording... {recordingSeconds}s</p>
                      ) : (
                        <>
                          <p className="text-sm font-medium text-slate">Record a voice note</p>
                          <p className="text-[11px] text-slate-soft">Tap the mic and describe your ceremony details</p>
                        </>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 rounded-[8px] border border-success/30 bg-success-pale/30 p-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success text-white">
                      <CheckCircle2 size={18} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate">Voice note recorded ✓</p>
                      {voiceUrl && <audio src={voiceUrl} controls className="mt-1 h-8 w-full" />}
                    </div>
                    <button
                      type="button"
                      onClick={deleteVoiceNote}
                      className="text-slate-soft hover:text-red-500"
                      aria-label="Delete voice note"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}

                <p className="text-[11px] text-slate-soft">
                  Max 2 minutes. Helps vendors understand your Tamil ceremony requirements.
                </p>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="font-display text-2xl text-slate">Review & Submit</h2>
                <p className="mt-1 text-sm text-slate-soft">Confirm your request before it goes live to matched vendors.</p>
              </div>
              <div className="rounded-[10px] border border-slate/10 bg-ivory p-5">
                <div className="grid gap-4 md:grid-cols-2">
                  <p className="text-sm text-slate-soft">Date <span className="ml-2 font-medium text-slate">{values.eventDate}</span></p>
                  <p className="text-sm text-slate-soft">Location <span className="ml-2 font-medium text-slate">{values.eventLocation}</span></p>
                  <p className="text-sm text-slate-soft">Guests <span className="ml-2 font-medium text-slate">{values.guestCount}</span></p>
                  <p className="text-sm text-slate-soft">
                    Budget <span className="ml-2 font-medium text-slate">{BUDGET_OPTIONS.find((option) => option.value === budgetRange)?.label}</span>
                  </p>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {selectedServices.map((service) => (
                    <span key={service} className="rounded-full bg-burgundy px-3 py-1 text-xs font-semibold text-white">
                      {categories.find((category) => category.slug === service)?.name ?? service}
                    </span>
                  ))}
                </div>
                <div className="mt-5 space-y-3">
                  {rankedSelections.map((selection) => {
                    const category = categories.find((item) => item.slug === selection.categorySlug);
                    return (
                      <div key={selection.categorySlug} className="rounded-[8px] border border-slate/10 bg-white p-4">
                        <p className="text-sm font-semibold text-slate">{category?.name ?? selection.categorySlug}</p>
                        <p className="mt-2 text-xs text-slate-soft">
                          {selection.rankedVendorSlugs.length > 0
                            ? selection.rankedVendorSlugs
                                .map((slug, index) => `${index + 1}. ${vendors.find((vendor) => vendor.slug === slug)?.name ?? slug}`)
                                .join("  •  ")
                            : "No vendor selected"}
                        </p>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-5 rounded-[8px] border border-gold/30 bg-white p-4">
                  <p className="text-sm font-semibold text-burgundy-deep">Estimated amount payable now</p>
                  <div className="mt-3 space-y-2 text-sm text-slate-soft">
                    <p>Budget midpoint: <span className="font-medium text-slate">{formatLKR(summary.midpoint)}</span></p>
                    <p>Advance (20%): <span className="font-medium text-slate">{formatLKR(summary.advance)}</span></p>
                    <p>Platform fee (3%): <span className="font-medium text-slate">{formatLKR(summary.fee)}</span></p>
                    <p className="border-t border-slate/10 pt-2 text-base font-semibold text-burgundy-deep">
                      Total payable now: {formatLKR(summary.total)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 flex flex-col gap-3 border-t border-slate/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <Button type="button" variant="secondary" onClick={saveForLater}>
              Save for Later
            </Button>
            <div className="flex flex-wrap items-center justify-end gap-3">
              {step === 1 && (
                <BackButton href="/" label="Home" />
              )}
              {step > 1 && (
                <Button type="button" variant="secondary" onClick={() => setStep((current) => current - 1)}>
                  Back
                </Button>
              )}
              {step < 4 ? (
                <Button type="button" variant="gold" onClick={nextStep}>
                  Continue →
                </Button>
              ) : (
                <Button type="submit" variant="gold" disabled={isSubmitting} className="min-w-48">
                  {isSubmitting ? "Submitting..." : "Submit Request"}
                </Button>
              )}
            </div>
          </div>
        </form>
      </Container>
    </div>
  );
}
