"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Input } from "@/components/ui/Field";
import { resetVendorPassword } from "@/lib/utils/vendorPortal";

export default function VendorResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = useMemo(() => searchParams.get("token") ?? "", [searchParams]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (password.length < 8) {
      setStatus("error");
      setMessage("Use at least 8 characters for the new password.");
      return;
    }
    if (password !== confirmPassword) {
      setStatus("error");
      setMessage("Passwords do not match.");
      return;
    }

    const result = resetVendorPassword(token, password);
    if (!result.ok) {
      setStatus("error");
      setMessage(
        result.reason === "expired"
          ? "This reset link expired. Request a new one from the vendor login page."
          : "This reset link is invalid or already used."
      );
      return;
    }

    setStatus("success");
    setMessage("Password updated. You can now sign in with the new password.");
  }

  return (
    <div className="min-h-screen bg-ivory py-16" data-portal="true">
      <Container className="max-w-lg">
        <div className="rounded-[12px] border border-slate/8 bg-white p-6 shadow-soft md:p-8">
          <h1 className="font-display text-2xl text-burgundy-deep">Choose a new password</h1>
          <p className="mt-1 text-sm text-slate-soft">Vendor reset links stay valid for 1 hour.</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <Input
              label="New password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
            <Input
              label="Confirm password"
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
            />
            {message && (
              <p className={`text-sm ${status === "success" ? "text-success" : "text-danger"}`}>{message}</p>
            )}
            <Button type="submit" variant="gold" fullWidth>
              Save new password
            </Button>
          </form>

          <Link href="/vendor/login" className="mt-6 inline-block text-sm font-medium text-burgundy underline underline-offset-2">
            Return to vendor login
          </Link>
        </div>
      </Container>
    </div>
  );
}
