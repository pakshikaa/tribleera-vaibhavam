"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AlertCircle, Award, Camera, Eye, EyeOff, Heart, MailCheck, Shield, TrendingUp } from "lucide-react";
import { createVendorPasswordReset, getVendorCompletion, loginVendor } from "@/lib/utils/vendorPortal";

const BENEFITS = [
  { icon: TrendingUp, text: "Reach couples looking for trusted wedding services" },
  { icon: Shield, text: "Advance secured through the TRIBLEERA flow" },
  { icon: Award, text: "Build trust score · rank higher in search" },
  { icon: Camera, text: "A professional profile seen by 1000s of couples" },
];

const STUDIO_AVATARS = [
  { initials: "PF", bg: "#5C0427" },
  { initials: "AJ", bg: "#7A1F3D" },
  { initials: "JF", bg: "#380C1E" },
  { initials: "NK", bg: "#220714" },
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

    // loginVendor accepts an approved email OR phone number, rejects the
    // suspended/unverified, and has no demo backdoor — do not shortcut it.
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
          setError(`This account is suspended. ${result.vendor?.suspensionReason ?? "Contact admin for details."}`);
          setLoading(false);
          return;
        }

        if (result.reason === "email_unverified") {
          setError(`Email not verified yet. Open the verification link sent to ${result.vendor?.email ?? "your inbox"}.`);
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
    // The confirmation is identical whether or not the account exists, so this
    // form can't be used to discover which studios are registered.
    createVendorPasswordReset(resetIdentifier);
    setResetState("sent");
  }

  return (
    <>
      <style>{`
        @keyframes vndHeartbeat {
          0%, 100% { transform: scale(1); }
          14% { transform: scale(1.22); }
          28% { transform: scale(1); }
          42% { transform: scale(1.14); }
          70% { transform: scale(1); }
        }
        .vnd-heart { animation: vndHeartbeat 3s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) { .vnd-heart { animation: none; } }
      `}</style>

      {/* ── Forgot password modal ── */}
      {showForgot && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 300,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
            background: "rgba(8,4,7,.62)",
            backdropFilter: "blur(8px)",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 380,
              borderRadius: 20,
              background: "linear-gradient(180deg, rgba(252,248,243,.97) 0%, rgba(250,247,242,.99) 100%)",
              border: "1px solid rgba(255,255,255,.5)",
              boxShadow: "0 28px 70px rgba(21,4,12,.28)",
              padding: "26px 24px",
            }}
          >
            {resetState === "sent" ? (
              <div style={{ textAlign: "center" }}>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: 12, color: "#7A1F3D" }}>
                  <MailCheck size={34} />
                </div>
                <h2 style={{ color: "#1F2937", fontFamily: "var(--font-display)", fontSize: 24 }}>Check your inbox</h2>
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
                    borderRadius: 12,
                    padding: "12px 0",
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
                <h2 style={{ color: "#1F2937", fontFamily: "var(--font-display)", fontSize: 24 }}>Reset password</h2>
                <p style={{ color: "#5B6576", fontSize: 13.5, lineHeight: 1.7, marginTop: 10 }}>
                  Enter your registered email address to receive a secure reset link.
                </p>
                <form onSubmit={handleReset} style={{ display: "grid", gap: 12, marginTop: 18 }}>
                  <input
                    type="email"
                    required
                    value={resetIdentifier}
                    onChange={(event) => setResetIdentifier(event.target.value)}
                    placeholder="you@studio.com"
                    className="vendor-input"
                    style={{ width: "100%", padding: "13px 15px", borderRadius: 12, border: "1.5px solid #E5E7EB", background: "#fff", color: "#1F2937" }}
                  />
                  <button
                    type="submit"
                    className="portal-btn"
                    style={{ width: "100%", border: 0, borderRadius: 12, padding: "12px 0", background: "linear-gradient(135deg, #7A1F3D 0%, #5C0427 100%)", color: "#fff", fontWeight: 700, cursor: "pointer" }}
                  >
                    Send reset link
                  </button>
                </form>
                <button
                  type="button"
                  onClick={() => setShowForgot(false)}
                  style={{ width: "100%", marginTop: 10, border: 0, background: "transparent", color: "#7B8597", cursor: "pointer", fontSize: 13 }}
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
      )}

      <div style={{ display: "flex", minHeight: "100svh", fontFamily: "Arial, sans-serif" }}>
        {/* ════ LEFT — editorial image panel (desktop) ════ */}
        <div className="hidden lg:block" style={{ width: "52%", position: "relative", overflow: "hidden", flexShrink: 0 }}>
          <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
            <Image
              src="/images/portal/vendor-hero.jpg"
              alt="TRIBLEERA VAIBHAVAM vendor partner"
              fill
              priority
              sizes="52vw"
              quality={92}
              className="img-kb img-reveal"
              style={{ objectFit: "cover", objectPosition: "center 28%", filter: "brightness(0.78) saturate(1.12)" }}
            />
          </div>

          {/* Overlay system */}
          <div style={{ position: "absolute", inset: 0, background: "rgba(21,4,12,0.46)" }} />
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 78% at 50% 42%, transparent 18%, rgba(21,4,12,0.50) 62%, rgba(21,4,12,0.88) 100%)" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(21,4,12,0.97) 0%, rgba(21,4,12,0.86) 16%, rgba(21,4,12,0.52) 30%, rgba(21,4,12,0.14) 48%, transparent 65%)" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(21,4,12,0.78) 0%, transparent 20%)" }} />
          <div style={{ position: "absolute", inset: 0, background: "rgba(92,4,39,0.15)", mixBlendMode: "multiply" }} />

          <div style={{ position: "relative", zIndex: 10, height: "100%", display: "flex", flexDirection: "column", padding: "34px 42px" }}>
            {/* Logo */}
            <div className="s1" style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Image
                src="/logo/tribleera-mark-192.png"
                alt="TRIBLEERA"
                width={38}
                height={38}
                style={{ borderRadius: 9, boxShadow: "0 0 0 1px rgba(212,175,106,.40), 0 0 24px rgba(212,175,106,.24)" }}
              />
              <div style={{ lineHeight: 1 }}>
                <p className="gold-shimmer" style={{ fontWeight: 700, fontSize: 14, letterSpacing: "0.20em" }}>TRIBLEERA</p>
                <p style={{ color: "rgba(233,206,156,0.60)", fontSize: 7.5, letterSpacing: "0.33em", marginTop: 2 }}>VAIBHAVAM</p>
              </div>
            </div>

            {/* Headline */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <div className="s2" style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
                <Heart size={11} className="vnd-heart" style={{ color: "rgba(212,175,106,0.75)" }} fill="currentColor" aria-hidden="true" />
                <p style={{ color: "rgba(212,175,106,0.60)", fontSize: 10, letterSpacing: "0.24em", textTransform: "uppercase" }}>
                  Vendor Partner Portal
                </p>
              </div>

              <div className="s3" style={{ marginBottom: 18 }}>
                <p style={{ color: "rgba(247,238,226,0.40)", fontSize: 16, fontWeight: 300, lineHeight: 1, letterSpacing: "0.03em", marginBottom: 7 }}>
                  Where Jaffna&apos;s
                </p>
                <p className="gold-gradient" style={{ fontSize: 50, fontWeight: 800, lineHeight: 0.88, letterSpacing: "-0.028em", marginBottom: 4 }}>
                  finest studios
                </p>
                <p style={{ color: "rgba(247,238,226,0.40)", fontSize: 16, fontWeight: 300, lineHeight: 1, letterSpacing: "0.03em" }}>
                  find their couples.
                </p>
              </div>

              <p className="s4" style={{ color: "rgba(247,238,226,0.50)", fontSize: 13.5, lineHeight: 1.78, maxWidth: 320 }}>
                Join TRIBLEERA VAIBHAVAM — where verified studios connect with couples seeking authentic Tamil celebrations.
              </p>
            </div>

            {/* Bottom */}
            <div>
              <div className="s5" style={{ height: "0.5px", marginBottom: 14, background: "linear-gradient(to right, transparent, rgba(212,175,106,.32), transparent)" }} />

              <div className="s5" style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
                {BENEFITS.map(({ icon: Icon, text }) => (
                  <div key={text} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 26, height: 26, borderRadius: 5, flexShrink: 0, background: "rgba(247,238,226,0.07)", border: "1px solid rgba(212,175,106,0.18)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Icon size={12} color="#D4AF6A" aria-hidden="true" />
                    </div>
                    <span style={{ color: "rgba(247,238,226,0.60)", fontSize: 12, lineHeight: 1.4 }}>{text}</span>
                  </div>
                ))}
              </div>

              <div className="s6" style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "rgba(247,238,226,0.06)", border: "1px solid rgba(212,175,106,0.16)", borderRadius: 8, padding: "7px 12px", backdropFilter: "blur(10px)", marginBottom: 18 }}>
                <div style={{ display: "flex" }}>
                  {STUDIO_AVATARS.map(({ initials, bg }, index) => (
                    <div
                      key={initials}
                      style={{ width: 22, height: 22, borderRadius: "50%", background: bg, border: "1.5px solid rgba(212,175,106,.32)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 7.5, fontWeight: 700, color: "#D4AF6A", marginLeft: index > 0 ? -7 : 0, position: "relative", zIndex: STUDIO_AVATARS.length - index }}
                    >
                      {initials}
                    </div>
                  ))}
                </div>
                <p style={{ color: "rgba(247,238,226,0.52)", fontSize: 11, lineHeight: 1.4 }}>
                  <strong style={{ color: "rgba(233,206,156,0.72)" }}>25+ studios</strong> already partnered
                </p>
              </div>

              <p className="breathe" style={{ color: "rgba(247,238,226,0.20)", fontSize: 10.5, fontStyle: "italic" }}>
                தேர்வின் செம்மை, வைபவத்தின் பெருமை
              </p>
            </div>
          </div>
        </div>

        {/* ════ MOBILE — atmospheric header ════ */}
        <div className="lg:hidden" style={{ position: "fixed", top: 0, left: 0, right: 0, height: 190, overflow: "hidden", zIndex: 1 }}>
          <Image
            src="/images/portal/vendor-hero.jpg"
            alt=""
            fill
            sizes="100vw"
            priority
            className="img-kb"
            style={{ objectFit: "cover", objectPosition: "center 30%", filter: "brightness(0.68) saturate(1.1)" }}
          />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(21,4,12,0.55) 0%, rgba(21,4,12,0.90) 100%)" }} />
          <div style={{ position: "relative", zIndex: 10, height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "16px 20px 0" }}>
            <Image
              src="/logo/tribleera-mark-192.png"
              alt="TRIBLEERA"
              width={42}
              height={42}
              className="s1"
              style={{ borderRadius: 9, marginBottom: 9, boxShadow: "0 0 0 1px rgba(212,175,106,.38)" }}
            />
            <p className="s2 gold-shimmer" style={{ fontWeight: 700, fontSize: 15, letterSpacing: "0.20em", lineHeight: 1 }}>TRIBLEERA</p>
            <p className="s3" style={{ color: "rgba(233,206,156,0.55)", fontSize: 8, letterSpacing: "0.30em", marginTop: 3 }}>VAIBHAVAM · VENDOR PORTAL</p>
          </div>
        </div>

        {/* ════ RIGHT — form panel ════ */}
        <div
          className="pt-[210px] lg:pt-10"
          style={{ flex: 1, background: "#FAF7F2", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 28px" }}
        >
          <div style={{ width: "100%", maxWidth: 375 }}>
            <div className="s2" style={{ background: "#FFFFFF", border: "0.5px solid #E5E7EB", borderRadius: 12, padding: "28px 24px", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
              <h1 className="s3" style={{ fontSize: 22, fontWeight: 700, color: "#1F2937", marginBottom: 5, letterSpacing: "-0.01em" }}>
                Vendor sign in
              </h1>
              <p className="s3" style={{ color: "#6B7280", fontSize: 13, marginBottom: 22 }}>
                New vendor?{" "}
                <Link href="/vendor/register" style={{ color: "#7A1F3D", fontWeight: 600, textDecoration: "none" }}>
                  Register your studio →
                </Link>
              </p>

              <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div className="s4">
                  <label htmlFor="v-id" style={{ display: "block", fontSize: 9.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.13em", color: "#6B7280", marginBottom: 6 }}>
                    Email or phone number
                  </label>
                  {/* Not type="email": loginVendor accepts a phone number too, and
                      the browser's email validation would block the form when one
                      is typed. */}
                  <input
                    id="v-id"
                    type="text"
                    inputMode="email"
                    required
                    value={identifier}
                    onChange={(event) => setIdentifier(event.target.value)}
                    autoComplete="username"
                    placeholder="you@studio.com or +94 77 123 4567"
                    className="vendor-input"
                    style={{ width: "100%", padding: "11px 13px", border: "1.5px solid #E5E7EB", borderRadius: 5, color: "#1F2937", background: "#fff", boxSizing: "border-box" }}
                  />
                </div>

                <div className="s4">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <label htmlFor="v-pw" style={{ fontSize: 9.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.13em", color: "#6B7280" }}>
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowForgot(true)}
                      style={{ fontSize: 11, color: "#7A1F3D", background: "none", border: "none", cursor: "pointer", padding: 0, fontFamily: "Arial, sans-serif" }}
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div style={{ position: "relative" }}>
                    <input
                      id="v-pw"
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      className="vendor-input"
                      style={{ width: "100%", padding: "11px 42px 11px 13px", border: "1.5px solid #E5E7EB", borderRadius: 5, color: "#1F2937", background: "#fff", boxSizing: "border-box" }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", display: "flex", background: "none", border: "none", cursor: "pointer", color: "#9CA3AF", padding: 2 }}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="s5" style={{ display: "flex", alignItems: "flex-start", gap: 8, background: "#FEE2E2", border: "1px solid #FECACA", borderRadius: 5, padding: "9px 11px", fontSize: 12, color: "#991B1B", lineHeight: 1.5 }}>
                    <AlertCircle size={14} style={{ flex: "0 0 auto", marginTop: 1 }} aria-hidden="true" />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="s5 portal-btn"
                  style={{
                    width: "100%",
                    padding: "12.5px 0",
                    border: "none",
                    borderRadius: 5,
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: loading ? "not-allowed" : "pointer",
                    marginTop: 4,
                    letterSpacing: "0.02em",
                    color: "#fff",
                    background: loading ? "#9CA3AF" : "linear-gradient(135deg,#7A1F3D 0%,#5C0427 55%,#380C1E 100%)",
                    boxShadow: loading ? "none" : "0 4px 18px rgba(92,4,39,.30)",
                  }}
                >
                  {loading ? "Signing in…" : "Sign in to vendor portal"}
                </button>
              </form>
            </div>

            <div className="s7" style={{ textAlign: "center", marginTop: 16 }}>
              <Link href="/" style={{ fontSize: 11, color: "#9CA3AF", textDecoration: "none" }}>
                ← Back to TRIBLEERA VAIBHAVAM
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
