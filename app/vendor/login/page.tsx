"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AlertCircle, ArrowRight, BriefcaseBusiness, CircleDot, Eye, EyeOff, MailCheck, ShieldCheck } from "lucide-react";
import { createVendorPasswordReset, getVendorCompletion, loginVendor } from "@/lib/utils/vendorPortal";

const BENEFITS = [
  "Reach couples looking for trusted wedding services",
  "Advance secured through the TRIBLEERA flow",
  "Build ranking with reviews and trust signals",
  "Manage enquiries, packages, and bookings in one place",
];

export default function VendorLoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [resetIdentifier, setResetIdentifier] = useState("");
  const [resetState, setResetState] = useState<"idle" | "sent">("idle");

  function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    window.setTimeout(() => {
      try {
        const result = loginVendor(identifier, password);
        if (result.ok) {
          const completion = getVendorCompletion(result.vendor.slug);
          router.push(completion.readyToGoLive || result.vendor.profileComplete ? "/dashboard/vendor" : "/dashboard/vendor/setup");
          return;
        }

        if (result.reason === "suspended") {
          setError(`This account is suspended. ${result.vendor?.suspensionReason ?? "Contact admin for details."}`);
          setLoading(false);
          return;
        }

        if (result.reason === "email_unverified") {
          setError(`Email not verified yet. Open the verification link sent to ${result.vendor?.email ?? "your inbox"}.`);
          setLoading(false);
          return;
        }

        setError("Invalid credentials. Check your email or phone number and try again.");
      } catch {
        setError("Something went wrong. Please try again.");
      }

      setLoading(false);
    }, 850);
  }

  function handleReset(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    createVendorPasswordReset(resetIdentifier);
    setResetState("sent");
  }

  return (
    <>
      {showForgot ? (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 50,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
            background: "rgba(8, 4, 7, .62)",
            backdropFilter: "blur(8px)",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 380,
              borderRadius: 22,
              background: "linear-gradient(180deg, rgba(252,248,243,.96) 0%, rgba(250,247,242,.98) 100%)",
              border: "1px solid rgba(255,255,255,.46)",
              boxShadow: "0 28px 70px rgba(21,4,12,.24)",
              padding: "24px 22px",
            }}
          >
            {resetState === "sent" ? (
              <div style={{ textAlign: "center" }}>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: 12, color: "#7A1F3D" }}>
                  <MailCheck size={34} />
                </div>
                <h2 style={{ color: "#243044", fontFamily: "var(--font-display)", fontSize: 28 }}>Check your inbox</h2>
                <p style={{ color: "#5B6576", fontSize: 13.5, lineHeight: 1.7, marginTop: 10 }}>
                  If a partner account exists for <strong>{resetIdentifier}</strong>, reset instructions have been queued.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setShowForgot(false);
                    setResetIdentifier("");
                    setResetState("idle");
                  }}
                  className="portal-btn"
                  style={{
                    marginTop: 18,
                    width: "100%",
                    border: 0,
                    borderRadius: 14,
                    padding: "13px 0",
                    background: "linear-gradient(135deg, #7A1F3D 0%, #5C0427 100%)",
                    color: "#fff",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Back to sign in
                </button>
              </div>
            ) : (
              <>
                <h2 style={{ color: "#243044", fontFamily: "var(--font-display)", fontSize: 28 }}>Reset password</h2>
                <p style={{ color: "#5B6576", fontSize: 13.5, lineHeight: 1.7, marginTop: 10 }}>
                  Enter your registered email or phone number to receive a secure reset link.
                </p>
                <form onSubmit={handleReset} style={{ display: "grid", gap: 12, marginTop: 18 }}>
                  <input
                    type="text"
                    required
                    value={resetIdentifier}
                    onChange={(event) => setResetIdentifier(event.target.value)}
                    placeholder="you@service.com or +94 77 123 4567"
                    className="vendor-input"
                    style={{
                      width: "100%",
                      padding: "14px 16px",
                      borderRadius: 14,
                      border: "1.5px solid #E5E7EB",
                      background: "#fff",
                      color: "#1F2937",
                    }}
                  />
                  <button
                    type="submit"
                    className="portal-btn"
                    style={{
                      width: "100%",
                      border: 0,
                      borderRadius: 14,
                      padding: "13px 0",
                      background: "linear-gradient(135deg, #7A1F3D 0%, #5C0427 100%)",
                      color: "#fff",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    Send reset link
                  </button>
                </form>
                <button
                  type="button"
                  onClick={() => setShowForgot(false)}
                  style={{
                    width: "100%",
                    marginTop: 10,
                    border: 0,
                    background: "transparent",
                    color: "#7B8597",
                    cursor: "pointer",
                    fontSize: 13,
                  }}
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
      ) : null}

      <div style={{ position: "fixed", inset: 0, overflow: "hidden" }}>
        <Image
          src="/images/portal/vendor-hero.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          quality={92}
          className="img-kb img-reveal"
          style={{
            objectFit: "cover",
            objectPosition: "center 28%",
            filter: "brightness(0.82) saturate(1.08)",
          }}
        />
        <div style={{ position: "absolute", inset: 0, background: "rgba(21,4,12,.16)" }} />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 50% 32%, rgba(247,238,226,.24) 0%, rgba(247,238,226,.08) 22%, rgba(21,4,12,.04) 48%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(21,4,12,.44) 0%, rgba(21,4,12,.10) 28%, rgba(21,4,12,.16) 58%, rgba(21,4,12,.70) 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 78% 72% at 50% 46%, transparent 32%, rgba(21,4,12,.18) 68%, rgba(21,4,12,.60) 100%)",
          }}
        />
      </div>

      <main
        style={{
          position: "relative",
          zIndex: 1,
          minHeight: "100svh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "28px 18px",
        }}
      >
        <div className="s1" style={{ textAlign: "center", marginBottom: 24 }}>
          <Image
            src="/logo/tribleera-mark-192.png"
            alt="TRIBLEERA VAIBHAVAM"
            width={54}
            height={54}
            style={{
              display: "block",
              margin: "0 auto 12px",
              borderRadius: 12,
              boxShadow: "0 0 0 1px rgba(212,175,106,.40), 0 12px 32px rgba(21,4,12,.24)",
            }}
          />
          <div className="gold-shimmer" style={{ fontSize: 18, fontWeight: 700, letterSpacing: ".22em" }}>
            TRIBLEERA
          </div>
          <div style={{ color: "rgba(233,206,156,.65)", fontSize: 9, letterSpacing: ".34em", marginTop: 4 }}>
            VAIBHAVAM
          </div>
          <p style={{ color: "rgba(247,238,226,.80)", fontSize: 12, marginTop: 10 }}>
            Elegant growth for photographers, bridal artists, decorators, cakes, and invitations.
          </p>
        </div>

        <section
          className="s2"
          style={{
            width: "100%",
            maxWidth: 470,
            borderRadius: 26,
            background: "linear-gradient(180deg, rgba(252,248,243,.90) 0%, rgba(250,247,242,.96) 100%)",
            border: "1px solid rgba(255,255,255,.38)",
            padding: "28px 26px",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            boxShadow: "0 32px 90px rgba(21,4,12,.28), inset 0 1px 0 rgba(255,255,255,.45)",
          }}
        >
          <div className="s3" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 12px", borderRadius: 999, background: "rgba(122,31,61,.08)", color: "#7A1F3D", fontSize: 11, fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase" }}>
            <BriefcaseBusiness size={14} />
            Partner Access
          </div>
          <h1 style={{ color: "#243044", fontFamily: "var(--font-display)", fontSize: 40, lineHeight: 1.04, marginTop: 12 }}>
            Vendor sign in
          </h1>
          <p style={{ color: "#5B6576", fontSize: 14, lineHeight: 1.7, marginTop: 10 }}>
            Sign in with your approved email or phone number to manage your services and bookings.
          </p>

          <div className="s4" style={{ marginTop: 16, padding: "14px 16px", borderRadius: 16, background: "rgba(255,255,255,.70)", border: "1px solid rgba(122,31,61,.08)" }}>
            <Link href="/vendor/register" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, textDecoration: "none", color: "#7A1F3D" }}>
              <span>
                <span style={{ display: "block", color: "#8A94A6", fontSize: 10.5, fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", marginBottom: 4 }}>
                  Service providers
                </span>
                <span style={{ display: "block", fontSize: 15, fontWeight: 700 }}>
                  Join as a service partner
                </span>
              </span>
              <ArrowRight size={18} />
            </Link>
          </div>

          <form onSubmit={handleLogin} style={{ display: "grid", gap: 16, marginTop: 18 }}>
            <div className="s4">
              <label htmlFor="vendor-identifier" style={{ display: "block", marginBottom: 7, color: "#697386", fontSize: 11, fontWeight: 700, letterSpacing: ".16em", textTransform: "uppercase" }}>
                Email or phone number
              </label>
              <input
                id="vendor-identifier"
                type="text"
                required
                autoComplete="username"
                value={identifier}
                onChange={(event) => setIdentifier(event.target.value)}
                placeholder="you@service.com or +94 77 123 4567"
                className="vendor-input"
                style={{
                  width: "100%",
                  padding: "15px 16px",
                  borderRadius: 15,
                  border: "1.5px solid #E5E7EB",
                  background: "rgba(255,255,255,.92)",
                  color: "#1F2937",
                }}
              />
            </div>

            <div className="s5">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 7 }}>
                <label htmlFor="vendor-password" style={{ color: "#697386", fontSize: 11, fontWeight: 700, letterSpacing: ".16em", textTransform: "uppercase" }}>
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgot(true)}
                  style={{ border: 0, background: "transparent", color: "#7A1F3D", fontSize: 11.5, fontWeight: 700, cursor: "pointer" }}
                >
                  Forgot password?
                </button>
              </div>
              <div style={{ position: "relative" }}>
                <input
                  id="vendor-password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  className="vendor-input"
                  style={{
                    width: "100%",
                    padding: "15px 48px 15px 16px",
                    borderRadius: 15,
                    border: "1.5px solid #E5E7EB",
                    background: "rgba(255,255,255,.92)",
                    color: "#1F2937",
                  }}
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
                    border: 0,
                    background: "transparent",
                    color: "#8A94A6",
                    cursor: "pointer",
                    display: "flex",
                    padding: 4,
                  }}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {error ? (
              <div
                className="s5"
                style={{
                  display: "flex",
                  gap: 9,
                  alignItems: "flex-start",
                  padding: "12px 14px",
                  borderRadius: 14,
                  border: "1px solid #FECACA",
                  background: "#FEF2F2",
                  color: "#991B1B",
                  fontSize: 12.5,
                  lineHeight: 1.55,
                }}
              >
                <AlertCircle size={15} style={{ flex: "0 0 auto", marginTop: 1 }} />
                <span>{error}</span>
              </div>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="s6 portal-btn"
              style={{
                width: "100%",
                padding: "15px 0",
                border: 0,
                borderRadius: 16,
                color: "#fff",
                fontSize: 15,
                fontWeight: 700,
                background: loading ? "#9CA3AF" : "linear-gradient(135deg, #7A1F3D 0%, #5C0427 55%, #380C1E 100%)",
                boxShadow: loading ? "none" : "0 16px 28px rgba(92,4,39,.24)",
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Please wait..." : "Sign in to vendor portal"}
            </button>
          </form>

          <div className="s6" style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 16, padding: "12px 14px", borderRadius: 14, background: "#F8F1E8", border: "1px solid #E9D9C3", color: "#5B6576", fontSize: 12.5 }}>
            <ShieldCheck size={16} color="#7A1F3D" />
            <span>
              Demo login: <strong style={{ color: "#243044" }}>+94771000001</strong> / <strong style={{ color: "#243044" }}>vendor2026</strong>
            </span>
          </div>
        </section>

        <div className="s6" style={{ display: "grid", gap: 10, width: "100%", maxWidth: 470, marginTop: 16 }}>
          {BENEFITS.map((item) => (
            <div
              key={item}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "12px 14px",
                borderRadius: 16,
                background: "rgba(247,238,226,.10)",
                border: "1px solid rgba(212,175,106,.14)",
                color: "rgba(247,238,226,.86)",
                backdropFilter: "blur(10px)",
                fontSize: 12.5,
              }}
            >
              <CircleDot size={14} color="#D4AF6A" />
              <span>{item}</span>
            </div>
          ))}
        </div>

        <div className="s7" style={{ textAlign: "center", marginTop: 16 }}>
          <Link href="/" style={{ color: "rgba(247,238,226,.72)", fontSize: 12, textDecoration: "none" }}>
            Back to TRIBLEERA VAIBHAVAM
          </Link>
        </div>
      </main>
    </>
  );
}
