"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { AlertCircle, Eye, EyeOff, ShieldCheck, Sparkles, TimerReset } from "lucide-react";
import { fallbackCustomerProfile, writeActiveCustomerProfile } from "@/lib/utils/customer-profile";

type CustomerTab = "signin" | "signup";

const TABS: Array<{ id: CustomerTab; label: string }> = [
  { id: "signin", label: "Sign in" },
  { id: "signup", label: "Create account" },
];

const HIGHLIGHTS = [
  { icon: ShieldCheck, label: "Secure session" },
  { icon: TimerReset, label: "Fast booking access" },
  { icon: Sparkles, label: "Shortlist and planning in one place" },
];

export default function CustomerLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // Same-origin paths only. A bare `redirect` value lets a crafted link
  // ("/login?redirect=//evil.com") bounce a customer off-site the moment they
  // sign in — and it would look like TRIBLEERA sent them there.
  const requestedRedirect = searchParams.get("redirect") ?? "";
  const redirectPath =
    requestedRedirect.startsWith("/") && !requestedRedirect.startsWith("//")
      ? requestedRedirect
      : "/dashboard/customer";
  const [tab, setTab] = useState<CustomerTab>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    window.setTimeout(() => {
      if (!email || password.trim().length < 6) {
        setError("Enter a valid email and a password with at least 6 characters.");
        setLoading(false);
        return;
      }

      // The signup tab hands off to /signup, which collects the name and
      // creates the account. Opening a session here would sign the visitor in
      // before the account they are asking for actually exists.
      if (tab === "signup") {
        router.push(`/signup?redirect=${encodeURIComponent(redirectPath)}&email=${encodeURIComponent(email)}`);
        return;
      }

      try {
        const profile = fallbackCustomerProfile(email);
        writeActiveCustomerProfile(profile);
        window.sessionStorage.setItem("user-auth", "true");
      } catch {}

      router.push(redirectPath);
    }, 800);
  }

  return (
    <>
      <style>{`
        .cust-tab {
          position: relative;
          border: 0;
          background: transparent;
          padding: 10px 0;
          color: rgba(75,85,99,.72);
          font-size: 13px;
          font-weight: 600;
          letter-spacing: .01em;
          transition: color .2s ease;
        }
        .cust-tab::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          bottom: -1px;
          height: 2px;
          border-radius: 999px;
          background: linear-gradient(90deg, #7A1F3D 0%, #9A2C52 100%);
          transform: scaleX(0);
          transition: transform .2s ease;
        }
        .cust-tab.active {
          color: #7A1F3D;
        }
        .cust-tab.active::after {
          transform: scaleX(1);
        }
      `}</style>

      <div style={{ position: "fixed", inset: 0, overflow: "hidden" }}>
        <Image
          src="/images/portal/testimonials.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          quality={92}
          className="img-kb img-reveal"
          style={{
            objectFit: "cover",
            objectPosition: "center 22%",
            filter: "brightness(0.84) saturate(1.04)",
          }}
        />
        <div style={{ position: "absolute", inset: 0, background: "rgba(21,4,12,0.18)" }} />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 50% 35%, rgba(247,238,226,0.26) 0%, rgba(247,238,226,0.10) 22%, rgba(21,4,12,0.04) 48%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(23,7,13,0.44) 0%, rgba(23,7,13,0.12) 24%, rgba(23,7,13,0.16) 55%, rgba(23,7,13,0.66) 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 76% 70% at 50% 48%, transparent 34%, rgba(21,4,12,0.18) 72%, rgba(21,4,12,0.58) 100%)",
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
              boxShadow: "0 0 0 1px rgba(212,175,106,.38), 0 12px 32px rgba(21,4,12,.22)",
            }}
          />
          <div className="gold-shimmer" style={{ fontSize: 18, fontWeight: 700, letterSpacing: ".22em" }}>
            TRIBLEERA
          </div>
          <div style={{ color: "rgba(233,206,156,0.65)", fontSize: 9, letterSpacing: ".34em", marginTop: 4 }}>
            VAIBHAVAM
          </div>
          <p style={{ color: "rgba(247,238,226,0.78)", fontSize: 12, marginTop: 10 }}>
            Warm wedding planning, premium vendors, one elegant flow.
          </p>
        </div>

        <section
          className="s2"
          style={{
            width: "100%",
            maxWidth: 470,
            borderRadius: 26,
            overflow: "hidden",
            background: "linear-gradient(180deg, rgba(252,248,243,.90) 0%, rgba(250,247,242,.96) 100%)",
            border: "1px solid rgba(255,255,255,.38)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            boxShadow: "0 32px 90px rgba(21,4,12,.28), inset 0 1px 0 rgba(255,255,255,.45)",
          }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, padding: "20px 26px 0", borderBottom: "1px solid rgba(31,41,55,.08)" }}>
            {TABS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setTab(item.id);
                  setError("");
                }}
                className={`cust-tab ${tab === item.id ? "active" : ""}`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div style={{ padding: "28px 26px 24px" }}>
            <div className="s3">
              <div style={{ color: "#7A1F3D", fontSize: 10, fontWeight: 700, letterSpacing: ".18em", textTransform: "uppercase" }}>
                Customer Access
              </div>
              <h1 style={{ color: "#243044", fontFamily: "var(--font-display)", fontSize: 42, lineHeight: 1.02, marginTop: 8 }}>
                {tab === "signin" ? "Welcome back" : "Create your account"}
              </h1>
              <p style={{ color: "#5B6576", fontSize: 14, lineHeight: 1.7, marginTop: 10 }}>
                {tab === "signin"
                  ? "Continue to your shortlist, bookings, and wedding planning dashboard without confusion."
                  : "Start with your email, then move into the full planning experience in a few quick steps."}
              </p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: "grid", gap: 16, marginTop: 24 }}>
              <div className="s4">
                <label htmlFor="customer-email" style={{ display: "block", marginBottom: 7, color: "#697386", fontSize: 11, fontWeight: 700, letterSpacing: ".16em", textTransform: "uppercase" }}>
                  Email
                </label>
                <input
                  id="customer-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
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
                <label htmlFor="customer-password" style={{ display: "block", marginBottom: 7, color: "#697386", fontSize: 11, fontWeight: 700, letterSpacing: ".16em", textTransform: "uppercase" }}>
                  Password
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    id="customer-password"
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={6}
                    autoComplete={tab === "signin" ? "current-password" : "new-password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder={tab === "signin" ? "Enter your password" : "Choose a secure password"}
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
                {loading ? "Please wait..." : tab === "signin" ? "Sign in" : "Continue to account setup"}
              </button>
            </form>

            <div className="s7" style={{ display: "grid", gap: 10, marginTop: 18 }}>
              {HIGHLIGHTS.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "12px 14px",
                    borderRadius: 14,
                    background: "rgba(255,255,255,.66)",
                    border: "1px solid rgba(122,31,61,.08)",
                    color: "#4B5563",
                    fontSize: 12.5,
                  }}
                >
                  <Icon size={15} color="#7A1F3D" />
                  <span>{label}</span>
                </div>
              ))}
            </div>

            <div className="s7" style={{ textAlign: "center", marginTop: 18, fontSize: 12.5, color: "#5B6576" }}>
              Offer wedding services?{" "}
              <Link href="/vendor/register" style={{ color: "#7A1F3D", fontWeight: 700, textDecoration: "none" }}>
                Join as a service partner
              </Link>
            </div>

            <div className="s7" style={{ textAlign: "center", marginTop: 10 }}>
              {/* Point at the redirect, not ADMIN_LOGIN_PATH itself — linking the
                  hardened path here would ship it to every public visitor's
                  bundle and undo the only thing the obscure URL buys. */}
              <Link href="/admin/login" style={{ color: "#C2B3A4", fontSize: 11.5, textDecoration: "none" }}>
                Admin access
              </Link>
            </div>
          </div>
        </section>

        <div className="s7" style={{ marginTop: 18, textAlign: "center" }}>
          <Link href="/" style={{ color: "rgba(247,238,226,.72)", fontSize: 12, textDecoration: "none" }}>
            Back to TRIBLEERA VAIBHAVAM
          </Link>
        </div>

        <p className="breathe" style={{ position: "fixed", insetInline: 0, bottom: 18, textAlign: "center", color: "rgba(247,238,226,.38)", fontSize: 11 }}>
          Premium wedding planning with calm, clear entry.
        </p>
      </main>
    </>
  );
}
