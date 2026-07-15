"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  AlertCircle,
  Award,
  Camera,
  Eye,
  EyeOff,
  Heart,
  MailCheck,
  Shield,
  TrendingUp,
} from "lucide-react";
import {
  createVendorPasswordReset,
  getVendorCompletion,
  loginVendor,
} from "@/lib/utils/vendorPortal";

const BENEFITS = [
  { icon: TrendingUp, text: "Reach couples looking for trusted wedding services" },
  { icon: Shield, text: "Advance secured through the TRIBLEERA escrow flow" },
  { icon: Award, text: "Build trust score and rank higher in search" },
  { icon: Camera, text: "Professional profiles seen by thousands of couples" },
];

const STUDIO_AVATARS = [
  { initials: "PF", background: "#5C0427" },
  { initials: "AJ", background: "#7A1F3D" },
  { initials: "JF", background: "#380C1E" },
  { initials: "NK", background: "#220714" },
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
        @keyframes vendorOrb {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
          50% { transform: translate3d(10px, -12px, 0) scale(1.06); }
        }
        @keyframes vendorPanelShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .vendor-heart {
          animation: vendorHeartbeat 3.2s ease-in-out infinite;
        }
        .vendor-panel-shift {
          background-size: 180% 180%;
          animation: vendorPanelShift 18s ease infinite;
        }
        .vendor-orb {
          animation: vendorOrb 10s ease-in-out infinite;
        }
        .vendor-input-shell {
          position: relative;
        }
        .vendor-input-shell::before {
          content: "";
          position: absolute;
          inset: 1px;
          border-radius: 15px;
          background: linear-gradient(180deg, rgba(255,255,255,.9), rgba(255,255,255,.55));
          pointer-events: none;
        }
        .vendor-card {
          position: relative;
          overflow: hidden;
        }
        .vendor-card::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(255,255,255,.28), transparent 24%);
          pointer-events: none;
        }
        @media (prefers-reduced-motion: reduce) {
          .vendor-heart,
          .vendor-panel-shift,
          .vendor-orb,
          .img-kb,
          .img-reveal,
          .gold-shimmer,
          .breathe,
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

      <div
        data-portal="true"
        style={{
          minHeight: "100svh",
          display: "flex",
          background: "#F7F0E8",
        }}
      >
        <div
          className="hidden lg:block dark-section"
          style={{
            width: "55%",
            position: "relative",
            overflow: "hidden",
            flexShrink: 0,
          }}
        >
          <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
            <Image
              src="/images/portal/vendor-hero.jpg"
              alt="TRIBLEERA VAIBHAVAM vendor partner"
              fill
              priority
              sizes="55vw"
              quality={95}
              className="img-kb img-reveal"
              style={{
                objectFit: "cover",
                objectPosition: "center 26%",
                filter: "brightness(0.92) saturate(1.15) contrast(1.03)",
              }}
            />
          </div>

          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to bottom, rgba(21,4,12,.76) 0%, rgba(21,4,12,.28) 16%, transparent 30%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to top, rgba(21,4,12,.94) 0%, rgba(21,4,12,.78) 18%, rgba(21,4,12,.34) 36%, transparent 54%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse 92% 90% at 50% 45%, transparent 34%, rgba(21,4,12,.34) 74%, rgba(21,4,12,.78) 100%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(92,4,39,.08)",
              mixBlendMode: "multiply",
            }}
          />

          <div
            style={{
              position: "absolute",
              top: 88,
              right: 58,
              width: 180,
              height: 180,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(212,175,106,.24) 0%, rgba(212,175,106,0) 72%)",
            }}
            className="vendor-orb"
          />

          <div
            style={{
              position: "relative",
              zIndex: 2,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              padding: "34px 44px",
            }}
          >
            <div className="s1" style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Image
                src="/logo/tribleera-mark-192.png"
                alt="TRIBLEERA"
                width={38}
                height={38}
                style={{
                  borderRadius: 10,
                  boxShadow:
                    "0 0 0 1px rgba(212,175,106,.42), 0 0 24px rgba(212,175,106,.22)",
                }}
              />
              <div style={{ lineHeight: 1 }}>
                <p
                  className="gold-shimmer"
                  style={{ margin: 0, fontWeight: 700, fontSize: 14, letterSpacing: "0.2em" }}
                >
                  TRIBLEERA
                </p>
                <p
                  style={{
                    margin: "3px 0 0",
                    color: "rgba(233,206,156,.58)",
                    fontSize: 7.5,
                    letterSpacing: "0.33em",
                  }}
                >
                  VAIBHAVAM
                </p>
              </div>
            </div>

            <div style={{ flex: 1 }} />

            <div style={{ maxWidth: 420 }}>
              <div className="s2" style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <Heart
                  size={11}
                  className="vendor-heart"
                  style={{ color: "rgba(212,175,106,.78)" }}
                  fill="currentColor"
                  aria-hidden="true"
                />
                <p
                  style={{
                    margin: 0,
                    color: "rgba(212,175,106,.64)",
                    fontSize: 10,
                    letterSpacing: "0.24em",
                    textTransform: "uppercase",
                  }}
                >
                  Vendor Partner Portal
                </p>
              </div>

              <div className="s3" style={{ marginBottom: 16 }}>
                <p
                  style={{
                    margin: "0 0 8px",
                    color: "rgba(247,238,226,.42)",
                    fontSize: 15,
                    fontWeight: 300,
                    lineHeight: 1,
                    letterSpacing: "0.03em",
                  }}
                >
                  Where Jaffna&apos;s
                </p>
                <p
                  className="gold-gradient"
                  style={{
                    margin: 0,
                    fontSize: 54,
                    fontWeight: 800,
                    lineHeight: 0.88,
                    letterSpacing: "-0.03em",
                  }}
                >
                  finest studios
                </p>
                <p
                  style={{
                    margin: "6px 0 0",
                    color: "rgba(247,238,226,.42)",
                    fontSize: 15,
                    fontWeight: 300,
                    lineHeight: 1,
                    letterSpacing: "0.03em",
                  }}
                >
                  find their couples.
                </p>
              </div>

              <p
                className="s4"
                style={{
                  margin: "0 0 20px",
                  color: "rgba(247,238,226,.56)",
                  fontSize: 13,
                  lineHeight: 1.78,
                  maxWidth: 332,
                }}
              >
                Join TRIBLEERA VAIBHAVAM where verified studios connect with couples
                seeking authentic Tamil celebrations.
              </p>

              <div className="s5" style={{ display: "grid", gap: 9, marginBottom: 18 }}>
                {BENEFITS.map(({ icon: Icon, text }) => (
                  <div key={text} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        flexShrink: 0,
                        borderRadius: 6,
                        display: "grid",
                        placeItems: "center",
                        background: "rgba(247,238,226,.07)",
                        border: "1px solid rgba(212,175,106,.18)",
                      }}
                    >
                      <Icon size={12} color="#D4AF6A" aria-hidden="true" />
                    </div>
                    <span
                      style={{
                        color: "rgba(247,238,226,.6)",
                        fontSize: 12,
                        lineHeight: 1.45,
                      }}
                    >
                      {text}
                    </span>
                  </div>
                ))}
              </div>

              <div
                className="s6 glass"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "8px 12px",
                  borderRadius: 10,
                  marginBottom: 18,
                }}
              >
                <div style={{ display: "flex" }}>
                  {STUDIO_AVATARS.map(({ initials, background }, index) => (
                    <div
                      key={initials}
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: "50%",
                        marginLeft: index > 0 ? -7 : 0,
                        background,
                        border: "1.5px solid rgba(212,175,106,.32)",
                        display: "grid",
                        placeItems: "center",
                        fontSize: 7.5,
                        fontWeight: 700,
                        color: "#D4AF6A",
                        position: "relative",
                        zIndex: STUDIO_AVATARS.length - index,
                      }}
                    >
                      {initials}
                    </div>
                  ))}
                </div>
                <p style={{ margin: 0, color: "rgba(247,238,226,.52)", fontSize: 11, lineHeight: 1.45 }}>
                  <strong style={{ color: "rgba(233,206,156,.78)" }}>25+ studios</strong> already
                  partnered with TRIBLEERA
                </p>
              </div>

              <p
                className="s7 breathe"
                style={{
                  margin: 0,
                  color: "rgba(247,238,226,.24)",
                  fontSize: 10.5,
                  fontStyle: "italic",
                }}
              >
                {TAMIL_TAGLINE}
              </p>
            </div>
          </div>
        </div>

        <div
          className="lg:hidden"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            height: 224,
            zIndex: 1,
            overflow: "hidden",
          }}
        >
          <Image
            src="/images/portal/vendor-hero.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="img-kb"
            style={{
              objectFit: "cover",
              objectPosition: "center 28%",
              filter: "brightness(0.88) saturate(1.12)",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to bottom, rgba(21,4,12,.48) 0%, rgba(21,4,12,.78) 62%, rgba(21,4,12,.96) 100%)",
            }}
          />
          <div
            style={{
              position: "relative",
              zIndex: 2,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "26px 20px 0",
              textAlign: "center",
            }}
          >
            <Image
              src="/logo/tribleera-mark-192.png"
              alt="TRIBLEERA"
              width={44}
              height={44}
              className="s1"
              style={{
                borderRadius: 10,
                marginBottom: 10,
                boxShadow: "0 0 0 1px rgba(212,175,106,.38)",
              }}
            />
            <p
              className="s2 gold-shimmer"
              style={{ margin: 0, fontWeight: 700, fontSize: 15, letterSpacing: "0.2em", lineHeight: 1 }}
            >
              TRIBLEERA
            </p>
            <p
              className="s3"
              style={{
                margin: "5px 0 0",
                color: "rgba(233,206,156,.58)",
                fontSize: 8,
                letterSpacing: "0.32em",
              }}
            >
              VAIBHAVAM . VENDOR PORTAL
            </p>
          </div>
        </div>

        <div
          className="vendor-panel-shift pt-[236px] lg:pt-10"
          style={{
            flex: 1,
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            padding: "42px 30px",
            background:
              "linear-gradient(155deg, #F8F0E7 0%, #FCFAF6 38%, #F2E8DC 100%)",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "radial-gradient(rgba(92,4,39,.05) 1px, transparent 1px), radial-gradient(rgba(212,175,106,.06) 1px, transparent 1px)",
              backgroundSize: "24px 24px, 32px 32px",
              backgroundPosition: "0 0, 12px 16px",
              opacity: 0.45,
              pointerEvents: "none",
            }}
          />

          <svg
            aria-hidden="true"
            viewBox="0 0 240 240"
            style={{
              position: "absolute",
              right: -36,
              bottom: -50,
              width: 340,
              height: 340,
              opacity: 0.05,
              pointerEvents: "none",
            }}
          >
            <path
              d="M44 212v-98c0-58 28-88 76-88s76 30 76 88v98"
              stroke="#5C0427"
              strokeWidth="3"
              fill="none"
            />
            <path
              d="M68 212v-92c0-41 16-66 52-66s52 25 52 66v92"
              stroke="#5C0427"
              strokeWidth="3"
              fill="none"
            />
            <path
              d="M92 212v-84c0-23 10-42 28-42s28 19 28 42v84"
              stroke="#D4AF6A"
              strokeWidth="2"
              fill="none"
            />
          </svg>

          <div
            style={{
              position: "absolute",
              top: 24,
              right: 28,
              alignItems: "center",
              gap: 7,
              opacity: 0.28,
            }}
            className="hidden lg:flex"
          >
            <Image
              src="/logo/tribleera-mark-192.png"
              alt=""
              width={20}
              height={20}
              style={{ borderRadius: 4 }}
            />
            <span
              style={{
                color: "#5C0427",
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.16em",
              }}
            >
              TRIBLEERA
            </span>
          </div>

          <div style={{ position: "relative", zIndex: 2, width: "100%", maxWidth: 430 }}>
            <div
              className="s2 vendor-card"
              style={{
                background: "rgba(255,255,255,.9)",
                borderRadius: 24,
                border: "1px solid rgba(212,175,106,.18)",
                boxShadow:
                  "0 2px 6px rgba(0,0,0,.04), 0 12px 28px rgba(31,41,55,.08), 0 32px 72px rgba(92,4,39,.1), inset 0 1px 0 rgba(255,255,255,.82)",
                backdropFilter: "blur(10px)",
              }}
            >
              <div
                style={{
                  height: 4,
                  background: "linear-gradient(90deg, #5C0427 0%, #D4AF6A 50%, #5C0427 100%)",
                }}
              />

              <div style={{ padding: "30px 26px 24px" }}>
                <div className="s3" style={{ marginBottom: 22 }}>
                  <h1
                    style={{
                      margin: 0,
                      color: "#1F2937",
                      fontSize: 24,
                      lineHeight: 1.08,
                      letterSpacing: "-0.015em",
                    }}
                  >
                    Vendor sign in
                  </h1>
                  <p style={{ margin: "8px 0 0", color: "#6B7280", fontSize: 13.5, lineHeight: 1.55 }}>
                    New vendor?{" "}
                    <Link
                      href="/vendor/register"
                      style={{ color: "#7A1F3D", fontWeight: 700, textDecoration: "none" }}
                    >
                      Register your studio &rarr;
                    </Link>
                  </p>
                </div>

                <form onSubmit={handleLogin} style={{ display: "grid", gap: 15 }}>
                  <div className="s4">
                    <label
                      htmlFor="vendor-identifier"
                      style={{
                        display: "block",
                        marginBottom: 7,
                        color: "#6B7280",
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing: "0.13em",
                        textTransform: "uppercase",
                      }}
                    >
                      Email or phone number
                    </label>
                    <div className="vendor-input-shell">
                      <input
                        id="vendor-identifier"
                        type="text"
                        required
                        value={identifier}
                        onChange={(event) => setIdentifier(event.target.value)}
                        autoComplete="username"
                        placeholder="you@studio.com or +94 77 123 4567"
                        className="vendor-input"
                        style={{
                          position: "relative",
                          zIndex: 1,
                          width: "100%",
                          padding: "14px 15px",
                          borderRadius: 16,
                          border: "1.5px solid #E5DDD2",
                          background: "rgba(253,250,246,.92)",
                          color: "#1F2937",
                          boxSizing: "border-box",
                        }}
                      />
                    </div>
                  </div>

                  <div className="s4">
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
                          color: "#6B7280",
                          fontSize: 10,
                          fontWeight: 700,
                          letterSpacing: "0.13em",
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
                          color: "#7A1F3D",
                          fontSize: 11,
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="vendor-input-shell">
                      <div style={{ position: "relative", zIndex: 1 }}>
                        <input
                          id="vendor-password"
                          type={showPassword ? "text" : "password"}
                          required
                          value={password}
                          onChange={(event) => setPassword(event.target.value)}
                          autoComplete="current-password"
                          placeholder="Enter your password"
                          className="vendor-input"
                          style={{
                            width: "100%",
                            padding: "14px 44px 14px 15px",
                            borderRadius: 16,
                            border: "1.5px solid #E5DDD2",
                            background: "rgba(253,250,246,.92)",
                            color: "#1F2937",
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
                            color: "#9CA3AF",
                            cursor: "pointer",
                          }}
                        >
                          {showPassword ? <EyeOff size={16} aria-hidden="true" /> : <Eye size={16} aria-hidden="true" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {error && (
                    <div
                      className="s5"
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 8,
                        padding: "10px 12px",
                        borderRadius: 12,
                        border: "1px solid #F6C8C8",
                        background: "#FFF1F1",
                        color: "#991B1B",
                        fontSize: 12.5,
                        lineHeight: 1.5,
                      }}
                    >
                      <AlertCircle size={14} style={{ flex: "0 0 auto", marginTop: 2 }} aria-hidden="true" />
                      <span>{error}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="s5 portal-btn"
                    style={{
                      width: "100%",
                      marginTop: 4,
                      padding: "14px 0",
                      border: 0,
                      borderRadius: 16,
                      background: loading
                        ? "#BDAAA3"
                        : "linear-gradient(135deg, #7A1F3D 0%, #5C0427 52%, #3D0019 100%)",
                      color: "#fff",
                      fontSize: 14.5,
                      fontWeight: 700,
                      letterSpacing: "0.02em",
                      cursor: loading ? "not-allowed" : "pointer",
                      boxShadow: loading ? "none" : "0 10px 26px rgba(92,4,39,.26)",
                    }}
                  >
                    {loading ? "Signing in..." : "Sign in to vendor portal"}
                  </button>
                </form>

                <div
                  className="s6"
                  style={{
                    marginTop: 16,
                    padding: "10px 12px",
                    borderRadius: 14,
                    background: "linear-gradient(135deg, #F8EFD8 0%, #FBF7EE 100%)",
                    border: "1px solid #E8D7B6",
                    color: "#6B7280",
                    fontSize: 11.5,
                    lineHeight: 1.65,
                  }}
                >
                  <strong style={{ color: "#92400E" }}>Demo login:</strong> Phone{" "}
                  <code
                    style={{
                      padding: "1px 5px",
                      borderRadius: 4,
                      background: "#fff",
                      color: "#1F2937",
                      border: "1px solid #E5E7EB",
                    }}
                  >
                    +94771000001
                  </code>{" "}
                  Password{" "}
                  <code
                    style={{
                      padding: "1px 5px",
                      borderRadius: 4,
                      background: "#fff",
                      color: "#1F2937",
                      border: "1px solid #E5E7EB",
                    }}
                  >
                    vendor2026
                  </code>
                </div>
              </div>
            </div>

            <div className="s7" style={{ textAlign: "center", marginTop: 18 }}>
              <Link
                href="/"
                style={{
                  color: "rgba(107,114,128,.78)",
                  fontSize: 11.5,
                  textDecoration: "none",
                }}
              >
                &larr; Back to TRIBLEERA VAIBHAVAM
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
