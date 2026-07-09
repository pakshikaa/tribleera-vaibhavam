"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { AlertCircle, Sparkles } from "lucide-react";
import { vendorLoginImage } from "@/lib/data/images";

type ApprovedVendor = {
  slug: string;
  businessName: string;
  phone: string;
  password: string;
  profileComplete: boolean;
};

// Static fallback credentials for demo
const STATIC_FALLBACK = [
  { slug: "pushpa-florals-and-decor", phone: "+94771000001", businessName: "Pushpa Florals & Decor" },
  { slug: "jaffna-frames-studio",     phone: "+94771000002", businessName: "Jaffna Frames Studio" },
];

const AVATARS = [
  { initials: "PF", bg: "#5C0427" },
  { initials: "AJ", bg: "#7A1F3D" },
  { initials: "JF", bg: "#380C1E" },
  { initials: "NL", bg: "#220714" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: 0.24 + index * 0.13, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

function normalisePhone(raw: string) {
  return raw.replace(/[\s\-()]/g, "");
}

export default function VendorLoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    setTimeout(() => {
      try {
        const stored: ApprovedVendor[] = JSON.parse(
          localStorage.getItem("TRIBLEERA-approved-vendors") ?? "[]"
        );
        const normInput = normalisePhone(phone);

        // Check localStorage approved vendors first
        const match = stored.find(
          (v) =>
            normalisePhone(v.phone) === normInput && v.password === password
        );

        if (match) {
          sessionStorage.setItem("vendor-auth", "true");
          sessionStorage.setItem("vendor-slug", match.slug);
          sessionStorage.setItem("vendor-name", match.businessName);
          router.push(match.profileComplete ? "/dashboard/vendor" : "/dashboard/vendor/setup");
          return;
        }

        // Static fallback: any known phone + "vendor2026"
        if (password === "vendor2026") {
          const fallback = STATIC_FALLBACK.find(
            (v) => normalisePhone(v.phone) === normInput
          );
          if (fallback) {
            sessionStorage.setItem("vendor-auth", "true");
            sessionStorage.setItem("vendor-slug", fallback.slug);
            sessionStorage.setItem("vendor-name", fallback.businessName);
            router.push("/dashboard/vendor");
            return;
          }
        }

        setError("Invalid credentials. Contact admin if you have not received yours.");
      } catch {
        setError("Something went wrong. Please try again.");
      }
      setLoading(false);
    }, 800);
  }

  return (
    <div className="flex min-h-screen">
      {/* Left panel — cinematic image */}
      <div className="relative hidden w-[52%] shrink-0 overflow-hidden lg:block">
        <Image
          src={vendorLoginImage}
          alt=""
          fill
          sizes="52vw"
          priority
          className="object-cover object-center"
        />

        {/* Film grain */}
        <div className="bg-grain absolute inset-0 scale-150 opacity-35 mix-blend-overlay" />

        {/* Radial vignette */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 90% 90% at 50% 45%, transparent 20%, rgba(21,4,12,0.45) 70%, rgba(21,4,12,0.9) 100%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(21,4,12,0.97) 0%, rgba(21,4,12,0.55) 26%, transparent 55%), linear-gradient(to bottom, rgba(21,4,12,0.72) 0%, transparent 18%)",
          }}
        />
        {/* Text-protection gradient — guarantees the headline reads cleanly
            no matter what's behind it in the source photo, independent of
            the radial vignette above. */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to right, rgba(21,4,12,0.75) 0%, rgba(21,4,12,0.3) 55%, transparent 85%)",
          }}
        />
        <div className="absolute inset-0 bg-burgundy-950/15 mix-blend-multiply" />

        <div className="relative z-10 flex h-full flex-col p-10">
          {/* Brand — sized to match the site header exactly */}
          <motion.div custom={0} initial="hidden" animate="show" variants={fadeUp} className="flex items-center gap-2.5">
            <Image
              src="/logo/tribleera-mark-192.png"
              alt="TRIBLEERA"
              width={36}
              height={36}
              className="rounded-[8px] shadow-[0_0_0_1px_rgba(212,175,106,0.4),0_0_26px_rgba(212,175,106,0.25)]"
            />
            <div className="leading-none">
              <p className="font-display text-[15px] font-bold tracking-widest text-gold text-shadow-dark">TRIBLEERA</p>
              <p className="mt-1 font-display text-[9px] font-semibold tracking-[0.25em] text-gold-light/70">VAIBHAVAM</p>
            </div>
          </motion.div>

          {/* Split headline */}
          <div className="flex flex-1 flex-col justify-center">
            <motion.p
              custom={1}
              initial="hidden"
              animate="show"
              variants={fadeUp}
              className="mb-3.5 text-[10px] uppercase tracking-[0.22em] text-gold/60"
            >
              ── Vendor Partner Portal ──
            </motion.p>

            <motion.div custom={2} initial="hidden" animate="show" variants={fadeUp} className="mb-4">
              <p className="mb-1 text-sm leading-none text-cream-faint/55">The platform where</p>
              <p className="bg-gradient-to-br from-cream via-gold to-gold-light bg-clip-text text-[46px] font-extrabold leading-[0.92] tracking-tight text-transparent drop-shadow-[0_2px_20px_rgba(21,4,12,0.95)]">
                Jaffna&rsquo;s
              </p>
              <p className="mb-3 bg-gradient-to-br from-cream via-gold to-gold-light bg-clip-text text-[46px] font-extrabold leading-[0.92] tracking-tight text-transparent drop-shadow-[0_2px_20px_rgba(21,4,12,0.95)]">
                finest studios
              </p>
              <p className="text-sm leading-none text-cream-faint/50">find their couples.</p>
            </motion.div>

            <motion.p
              custom={3}
              initial="hidden"
              animate="show"
              variants={fadeUp}
              className="max-w-[340px] text-[13px] leading-relaxed text-cream-dim/70"
            >
              Join TRIBLEERA VAIBHAVAM — where verified studios connect with couples seeking authentic Tamil
              celebrations.
            </motion.p>
          </div>

          {/* Bottom: shimmer divider, quote, social proof */}
          <motion.div custom={4} initial="hidden" animate="show" variants={fadeUp}>
            <div className="mb-4 h-px w-full overflow-hidden rounded-full bg-cream/10">
              <div className="h-full w-full animate-[loading_2.4s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-gold to-transparent" />
            </div>

            <div className="mb-4 flex items-start gap-2.5">
              <motion.span
                animate={{ opacity: [0.55, 0.9, 0.55] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                className="mt-0.5 shrink-0"
              >
                <Sparkles size={14} className="text-gold" aria-hidden="true" />
              </motion.span>
              <p className="text-[12.5px] italic leading-relaxed text-cream-dim/60">
                &ldquo;Every great wedding starts with the right vendors. Be the reason a family says — it was
                perfect.&rdquo;
              </p>
            </div>

            <div className="mb-4 inline-flex items-center gap-2.5 rounded-[8px] border border-gold/[0.18] bg-cream/[0.06] px-3.5 py-2 backdrop-blur-md">
              <div className="flex">
                {AVATARS.map((a, i) => (
                  <div
                    key={a.initials}
                    className="flex h-[22px] w-[22px] items-center justify-center rounded-full border-2 text-[7.5px] font-bold text-gold"
                    style={{
                      background: a.bg,
                      borderColor: "rgba(212,175,106,0.35)",
                      marginLeft: i > 0 ? -7 : 0,
                      zIndex: 4 - i,
                      position: "relative",
                    }}
                  >
                    {a.initials}
                  </div>
                ))}
              </div>
              <p className="text-[11px] leading-tight text-cream-dim/65">
                <strong className="text-gold-light">25+ studios</strong> already
                <br />
                partnered with TRIBLEERA
              </p>
            </div>

            <p className="font-display text-[10.5px] italic text-cream-faint/25">
              தேர்வின் செம்மை, வைபவத்தின் பெருமை
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right panel — min-w-0 so this flex child can actually shrink below
          its content's intrinsic width instead of overflowing the viewport
          on narrower windows (flexbox default is min-width:auto). */}
      <div className="flex min-w-0 flex-1 items-center justify-center px-6 py-12 lg:px-16">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex justify-center lg:hidden">
            <Image
              src="/logo/tribleera-mark-192.png"
              alt="TRIBLEERA"
              width={48}
              height={48}
              className="rounded-[10px]"
            />
          </div>

          <h2 className="mb-1 font-display text-2xl font-semibold text-[#1F2937]">Vendor sign in</h2>
          <p className="mb-8 text-sm text-[#4B5563]">
            New vendor?{" "}
            <Link href="/vendor/register" className="font-semibold text-[#7A1F3D] hover:underline">
              Register your studio →
            </Link>
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="phone" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#4B5563]">
                Phone number
              </label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+94 77 XXX XXXX"
                required
                autoComplete="tel"
                className="w-full rounded border border-slate/20 bg-white px-4 py-3 text-sm text-[#1F2937] placeholder:text-slate/40 focus:border-[#7A1F3D] focus:outline-none focus:ring-1 focus:ring-[#7A1F3D]/20"
              />
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-[#4B5563]">
                  Password
                </label>
                <Link href="/contact" className="text-xs text-[#7A1F3D] hover:underline">
                  Forgot password?
                </Link>
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
                className="w-full rounded border border-slate/20 bg-white px-4 py-3 text-sm text-[#1F2937] placeholder:text-slate/40 focus:border-[#7A1F3D] focus:outline-none focus:ring-1 focus:ring-[#7A1F3D]/20"
              />
            </div>

            {error && (
              <div className="flex items-start gap-2 rounded border border-red-200 bg-red-50 px-3 py-2.5 text-xs text-red-700">
                <AlertCircle size={13} className="mt-0.5 shrink-0" aria-hidden="true" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded bg-[#7A1F3D] py-3 text-sm font-semibold text-white transition-all hover:bg-[#5C0427] disabled:opacity-60"
            >
              {loading ? "Signing in…" : "Sign in to vendor portal"}
            </button>
          </form>

          <div className="mt-6 rounded border border-slate/10 bg-[#FAF7F2] p-3">
            <p className="text-[11px] text-[#4B5563]">
              <strong>Demo credentials:</strong><br />
              Phone: +94771000001<br />
              Password: vendor2026
            </p>
          </div>

          <p className="mt-6 text-center text-xs text-[#4B5563]">
            <Link href="/" className="hover:text-[#7A1F3D]">← Back to TRIBLEERA</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
