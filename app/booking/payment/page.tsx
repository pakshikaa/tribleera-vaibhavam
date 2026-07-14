"use client";

import { ChangeEvent, useEffect, useId, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, ShieldCheck, ShoppingBag, CreditCard, Landmark, Smartphone, Check, Copy, Clock } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Field";
import { EmptyState } from "@/components/ui/EmptyState";
import { BookingSteps } from "@/components/booking/BookingSteps";
import { PriceSummary } from "@/components/booking/PriceSummary";
import { useToast } from "@/components/ui/Toast";
import { formatLKR } from "@/lib/utils/format";
import { lineItemBreakdown, generateBookingId } from "@/lib/utils/booking";
import { getCategoryBySlug } from "@/lib/data/categories";
import { useCart } from "@/context/CartContext";
import { customerDetailsSchema, type CustomerDetailsValues } from "@/lib/schemas";
import { BackButton } from "@/components/ui/BackButton";
import { generateId, safePush } from "@/lib/utils/store";
import { checkVendorBookable } from "@/lib/utils/availability";

interface VendorResponseSelection {
  requestId?: string;
  vendorSlug?: string;
  categorySlug?: string;
  status?: "accepted" | "rejected" | "pending";
}

const PAYMENT_METHODS = [
  {
    id: "card",
    label: "Credit / Debit Card",
    description: "Visa, Mastercard and Amex accepted.",
    icon: CreditCard,
  },
  {
    id: "bank",
    label: "Online Bank Transfer",
    description: "Direct transfer via your bank's online portal.",
    icon: Landmark,
  },
  {
    id: "wallet",
    label: "Mobile Wallet",
    description: "Pay instantly via eZ Cash, FriMi or Genie.",
    icon: Smartphone,
  },
] as const;

