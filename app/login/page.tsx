"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { AlertCircle, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    // Mock auth — replace with real API call when backend ready
    setTimeout(() => {
      if (email && password.length >= 6) {
        try {
          sessionStorage.setItem("customer-auth", email);
        } catch {}
        router.push("/dashboard/customer");
      } else {
        setError("Invalid email or password. Please try again.");
        setLoading(false);
      }
    }, 700);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ivory px-5 py-12">
      {/* Arch watermark */}
      <svg
        className="pointer-events-none absolute inset-0 m-auto h-[500px] w-[500px] text-burgundy/[0.04]"
        viewBox="0 0 200 200"
        fill="none"
      >
        <path
          d="M40 180 V100 C40 50 65 15 100 15 C135 15 160 50 160 100 V180"
          stroke="currentColor"
          strokeWidth="5"
        />
        <path
          d="M62 180 V104 C62 68 78 38 100 38 C122 38 138 68 138 104 V180"
          stroke="currentColor"
          strokeWidth="5"
        />
      </svg>

      <div className="relative z-10 w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 text-center">
          <Link href="/">
            <Image
              src="/logo/tribleera-mark-192.png"
              alt="TRIBLEERA"
              width={64}
              height={64}
              className="mx-auto mb-3 rounded-[12px] shadow-[0_0_30px_rgba(92,4,39,0.15)]"
            />
          </Link>
          <p className="font-display text-xl tracking-widest text-burgundy-deep">TRIBLEERA</p>
          <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-soft">
            Welcome back
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleLogin}
          className="rounded-[14px] border border-slate/10 bg-white p-7 shadow-soft space-y-5"
        >
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
            className="w-full rounded-[6px] bg-burgundy py-3 text-sm font-bold text-cream shadow-sm transition-all hover:-translate-y-0.5 hover:bg-burgundy-deep disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>

          <p className="text-center text-xs text-slate-soft">
            New to TRIBLEERA?{" "}
            <Link href="/event-request" className="font-semibold text-burgundy hover:underline">
              Plan your wedding
            </Link>
          </p>
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
      </div>
    </div>
  );
}
