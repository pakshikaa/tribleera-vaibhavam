"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Phone, MapPin, Clock, MessageCircle, CheckCircle } from "lucide-react";
import { Container } from "@/components/ui/Container";

const SUBJECTS = ["Booking query", "Vendor inquiry", "Payment issue", "Other"] as const;

const contactSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  email: z.string().trim().email("Enter a valid email address"),
  subject: z.enum(SUBJECTS, { error: "Select a subject" }),
  message: z.string().trim().min(20, "Message must be at least 20 characters").max(1000, "Maximum 1000 characters"),
});

type ContactValues = z.infer<typeof contactSchema>;

const INFO_CARDS = [
  { icon: Mail, label: "Email", value: "hello@tribleera.com", href: "mailto:hello@tribleera.com" },
  { icon: Phone, label: "Phone", value: "+94 77 123 4567", href: "tel:+94771234567" },
  { icon: MessageCircle, label: "WhatsApp", value: "Chat directly", href: "https://wa.me/94771234567" },
  { icon: MapPin, label: "Address", value: "Jaffna, Sri Lanka", href: undefined },
  { icon: Clock, label: "Hours", value: "Monday–Saturday, 9 AM – 7 PM IST", href: undefined },
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function onSubmit(_formData: ContactValues) {
    setSubmitted(true);
  }

  return (
    <div>
      {/* HERO */}
      <section className="bg-ink py-20 md:py-28">
        <Container className="max-w-2xl text-center">
          <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.25em] text-gold">
            Get in touch
          </p>
          <h1
            className="font-display font-bold text-cream"
            style={{ fontSize: "clamp(2.2rem, 5vw, 3.6rem)", textShadow: "0 2px 30px rgba(21,4,12,0.8)" }}
          >
            We&rsquo;re here to help.
          </h1>
          <p className="mt-5 text-lg text-cream-dim">
            Questions about vendors, bookings, or payments — reach our team.
          </p>
        </Container>
      </section>

      {/* CONTENT */}
      <section className="bg-ivory py-16 md:py-24">
        <Container>
          <div className="grid grid-cols-1 gap-12 md:grid-cols-[1fr_380px]">
            {/* Contact form */}
            <div className="rounded-[12px] border border-slate/10 bg-white p-8 shadow-soft">
              {submitted ? (
                <div className="flex flex-col items-center py-10 text-center">
                  <CheckCircle size={48} className="mb-4 text-success" />
                  <h2 className="font-display text-2xl text-slate">Message sent!</h2>
                  <p className="mt-2 text-slate-soft">We&rsquo;ll respond within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-soft">
                      Your name
                    </label>
                    <input
                      {...register("name")}
                      type="text"
                      placeholder="Priya Rajendran"
                      className="w-full rounded-[6px] border border-slate/20 bg-ivory px-4 py-3 text-sm text-slate placeholder-slate/40 focus:border-burgundy focus:outline-none"
                    />
                    {errors.name && (
                      <p className="mt-1 text-xs text-danger">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-soft">
                      Email address
                    </label>
                    <input
                      {...register("email")}
                      type="email"
                      placeholder="priya@email.com"
                      className="w-full rounded-[6px] border border-slate/20 bg-ivory px-4 py-3 text-sm text-slate placeholder-slate/40 focus:border-burgundy focus:outline-none"
                    />
                    {errors.email && (
                      <p className="mt-1 text-xs text-danger">{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-soft">
                      Subject
                    </label>
                    <select
                      {...register("subject")}
                      className="w-full rounded-[6px] border border-slate/20 bg-ivory px-4 py-3 text-sm text-slate focus:border-burgundy focus:outline-none"
                    >
                      <option value="">Select a subject</option>
                      <option value="Booking query">Booking query</option>
                      <option value="Vendor inquiry">Vendor inquiry</option>
                      <option value="Payment issue">Payment issue</option>
                      <option value="Other">Other</option>
                    </select>
                    {errors.subject && (
                      <p className="mt-1 text-xs text-danger">{errors.subject.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-soft">
                      Message
                    </label>
                    <textarea
                      {...register("message")}
                      rows={5}
                      placeholder="Tell us how we can help…"
                      className="w-full resize-none rounded-[6px] border border-slate/20 bg-ivory px-4 py-3 text-sm text-slate placeholder-slate/40 focus:border-burgundy focus:outline-none"
                    />
                    {errors.message && (
                      <p className="mt-1 text-xs text-danger">{errors.message.message}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-[6px] bg-burgundy py-3 text-sm font-semibold text-white transition-all hover:bg-burgundy-deep disabled:opacity-60"
                  >
                    Send message
                  </button>
                </form>
              )}
            </div>

            {/* Contact info */}
            <div className="space-y-4">
              {INFO_CARDS.map(({ icon: Icon, label, value, href }) => (
                <div
                  key={label}
                  className="flex items-start gap-4 rounded-[10px] border border-slate/10 bg-white p-5 shadow-soft"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-burgundy/8 text-burgundy">
                    <Icon size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-soft">
                      {label}
                    </p>
                    {href ? (
                      <a
                        href={href}
                        target={href.startsWith("http") ? "_blank" : undefined}
                        rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="mt-0.5 block text-[15px] font-medium text-slate hover:text-burgundy"
                      >
                        {value}
                      </a>
                    ) : (
                      <p className="mt-0.5 text-[15px] text-slate">{value}</p>
                    )}
                  </div>
                </div>
              ))}
              <div className="rounded-[10px] border border-gold/20 bg-gold/5 p-5">
                <p className="text-xs font-semibold text-gold-deep">Response time</p>
                <p className="mt-1 text-sm text-slate-soft">
                  Usually within 2 hours on WhatsApp.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
