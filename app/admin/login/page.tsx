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

// Blur-to-sharp staggered entrance — logo, then eyebrow, then headline, then
// body, then stats, each 0.14s apart.
const fadeUp = {
  hidden: { opacity: 0, y: 20, filter: "blur(6px)" },
  show: (index: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, delay: 0.15 + index * 0.14, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

const lineExpand = {
  hidden: { width: 0, opacity: 0 },
  show: { width: 22, opacity: 1, transition: { duration: 0.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] as const } },
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
    <div className="flex min-h-screen font-[Arial,sans-serif]" data-portal="true">
      {/* Left — cinematic image panel */}
      <div className="relative hidden w-[60%] shrink-0 overflow-hidden lg:block">
        {/* Slow Ken Burns zoom — same technique as components/home/Hero.tsx,
            tuned to a barely-there 14s drift so it reads as "alive" rather
            than an obvious animation. */}
        <motion.div
          className="absolute inset-0 will-change-transform motion-reduce:animate-none"
          animate={{ scale: [1, 1.06] }}
          transition={{ duration: 14, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
        >
          {/* Champagne hands close-up: the ring-and-watch moment sits centred,
              so anchor centre and let the vignette carry the text column. */}
          <Image
            src={adminLoginImage}
            alt="TRIBLEERA — professional wedding management"
            fill
            sizes="60vw"
            priority
            className="object-cover object-center brightness-[0.85] contrast-105"
          />
        </motion.div>

        {/* Film grain — reuses the existing .bg-grain utility, intensified for this hero moment */}
        <div className="bg-grain absolute inset-0 scale-150 opacity-40 mix-blend-overlay" />

        {/* Base warmth — lighter than before: the B&W portrait is already
            naturally dark, so a heavy base would crush it to black. */}
        <div className="absolute inset-0 bg-ink/25" />
        {/* Radial vignette — depth from the center out, not a flat linear wash */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 75% 75% at 50% 45%, transparent 15%, rgba(21,4,12,0.5) 65%, rgba(21,4,12,0.88) 100%)",
          }}
        />
        {/* Bottom safe zone (headline + stats) and top safe zone (logo) */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(21,4,12,0.97) 0%, rgba(21,4,12,0.7) 24%, rgba(21,4,12,0.2) 50%, transparent 70%), linear-gradient(to bottom, rgba(21,4,12,0.78) 0%, transparent 22%)",
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
            <motion.div
              custom={1}
              initial="hidden"
              animate="show"
              variants={fadeUp}
              className="mb-4 flex items-center gap-2.5"
            >
              <motion.span variants={lineExpand} className="h-px bg-gold/50" />
              <p className="whitespace-nowrap text-[10px] uppercase tracking-[0.24em] text-gold/55">Control Centre</p>
              <motion.span variants={lineExpand} className="h-px bg-gold/50" />
            </motion.div>

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
            <p className="mb-2.5 text-[9px] uppercase tracking-[0.16em] text-gold/40">Platform at a glance</p>
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
            {/* The one element that breathes — a slow, quiet pulse rather
                than anything competing for attention. */}
            <motion.p
              animate={{ opacity: [0.3, 0.55, 0.3] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
              className="mt-5 font-display text-[10.5px] italic text-cream-faint"
            >
              தேர்வின் செம்மை, வைபவத்தின் பெருமை
            </motion.p>
          </motion.div>
        </div>
      </div>

      {/* Right — login form. min-w-0 so this flex child can shrink below its
          content's intrinsic width instead of overflowing on narrower windows. */}
      <div className="relative flex min-w-0 flex-1 items-start justify-center bg-[#FAF7F2] px-0 py-0 lg:items-center lg:bg-ink lg:px-5 lg:py-12">
        {/* Mobile-only backdrop — the hero photo, blurred and darkened so the
            form stays readable while the brand image still shows through. */}
        <div className="fixed inset-0 lg:hidden" aria-hidden="true">
          {/* Heavy blur turns the champagne close-up into a soft golden wash;
              the gradient scrim stays calm behind the form while the gold halo
              gives the logo zone a quiet glow. */}
          <Image
            src={adminLoginImage}
            alt=""
            fill
            sizes="100vw"
            className="scale-110 object-cover object-center blur-[10px] brightness-[0.68]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(21,4,12,0.7)_0%,rgba(21,4,12,0.48)_30%,rgba(33,7,20,0.6)_62%,rgba(21,4,12,0.85)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_36%_at_50%_10%,rgba(212,175,106,0.14),transparent_70%)]" />
        </div>

        {/* Arch watermark */}
        <svg
          className="pointer-events-none absolute inset-0 m-auto h-[500px] w-[500px] text-gold/[0.06] lg:hidden"
          viewBox="0 0 200 200"
          fill="none"
        >
          <path d="M40 180 V100 C40 50 65 15 100 15 C135 15 160 50 160 100 V180" stroke="currentColor" strokeWidth="5" />
          <path d="M62 180 V104 C62 68 78 38 100 38 C122 38 138 68 138 104 V180" stroke="currentColor" strokeWidth="5" />
        </svg>

        <div className="relative z-10 mx-auto w-full max-w-[400px] px-5 pb-10 lg:max-w-sm lg:px-0">
          {/* Mobile logo */}
          <div
            className="mb-7 text-center lg:hidden"
            style={{
              padding: "28px 0 24px",
              borderBottom: "0.5px solid rgba(212,175,106,0.28)",
              marginBottom: 28,
            }}
          >
            <Image
              src="/logo/tribleera-mark-192.png"
              alt="TRIBLEERA"
              width={48}
              height={48}
              className="mx-auto mb-2.5 rounded-[10px]"
            />
            <p className="text-[15px] font-bold tracking-[0.18em] text-[#D4AF6A]">TRIBLEERA</p>
            <p className="mt-0.5 text-[9px] uppercase tracking-[0.22em] text-cream-faint">
              VAIBHAVAM · ADMIN PORTAL
            </p>
          </div>

          <div className="mb-7 hidden text-left lg:block">
            <h2 className="font-display text-2xl font-bold text-cream">Admin sign in</h2>
            <p className="mt-1 text-sm text-cream-faint">Authorized personnel only</p>
          </div>
          <p className="mb-6 text-center text-xs uppercase tracking-[0.2em] text-cream-faint lg:hidden">
            Admin Portal
          </p>

          {/* Form */}
          <form
            onSubmit={handleLogin}
            className="space-y-5 rounded-[14px] border border-slate/10 bg-white p-5 shadow-[0_24px_60px_rgba(0,0,0,0.35)] lg:border-[rgba(212,175,106,0.28)] lg:bg-[rgb(247_238_226_/_0.06)] lg:p-7 lg:shadow-none lg:backdrop-blur-[20px]"
          >
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
                className="min-h-12 w-full rounded-[6px] border border-slate/15 bg-white px-[14px] py-3 text-base text-slate placeholder:text-slate-soft/60 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/30 lg:border-cream/15 lg:bg-white/10 lg:text-cream lg:placeholder:text-cream-faint"
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
                className="min-h-12 w-full rounded-[6px] border border-slate/15 bg-white px-[14px] py-3 text-base text-slate placeholder:text-slate-soft/60 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/30 lg:border-cream/15 lg:bg-white/10 lg:text-cream lg:placeholder:text-cream-faint"
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
              className="min-h-12 w-full rounded-[6px] bg-gradient-to-br from-gold-light via-gold to-gold-deep px-4 py-3 text-[15px] font-bold text-burgundy-deep shadow-glow transition-all hover:-translate-y-0.5 disabled:opacity-60"
            >
              {loading ? "Signing in…" : "Sign in to admin portal"}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-5 rounded-[14px] border border-slate/10 bg-white p-5 text-[13px] leading-relaxed text-slate-soft shadow-[0_10px_30px_rgba(0,0,0,0.25)] lg:rounded-[8px] lg:border-gold/15 lg:bg-cream/[0.05] lg:p-3 lg:text-cream-faint lg:shadow-none">
            <strong className="text-slate lg:text-cream-dim">Demo credentials:</strong>
            <br />
            Username: <code className="text-burgundy-deep lg:text-gold-light">admin</code>
            <br />
            Password: <code className="text-burgundy-deep lg:text-gold-light">tribleera2026</code>
          </div>

          <p className="mt-5 text-center">
            <Link href="/" className="inline-block py-3 text-[13px] text-cream-faint hover:text-cream-dim lg:text-[11px]">
              ← Back to TRIBLEERA VAIBHAVAM
            </Link>
          </p>

          <p className="mt-3 text-center text-[13px] text-cream-faint lg:text-[11px]">
            Admin access only. All sessions are monitored and logged.
          </p>
        </div>
      </div>
    </div>
  );
}
