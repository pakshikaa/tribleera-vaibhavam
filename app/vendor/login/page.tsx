"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AlertCircle, Camera, Shield, Star, TrendingUp } from "lucide-react";
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

const BENEFITS = [
  { icon: TrendingUp, text: "Earn LKR 50K–350K per event" },
  { icon: Shield, text: "Advance secured in escrow — always paid" },
  { icon: Star, text: "Grow your trust score and get more bookings" },
  { icon: Camera, text: "Professional profile visible to 1000s of couples" },
];

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
      {/* Left panel — image + benefits */}
      <div className="relative hidden w-[45%] shrink-0 overflow-hidden lg:block">
        <Image src={vendorLoginImage} alt="" fill sizes="45vw" priority className="object-cover object-top" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(21,4,12,0.7) 0%, rgba(21,4,12,0.35) 45%, rgba(21,4,12,0.9) 100%)",
          }}
        />
        <div className="absolute inset-0 bg-burgundy-950/20" />

        <div className="relative z-10 flex h-full flex-col p-9">
          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <Image
              src="/logo/tribleera-mark-192.png"
              alt="TRIBLEERA"
              width={36}
              height={36}
              className="rounded-[8px] shadow-[0_0_18px_rgba(212,175,106,0.35)]"
            />
            <div className="leading-none">
              <p className="font-display text-[13px] font-bold tracking-[0.18em] text-gold">TRIBLEERA</p>
              <p className="mt-1 font-display text-[7.5px] tracking-[0.28em] text-gold-light/70">VAIBHAVAM</p>
            </div>
          </div>

          {/* Headline */}
          <div className="flex flex-1 flex-col justify-center">
            <p className="mb-3 text-[10px] uppercase tracking-[0.2em] text-gold/70">Vendor Partner Portal</p>
            <h1
              className="mb-3.5 font-display text-3xl font-bold leading-tight text-cream"
              style={{ textShadow: "0 2px 20px rgba(21,4,12,0.9)" }}
            >
              Your studio.
              <br />
              <span className="text-gold">Your success.</span>
            </h1>
            <p className="max-w-[300px] text-[13px] leading-relaxed text-cream-dim/70">
              Manage bookings, respond to requests, and grow your business with Jaffna&rsquo;s most trusted
              wedding platform.
            </p>
          </div>

          {/* Why vendors choose us */}
          <div>
            <p className="mb-2.5 text-[9.5px] uppercase tracking-[0.14em] text-gold/55">Why vendors choose us</p>
            <div className="flex flex-col gap-2">
              {BENEFITS.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2.5">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[6px] border border-gold/20 bg-gold/[0.12]">
                    <Icon size={13} className="text-gold" aria-hidden="true" />
                  </div>
                  <span className="text-xs leading-tight text-cream-dim/75">{text}</span>
                </div>
              ))}
            </div>
            <p className="mt-5 font-display text-[10px] italic text-cream-faint/40">
              தேர்வின் செம்மை, வைபவத்தின் பெருமை
            </p>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex flex-1 items-center justify-center px-6 py-12 lg:px-16">
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
