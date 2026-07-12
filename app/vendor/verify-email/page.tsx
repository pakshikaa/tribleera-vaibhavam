"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { BadgeCheck, MailWarning } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { verifyVendorEmailToken } from "@/lib/utils/vendorPortal";

export default function VendorVerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [result] = useState(() => verifyVendorEmailToken(token));

  const status = result.ok ? "success" : "error";
  const message = result.ok
    ? `Email verified for ${result.email}. Your application can now move through approval.`
    : result.reason === "expired"
      ? "This verification link expired. Register again or ask support to resend it."
      : "This verification link is invalid or already used.";

  return (
    <div className="min-h-screen bg-ivory py-16" data-portal="true">
      <Container className="max-w-lg">
        <div className="rounded-[12px] border border-slate/8 bg-white p-6 text-center shadow-soft md:p-8">
          <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${status === "success" ? "bg-success-pale text-success" : "bg-rose-pale text-burgundy"}`}>
            {status === "success" ? <BadgeCheck size={30} /> : <MailWarning size={30} />}
          </div>
          <h1 className="mt-5 font-display text-2xl text-burgundy-deep">
            {status === "success" ? "Email verified" : "Verification issue"}
          </h1>
          <p className="mt-2 text-sm text-slate-soft">{message}</p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button href="/vendor/login" variant="gold">
              Vendor login
            </Button>
            <Button href="/vendor/register" variant="secondary">
              Vendor registration
            </Button>
          </div>

          <Link href="/" className="mt-6 inline-block text-sm font-medium text-burgundy underline underline-offset-2">
            Back to home
          </Link>
        </div>
      </Container>
    </div>
  );
}
