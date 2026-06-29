"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { AlertCircle } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    // Mock auth — replace with real API call when backend ready
    setTimeout(() => {
      if (username === "admin" && password === "tribleera2026") {
        try {
          sessionStorage.setItem("admin-auth", "true");
        } catch {}
        router.push("/dashboard/admin");
      } else {
        setError("Invalid username or password.");
        setLoading(false);
      }
    }, 800);
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-5">
      {/* Arch watermark */}
      <svg
        className="pointer-events-none absolute inset-0 m-auto h-[500px] w-[500px] text-gold/[0.06]"
        viewBox="0 0 200 200"
        fill="none"
      >
        <path
          d="M40 180 V100 C40 50 65 15 100 15 C135 15 160 50 160 100 V180"
          stroke="currentColor"
          strokeWidth="5"
        />
        <path
          d="M62 180 V104 C62 68 78 38 100 38 C122 38 138 68 138 104 V180"
          stroke="currentColor"
          strokeWidth="5"
        />
      </svg>

      <div className="relative z-10 w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 text-center">
          <Image
            src="/logo/tribleera-mark-192.png"
            alt="TRIBLEERA"
            width={64}
            height={64}
            className="mx-auto mb-3 rounded-[12px]"
            style={{ boxShadow: "0 0 30px rgba(212,175,106,0.3)" }}
          />
          <p className="font-display text-xl tracking-widest text-cream">TRIBLEERA</p>
          <p className="mt-1 text-xs uppercase tracking-[0.2em] text-cream-faint">
            Admin Portal
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="glass rounded-[14px] p-7 space-y-5">
          <div>
            <label
              htmlFor="username"
              className="block mb-1.5 text-xs font-semibold uppercase tracking-wider text-cream-dim"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
              className="w-full rounded-[6px] border border-cream/15 bg-white/10 px-4 py-3 text-sm text-cream placeholder:text-cream-faint focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/30"
              placeholder="admin"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block mb-1.5 text-xs font-semibold uppercase tracking-wider text-cream-dim"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full rounded-[6px] border border-cream/15 bg-white/10 px-4 py-3 text-sm text-cream placeholder:text-cream-faint focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/30"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-xs text-red-400 flex items-center gap-1.5">
              <AlertCircle size={13} /> {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-[6px] bg-gradient-to-br from-gold-light via-gold to-gold-deep py-3 text-sm font-bold text-burgundy-deep shadow-glow transition-all hover:-translate-y-0.5 disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign In to Admin"}
          </button>
        </form>

        <p className="mt-4 text-center text-[11px] text-cream-faint">
          Admin access only. Unauthorized access is monitored.
        </p>
      </div>
    </div>
  );
}