export default function PaymentSummaryPage() {
  const router = useRouter();
  const { items, totals, clear, hydrated } = useCart();
  const { showToast } = useToast();
  const [method, setMethod] = useState<(typeof PAYMENT_METHODS)[number]["id"]>("card");
  const [slipUploaded, setSlipUploaded] = useState(false);
  const [slipPreview, setSlipPreview] = useState<string | null>(null);
  const [slipDataUrl, setSlipDataUrl] = useState<string | null>(null);
  const [slipMimeType, setSlipMimeType] = useState<string | null>(null);
  const [slipName, setSlipName] = useState("");
  const [bankTransferReference, setBankTransferReference] = useState("");
  const fileInputId = useId();
  const selectedCategory = items[0]?.categorySlug;
  const acceptedSelection = (() => {
    if (typeof window === "undefined") return null;
    try {
      const selected = JSON.parse(
        window.localStorage.getItem("TRIBLEERA-payment-selection") ?? "null"
      ) as VendorResponseSelection | null;
      if (selected?.status === "accepted") return selected;

      const responses = JSON.parse(
        window.localStorage.getItem("tv-responses") ?? "[]"
      ) as VendorResponseSelection[];
      return responses.find(
        (response) =>
          response.status === "accepted" &&
          (!selectedCategory || response.categorySlug === selectedCategory)
      ) ?? null;
    } catch {
      return null;
    }
  })();

  // A vendor request exists (any status) — the customer arrived from the
  // event-request flow and is legitimately waiting, even with an empty cart.
  const hasVendorRequest = (() => {
    if (typeof window === "undefined") return false;
    try {
      if (window.localStorage.getItem("TRIBLEERA-payment-selection")) return true;
      const responses = JSON.parse(
        window.localStorage.getItem("tv-responses") ?? "[]"
      ) as VendorResponseSelection[];
      return responses.length > 0;
    } catch {
      return false;
    }
  })();

  // Nothing in the cart and no vendor request behind it — there is nothing to
  // pay for, so send them back to the cart (which forwards on to /vendors).
  const nothingToPayFor = hydrated && items.length === 0 && !acceptedSelection && !hasVendorRequest;

  useEffect(() => {
    if (nothingToPayFor) router.replace("/booking/cart");
  }, [nothingToPayFor, router]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CustomerDetailsValues>({
    resolver: zodResolver(customerDetailsSchema),
    mode: "onBlur",
    defaultValues: { name: "", phone: "", email: "", eventDate: "" },
  });

  function handleSlipChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      setSlipUploaded(false);
      setSlipPreview(null);
      setSlipDataUrl(null);
      setSlipMimeType(null);
      setSlipName("");
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
    if (!allowedTypes.includes(file.type) || file.size > 5 * 1024 * 1024) {
      showToast("Upload a JPG, PNG, or PDF under 5MB.", "error");
      setSlipUploaded(false);
      setSlipPreview(null);
      setSlipDataUrl(null);
      setSlipMimeType(null);
      setSlipName("");
      return;
    }

    setSlipUploaded(true);
    setSlipName(file.name);
    setSlipMimeType(file.type);

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = typeof reader.result === "string" ? reader.result : null;
      setSlipDataUrl(dataUrl);
      setSlipPreview(file.type === "application/pdf" ? null : dataUrl);
    };
    reader.readAsDataURL(file);
  }

  function onSubmit(values: CustomerDetailsValues) {
    // Enforce each vendor's live availability, notice period and service
    // area before taking money (V-21, V-22, V-23).
    for (const item of items) {
      const check = checkVendorBookable(item.vendorId, item.vendorName, values.eventDate);
      if (!check.ok) {
        showToast(check.message ?? `${item.vendorName} cannot take this date.`, "error");
        return;
      }
    }

    const bookingId = generateBookingId();
    const submittedAt = new Date().toISOString();
    const record = {
      id: bookingId,
      bookingId,
      items,
      totals,
      customer: values,
      customerName: values.name,
      customerCity: "Jaffna",
      eventDate: values.eventDate,
      paymentMethod: method,
      bankTransferReference: bankTransferReference || bankReference,
      depositSlipName: slipName || null,
      depositSlipDataUrl: slipDataUrl,
      depositSlipMimeType: slipMimeType,
      createdAt: submittedAt,
      submittedAt,
      status: "pending" as const,
      adminVerified: false,
    };
    try {
      window.localStorage.setItem("TRIBLEERA-last-booking", JSON.stringify(record));
    } catch {
      // session-only fallback; confirmation page handles a missing record gracefully
    }

    safePush("tv-payments-pending", record);

    safePush("tv-admin-notifications", {
      id: generateId("AN"),
      type: "payment",
      message: `New payment: ${values.name} — ${formatLKR(totals.payableNow)} [${method}]`,
      time: submittedAt,
      icon: "💳",
      urgent: true,
    });

    safePush("tv-notifications-cust-demo", {
      id: generateId("N"),
      type: "payment_submitted",
      title: "Payment submitted",
      message: "Your advance payment is being verified by the TRIBLEERA team.",
      href: "/booking/confirmation",
      read: false,
      createdAt: submittedAt,
    });

    return new Promise<void>((resolve) => {
      setTimeout(() => {
        clear();
        router.push("/booking/confirmation");
        resolve();
      }, 900);
    });
  }

  if (nothingToPayFor) {
    // Redirecting to /booking/cart — this only paints for a frame.
    return (
      <Container className="px-5 py-20">
        <p className="text-center text-sm text-slate-soft" aria-live="polite">
          Nothing to pay for yet — taking you back to your cart…
        </p>
      </Container>
    );
  }

  if (hydrated && items.length === 0 && !acceptedSelection) {
    return (
      <Container className="px-5 py-20">
        <div className="mx-auto max-w-[520px] text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
            <Clock size={28} color="#D97706" />
          </div>
          <h2 className="text-xl font-bold text-slate">Awaiting vendor confirmation</h2>
          <p className="mt-2 text-sm leading-7 text-slate-soft">
            Your request has been sent. Payment will be enabled once the vendor confirms
            availability for your event.
          </p>
          <div className="mt-6 rounded-[8px] border border-amber-200 bg-amber-50 px-4 py-4 text-left text-[13px] text-amber-900">
            <strong>What happens next:</strong>
            <ol className="mt-2 list-decimal space-y-1 pl-5">
              <li>Vendor reviews your request within 24 hours</li>
              <li>If accepted, you will get a notification</li>
              <li>Return here to pay the 20% advance</li>
              <li>Vendor contact details unlock after payment</li>
            </ol>
          </div>
          <Button href="/dashboard/customer" className="mt-6" variant="primary">
            View in my dashboard →
          </Button>
        </div>
      </Container>
    );
  }

  if (hydrated && items.length === 0) {
    return (
      <Container className="py-16">
        <EmptyState
          icon={<ShoppingBag size={32} />}
          title="Nothing to pay for yet"
          description="Add a vendor package to your cart before continuing to payment."
          action={<Button href="/services">Browse services</Button>}
        />
      </Container>
    );
  }

  const bankReference = items[0]?.vendorId ? `${items[0].vendorId.slice(0, 3).toUpperCase()}-${items.length}` : "TRB-REF";
  const submitLabel =
    method === "bank" ? "Submit Booking & Deposit Slip" : `Pay ${formatLKR(totals.payableNow)} securely`;
  const bankSubmissionBlocked = method === "bank" && (!slipUploaded || !bankTransferReference.trim());

  return (
    <div className="bg-ivory">
      <section className="border-b border-slate/8 bg-white py-8 md:py-10">
        <Container>
          <BackButton href="/booking/cart" label="Cart" className="mb-4" />
          <SectionHeading eyebrow="Step 3 of 4" title="Payment summary" className="mb-6" />
          <BookingSteps current={3} />
        </Container>
      </section>

      <Container className="py-10 md:py-14">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1fr_380px]">
          <form id="payment-form" onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-10">
            <div>
              <h2 className="font-display text-xl">Your details</h2>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input label="Full name" required placeholder="Niranjala & Kajan" error={errors.name?.message} {...register("name")} />
                <Input label="Phone number" type="tel" required placeholder="+94 77 XXX XXXX" error={errors.phone?.message} {...register("phone")} />
                <Input label="Email address" type="email" required placeholder="you@example.com" error={errors.email?.message} {...register("email")} />
                <Input label="Event date" type="date" required error={errors.eventDate?.message} {...register("eventDate")} />
              </div>
            </div>

            <div>
              <h2 className="font-display text-xl">Itemised breakdown</h2>
              <div className="mt-4 space-y-3">
                {items.map((item) => {
                  const breakdown = lineItemBreakdown(item.price);
                  const category = getCategoryBySlug(item.categorySlug);
                  return (
                    <div key={item.categorySlug} className="rounded-[8px] border border-slate/8 bg-white p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-medium uppercase tracking-wide text-gold-deep">{category?.name}</p>
                          <p className="font-display text-base text-slate">{item.vendorName}</p>
                        </div>
                        <p className="font-display text-base text-burgundy-deep">{formatLKR(item.price)}</p>
                      </div>
                      <div className="mt-3 grid grid-cols-2 gap-2 border-t border-slate/8 pt-3 text-xs sm:grid-cols-4">
                        <div>
                          <p className="text-slate-soft">Advance (20%)</p>
                          <p className="font-medium text-slate">{formatLKR(breakdown.advanceAmount)}</p>
                        </div>
                        <div>
                          <p className="text-slate-soft">Platform fee (3%)</p>
                          <p className="font-medium text-slate">{formatLKR(breakdown.platformFee)}</p>
                        </div>
                        <div>
                          <p className="text-slate-soft">Payable now</p>
                          <p className="font-medium text-burgundy-deep">{formatLKR(breakdown.payableNow)}</p>
                        </div>
                        <div>
                          <p className="text-slate-soft">Remaining</p>
                          <p className="font-medium text-slate">{formatLKR(breakdown.remainingBalance)}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <h2 className="font-display text-xl">Payment method</h2>
              <div role="radiogroup" aria-label="Payment method" className="mt-4 space-y-3">
                {PAYMENT_METHODS.map((paymentMethod) => {
                  const Icon = paymentMethod.icon;
                  const selected = method === paymentMethod.id;

                  return (
                    <label
                      key={paymentMethod.id}
                      className={`flex cursor-pointer items-center gap-3.5 rounded-[4px] border px-4 py-3.5 transition-colors ${
                        selected ? "border-burgundy bg-burgundy/[0.03]" : "border-slate/15 hover:border-slate/30"
                      }`}
                    >
                      <input
                        type="radio"
                        name="method"
                        value={paymentMethod.id}
                        checked={selected}
                        onChange={() => setMethod(paymentMethod.id)}
                        className="sr-only"
                      />
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[4px] ${
                          selected ? "bg-burgundy text-white" : "bg-rose-pale text-burgundy"
                        }`}
                      >
                        <Icon size={18} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-slate">{paymentMethod.label}</p>
                        <p className="text-xs text-slate-soft">{paymentMethod.description}</p>
                      </div>
                      {selected && (
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-burgundy text-white">
                          <Check size={12} />
                        </span>
                      )}
                    </label>
                  );
                })}
              </div>
            </div>

            {method === "bank" && (
              <div className="space-y-4 rounded-[8px] border border-burgundy/10 bg-white p-5">
                <p className="text-sm text-slate-soft">
                  After transferring, upload your deposit slip for admin verification.
                </p>
                <div className="rounded-[8px] border border-slate/10 bg-ivory p-4 text-sm">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-soft">Transfer to this account</p>
                  <dl className="divide-y divide-slate/8">
                    {[
                      ["Bank", "People's Bank of Sri Lanka"],
                      ["Account Name", "TRIBLEERA VAIBHAVAM PVT LTD"],
                      ["Account Number", "123-4567-8901-00"],
                      ["Branch", "Jaffna Main Branch"],
                      ["Reference", bankReference],
                    ].map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between py-2">
                        <dt className="text-slate-soft">{key}</dt>
                        <dd className="font-medium text-slate">{value}</dd>
                      </div>
                    ))}
                  </dl>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="mt-3 w-full"
                    icon={<Copy size={14} />}
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText("123-4567-8901-00");
                        showToast("Account number copied.", "success");
                      } catch {
                        showToast("Clipboard access unavailable.", "error");
                      }
                    }}
                  >
                    Copy account number
                  </Button>
                  <p className="mt-2 text-[11px] text-slate-soft">
                    Use your booking reference as the transfer description so our team can match your payment instantly.
                  </p>
                </div>

                <Input
                  label="Bank transfer reference"
                  required
                  value={bankTransferReference}
                  onChange={(e) => setBankTransferReference(e.target.value)}
                  placeholder={bankReference}
                  hint="Enter the exact bank / transfer reference visible on your deposit proof."
                />

                <label
                  htmlFor={fileInputId}
                  className="flex cursor-pointer flex-col items-center justify-center rounded-[8px] border border-dashed border-burgundy/30 bg-burgundy/[0.03] px-5 py-8 text-center transition-colors hover:bg-burgundy/[0.06]"
                >
                  <span className="text-sm font-semibold text-burgundy-deep">Drop your deposit slip here or click to browse</span>
                  <span className="mt-2 text-xs text-slate-soft">Accepts JPG, PNG, PDF. Max 5MB.</span>
                  <input id={fileInputId} type="file" accept=".jpg,.jpeg,.png,.pdf" className="sr-only" onChange={handleSlipChange} />
                </label>

                {slipUploaded && (
                  <div className="rounded-[8px] border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
                    <p>✓ Slip uploaded - admin will verify within 2 hours</p>
                    <p className="mt-1 text-xs">{slipName}</p>
                    {slipPreview && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={slipPreview} alt="Deposit slip preview" className="mt-3 max-h-48 rounded-[6px] object-cover" />
                    )}
                  </div>
                )}
              </div>
            )}

            <Button
              type="submit"
              size="lg"
              fullWidth
              icon={<Lock size={16} />}
              disabled={isSubmitting || bankSubmissionBlocked}
              title={bankSubmissionBlocked ? "Please add your bank reference and upload the deposit slip to continue" : undefined}
              className="md:hidden"
            >
              {isSubmitting ? "Processing payment..." : submitLabel}
            </Button>
            <p className="text-center text-[11px] leading-relaxed text-slate-soft md:hidden">
              By clicking, you agree to TRIBLEERA&apos;s Escrow Terms of Service.
            </p>
          </form>

          <aside className="hidden md:block">
            <div className="sticky top-28 space-y-4">
              <PriceSummary breakdown={totals} />
              <div className="flex items-start gap-3 rounded-[4px] border border-rose/40 bg-rose-pale/50 p-4">
                <ShieldCheck size={18} className="mt-0.5 shrink-0 text-burgundy" />
                <div>
                  <p className="text-xs font-semibold text-burgundy-deep">TRIBLEERA Escrow Protection</p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-soft">
                    Your advance is held in a secure escrow account and released to vendors only as milestones are completed.
                    Your remaining balance is settled directly with each vendor afterwards.
                  </p>
                  <Link href="/faq#escrow" className="mt-1.5 inline-block text-xs font-semibold text-burgundy hover:underline">
                    How does TRIBLEERA escrow work? →
                  </Link>
                </div>
              </div>
              <Button
                type="submit"
                form="payment-form"
                size="lg"
                fullWidth
                icon={<Lock size={16} />}
                disabled={isSubmitting || bankSubmissionBlocked}
                title={bankSubmissionBlocked ? "Please add your bank reference and upload the deposit slip to continue" : undefined}
                className="hidden md:flex"
              >
                {isSubmitting ? "Processing payment..." : submitLabel}
              </Button>
              <p className="text-center text-[11px] leading-relaxed text-slate-soft">
                By clicking, you agree to TRIBLEERA&apos;s Escrow Terms of Service.
              </p>
            </div>
          </aside>
        </div>
      </Container>
    </div>
  );
}
