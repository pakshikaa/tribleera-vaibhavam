"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { AlertCircle, BarChart3, ShoppingBag, Star, Users } from "lucide-react";
import { adminLoginImage } from "@/lib/data/images";

const PLATFORM_STATS = [
  { icon: Users, label: "Verified vendors", value: "25+" },
  { icon: ShoppingBag, label: "Bookings managed", value: "100+" },
  { icon: Star, label: "Average trust score", value: "4.8★" },
  { icon: BarChart3, label: "Cities active", value: "5" },
];

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    // Mock auth — replace with real API call when backend ready
    // Demo credentials: admin / tribleera2026 (case-insensitive — this had
    // been hardcoded as an exact-case match against "TRIBLEERA2026" while
    // every doc/ticket referencing this login documents it lowercase,
    // so logins with the documented password were silently rejected).
    setTimeout(() => {
      if (username.toLowerCase() === "admin" && password.toLowerCase() === "tribleera2026") {
        try {
          sessionStorage.setItem("admin-auth", "true");
        } catch {}
        router.push("/dashboard/admin");
      } else {
        setError("Invalid username or password.");
        setLoading(false);
      }
    }, 800);
  }

  return (
    <div className="flex min-h-screen">
      {/* Left — image + platform stats panel */}
      <div className="relative hidden w-[55%] shrink-0 overflow-hidden lg:block">
        <Image
          src={adminLoginImage}
          alt=""
          fill
          sizes="55vw"
          priority
          className="object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(21,4,12,0.65) 0%, rgba(21,4,12,0.4) 40%, rgba(21,4,12,0.9) 100%)",
          }}
        />
        <div className="absolute inset-0 bg-ink/25" />

        <div className="relative z-10 flex h-full flex-col p-10">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <Image
              src="/logo/tribleera-mark-192.png"
              alt="TRIBLEERA"
              width={40}
              height={40}
              className="rounded-[9px] shadow-[0_0_20px_rgba(212,175,106,0.4)]"
            />
            <div className="leading-none">
              <p className="font-display text-[15px] font-bold tracking-[0.18em] text-gold">TRIBLEERA</p>
              <p className="mt-1 font-display text-[8px] tracking-[0.3em] text-gold-light/70">VAIBHAVAM</p>
            </div>
            <span className="ml-2 rounded border border-gold/30 bg-gold/[0.15] px-2 py-0.5 text-[10px] tracking-[0.15em] text-gold">
              CONTROL CENTRE
            </span>
          </div>

          {/* Headline */}
          <div className="flex flex-1 flex-col justify-center">
            <h1
              className="mb-4 font-display text-4xl font-bold leading-tight text-cream"
              style={{ textShadow: "0 2px 20px rgba(21,4,12,0.8)" }}
            >
              Manage your
              <br />
              <span className="text-gold">wedding platform</span>
              <br />
              from one place.
            </h1>
            <p className="max-w-[360px] text-sm leading-relaxed text-cream-dim/80">
              Approve vendors, verify payments, resolve disputes, and monitor your platform analytics — all in
              one dashboard.
            </p>
          </div>

          {/* Platform stats */}
          <div>
            <p className="mb-3 text-[10px] uppercase tracking-[0.15em] text-gold/60">Platform overview</p>
            <div className="grid grid-cols-2 gap-2.5">
              {PLATFORM_STATS.map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="rounded-[8px] border border-gold/15 bg-cream/[0.06] p-3.5 backdrop-blur-sm"
                >
                  <div className="mb-1 flex items-center gap-2">
                    <Icon size={14} className="text-gold" aria-hidden="true" />
                    <span className="text-[10px] text-cream-faint">{label}</span>
                  </div>
                  <p className="font-display text-xl font-bold leading-none text-gold-light">{value}</p>
                </div>
              ))}
            </div>
            <p className="mt-5 font-display text-[11px] italic text-cream-faint/50">
              தேர்வின் செம்மை, வைபவத்தின் பெருமை
            </p>
          </div>
        </div>
      </div>

      {/* Right — login form */}
      <div className="flex flex-1 items-center justify-center bg-ink px-5 py-12">
        {/* Arch watermark */}
        <svg
          className="pointer-events-none absolute inset-0 m-auto h-[500px] w-[500px] text-gold/[0.06] lg:hidden"
          viewBox="0 0 200 200"
          fill="none"
        >
          <path d="M40 180 V100 C40 50 65 15 100 15 C135 15 160 50 160 100 V180" stroke="currentColor" strokeWidth="5" />
          <path d="M62 180 V104 C62 68 78 38 100 38 C122 38 138 68 138 104 V180" stroke="currentColor" strokeWidth="5" />
        </svg>

        <div className="relative z-10 w-full max-w-sm">
          {/* Mobile logo */}
          <div className="mb-8 text-center lg:hidden">
            <Image
              src="/logo/tribleera-mark-192.png"
              alt="TRIBLEERA"
              width={56}
              height={56}
              className="mx-auto mb-3 rounded-[12px] shadow-[0_0_30px_rgba(212,175,106,0.3)]"
            />
            <p className="font-display text-xl tracking-widest text-cream">TRIBLEERA</p>
            <p className="mt-0.5 font-display text-[10px] tracking-[0.35em] text-gold/60">VAIBHAVAM</p>
          </div>

          <div className="mb-7 hidden text-left lg:block">
            <h2 className="font-display text-2xl font-bold text-cream">Admin sign in</h2>
            <p className="mt-1 text-sm text-cream-faint">Authorized personnel only</p>
          </div>
          <p className="mb-6 text-center text-xs uppercase tracking-[0.2em] text-cream-faint lg:hidden">
            Admin Portal
          </p>

          {/* Form */}
          <form onSubmit={handleLogin} className="glass rounded-[14px] p-7 space-y-5">
            <div>
              <label
                htmlFor="username"
                className="block mb-1.5 text-xs font-semibold uppercase tracking-wider text-cream-dim"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
                className="w-full rounded-[6px] border border-cream/15 bg-white/10 px-4 py-3 text-sm text-cream placeholder:text-cream-faint focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/30"
                placeholder="admin"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block mb-1.5 text-xs font-semibold uppercase tracking-wider text-cream-dim"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full rounded-[6px] border border-cream/15 bg-white/10 px-4 py-3 text-sm text-cream placeholder:text-cream-faint focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/30"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="text-xs text-red-400 flex items-center gap-1.5">
                <AlertCircle size={13} /> {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-[6px] bg-gradient-to-br from-gold-light via-gold to-gold-deep py-3 text-sm font-bold text-burgundy-deep shadow-glow transition-all hover:-translate-y-0.5 disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign In to Admin"}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-5 rounded-[8px] border border-gold/15 bg-cream/[0.05] p-3.5 text-[11px] leading-relaxed text-cream-faint">
            <strong className="text-cream-dim">Demo credentials:</strong>
            <br />
            Username: <code className="text-gold-light">admin</code>
            <br />
            Password: <code className="text-gold-light">tribleera2026</code>
          </div>

          <p className="mt-5 text-center">
            <Link href="/" className="text-[11px] text-cream-faint hover:text-cream-dim">
              ← Back to TRIBLEERA VAIBHAVAM
            </Link>
          </p>

          <p className="mt-3 text-center text-[11px] text-cream-faint">
            Admin access only. All sessions are monitored and logged.
          </p>
        </div>
      </div>
    </div>
  );
}
