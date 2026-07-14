"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AlertCircle } from "lucide-react";
import { vendorLoginImage } from "@/lib/data/images";
import { getVendorCompletion, loginVendor } from "@/lib/utils/vendorPortal";

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
          0% { transform: scale(1.02) translate3d(0, 0, 0); }
          50% { transform: scale(1.07) translate3d(-1.2%, -0.8%, 0); }
          100% { transform: scale(1.10) translate3d(1.2%, 0.8%, 0); }
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
        @keyframes auraPulse {
          0%, 100% { opacity: 0.32; transform: scale(1); }
          50% { opacity: 0.56; transform: scale(1.08); }
        }
        .kb { animation: kenBurns 26s ease-in-out infinite alternate; }
        .ir { animation: imgReveal .9s cubic-bezier(.16,1,.3,1) both; }
        .s1 { animation: slideUp .6s cubic-bezier(.16,1,.3,1) .10s both; }
        .s2 { animation: slideUp .6s cubic-bezier(.16,1,.3,1) .22s both; }
        .s3 { animation: slideUp .6s cubic-bezier(.16,1,.3,1) .34s both; }
        .s4 { animation: slideUp .6s cubic-bezier(.16,1,.3,1) .46s both; }
        .s5 { animation: slideUp .6s cubic-bezier(.16,1,.3,1) .58s both; }
        .scene-aura { animation: auraPulse 11s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .kb, .ir, .s1, .s2, .s3, .s4, .s5, .scene-aura { animation: none; }
        }
        .goldtext {
          background: linear-gradient(90deg,#D4AF6A,#E9CE9C,#F7EEE2,#E9CE9C,#D4AF6A);
          background-size: 300% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: goldShimmer 4s linear infinite;
        }
        .scene-photo-vendor {
          object-position: center 18%;
          filter: brightness(0.80) saturate(1.02) contrast(1.02);
        }
        .v-panel {
          width: 100%;
          max-width: 500px;
          border-radius: 26px;
          border: 1px solid rgba(212,175,106,0.18);
          background: linear-gradient(180deg, rgba(252,248,243,0.92) 0%, rgba(250,247,242,0.88) 100%);
          padding: 34px 30px 30px;
          backdrop-filter: blur(28px);
          -webkit-backdrop-filter: blur(28px);
          box-shadow: 0 30px 80px rgba(21,4,12,0.34), 0 0 0 1px rgba(255,255,255,0.32) inset;
        }
        .v-inp {
          width: 100%;
          padding: 14px 15px;
          border: 1.5px solid #E5E7EB;
          border-radius: 12px;
          font-size: 16px;
          color: #1F2937;
          background: rgba(255,255,255,0.92);
          outline: none;
          box-sizing: border-box;
          font-family: Arial, sans-serif;
          transition: border-color .2s, box-shadow .2s, background-color .2s;
        }
        .v-inp::placeholder { color: rgba(31,41,55,0.35); }
        .v-inp:focus {
          border-color: #7A1F3D;
          box-shadow: 0 0 0 4px rgba(122,31,61,0.10);
          background: #FFFFFF;
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
          box-shadow: 0 12px 26px rgba(92,4,39,0.28);
          transition: transform .16s, box-shadow .16s, opacity .16s;
        }
        .v-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 16px 34px rgba(92,4,39,0.34);
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
        .auth-shell {
          width: 100%;
          max-width: 1400px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .auth-column {
          width: 100%;
          max-width: 500px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        @media (max-width: 767px) {
          .scene-photo-vendor { object-position: center 14%; }
        }
        @media (min-width: 960px) {
          .auth-shell {
            align-items: center;
            padding-right: 0;
          }
          .auth-column {
            max-width: 500px;
            align-items: center;
            margin-left: 0;
            padding: 0;
            background: transparent;
            backdrop-filter: none;
            -webkit-backdrop-filter: none;
            border-left: none;
          }
        }
      `}</style>

      <div style={{ position: "fixed", inset: 0, zIndex: 0, overflow: "hidden" }} aria-hidden="true">
        <Image
          src={vendorLoginImage}
          alt=""
          fill
          sizes="100vw"
          priority
          quality={90}
          className="kb ir scene-photo-vendor"
          style={{ objectFit: "cover" }}
        />
        <div style={{ position: "absolute", inset: 0, background: "rgba(21,4,12,0.10)" }} />
        <div
          className="scene-aura"
          style={{
            position: "absolute",
            inset: "-10%",
            background:
              "radial-gradient(circle at 52% 26%, rgba(247,238,226,0.28) 0%, rgba(233,206,156,0.14) 24%, rgba(122,31,61,0.10) 48%, transparent 72%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 84% 78% at 42% 40%, transparent 28%, rgba(21,4,12,0.24) 68%, rgba(21,4,12,0.72) 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(90deg, rgba(21,4,12,0.18) 0%, rgba(21,4,12,0.08) 34%, rgba(21,4,12,0.22) 62%, rgba(21,4,12,0.54) 100%)",
          }}
        />
      </div>

      <div
        style={{
          position: "relative",
          zIndex: 10,
          minHeight: "100svh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px 20px",
        }}
      >
        <div className="auth-shell">
          <div className="auth-column">
            <div className="lg:hidden s1" style={{ textAlign: "center", marginBottom: 24, width: "100%" }}>
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

            <div className="s1 hidden lg:block" style={{ textAlign: "left", marginBottom: 28, width: "100%" }}>
              <Image
                src="/logo/tribleera-mark-192.png"
                alt="TRIBLEERA VAIBHAVAM"
                width={52}
                height={52}
                style={{
                  borderRadius: 11,
                  margin: "0 0 12px",
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
          <h1
            className="s3"
            style={{
              color: "#1F2937",
              fontSize: 28,
              fontWeight: 700,
              marginBottom: 6,
              letterSpacing: "-0.02em",
              lineHeight: 1.08,
            }}
          >
            Vendor sign in
          </h1>

          <p className="s3" style={{ color: "#6B7280", fontSize: 14, marginBottom: 20, lineHeight: 1.6 }}>
            Use your approved studio email or phone number to continue.
          </p>

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

          <p style={{ marginTop: 18, textAlign: "center", fontSize: 12, color: "#6B7280", lineHeight: 1.6 }}>
            Need a studio account?{" "}
            <Link href="/vendor/register" style={{ color: "#7A1F3D", fontWeight: 600, textDecoration: "none" }}>
              Register your studio
            </Link>
          </p>
            </div>
          </div>
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
