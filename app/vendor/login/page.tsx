"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AlertCircle } from "lucide-react";
import { vendorLoginImage } from "@/lib/data/images";
import { getVendorCompletion, loginVendor, normalisePhone } from "@/lib/utils/vendorPortal";

// Static fallback credentials for demo
const STATIC_FALLBACK = [
  { slug: "pushpa-florals-and-decor", phone: "+94771000001", businessName: "Pushpa Florals & Decor" },
  { slug: "jaffna-frames-studio",     phone: "+94771000002", businessName: "Jaffna Frames Studio" },
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

        // Static fallback: any known phone + "vendor2026"
        if (password === "vendor2026") {
          const fallback = STATIC_FALLBACK.find(
            (v) => normalisePhone(v.phone) === normalisePhone(phone)
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
        .v-inp {
          width: 100%; padding: 12px 14px;
          border: 1.5px solid #E5E7EB; border-radius: 6px;
          font-size: 16px; color: #1F2937; background: #FFFFFF;
          outline: none; box-sizing: border-box;
          font-family: Arial, sans-serif;
          transition: border-color .2s, box-shadow .2s;
        }
        .v-inp::placeholder { color: rgba(31,41,55,0.35); }
        .v-inp:focus {
          border-color: #7A1F3D;
          box-shadow: 0 0 0 3px rgba(122,31,61,0.10);
        }
        .v-btn {
          width: 100%; padding: 13px 0; border: none;
          border-radius: 6px; font-size: 15px; font-weight: 600;
          cursor: pointer; font-family: Arial, sans-serif;
          background: linear-gradient(135deg,#7A1F3D 0%,#5C0427 100%);
          color: #FFFFFF;
          box-shadow: 0 4px 18px rgba(92,4,39,0.30);
          transition: transform .16s, box-shadow .16s;
        }
        .v-btn:hover:not(:disabled) {
          transform: translateY(-1.5px);
          box-shadow: 0 6px 24px rgba(92,4,39,0.40);
        }
        .v-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
        .v-backlink { color: rgba(247,238,226,0.5); text-decoration: none; transition: color .15s; }
        .v-backlink:hover { color: rgba(212,175,106,0.85); }
      `}</style>

      {/* Full-bleed background — homepage-hero pattern */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, overflow: "hidden" }} aria-hidden="true">
        {/* Portrait couple frame: faces sit around the mid-upper band with a
            bright sky above, so anchor slightly high to keep both subjects in
            frame across desktop crops. */}
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
        <div style={{ position: "absolute", inset: 0, background: "rgba(21,4,12,0.55)" }} />
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
        <div
          className="lg:hidden"
          style={{
            position: "relative",
            height: 200,
            width: "100%",
            maxWidth: 420,
            overflow: "hidden",
            borderRadius: 16,
            marginBottom: 20,
            boxShadow: "0 24px 64px rgba(21,4,12,0.35)",
          }}
        >
          <Image
            src={vendorLoginImage}
            alt=""
            fill
            sizes="100vw"
            priority
            style={{
              objectFit: "cover",
              objectPosition: "center 24%",
              filter: "brightness(0.70) saturate(1.02)",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to bottom,rgba(21,4,12,0.55) 0%,rgba(21,4,12,0.88) 100%)",
            }}
          />
          <div
            style={{
              position: "relative",
              zIndex: 10,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 20px",
            }}
          >
            <Image
              src="/logo/tribleera-mark-192.png"
              alt="TRIBLEERA"
              width={44}
              height={44}
              style={{
                borderRadius: 9,
                marginBottom: 10,
                boxShadow: "0 0 0 1px rgba(212,175,106,.38),0 0 20px rgba(212,175,106,.22)",
              }}
            />
            <p style={{ color: "#D4AF6A", fontWeight: 700, fontSize: 16, letterSpacing: "0.20em", lineHeight: 1 }}>
              TRIBLEERA
            </p>
            <p style={{ color: "rgba(233,206,156,0.58)", fontSize: 8, letterSpacing: "0.32em", marginTop: 3 }}>
              VAIBHAVAM · VENDOR PORTAL
            </p>
          </div>
        </div>

        {/* Brand */}
        <div className="s1 hidden lg:block" style={{ textAlign: "center", marginBottom: 28 }}>
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
            Vendor sign in
          </h1>
          <p className="s3" style={{ color: "#6B7280", fontSize: 13, marginBottom: 24 }}>
            New vendor?{" "}
            <Link href="/vendor/register" style={{ color: "#7A1F3D", fontWeight: 600, textDecoration: "none" }}>
              Register your studio →
            </Link>
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
                  marginBottom: 6,
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
                placeholder="you@studio.com or +94 77 XXX XXXX"
                onChange={(e) => setPhone(e.target.value)}
                className="v-inp"
              />
            </div>

            <div className="s4">
              <div
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}
              >
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
                placeholder="••••••••"
                onChange={(e) => setPassword(e.target.value)}
                className="v-inp"
              />
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

            <button type="submit" disabled={loading} className="s5 v-btn" style={{ marginTop: 4 }}>
              {loading ? "Signing in…" : "Sign in to vendor portal"}
            </button>
          </form>
        </div>

        {/* Bottom */}
        <div className="s5" style={{ marginTop: 18, textAlign: "center" }}>
          <Link href="/" className="v-backlink" style={{ fontSize: 12 }}>
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
