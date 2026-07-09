"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import { AuthShell } from "@/components/ui/AuthShell";
import { writeActiveCustomerProfile } from "@/lib/utils/customer-profile";

export default function SignupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const redirectPath = searchParams.get("redirect") || "/";

  function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!name.trim()) {
      setError("Please enter your name.");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    setTimeout(() => {
      try {
        writeActiveCustomerProfile({
          name: name.trim(),
          email,
          city: "Jaffna",
          phone: "+94 77 410 0012",
        });
      } catch {}
      router.push(redirectPath);
    }, 700);
  }

  return (
    <AuthShell
      mode="signup"
      eyebrow="One account"
      title="Create your wedding access"
      subtitle="Join once, then explore vendors, compare options, and move through planning without losing momentum."
      alternateLabel="Already have an account?"
      alternateHref={`/login?redirect=${encodeURIComponent(redirectPath)}`}
      alternateText="Sign in"
    >
      <form onSubmit={handleSignup} className="space-y-5">
          <div>
            <label
              htmlFor="name"
              className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-soft"
            >
              Full name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoComplete="name"
              className="w-full rounded-[6px] border border-slate/20 bg-ivory px-4 py-3 text-sm text-slate placeholder:text-slate/40 focus:border-burgundy focus:outline-none focus:ring-1 focus:ring-burgundy/20"
              placeholder="Your name"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-soft"
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
              className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-soft"
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
                autoComplete="new-password"
                className="w-full rounded-[6px] border border-slate/20 bg-ivory px-4 py-3 pr-10 text-sm text-slate placeholder:text-slate/40 focus:border-burgundy focus:outline-none focus:ring-1 focus:ring-burgundy/20"
                placeholder="Minimum 6 characters"
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

          <div>
            <label
              htmlFor="confirm-password"
              className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-soft"
            >
              Confirm password
            </label>
            <div className="relative">
              <input
                id="confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
                className="w-full rounded-[6px] border border-slate/20 bg-ivory px-4 py-3 pr-10 text-sm text-slate placeholder:text-slate/40 focus:border-burgundy focus:outline-none focus:ring-1 focus:ring-burgundy/20"
                placeholder="Re-enter password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((v) => !v)}
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate/40 hover:text-slate"
              >
                {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
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
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>
    </AuthShell>
  );
}
