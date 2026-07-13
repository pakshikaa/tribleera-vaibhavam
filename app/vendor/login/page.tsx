"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AlertCircle, ArrowRight, Sparkles, UserPlus } from "lucide-react";
import { vendorLoginImage } from "@/lib/data/images";
import { getVendorCompletion, loginVendor, normalisePhone } from "@/lib/utils/vendorPortal";

const STATIC_FALLBACK = [
  { slug: "pushpa-florals-and-decor", phone: "+94771000001", businessName: "Pushpa Florals & Decor" },
  { slug: "jaffna-frames-studio", phone: "+94771000002", businessName: "Jaffna Frames Studio" },
];

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
        const result = loginVendor(phone, password);
        if (result.ok) {
          const completion = getVendorCompletion(result.vendor.slug);
          router.push(completion.readyToGoLive || result.vendor.profileComplete ? "/dashboard/vendor" : "/dashboard/vendor/setup");
          return;
        }

        if (result.reason === "suspended") {
          setError(
            `This vendor account is suspended. Reason: ${result.vendor?.suspensionReason ?? "Contact admin for details"}. A notification was sent to ${result.vendor?.email ?? "your registered email"}.`
          );
          setLoading(false);
          return;
        }

        if (result.reason === "email_unverified") {
          setError(
            `This email is not verified yet. Please open the verification link sent to ${result.vendor?.email ?? "your registered email"} before signing in.`
          );
          setLoading(false);
          return;
        }

        if (password === "vendor2026") {
          const fallback = STATIC_FALLBACK.find((vendor) => normalisePhone(vendor.phone) === normalisePhone(phone));
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
    <div data-portal="true" className="font-[Arial,sans-serif]">
      <style>{`
        @keyframes kenBurns {
          from { transform: scale(1); }
          to { transform: scale(1.08); }
        }
        @keyframes imgReveal {
          from { opacity: 0; filter: blur(8px); }
          to { opacity: 1; filter: blur(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes goldShimmer {
          0% { background-position: -300% center; }
          100% { background-position: 300% center; }
        }
        .kb { animation: kenBurns 18s ease-in-out infinite alternate; }
        .ir { animation: imgReveal .9s cubic-bezier(.16,1,.3,1) both; }
        .s1 { animation: slideUp .6s cubic-bezier(.16,1,.3,1) .10s both; }
        .s2 { animation: slideUp .6s cubic-bezier(.16,1,.3,1) .22s both; }
        .s3 { animation: slideUp .6s cubic-bezier(.16,1,.3,1) .34s both; }
        .s4 { animation: slideUp .6s cubic-bezier(.16,1,.3,1) .46s both; }
        .s5 { animation: slideUp .6s cubic-bezier(.16,1,.3,1) .58s both; }
        @media (prefers-reduced-motion: reduce) {
          .kb, .ir, .s1, .s2, .s3, .s4, .s5 { animation: none; }
        }
        .goldtext {
          background: linear-gradient(90deg,#D4AF6A,#E9CE9C,#F7EEE2,#E9CE9C,#D4AF6A);
          background-size: 300% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: goldShimmer 4s linear infinite;
        }
        .v-panel {
          width: 100%;
          max-width: 500px;
          border-radius: 28px;
          border: 1px solid rgba(212,175,106,0.20);
          background:
            linear-gradient(180deg, rgba(255,255,255,0.97) 0%, rgba(250,247,242,0.96) 100%);
          padding: 34px 30px 30px;
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          box-shadow: 0 28px 70px rgba(21,4,12,0.42);
        }
        .v-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 7px 12px;
          margin-bottom: 16px;
          border-radius: 999px;
          background: rgba(122,31,61,0.08);
          color: #7A1F3D;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }
        .v-helper-grid {
          display: grid;
          gap: 10px;
          margin: 20px 0 22px;
        }
        .v-helper-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 15px;
          border-radius: 14px;
          border: 1px solid rgba(122,31,61,0.12);
          background: linear-gradient(180deg, rgba(255,255,255,0.92) 0%, rgba(248,242,236,0.96) 100%);
          text-decoration: none;
          transition: transform .16s, box-shadow .16s, border-color .16s;
        }
        .v-helper-card:hover {
          transform: translateY(-1px);
          border-color: rgba(122,31,61,0.25);
          box-shadow: 0 12px 28px rgba(92,4,39,0.08);
        }
        .v-helper-icon {
          display: grid;
          place-items: center;
          width: 40px;
          height: 40px;
          border-radius: 12px;
          flex: 0 0 auto;
          background: rgba(122,31,61,0.08);
          color: #7A1F3D;
        }
        .v-helper-copy {
          flex: 1;
          min-width: 0;
        }
        .v-helper-eyebrow {
          display: block;
          margin: 0 0 2px;
          color: #9CA3AF;
          font-size: 11px;
          line-height: 1.35;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }
        .v-helper-title {
          display: block;
          margin: 0;
          color: #5C0427;
          font-size: 14px;
          font-weight: 700;
          line-height: 1.4;
        }
        .v-helper-arrow {
          color: #7A1F3D;
          flex: 0 0 auto;
        }
        .v-inp {
          width: 100%;
          padding: 14px 15px;
          border: 1.5px solid #E5E7EB;
          border-radius: 12px;
          font-size: 16px;
          color: #1F2937;
          background: #FFFFFF;
          outline: none;
          box-sizing: border-box;
          font-family: Arial, sans-serif;
          transition: border-color .2s, box-shadow .2s, background-color .2s;
        }
        .v-inp::placeholder { color: rgba(31,41,55,0.35); }
        .v-inp:focus {
          border-color: #7A1F3D;
          box-shadow: 0 0 0 4px rgba(122,31,61,0.10);
          background: #FFFDFC;
        }
        .v-btn {
          width: 100%;
          padding: 15px 0;
          border: none;
          border-radius: 14px;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          font-family: Arial, sans-serif;
          background: linear-gradient(135deg,#7A1F3D 0%,#5C0427 100%);
          color: #FFFFFF;
          box-shadow: 0 10px 24px rgba(92,4,39,0.26);
          transition: transform .16s, box-shadow .16s, opacity .16s;
        }
        .v-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 14px 30px rgba(92,4,39,0.34);
        }
        .v-btn:disabled {
          opacity: 0.65;
          cursor: not-allowed;
          transform: none;
        }
        .v-backlink {
          color: rgba(247,238,226,0.58);
          text-decoration: none;
          transition: color .15s;
        }
        .v-backlink:hover { color: rgba(212,175,106,0.90); }
      `}</style>

      <div style={{ position: "fixed", inset: 0, zIndex: 0, overflow: "hidden" }} aria-hidden="true">
        <Image
          src={vendorLoginImage}
          alt=""
          fill
          sizes="100vw"
          priority
          quality={90}
          className="kb ir"
          style={{
            objectFit: "cover",
            objectPosition: "center 34%",
            filter: "brightness(0.72) saturate(1.02)",
          }}
        />
        <div style={{ position: "absolute", inset: 0, background: "rgba(21,4,12,0.54)" }} />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 85% 85% at 50% 40%, transparent 18%, rgba(21,4,12,0.55) 68%, rgba(21,4,12,0.90) 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to bottom, rgba(21,4,12,0.48) 0%, transparent 35%, rgba(21,4,12,0.72) 100%)",
          }}
        />
      </div>

      <div
        style={{
          position: "relative",
          zIndex: 10,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px 20px",
        }}
      >
        <div className="lg:hidden" style={{ textAlign: "center", marginBottom: 24 }}>
          <Image
            src="/logo/tribleera-mark-192.png"
            alt="TRIBLEERA VAIBHAVAM"
            width={48}
            height={48}
            style={{
              borderRadius: 10,
              margin: "0 auto 10px",
              display: "block",
              boxShadow: "0 0 0 1px rgba(212,175,106,.40), 0 0 26px rgba(212,175,106,.24)",
            }}
          />
          <p style={{ color: "#D4AF6A", fontWeight: 700, fontSize: 15, letterSpacing: "0.20em" }}>
            TRIBLEERA
          </p>
          <p style={{ color: "rgba(233,206,156,0.55)", fontSize: 8, letterSpacing: "0.30em", marginTop: 2 }}>
            VAIBHAVAM
          </p>
        </div>

        <div className="s1 hidden lg:block" style={{ textAlign: "center", marginBottom: 28 }}>
          <Image
            src="/logo/tribleera-mark-192.png"
            alt="TRIBLEERA VAIBHAVAM"
            width={52}
            height={52}
            style={{
              borderRadius: 11,
              margin: "0 auto 12px",
              display: "block",
              boxShadow: "0 0 0 1px rgba(212,175,106,.40), 0 0 26px rgba(212,175,106,.24)",
            }}
          />
          <p className="goldtext" style={{ fontWeight: 700, fontSize: 16, letterSpacing: "0.20em" }}>
            TRIBLEERA
          </p>
          <p style={{ color: "rgba(233,206,156,0.55)", fontSize: 8, letterSpacing: "0.30em", marginTop: 2 }}>
            VAIBHAVAM
          </p>
          <p
            style={{
              color: "rgba(247,238,226,0.35)",
              fontSize: 9,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              marginTop: 8,
            }}
          >
            Vendor Portal
          </p>
        </div>

        <div className="s2 v-panel">
          <div className="s3 v-badge">
            <Sparkles size={13} aria-hidden="true" />
            Vendor access
          </div>

          <h1
            className="s3"
            style={{
              color: "#1F2937",
              fontSize: 30,
              fontWeight: 700,
              marginBottom: 8,
              letterSpacing: "-0.02em",
              lineHeight: 1.08,
            }}
          >
            Vendor sign in
          </h1>

          <p className="s3" style={{ color: "#6B7280", fontSize: 14, marginBottom: 0, lineHeight: 1.6 }}>
            Sign in with your approved studio email or phone number. If you are new, start with studio registration.
          </p>

          <div className="s4 v-helper-grid">
            <Link href="/vendor/register" className="v-helper-card">
              <span className="v-helper-icon" aria-hidden="true">
                <UserPlus size={18} />
              </span>
              <span className="v-helper-copy">
                <span className="v-helper-eyebrow">New vendor</span>
                <span className="v-helper-title">Register your studio</span>
              </span>
              <ArrowRight size={16} className="v-helper-arrow" aria-hidden="true" />
            </Link>
          </div>

          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div className="s4">
              <label
                htmlFor="v-ph"
                style={{
                  display: "block",
                  fontSize: 9.5,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.14em",
                  color: "#6B7280",
                  marginBottom: 7,
                }}
              >
                Email or phone number
              </label>
              <input
                id="v-ph"
                type="text"
                value={phone}
                required
                autoComplete="username"
                placeholder="you@studio.com or +94 77 123 4567"
                onChange={(e) => setPhone(e.target.value)}
                className="v-inp"
              />
            </div>

            <div className="s4">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7 }}>
                <label
                  htmlFor="v-pw"
                  style={{
                    fontSize: 9.5,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.14em",
                    color: "#6B7280",
                  }}
                >
                  Password
                </label>
                <Link href="/vendor/forgot-password" style={{ fontSize: 11, color: "#7A1F3D", textDecoration: "none" }}>
                  Forgot password?
                </Link>
              </div>
              <input
                id="v-pw"
                type="password"
                value={password}
                required
                autoComplete="current-password"
                placeholder="Enter your password"
                onChange={(e) => setPassword(e.target.value)}
                className="v-inp"
              />
            </div>

            {error && (
              <div
                className="s4"
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 8,
                  background: "#FEE2E2",
                  border: "1px solid #FECACA",
                  borderRadius: 12,
                  padding: "11px 12px",
                  fontSize: 12,
                  color: "#991B1B",
                  lineHeight: 1.55,
                }}
              >
                <AlertCircle size={14} aria-hidden="true" style={{ flex: "0 0 auto", marginTop: 1 }} />
                <span>{error}</span>
              </div>
            )}

            <button type="submit" disabled={loading} className="s5 v-btn" style={{ marginTop: 4 }}>
              {loading ? "Signing in..." : "Sign in to vendor portal"}
            </button>
          </form>
        </div>

        <div className="s5" style={{ marginTop: 18, textAlign: "center" }}>
          <Link href="/" className="v-backlink" style={{ fontSize: 12 }}>
            Back to TRIBLEERA VAIBHAVAM
          </Link>
        </div>
      </div>
    </div>
  );
}
