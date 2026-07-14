"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import { commonLoginImage } from "@/lib/data/images";
import { ADMIN_LOGIN_PATH } from "@/lib/utils/adminAuth";
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

    setTimeout(() => {
      if (email && password.length >= 6) {
        try {
          const profile = readCustomerProfile(email);
          writeActiveCustomerProfile(profile);
        } catch {}
        router.push(redirectPath);
        return;
      }

      setError("Invalid email or password. Please try again.");
      setLoading(false);
    }, 700);
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
          0%, 100% { opacity: 0.34; transform: scale(1); }
          50% { opacity: 0.60; transform: scale(1.08); }
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
        .scene-photo-common {
          object-position: center 24%;
          filter: brightness(0.86) saturate(1.01) contrast(1.01);
        }
        .auth-card-common {
          background: linear-gradient(180deg, rgba(252,248,243,0.94) 0%, rgba(250,247,242,0.90) 100%);
          border: 1px solid rgba(212,175,106,0.18);
          border-radius: 24px;
          backdrop-filter: blur(28px);
          -webkit-backdrop-filter: blur(28px);
          box-shadow: 0 30px 80px rgba(21,4,12,0.34), 0 0 0 1px rgba(255,255,255,0.35) inset;
        }
        .c-inp {
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
        .c-inp::placeholder { color: rgba(31,41,55,0.35); }
        .c-inp:focus {
          border-color: #7A1F3D;
          box-shadow: 0 0 0 4px rgba(122,31,61,0.10);
          background: #FFFFFF;
        }
        .c-btn {
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
        .c-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 16px 34px rgba(92,4,39,0.34);
        }
        .c-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
        .c-backlink { color: rgba(247,238,226,0.58); text-decoration: none; transition: color .15s; }
        .c-backlink:hover { color: rgba(212,175,106,0.90); }
        .c-helper-row {
          display: grid;
          gap: 10px;
          margin-top: 18px;
        }
        .c-helper-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 14px 16px;
          border-radius: 14px;
          border: 1px solid rgba(122,31,61,0.12);
          background: linear-gradient(180deg, rgba(255,255,255,0.82) 0%, rgba(248,242,236,0.92) 100%);
          text-decoration: none;
          transition: transform .16s, box-shadow .16s, border-color .16s;
        }
        .c-helper-card:hover {
          transform: translateY(-1px);
          border-color: rgba(122,31,61,0.22);
          box-shadow: 0 12px 24px rgba(92,4,39,0.08);
        }
        .c-helper-copy { min-width: 0; }
        .c-helper-label {
          display: block;
          color: #9CA3AF;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          margin-bottom: 3px;
        }
        .c-helper-title {
          display: block;
          color: #7A1F3D;
          font-size: 14px;
          font-weight: 600;
          line-height: 1.45;
        }
        .c-helper-arrow {
          color: #7A1F3D;
          font-size: 16px;
          flex: 0 0 auto;
        }
        .auth-shell {
          width: 100%;
          max-width: 1400px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .auth-column {
          width: 100%;
          max-width: 420px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        @media (max-width: 767px) {
          .scene-photo-common { object-position: center 18%; }
        }
        @media (min-width: 960px) {
          .auth-shell {
            align-items: center;
            padding-left: 0;
          }
          .auth-column {
            max-width: 420px;
            align-items: center;
            padding: 0;
            background: transparent;
            backdrop-filter: none;
            -webkit-backdrop-filter: none;
            border-right: none;
          }
        }
      `}</style>

      <div style={{ position: "fixed", inset: 0, zIndex: 0, overflow: "hidden" }} aria-hidden="true">
        <Image
          src={commonLoginImage}
          alt=""
          fill
          sizes="100vw"
          priority
          quality={90}
          className="kb ir scene-photo-common"
          style={{ objectFit: "cover" }}
        />
        <div style={{ position: "absolute", inset: 0, background: "rgba(21,4,12,0.10)" }} />
        <div
          className="scene-aura"
          style={{
            position: "absolute",
            inset: "-10%",
            background:
              "radial-gradient(circle at 50% 28%, rgba(247,238,226,0.28) 0%, rgba(233,206,156,0.14) 24%, rgba(122,31,61,0.10) 48%, transparent 72%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 82% 78% at 60% 42%, transparent 30%, rgba(21,4,12,0.22) 68%, rgba(21,4,12,0.68) 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(90deg, rgba(21,4,12,0.48) 0%, rgba(21,4,12,0.26) 26%, rgba(21,4,12,0.10) 54%, rgba(21,4,12,0.34) 100%)",
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
            <div className="s1" style={{ textAlign: "center", marginBottom: 28, width: "100%" }}>
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

            <div
              className="s2 auth-card-common"
              style={{
                width: "100%",
                maxWidth: 420,
                padding: "32px 28px",
              }}
            >
          <h1
            className="s3"
            style={{ color: "#1F2937", fontSize: 23, fontWeight: 700, marginBottom: 4, letterSpacing: "-0.01em" }}
          >
            Welcome back
          </h1>
          <p className="s3" style={{ color: "#6B7280", fontSize: 13, marginBottom: 22, lineHeight: 1.65 }}>
            New to TRIBLEERA?{" "}
            <Link
              href={`/signup?redirect=${encodeURIComponent(redirectPath)}`}
              style={{ color: "#7A1F3D", fontWeight: 600, textDecoration: "none" }}
            >
              Create an account
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
                  placeholder="Enter your password"
                  onChange={(e) => setPassword(e.target.value)}
                  className="c-inp"
                  style={{ paddingRight: 40 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
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
                  borderRadius: 12,
                  padding: "11px 12px",
                  fontSize: 12,
                  color: "#991B1B",
                  lineHeight: 1.55,
                }}
              >
                <AlertCircle size={14} aria-hidden="true" />
                <span>{error}</span>
              </div>
            )}

            <button type="submit" disabled={loading} className="s5 c-btn" style={{ marginTop: 4 }}>
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <div className="c-helper-row">
            <Link href="/vendor/register" className="c-helper-card">
              <span className="c-helper-copy">
                <span className="c-helper-label">Service providers</span>
                <span className="c-helper-title">Join as a partner and list your services</span>
              </span>
              <span className="c-helper-arrow" aria-hidden="true">→</span>
            </Link>
          </div>

          <p style={{ marginTop: 8, textAlign: "center", fontSize: 11 }}>
            <Link href={ADMIN_LOGIN_PATH} style={{ color: "#C9BCAF", textDecoration: "none" }}>
              Admin access
            </Link>
          </p>
            </div>
          </div>
        </div>

        <div className="s5" style={{ marginTop: 18, textAlign: "center" }}>
          <Link href="/" className="c-backlink" style={{ fontSize: 12 }}>
            Back to TRIBLEERA VAIBHAVAM
          </Link>
        </div>
      </div>
    </div>
  );
}
