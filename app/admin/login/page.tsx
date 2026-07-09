"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { AlertCircle, BarChart3, ShoppingBag, Star, Users } from "lucide-react";
import { adminLoginImage } from "@/lib/data/images";

const PLATFORM_STATS = [
  { icon: Users, label: "Vendors", value: "25+" },
  { icon: ShoppingBag, label: "Rating", value: "4.8★" },
  { icon: Star, label: "Advance", value: "20%" },
  { icon: BarChart3, label: "Cities", value: "5" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, delay: 0.28 + index * 0.14, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

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
      {/* Left — cinematic image panel */}
      <div className="relative hidden w-[60%] shrink-0 overflow-hidden lg:block">
        <Image src={adminLoginImage} alt="" fill sizes="60vw" priority className="object-cover" />

        {/* Film grain — reuses the existing .bg-grain utility, intensified for this hero moment */}
        <div className="bg-grain absolute inset-0 scale-150 opacity-40 mix-blend-overlay" />

        {/* Radial vignette — depth from the center out, not a flat linear wash */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 80% at 50% 40%, transparent 15%, rgba(21,4,12,0.55) 70%, rgba(21,4,12,0.92) 100%)",
          }}
        />
        {/* Top/bottom legibility gradient for the logo and content bands */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(21,4,12,0.97) 0%, rgba(21,4,12,0.5) 26%, transparent 55%), linear-gradient(to bottom, rgba(21,4,12,0.7) 0%, transparent 22%)",
          }}
        />
        <div className="absolute inset-0 bg-burgundy-950/15 mix-blend-multiply" />

        <div className="relative z-10 flex h-full flex-col p-11">
          {/* Brand — sized to match the site header exactly */}
          <motion.div
            custom={0}
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="flex items-center gap-3"
          >
            <Image
              src="/logo/tribleera-mark-192.png"
              alt="TRIBLEERA"
              width={36}
              height={36}
              className="rounded-[8px] shadow-[0_0_0_1px_rgba(212,175,106,0.5),0_0_32px_rgba(212,175,106,0.3)]"
            />
            <div className="leading-none">
              <p className="font-display text-[15px] font-bold tracking-widest text-gold text-shadow-dark">
                TRIBLEERA
              </p>
              <p className="mt-1 font-display text-[9px] font-semibold tracking-[0.25em] text-gold-light/70">VAIBHAVAM</p>
            </div>
            <div className="ml-1 rounded border border-gold/30 bg-gold/10 px-2.5 py-1 backdrop-blur-md">
              <p className="text-[9.5px] uppercase tracking-[0.14em] text-gold">Admin Portal</p>
            </div>
          </motion.div>

          {/* Split headline */}
          <div className="flex flex-1 flex-col justify-center">
            <motion.p
              custom={1}
              initial="hidden"
              animate="show"
              variants={fadeUp}
              className="mb-4 text-[10px] uppercase tracking-[0.24em] text-gold/55"
            >
              ── Control Centre ──
            </motion.p>

            <motion.div custom={2} initial="hidden" animate="show" variants={fadeUp} className="mb-5">
              <p className="text-[15px] leading-none tracking-wide text-cream-faint/50 text-shadow-dark">Manage</p>
              <p
                className="bg-gradient-to-br from-cream via-gold to-gold-light bg-clip-text text-[52px] font-extrabold leading-[0.95] tracking-tight text-transparent drop-shadow-[0_2px_16px_rgba(21,4,12,0.9)]"
              >
                Every
              </p>
              <p
                className="bg-gradient-to-br from-cream via-gold to-gold-light bg-clip-text text-[52px] font-extrabold leading-[0.95] tracking-tight text-transparent drop-shadow-[0_2px_16px_rgba(21,4,12,0.9)]"
              >
                Celebration.
              </p>
            </motion.div>

            <motion.p
              custom={3}
              initial="hidden"
              animate="show"
              variants={fadeUp}
              className="max-w-[360px] text-[13.5px] leading-relaxed text-cream-dim/70"
            >
              From vendor approvals to payment verification — TRIBLEERA VAIBHAVAM&rsquo;s control centre puts
              every tool in your hands.
            </motion.p>
          </div>

          {/* Stats + shimmer divider */}
          <motion.div custom={4} initial="hidden" animate="show" variants={fadeUp}>
            <div className="mb-4 h-px w-full overflow-hidden rounded-full bg-cream/10">
              <div className="h-full w-full animate-[loading_2.4s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-gold to-transparent" />
            </div>
            <div className="grid grid-cols-4 gap-2.5">
              {PLATFORM_STATS.map(({ icon: Icon, label, value }) => (
                <div key={label} className="rounded-[9px] border border-gold/15 bg-cream/[0.06] p-3 text-center backdrop-blur-md">
                  <Icon size={13} className="mx-auto mb-1 text-gold" aria-hidden="true" />
                  <p className="bg-gradient-to-b from-gold-light to-gold bg-clip-text font-display text-xl font-bold leading-none text-transparent">
                    {value}
                  </p>
                  <p className="mt-1 text-[9.5px] tracking-wide text-cream-faint/60">{label}</p>
                </div>
              ))}
            </div>
            <p className="mt-5 font-display text-[10.5px] italic text-cream-faint/35">
              தேர்வின் செம்மை, வைபவத்தின் பெருமை
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right — login form. min-w-0 so this flex child can shrink below its
          content's intrinsic width instead of overflowing on narrower windows. */}
      <div className="flex min-w-0 flex-1 items-center justify-center bg-ink px-5 py-12">
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
