"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import { trustSectionImage } from "@/lib/data/images";
import { readCustomerProfile, writeActiveCustomerProfile } from "@/lib/utils/customer-profile";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const redirectPath = searchParams.get("redirect") || "/";

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    // Mock auth — replace with real API call when backend ready
    setTimeout(() => {
      if (email && password.length >= 6) {
        try {
          const profile = readCustomerProfile(email);
          writeActiveCustomerProfile(profile);
        } catch {}
        router.push(redirectPath);
      } else {
        setError("Invalid email or password. Please try again.");
        setLoading(false);
      }
    }, 700);
  }

  return (
    <div data-portal="true" className="font-[Arial,sans-serif]">
      <style>{`
        @keyframes kenBurns {
          from { transform: scale(1.00); }
          to   { transform: scale(1.08); }
        }
        @keyframes imgReveal {
          from { opacity: 0; filter: blur(8px); }
          to   { opacity: 1; filter: blur(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes goldShimmer {
          0%   { background-position: -300% center; }
          100% { background-position:  300% center; }
        }
        @keyframes breathe {
          0%, 100% { opacity: 0.38; }
          50%      { opacity: 0.68; }
        }
        .kb { animation: kenBurns 18s ease-in-out infinite alternate; }
        .ir { animation: imgReveal .9s cubic-bezier(.16,1,.3,1) both; }
        .s1 { animation: slideUp .6s cubic-bezier(.16,1,.3,1) .10s both; }
        .s2 { animation: slideUp .6s cubic-bezier(.16,1,.3,1) .22s both; }
        .s3 { animation: slideUp .6s cubic-bezier(.16,1,.3,1) .34s both; }
        .s4 { animation: slideUp .6s cubic-bezier(.16,1,.3,1) .46s both; }
        .s5 { animation: slideUp .6s cubic-bezier(.16,1,.3,1) .58s both; }
        .breathe { animation: breathe 4s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .kb, .ir, .s1, .s2, .s3, .s4, .s5, .breathe { animation: none; }
        }
        .goldtext {
          background: linear-gradient(90deg,#D4AF6A,#E9CE9C,#F7EEE2,#E9CE9C,#D4AF6A);
          background-size: 300% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: goldShimmer 4s linear infinite;
        }
        .c-inp {
          width: 100%; padding: 12px 14px;
          border: 1.5px solid #E5E7EB; border-radius: 6px;
          font-size: 16px; color: #1F2937; background: #FFFFFF;
          outline: none; box-sizing: border-box;
          font-family: Arial, sans-serif;
          transition: border-color .2s, box-shadow .2s;
        }
        .c-inp::placeholder { color: rgba(31,41,55,0.35); }
        .c-inp:focus {
          border-color: #7A1F3D;
          box-shadow: 0 0 0 3px rgba(122,31,61,0.10);
        }
        .c-btn {
          width: 100%; padding: 13px 0; border: none;
          border-radius: 6px; font-size: 15px; font-weight: 600;
          cursor: pointer; font-family: Arial, sans-serif;
          background: linear-gradient(135deg,#7A1F3D 0%,#5C0427 100%);
          color: #FFFFFF;
          box-shadow: 0 4px 18px rgba(92,4,39,0.30);
          transition: transform .16s, box-shadow .16s;
        }
        .c-btn:hover:not(:disabled) {
          transform: translateY(-1.5px);
          box-shadow: 0 6px 24px rgba(92,4,39,0.40);
        }
        .c-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
        .c-backlink { color: rgba(247,238,226,0.5); text-decoration: none; transition: color .15s; }
        .c-backlink:hover { color: rgba(212,175,106,0.85); }
      `}</style>

      {/* Full-bleed background — homepage-hero pattern */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, overflow: "hidden" }} aria-hidden="true">
        {/* Golden-hour veil couple — faces sit in the upper quarter. */}
        <Image
          src={trustSectionImage}
          alt=""
          fill
          sizes="100vw"
          priority
          quality={90}
          className="kb ir"
          style={{
            objectFit: "cover",
            objectPosition: "center 24%",
            filter: "brightness(0.82) saturate(1.05)",
          }}
        />
        <div style={{ position: "absolute", inset: 0, background: "rgba(21,4,12,0.50)" }} />
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
            background:
              "linear-gradient(to bottom, rgba(21,4,12,0.50) 0%, transparent 35%, rgba(21,4,12,0.70) 100%)",
          }}
        />
      </div>

      {/* Centered content */}
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
        {/* Brand */}
        <div className="s1" style={{ textAlign: "center", marginBottom: 28 }}>
          <Image
            src="/logo/tribleera-mark-192.png"
            alt="TRIBLEERA VAIBHAVAM"
            width={50}
            height={50}
            style={{
              borderRadius: 10,
              margin: "0 auto 10px",
              display: "block",
              boxShadow: "0 0 0 1px rgba(212,175,106,.40), 0 0 26px rgba(212,175,106,.24)",
            }}
          />
          <p className="goldtext" style={{ fontWeight: 700, fontSize: 15, letterSpacing: "0.20em" }}>
            TRIBLEERA
          </p>
          <p style={{ color: "rgba(233,206,156,0.55)", fontSize: 7.5, letterSpacing: "0.30em", marginTop: 2 }}>
            VAIBHAVAM
          </p>
        </div>

        {/* Floating ivory card */}
        <div
          className="s2"
          style={{
            width: "100%",
            maxWidth: 420,
            background: "rgba(250,247,242,0.96)",
            border: "1px solid rgba(212,175,106,0.20)",
            borderRadius: 16,
            padding: "32px 28px",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            boxShadow: "0 24px 64px rgba(21,4,12,0.45)",
          }}
        >
          <h1
            className="s3"
            style={{ color: "#1F2937", fontSize: 23, fontWeight: 700, marginBottom: 4, letterSpacing: "-0.01em" }}
          >
            Welcome back
          </h1>
          <p className="s3" style={{ color: "#6B7280", fontSize: 13, marginBottom: 24 }}>
            New to TRIBLEERA?{" "}
            <Link
              href={`/signup?redirect=${encodeURIComponent(redirectPath)}`}
              style={{ color: "#7A1F3D", fontWeight: 600, textDecoration: "none" }}
            >
              Create an account →
            </Link>
          </p>

          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div className="s4">
              <label
                htmlFor="c-em"
                style={{
                  display: "block",
                  fontSize: 9.5,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.14em",
                  color: "#6B7280",
                  marginBottom: 6,
                }}
              >
                Email
              </label>
              <input
                id="c-em"
                type="email"
                value={email}
                required
                autoComplete="email"
                placeholder="you@example.com"
                onChange={(e) => setEmail(e.target.value)}
                className="c-inp"
              />
            </div>

            <div className="s4">
              <label
                htmlFor="c-pw"
                style={{
                  display: "block",
                  fontSize: 9.5,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.14em",
                  color: "#6B7280",
                  marginBottom: 6,
                }}
              >
                Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  id="c-pw"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  onChange={(e) => setPassword(e.target.value)}
                  className="c-inp"
                  style={{ paddingRight: 40 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  style={{
                    position: "absolute",
                    right: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "rgba(31,41,55,0.4)",
                    display: "flex",
                    padding: 4,
                  }}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {error && (
              <div
                className="s4"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  background: "#FEE2E2",
                  border: "1px solid #FECACA",
                  borderRadius: 5,
                  padding: "9px 12px",
                  fontSize: 12,
                  color: "#991B1B",
                }}
              >
                <AlertCircle size={13} aria-hidden="true" /> {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="s5 c-btn" style={{ marginTop: 4 }}>
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <p style={{ marginTop: 18, textAlign: "center", fontSize: 12, color: "#6B7280" }}>
            Are you a vendor?{" "}
            <Link href="/vendor/register" style={{ color: "#7A1F3D", fontWeight: 500, textDecoration: "none" }}>
              Register your studio →
            </Link>
          </p>
          <p style={{ marginTop: 8, textAlign: "center", fontSize: 11 }}>
            <Link href="/admin/login" style={{ color: "#C9BCAF", textDecoration: "none" }}>
              Admin access
            </Link>
          </p>
        </div>

        {/* Bottom */}
        <div className="s5" style={{ marginTop: 18, textAlign: "center" }}>
          <Link href="/" className="c-backlink" style={{ fontSize: 12 }}>
            ← Back to TRIBLEERA VAIBHAVAM
          </Link>
        </div>

        <p
          className="breathe"
          style={{
            position: "fixed",
            bottom: 20,
            left: 0,
            right: 0,
            textAlign: "center",
            color: "rgba(247,238,226,0.18)",
            fontSize: 10.5,
            fontStyle: "italic",
            zIndex: 5,
          }}
        >
          தேர்வின் செம்மை, வைபவத்தின் பெருமை
        </p>
      </div>
    </div>
  );
}
