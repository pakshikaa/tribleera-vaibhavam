"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import { AuthShell } from "@/components/ui/AuthShell";
import { readCustomerProfile, writeActiveCustomerProfile } from "@/lib/utils/customer-profile";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const redirectPath = searchParams.get("redirect") || "/";

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    // Mock auth — replace with real API call when backend ready
    setTimeout(() => {
      if (email && password.length >= 6) {
        try {
          const profile = readCustomerProfile(email);
          writeActiveCustomerProfile(profile);
        } catch {}
        router.push(redirectPath);
      } else {
        setError("Invalid email or password. Please try again.");
        setLoading(false);
      }
    }, 700);
  }

  return (
    <AuthShell
      mode="login"
      eyebrow="Plan faster"
      title="Sign in and continue"
      subtitle="Your shortlisted vendors, booking updates, and planning steps stay in one calm, curated place."
      alternateLabel="New to TRIBLEERA?"
      alternateHref={`/signup?redirect=${encodeURIComponent(redirectPath)}`}
      alternateText="Create an account"
    >
      <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block mb-1.5 text-xs font-semibold uppercase tracking-wider text-slate-soft"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full rounded-[6px] border border-slate/20 bg-ivory px-4 py-3 text-sm text-slate placeholder:text-slate/40 focus:border-burgundy focus:outline-none focus:ring-1 focus:ring-burgundy/20"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block mb-1.5 text-xs font-semibold uppercase tracking-wider text-slate-soft"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full rounded-[6px] border border-slate/20 bg-ivory px-4 py-3 pr-10 text-sm text-slate placeholder:text-slate/40 focus:border-burgundy focus:outline-none focus:ring-1 focus:ring-burgundy/20"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate/40 hover:text-slate"
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {error && (
            <p className="flex items-center gap-1.5 text-xs text-red-500">
              <AlertCircle size={13} /> {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-[10px] bg-burgundy py-3.5 text-sm font-bold text-cream shadow-[0_16px_30px_rgba(92,4,39,0.18)] transition-all hover:-translate-y-0.5 hover:bg-burgundy-deep disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <p className="mt-5 text-center text-xs text-slate-soft">
          Are you a vendor?{" "}
          <Link href="/vendor/register" className="font-medium text-burgundy hover:underline">
            Register your studio
          </Link>
        </p>

        <p className="mt-2 text-center text-xs text-slate/30">
          <Link href="/admin/login" className="hover:text-slate/60">
            Admin access
          </Link>
        </p>
    </AuthShell>
  );
}
