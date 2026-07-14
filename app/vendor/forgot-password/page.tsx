"use client";

import Link from "next/link";
import { useState } from "react";
import { KeyRound, MailCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Input } from "@/components/ui/Field";
import { createVendorPasswordReset } from "@/lib/utils/vendorPortal";

export default function VendorForgotPasswordPage() {
  const [identifier, setIdentifier] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [demoLink, setDemoLink] = useState<string | null>(null);

  /**
   * The confirmation is identical whether or not the account exists — telling
   * a stranger "no vendor matched that email" turns this form into a way to
   * enumerate which studios are registered on the platform.
   */
  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const result = createVendorPasswordReset(identifier);
    setDemoLink(result.ok ? result.href : null);
    setSubmitted(true);
  }

  return (
    <div className="min-h-screen bg-ivory py-16" data-portal="true">
      <Container className="max-w-lg">
        <div className="rounded-[12px] border border-slate/8 bg-white p-6 shadow-soft md:p-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-burgundy/8 text-burgundy">
              <KeyRound size={18} />
            </div>
            <div>
              <h1 className="font-display text-2xl text-burgundy-deep">Reset vendor password</h1>
              <p className="text-sm text-slate-soft">Enter your registered email or phone number.</p>
            </div>
          </div>

          {submitted ? (
            <div className="mt-6 rounded-[10px] border border-gold/20 bg-gold/[0.05] p-4">
              <p className="flex items-center gap-2 text-sm font-semibold text-slate">
                <MailCheck size={16} className="text-success" /> Check your inbox
              </p>
              <p className="mt-1 text-sm text-slate-soft">
                If an approved vendor account matches <strong>{identifier}</strong>, we have sent password reset
                instructions to its registered email address.
              </p>
              {demoLink && (
                <Button href={demoLink} variant="secondary" className="mt-3">
                  Open reset link (demo)
                </Button>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <Input
                label="Registered email or phone"
                value={identifier}
                onChange={(event) => setIdentifier(event.target.value)}
                placeholder="business@example.com or +94 77..."
                required
              />
              <Button type="submit" variant="gold" fullWidth>
                Send reset link
              </Button>
            </form>
          )}

          <Link href="/vendor/login" className="mt-6 inline-block text-sm font-medium text-burgundy underline underline-offset-2">
            Back to vendor login
          </Link>
        </div>
      </Container>
    </div>
  );
}
