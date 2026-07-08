"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AlertCircle } from "lucide-react";

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
      {/* Left panel */}
      <div className="relative hidden overflow-hidden lg:flex lg:w-1/2 lg:flex-col lg:items-center lg:justify-center lg:bg-[#15040C] lg:px-12">
        <div className="pointer-events-none absolute inset-0 opacity-[0.04]">
          <svg viewBox="0 0 200 200" fill="none" className="h-full w-full">
            <path d="M40 180 V100 C40 50 65 15 100 15 C135 15 160 50 160 100 V180" stroke="#D4AF6A" strokeWidth="3" />
            <path d="M62 180 V104 C62 68 78 38 100 38 C122 38 138 68 138 104 V180" stroke="#D4AF6A" strokeWidth="3" />
          </svg>
        </div>
        <Image
          src="/logo/tribleera-mark-192.png"
          alt="TRIBLEERA"
          width={64}
          height={64}
          className="mb-6 rounded-[12px]"
          style={{ boxShadow: "0 0 30px rgba(212,175,106,0.3)" }}
        />
        <h1 className="mb-3 text-center font-display text-3xl font-bold text-[#F7EEE2]">
          Your studio.<br />Your bookings.
        </h1>
        <p className="max-w-xs text-center text-sm leading-relaxed text-[#C9BCAF]">
          Manage requests, update your profile, and track your revenue — all in one place.
        </p>
        <p className="mt-8 font-display text-sm italic text-[#D4AF6A]/70">
          தேர்வின் செம்மை, வைபவத்தின் பெருமை
        </p>
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
