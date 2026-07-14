"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { AlertCircle, TimerReset } from "lucide-react";
import { adminLoginImage } from "@/lib/data/images";
import {
  authenticateAdmin,
  formatLockoutRemaining,
  getAdminLockout,
  getDefaultAdminPath,
} from "@/lib/utils/adminAuth";

export function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [lockoutRemainingMs, setLockoutRemainingMs] = useState(0);
  const lockoutMessage = lockoutRemainingMs > 0
    ? `Too many failed attempts. Try again in ${formatLockoutRemaining(lockoutRemainingMs)}.`
    : "";

  useEffect(() => {
    const lockout = getAdminLockout();
    if (lockout.locked) {
      // Browser lockout state is sourced from localStorage on mount.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLockoutRemainingMs(lockout.remainingMs);
    }
  }, []);

  useEffect(() => {
    if (lockoutRemainingMs <= 0) return;
    const interval = window.setInterval(() => {
      const lockout = getAdminLockout();
      setLockoutRemainingMs(lockout.locked ? lockout.remainingMs : 0);
    }, 1000);
    return () => window.clearInterval(interval);
  }, [lockoutRemainingMs]);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    setTimeout(() => {
      const result = authenticateAdmin(username, password);

      if (result.ok) {
        router.push(getDefaultAdminPath(result.session.role));
        return;
      }

      setLoading(false);

      if (result.reason === "locked") {
        setLockoutRemainingMs(result.remainingMs);
        setError("Admin access is temporarily locked on this browser.");
        return;
      }

      setLockoutRemainingMs(0);
      setError("Invalid username or password.");
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
          0%, 100% { opacity: 0.40; }
          50%      { opacity: 0.72; }
        }
        @keyframes auraPulse {
          0%, 100% { opacity: 0.26; transform: scale(1); }
          50% { opacity: 0.48; transform: scale(1.08); }
        }
        .kb { animation: kenBurns 26s ease-in-out infinite alternate; }
        .ir { animation: imgReveal .9s cubic-bezier(.16,1,.3,1) both; }
        .s1 { animation: slideUp .6s cubic-bezier(.16,1,.3,1) .10s both; }
        .s2 { animation: slideUp .6s cubic-bezier(.16,1,.3,1) .22s both; }
        .s3 { animation: slideUp .6s cubic-bezier(.16,1,.3,1) .34s both; }
        .s4 { animation: slideUp .6s cubic-bezier(.16,1,.3,1) .46s both; }
        .s5 { animation: slideUp .6s cubic-bezier(.16,1,.3,1) .58s both; }
        .scene-aura { animation: auraPulse 12s ease-in-out infinite; }
        .breathe { animation: breathe 4s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .kb, .ir, .s1, .s2, .s3, .s4, .s5, .scene-aura, .breathe { animation: none; }
        }
        .goldtext {
          background: linear-gradient(90deg,#D4AF6A,#E9CE9C,#F7EEE2,#E9CE9C,#D4AF6A);
          background-size: 300% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: goldShimmer 4s linear infinite;
        }
        .a-inp {
          width: 100%; padding: 12px 14px;
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 6px; font-size: 16px;
          color: #F7EEE2; background: rgba(255,255,255,0.08);
          outline: none; box-sizing: border-box;
          font-family: Arial, sans-serif;
          transition: border-color .2s, box-shadow .2s;
          backdrop-filter: blur(4px);
        }
        .a-inp::placeholder { color: rgba(247,238,226,0.35); }
        .a-inp:focus {
          border-color: rgba(212,175,106,0.6);
          box-shadow: 0 0 0 3px rgba(212,175,106,0.14);
        }
        .a-btn {
          width: 100%; padding: 13px 0; border: none;
          border-radius: 6px; font-size: 15px; font-weight: 700;
          letter-spacing: .04em; cursor: pointer;
          font-family: Arial, sans-serif;
          background: linear-gradient(135deg,#D4AF6A 0%,#C49E5A 100%);
          color: #15040C;
          box-shadow: 0 4px 20px rgba(212,175,106,0.30);
          transition: transform .16s, box-shadow .16s;
        }
        .a-btn:hover:not(:disabled) {
          transform: translateY(-1.5px);
          box-shadow: 0 6px 28px rgba(212,175,106,0.40);
        }
        .a-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
        .a-backlink { color: rgba(247,238,226,0.40); text-decoration: none; transition: color .15s; }
        .a-backlink:hover { color: rgba(212,175,106,0.75); }
        .scene-photo-admin {
          object-position: center 32%;
          filter: brightness(0.84) contrast(1.06);
        }
        .auth-card-admin {
          background: linear-gradient(180deg, rgba(21,4,12,0.68) 0%, rgba(21,4,12,0.76) 100%);
          border: 1px solid rgba(212,175,106,0.20);
          border-radius: 24px;
          backdrop-filter: blur(28px);
          -webkit-backdrop-filter: blur(28px);
          box-shadow: 0 30px 80px rgba(0,0,0,0.46), 0 0 0 1px rgba(255,255,255,0.05) inset;
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
          max-width: 440px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        @media (max-width: 767px) {
          .scene-photo-admin { object-position: center 26%; }
        }
        @media (min-width: 960px) {
          .auth-shell {
            align-items: center;
            padding-right: 0;
          }
          .auth-column {
            max-width: 440px;
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
          src={adminLoginImage}
          alt=""
          fill
          sizes="100vw"
          priority
          quality={90}
          className="kb ir scene-photo-admin"
          style={{ objectFit: "cover" }}
        />
        <div style={{ position: "absolute", inset: 0, background: "rgba(21,4,12,0.10)" }} />
        <div
          className="scene-aura"
          style={{
            position: "absolute",
            inset: "-10%",
            background:
              "radial-gradient(circle at 52% 28%, rgba(255,255,255,0.22) 0%, rgba(212,175,106,0.12) 22%, rgba(21,4,12,0.12) 50%, transparent 72%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 80% 76% at 40% 40%, transparent 30%, rgba(21,4,12,0.24) 68%, rgba(21,4,12,0.74) 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(90deg, rgba(21,4,12,0.18) 0%, rgba(21,4,12,0.10) 32%, rgba(21,4,12,0.20) 62%, rgba(21,4,12,0.54) 100%)",
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
            <div className="s1" style={{ textAlign: "left", marginBottom: 32, width: "100%" }}>
              <Image
                src="/logo/tribleera-mark-192.png"
                alt="TRIBLEERA VAIBHAVAM"
                width={52}
                height={52}
                style={{
                  borderRadius: 11,
                  margin: "0 0 12px",
                  display: "block",
                  boxShadow: "0 0 0 1px rgba(212,175,106,.42), 0 0 28px rgba(212,175,106,.26)",
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
                Secure Admin Portal
              </p>
            </div>

            <div
              className="s2 auth-card-admin"
              style={{
                width: "100%",
                maxWidth: 440,
                padding: "32px 28px",
              }}
            >
          <h1
            className="s3"
            style={{ color: "#F7EEE2", fontSize: 24, fontWeight: 700, marginBottom: 4, letterSpacing: "-0.01em" }}
          >
            Admin sign in
          </h1>
          <p className="s3" style={{ color: "rgba(247,238,226,0.45)", fontSize: 13, marginBottom: 24 }}>
            Authorized personnel only. Sessions auto-expire after 30 minutes of inactivity.
          </p>

          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div className="s4">
              <label
                htmlFor="adm-u"
                style={{
                  display: "block",
                  fontSize: 9.5,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.14em",
                  color: "rgba(212,175,106,0.70)",
                  marginBottom: 6,
                }}
              >
                Username
              </label>
              <input
                id="adm-u"
                type="text"
                value={username}
                required
                autoComplete="username"
                placeholder="Enter username"
                onChange={(e) => setUsername(e.target.value)}
                className="a-inp"
              />
            </div>

            <div className="s4">
              <label
                htmlFor="adm-p"
                style={{
                  display: "block",
                  fontSize: 9.5,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.14em",
                  color: "rgba(212,175,106,0.70)",
                  marginBottom: 6,
                }}
              >
                Password
              </label>
              <input
                id="adm-p"
                type="password"
                value={password}
                required
                autoComplete="current-password"
                placeholder="Enter password"
                onChange={(e) => setPassword(e.target.value)}
                className="a-inp"
              />
            </div>

            {lockoutMessage && (
              <div
                className="s4"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  background: "rgba(212,175,106,0.10)",
                  border: "1px solid rgba(212,175,106,0.35)",
                  borderRadius: 6,
                  padding: "9px 12px",
                  fontSize: 12,
                  color: "#FDE68A",
                }}
              >
                <TimerReset size={13} aria-hidden="true" /> {lockoutMessage}
              </div>
            )}

            {error && (
              <div
                className="s4"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  background: "rgba(227,73,72,0.15)",
                  border: "1px solid rgba(227,73,72,0.35)",
                  borderRadius: 6,
                  padding: "9px 12px",
                  fontSize: 12,
                  color: "#FCA5A5",
                }}
              >
                <AlertCircle size={13} aria-hidden="true" /> {error}
              </div>
            )}

            <button type="submit" disabled={loading || Boolean(lockoutMessage)} className="s5 a-btn" style={{ marginTop: 4 }}>
              {loading ? "Signing in..." : "Sign in to secure admin portal"}
            </button>
          </form>
            </div>
          </div>
        </div>

        <div className="s5" style={{ marginTop: 20, textAlign: "center" }}>
          <Link href="/" className="a-backlink" style={{ fontSize: 12 }}>
            Back to TRIBLEERA VAIBHAVAM
          </Link>
        </div>
      </div>
    </div>
  );
}
