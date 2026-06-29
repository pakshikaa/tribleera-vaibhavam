"use client";

import { ChangeEvent, useId, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, ShieldCheck, ShoppingBag, CreditCard, Landmark, Smartphone, Check, Copy } from "lucide-react";
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
  const [slipName, setSlipName] = useState("");
  const fileInputId = useId();

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
      setSlipName("");
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
    if (!allowedTypes.includes(file.type) || file.size > 5 * 1024 * 1024) {
      showToast("Upload a JPG, PNG, or PDF under 5MB.", "error");
      setSlipUploaded(false);
      setSlipPreview(null);
      setSlipName("");
      return;
    }

    setSlipUploaded(true);
    setSlipName(file.name);

    if (file.type === "application/pdf") {
      setSlipPreview(null);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setSlipPreview(typeof reader.result === "string" ? reader.result : null);
    };
    reader.readAsDataURL(file);
  }

  function onSubmit(values: CustomerDetailsValues) {
    const bookingId = generateBookingId();
    const record = {
      id: bookingId,
      items,
      totals,
      customer: values,
      paymentMethod: method,
      depositSlipName: slipName || null,
      createdAt: new Date().toISOString(),
    };
    try {
      window.localStorage.setItem("tribleera-last-booking", JSON.stringify(record));
    } catch {
      // session-only fallback; confirmation page handles a missing record gracefully
    }

    return new Promise<void>((resolve) => {
      setTimeout(() => {
        clear();
        router.push("/booking/confirmation");
        resolve();
      }, 900);
    });
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

  return (
    <div className="bg-ivory">
      <section className="border-b border-slate/8 bg-white py-8 md:py-10">
        <Container>
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
              disabled={isSubmitting || (method === "bank" && !slipUploaded)}
              title={method === "bank" && !slipUploaded ? "Please upload your deposit slip to continue" : undefined}
              className="md:hidden"
            >
              {isSubmitting ? "Processing payment..." : submitLabel}
            </Button>
            <p className="text-center text-[11px] leading-relaxed text-slate-soft md:hidden">
              By clicking, you agree to TRIBLEERA&apos;s Escrow Terms of Service.
            </p>
          </form>

          <aside>
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
                </div>
              </div>
              <Button
                type="submit"
                form="payment-form"
                size="lg"
                fullWidth
                icon={<Lock size={16} />}
                disabled={isSubmitting || (method === "bank" && !slipUploaded)}
                title={method === "bank" && !slipUploaded ? "Please upload your deposit slip to continue" : undefined}
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
