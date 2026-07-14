"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, ShieldCheck, ShoppingBag, Star, TimerReset, TrendingUp, Users } from "lucide-react";
import {
  authenticateAdmin,
  formatLockoutRemaining,
  getAdminLockout,
  getDefaultAdminPath,
} from "@/lib/utils/adminAuth";

const STATS = [
  { icon: Users, value: "25+", label: "Studios" },
  { icon: Star, value: "4.8+", label: "Rating" },
  { icon: ShoppingBag, value: "20%", label: "Advance" },
  { icon: TrendingUp, value: "5", label: "Cities" },
];

export function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [lockoutRemainingMs, setLockoutRemainingMs] = useState(() => {
    if (typeof window === "undefined") return 0;
    const lockout = getAdminLockout();
    return lockout.locked ? lockout.remainingMs : 0;
  });

  useEffect(() => {
    if (lockoutRemainingMs <= 0) return;
    const timer = window.setInterval(() => {
      const lockout = getAdminLockout();
      setLockoutRemainingMs(lockout.locked ? lockout.remainingMs : 0);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [lockoutRemainingMs]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    window.setTimeout(() => {
      const result = authenticateAdmin(username, password);

      if (result.ok) {
        router.push(getDefaultAdminPath(result.session.role));
        return;
      }

      setLoading(false);

      if (result.reason === "locked") {
        setLockoutRemainingMs(result.remainingMs);
        setError("This browser is temporarily locked for admin sign in.");
        return;
      }

      setLockoutRemainingMs(0);
      setError("Invalid username or password.");
    }, 800);
  }

  const lockoutMessage = lockoutRemainingMs > 0
    ? `Too many failed attempts. Try again in ${formatLockoutRemaining(lockoutRemainingMs)}.`
    : "";

  return (
    <>
      <div style={{ position: "fixed", inset: 0, overflow: "hidden" }}>
        <Image
          src="/images/portal/admin-hero.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          quality={92}
          className="img-kb img-reveal"
          style={{
            objectFit: "cover",
            objectPosition: "center 36%",
            filter: "brightness(0.82) contrast(1.06) grayscale(1)",
          }}
        />
        <div style={{ position: "absolute", inset: 0, background: "rgba(21,4,12,.50)" }} />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 50% 34%, rgba(255,255,255,.12) 0%, rgba(212,175,106,.12) 20%, rgba(21,4,12,.08) 44%, transparent 66%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(21,4,12,.78) 0%, rgba(21,4,12,.26) 26%, rgba(21,4,12,.28) 58%, rgba(21,4,12,.94) 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 78% 72% at 50% 46%, transparent 28%, rgba(21,4,12,.22) 68%, rgba(21,4,12,.72) 100%)",
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
            <span style={{ color: "rgba(212,175,106,.70)", fontSize: 10, letterSpacing: ".24em", textTransform: "uppercase" }}>
              Control Centre
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
          <div className="s3" style={{ display: "flex", alignItems: "center", gap: 9, color: "rgba(212,175,106,.70)", fontSize: 10.5, letterSpacing: ".16em", textTransform: "uppercase" }}>
            <ShieldCheck size={14} />
            Secure admin access
          </div>
          <h1 style={{ color: "#F7EEE2", fontFamily: "var(--font-display)", fontSize: 40, lineHeight: 1.04, marginTop: 10 }}>
            Admin sign in
          </h1>
          <p style={{ color: "rgba(247,238,226,.62)", fontSize: 13.5, lineHeight: 1.65, marginTop: 10 }}>
            Authorized personnel only. Sessions expire after 30 minutes of inactivity.
          </p>

          <form onSubmit={handleSubmit} style={{ display: "grid", gap: 15, marginTop: 24 }}>
            <div className="s4">
              <label htmlFor="admin-username" style={{ display: "block", marginBottom: 7, color: "rgba(212,175,106,.68)", fontSize: 11, fontWeight: 700, letterSpacing: ".16em", textTransform: "uppercase" }}>
                Username
              </label>
              <input
                id="admin-username"
                type="text"
                required
                autoComplete="username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="Enter username"
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
              <label htmlFor="admin-password" style={{ display: "block", marginBottom: 7, color: "rgba(212,175,106,.68)", fontSize: 11, fontWeight: 700, letterSpacing: ".16em", textTransform: "uppercase" }}>
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter password"
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

            {lockoutMessage ? (
              <div
                className="s5"
                style={{
                  display: "flex",
                  gap: 9,
                  alignItems: "flex-start",
                  padding: "12px 14px",
                  borderRadius: 14,
                  border: "1px solid rgba(212,175,106,.34)",
                  background: "rgba(212,175,106,.10)",
                  color: "#FDE68A",
                  fontSize: 12.5,
                  lineHeight: 1.55,
                }}
              >
                <TimerReset size={15} style={{ flex: "0 0 auto", marginTop: 1 }} />
                <span>{lockoutMessage}</span>
              </div>
            ) : null}

            {error ? (
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
                <AlertCircle size={15} style={{ flex: "0 0 auto", marginTop: 1 }} />
                <span>{error}</span>
              </div>
            ) : null}

            <button
              type="submit"
              disabled={loading || Boolean(lockoutMessage)}
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
                background: loading ? "rgba(255,255,255,.18)" : "linear-gradient(135deg, #D4AF6A 0%, #E9CE9C 45%, #C49E5A 100%)",
                boxShadow: loading ? "none" : "0 16px 32px rgba(212,175,106,.18)",
                cursor: loading || lockoutMessage ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Please wait..." : "Sign in to portal"}
            </button>
          </form>
        </section>

        <div className="s6" style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 10, width: "100%", maxWidth: 430, marginTop: 16 }}>
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
                <Icon size={15} />
              </div>
              <div style={{ color: "#F7EEE2", fontWeight: 700, fontSize: 18 }}>{value}</div>
              <div style={{ color: "rgba(247,238,226,.50)", fontSize: 10, marginTop: 4 }}>{label}</div>
            </div>
          ))}
        </div>

        <div className="s7" style={{ textAlign: "center", marginTop: 16 }}>
          <Link href="/" style={{ color: "rgba(247,238,226,.70)", fontSize: 12, textDecoration: "none" }}>
            Back to TRIBLEERA VAIBHAVAM
          </Link>
          <p style={{ color: "rgba(247,238,226,.34)", fontSize: 11, marginTop: 8 }}>
            All admin sessions are monitored and logged.
          </p>
        </div>
      </main>
    </>
  );
}
