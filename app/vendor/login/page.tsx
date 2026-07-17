"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  AlertCircle,
  Eye,
  EyeOff,
  Heart,
  MailCheck,
  ShoppingBag,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  createVendorPasswordReset,
  getVendorCompletion,
  loginVendor,
} from "@/lib/utils/vendorPortal";

const STATS = [
  { icon: Users, value: "25+", label: "Partner studios" },
  { icon: Star, value: "4.8+", label: "Avg rating" },
  { icon: ShoppingBag, value: "20%", label: "Secured advance" },
  { icon: TrendingUp, value: "5", label: "Cities served" },
];

const TAMIL_TAGLINE = "தேர்வின் செம்மை, வைபவத்தின் பெருமை";

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
          router.push(
            completion.readyToGoLive || result.vendor.profileComplete
              ? "/dashboard/vendor"
              : "/dashboard/vendor/setup"
          );
          return;
        }

        if (result.reason === "suspended") {
          setError(
            `This account is suspended. ${result.vendor?.suspensionReason ?? "Contact admin for details."}`
          );
          setLoading(false);
          return;
        }

        if (result.reason === "email_unverified") {
          setError(
            `Email not verified yet. Open the verification link sent to ${result.vendor?.email ?? "your inbox"}.`
          );
          setLoading(false);
          return;
        }

        setError("Invalid credentials. Check your details and try again.");
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
      <style>{`
        @keyframes vendorHeartbeat {
          0%, 100% { transform: scale(1); }
          15% { transform: scale(1.22); }
          30% { transform: scale(1); }
          44% { transform: scale(1.12); }
          58% { transform: scale(1); }
        }
        .vendor-heart {
          animation: vendorHeartbeat 3.2s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .vendor-heart,
          .img-kb,
          .img-reveal,
          .gold-shimmer,
          .breathe,
          .line-grow,
          .s1, .s2, .s3, .s4, .s5, .s6, .s7 {
            animation: none !important;
          }
        }
      `}</style>

      {showForgot && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 400,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
            background: "rgba(12, 4, 9, 0.72)",
            backdropFilter: "blur(8px)",
          }}
        >
          <div
            className="animate-scale-in"
            style={{
              width: "100%",
              maxWidth: 390,
              borderRadius: 24,
              background:
                "linear-gradient(180deg, rgba(251,247,242,.98) 0%, rgba(246,239,231,.99) 100%)",
              border: "1px solid rgba(255,255,255,.7)",
              boxShadow: "0 32px 80px rgba(21,4,12,.45)",
              padding: "28px 24px",
            }}
          >
            {resetState === "sent" ? (
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    width: 64,
                    height: 64,
                    margin: "0 auto 16px",
                    borderRadius: "50%",
                    display: "grid",
                    placeItems: "center",
                    background: "linear-gradient(135deg, rgba(122,31,61,.14), rgba(212,175,106,.24))",
                    color: "#7A1F3D",
                  }}
                >
                  <MailCheck size={28} aria-hidden="true" />
                </div>
                <h2 style={{ color: "#1F2937", fontSize: 28, margin: 0 }}>Check your inbox</h2>
                <p style={{ color: "#5B6576", fontSize: 13.5, lineHeight: 1.75, marginTop: 10 }}>
                  If a partner account exists for <strong>{resetIdentifier}</strong>, reset
                  instructions have been queued.
                </p>
                <button
                  type="button"
                  className="portal-btn"
                  onClick={() => {
                    setShowForgot(false);
                    setResetIdentifier("");
                    setResetState("idle");
                  }}
                  style={{
                    width: "100%",
                    marginTop: 18,
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
                <h2 style={{ color: "#1F2937", fontSize: 28, margin: 0 }}>Reset password</h2>
                <p style={{ color: "#5B6576", fontSize: 13.5, lineHeight: 1.75, marginTop: 10 }}>
                  Enter your registered email or phone number to receive a secure reset link.
                </p>
                <form onSubmit={handleReset} style={{ display: "grid", gap: 12, marginTop: 18 }}>
                  <input
                    type="text"
                    required
                    value={resetIdentifier}
                    onChange={(event) => setResetIdentifier(event.target.value)}
                    placeholder="you@studio.com or +94 77 123 4567"
                    className="vendor-input"
                    style={{
                      width: "100%",
                      padding: "14px 15px",
                      borderRadius: 14,
                      border: "1.5px solid #E5DDD2",
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
                    marginTop: 12,
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
      )}

      {/* Full-bleed photo backdrop — same treatment as the admin portal, kept
          warm (no grayscale) so the vendor portal reads gold and celebratory.
          Overlays stay light enough that the couple remains recognizable; the
          card's own glass blur is what protects form legibility. */}
      <div className="dark-section" data-portal="true" style={{ position: "fixed", inset: 0, overflow: "hidden" }}>
        <Image
          src="/images/portal/home-hero.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          quality={92}
          className="img-kb img-reveal"
          style={{
            objectFit: "cover",
            objectPosition: "center 26%",
            filter: "brightness(0.96) saturate(1.08) contrast(1.02)",
          }}
        />
        <div style={{ position: "absolute", inset: 0, background: "rgba(21,4,12,.32)" }} />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 50% 34%, rgba(233,206,156,.10) 0%, rgba(212,175,106,.06) 22%, transparent 52%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(21,4,12,.62) 0%, rgba(21,4,12,.14) 26%, rgba(21,4,12,.16) 58%, rgba(21,4,12,.82) 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 78% 72% at 50% 46%, transparent 40%, rgba(21,4,12,.16) 72%, rgba(21,4,12,.5) 100%)",
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
            width={52}
            height={52}
            style={{
              display: "block",
              margin: "0 auto 12px",
              borderRadius: 12,
              boxShadow: "0 0 0 1px rgba(212,175,106,.42), 0 12px 32px rgba(0,0,0,.24)",
            }}
          />
          <div className="gold-shimmer" style={{ fontSize: 17, fontWeight: 700, letterSpacing: ".22em" }}>
            TRIBLEERA
          </div>
          <div style={{ color: "rgba(233,206,156,.62)", fontSize: 9, letterSpacing: ".34em", marginTop: 4 }}>
            VAIBHAVAM
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginTop: 14 }}>
            <span className="line-grow" style={{ width: 34, height: 1, background: "rgba(212,175,106,.42)" }} />
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
                color: "rgba(212,175,106,.78)",
                fontSize: 10,
                letterSpacing: ".24em",
                textTransform: "uppercase",
              }}
            >
              <Heart size={10} className="vendor-heart" fill="currentColor" aria-hidden="true" />
              Vendor Partner Portal
            </span>
            <span className="line-grow" style={{ width: 34, height: 1, background: "rgba(212,175,106,.42)" }} />
          </div>
        </div>

        <section
          className="s2"
          style={{
            width: "100%",
            maxWidth: 430,
            borderRadius: 24,
            background: "linear-gradient(180deg, rgba(21,4,12,.72) 0%, rgba(21,4,12,.82) 100%)",
            border: "1px solid rgba(212,175,106,.20)",
            padding: "28px 26px",
            backdropFilter: "blur(22px)",
            WebkitBackdropFilter: "blur(22px)",
            boxShadow: "0 32px 90px rgba(0,0,0,.42), inset 0 1px 0 rgba(255,255,255,.06)",
          }}
        >
          <h1
            className="s3"
            style={{
              color: "#F7EEE2",
              fontFamily: "var(--font-display)",
              fontSize: 40,
              lineHeight: 1.04,
              margin: 0,
            }}
          >
            Vendor sign in
          </h1>
          <p className="s3" style={{ color: "rgba(247,238,226,.62)", fontSize: 13.5, lineHeight: 1.65, marginTop: 10 }}>
            New vendor?{" "}
            <Link
              href="/vendor/register"
              style={{ color: "#E9CE9C", fontWeight: 700, textDecoration: "none" }}
            >
              Register your studio &rarr;
            </Link>
          </p>

          <form onSubmit={handleLogin} style={{ display: "grid", gap: 15, marginTop: 24 }}>
            <div className="s4">
              <label
                htmlFor="vendor-identifier"
                style={{
                  display: "block",
                  marginBottom: 7,
                  color: "rgba(212,175,106,.68)",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: ".16em",
                  textTransform: "uppercase",
                }}
              >
                Email or phone number
              </label>
              <input
                id="vendor-identifier"
                type="text"
                required
                value={identifier}
                onChange={(event) => setIdentifier(event.target.value)}
                autoComplete="username"
                placeholder="you@studio.com or +94 77 123 4567"
                className="admin-input"
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  borderRadius: 14,
                  border: "1px solid rgba(255,255,255,.14)",
                  background: "rgba(247,238,226,.07)",
                  color: "#F7EEE2",
                }}
              />
            </div>

            <div className="s5">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 7,
                }}
              >
                <label
                  htmlFor="vendor-password"
                  style={{
                    color: "rgba(212,175,106,.68)",
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: ".16em",
                    textTransform: "uppercase",
                  }}
                >
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgot(true)}
                  style={{
                    border: 0,
                    padding: 0,
                    background: "transparent",
                    color: "#E9CE9C",
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Forgot password?
                </button>
              </div>
              <div style={{ position: "relative" }}>
                <input
                  id="vendor-password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  className="admin-input"
                  style={{
                    width: "100%",
                    padding: "14px 44px 14px 16px",
                    borderRadius: 14,
                    border: "1px solid rgba(255,255,255,.14)",
                    background: "rgba(247,238,226,.07)",
                    color: "#F7EEE2",
                    boxSizing: "border-box",
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
                    display: "grid",
                    placeItems: "center",
                    width: 28,
                    height: 28,
                    border: 0,
                    borderRadius: 999,
                    background: "transparent",
                    color: "rgba(247,238,226,.55)",
                    cursor: "pointer",
                  }}
                >
                  {showPassword ? <EyeOff size={16} aria-hidden="true" /> : <Eye size={16} aria-hidden="true" />}
                </button>
              </div>
            </div>

            {error && (
              <div
                className="s5"
                style={{
                  display: "flex",
                  gap: 9,
                  alignItems: "flex-start",
                  padding: "12px 14px",
                  borderRadius: 14,
                  border: "1px solid rgba(248,113,113,.30)",
                  background: "rgba(127,29,29,.24)",
                  color: "#FCA5A5",
                  fontSize: 12.5,
                  lineHeight: 1.55,
                }}
              >
                <AlertCircle size={15} style={{ flex: "0 0 auto", marginTop: 1 }} aria-hidden="true" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="s6 portal-btn"
              style={{
                width: "100%",
                padding: "15px 0",
                border: 0,
                borderRadius: 15,
                color: "#15040C",
                fontSize: 15,
                fontWeight: 800,
                letterSpacing: ".04em",
                background: loading
                  ? "rgba(255,255,255,.18)"
                  : "linear-gradient(135deg, #D4AF6A 0%, #E9CE9C 45%, #C49E5A 100%)",
                boxShadow: loading ? "none" : "0 16px 32px rgba(212,175,106,.18)",
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Signing in..." : "Sign in to vendor portal"}
            </button>
          </form>
        </section>

        <div
          className="s6"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
            gap: 10,
            width: "100%",
            maxWidth: 430,
            marginTop: 16,
          }}
        >
          {STATS.map(({ icon: Icon, value, label }) => (
            <div
              key={label}
              style={{
                borderRadius: 16,
                padding: "12px 8px",
                textAlign: "center",
                background: "rgba(247,238,226,.06)",
                border: "1px solid rgba(212,175,106,.14)",
                backdropFilter: "blur(12px)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 8, color: "#D4AF6A" }}>
                <Icon size={15} aria-hidden="true" />
              </div>
              <div style={{ color: "#F7EEE2", fontWeight: 700, fontSize: 18 }}>{value}</div>
              <div style={{ color: "rgba(247,238,226,.50)", fontSize: 10, marginTop: 4 }}>{label}</div>
            </div>
          ))}
        </div>

        <div className="s7" style={{ textAlign: "center", marginTop: 16 }}>
          <Link href="/" style={{ color: "rgba(247,238,226,.70)", fontSize: 12, textDecoration: "none" }}>
            &larr; Back to TRIBLEERA VAIBHAVAM
          </Link>
          <p
            className="breathe"
            style={{ color: "rgba(247,238,226,.4)", fontSize: 11, marginTop: 8, fontStyle: "italic" }}
          >
            {TAMIL_TAGLINE}
          </p>
        </div>
      </main>
    </>
  );
}
