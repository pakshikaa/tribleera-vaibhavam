"use client";

import { useMemo, useSyncExternalStore } from "react";
import { AlertTriangle, Bell, Eye, ExternalLink, Pencil, ShieldCheck, Sparkles, TrendingUp, Wallet } from "lucide-react";
import { StatCard } from "@/components/ui/StatCard";
import { Tabs } from "@/components/ui/Tabs";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { MotifArt } from "@/components/ui/MotifArt";
import { VendorOnboardingCard } from "@/components/dashboard/VendorOnboardingCard";
import { VendorRequestsClient } from "@/components/dashboard/VendorRequestsClient";
import { formatDate, formatLKR } from "@/lib/utils/format";
import { vendorRequests } from "@/lib/data/vendorRequests";
import { getCurrentVendorMetrics, subscribeVendorMetrics } from "@/lib/utils/vendorMetrics";

function daysUntil(dateStr: string): number {
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}

function TrustScoreRing({ score }: { score: number }) {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const filled = (score / 100) * circumference;
  return (
    <div className="relative flex h-16 w-16 shrink-0 items-center justify-center">
      <svg width={64} height={64} viewBox="0 0 64 64" className="-rotate-90">
        <circle cx={32} cy={32} r={radius} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth={5} />
        <circle cx={32} cy={32} r={radius} fill="none" stroke="#D4AF6A" strokeWidth={5} strokeDasharray={`${filled} ${circumference}`} strokeLinecap="round" />
      </svg>
      <p className="absolute font-display text-base font-bold text-gold-light">{score}</p>
    </div>
  );
}

export function VendorDashboardClient() {
  const metrics = useSyncExternalStore(subscribeVendorMetrics, getCurrentVendorMetrics, getCurrentVendorMetrics);
  const vendor = metrics.vendor;

  const upcomingSoon = useMemo(
    () =>
      metrics.bookings
        .filter((booking) => booking.status !== "cancelled" && booking.status !== "completed")
        .map((booking) => ({ ...booking, daysUntil: daysUntil(booking.eventDate) }))
        .filter((booking) => booking.daysUntil >= 0 && booking.daysUntil <= 3)
        .sort((left, right) => left.daysUntil - right.daysUntil),
    [metrics.bookings]
  );

  const maxViews = Math.max(1, ...metrics.viewsTrend.map((point) => point.value));
  const maxEarnings = Math.max(1, ...metrics.earningsTimeline.map((point) => point.value));

  if (!vendor) return null;

  return (
    <div data-portal="true">
      <section
        className="relative overflow-hidden rounded-[12px] px-5 py-8 shadow-ambient md:px-8"
        style={{ background: "linear-gradient(135deg, #15040C 0%, #380C1E 45%, #5C0427 80%, #7A1F3D 100%)" }}
      >
        {/* Mandap-arch watermark — brand texture without competing with the text. */}
        <svg
          aria-hidden="true"
          viewBox="0 0 200 200"
          className="pointer-events-none absolute -right-6 -top-8 h-56 w-56 opacity-[0.06]"
        >
          <path d="M40 180V100C40 50 65 15 100 15S160 50 160 100v80" stroke="#D4AF6A" strokeWidth="4" fill="none" />
          <path d="M62 180V104C62 68 78 38 100 38S138 68 138 104v76" stroke="#D4AF6A" strokeWidth="4" fill="none" />
        </svg>

        <div className="relative z-[1] flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full shadow-soft ring-2 ring-gold/45 ring-offset-2 ring-offset-burgundy-950">
              <MotifArt variant={vendor.motif} tone={vendor.tone} seed={vendor.id.length} />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-gold">Premium Partner Dashboard</p>
              <h1 className="mt-0.5 font-display text-2xl text-cream">
                Welcome back, <span className="text-gold-light">{vendor.name}</span>
              </h1>
              <div className="mt-1.5 flex flex-wrap items-center gap-2">
                {vendor.verified && (
                  <span className="inline-flex items-center gap-1 rounded-[3px] border border-gold/30 bg-gold/[0.15] px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-[0.1em] text-gold">
                    <ShieldCheck size={11} aria-hidden="true" /> Verified
                  </span>
                )}
                <span className="text-[11px] text-cream-faint">{vendor.location}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <TrustScoreRing score={Math.round(vendor.trustScore * 20)} />
            <div className="grid w-full grid-cols-1 gap-2 sm:flex sm:w-auto sm:flex-wrap">
              <Button href="/dashboard/vendor/profile" variant="glass" icon={<Pencil size={15} />} fullWidth>
                Edit profile
              </Button>
              <Button href="/dashboard/vendor/packages" variant="gold" fullWidth>
                Manage packages
              </Button>
              <Button
                href={`/vendors/${vendor.slug}`}
                target="_blank"
                variant="glass"
                icon={<ExternalLink size={15} />}
                fullWidth
              >
                View live profile
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="mt-8">
        <VendorOnboardingCard />

        {upcomingSoon.length > 0 && (
          <div className="mb-8 rounded-[10px] border border-gold/30 bg-gold/[0.08] p-5">
            <div className="flex items-center gap-2 text-amber-900">
              <AlertTriangle size={18} className="text-gold-deep" />
              <p className="font-display text-base font-semibold text-burgundy-deep">Upcoming event - action required</p>
            </div>
            <div className="mt-3 space-y-2">
              {upcomingSoon.map((booking) => (
                <div key={booking.id} className="flex flex-wrap items-center justify-between gap-3 rounded-[8px] bg-white/70 px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-slate">{booking.customerName}</p>
                    <p className="text-xs text-slate-soft">{formatDate(booking.eventDate)}</p>
                  </div>
                  <p className="font-display text-2xl font-bold text-burgundy-deep">
                    {booking.daysUntil === 0 ? "Today" : booking.daysUntil === 1 ? "1 day" : `${booking.daysUntil} days`}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard label="New requests" value={String(metrics.requests.filter((item) => item.status === "new").length)} icon={<Bell size={18} />} accent="burgundy" />
          <StatCard
            label="Profile views (30d)"
            value={String(metrics.views30d)}
            delta={`${metrics.viewsDelta >= 0 ? "+" : ""}${metrics.viewsDelta}% vs previous 30d`}
            icon={<Eye size={18} />}
            accent="gold"
          />
          <StatCard label="Revenue this month" value={formatLKR(metrics.revenueThisMonth)} icon={<Wallet size={18} />} accent="success" />
          <StatCard label="Response rate" value={`${metrics.responseRate}%`} icon={<TrendingUp size={18} />} accent="info" />
        </div>

        <div className="mt-8 rounded-[10px] border border-slate/8 bg-white p-6 shadow-ambient">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-xl text-burgundy-deep">Your public profile</h2>
            <div className="grid w-full grid-cols-1 gap-2 sm:flex sm:w-auto">
              <Button href="/dashboard/vendor/profile" variant="secondary" size="sm" icon={<Pencil size={14} />} fullWidth>
                Edit
              </Button>
              <Button href={`/vendors/${vendor.slug}`} variant="secondary" size="sm" icon={<ExternalLink size={14} />} fullWidth>
                Preview customer view
              </Button>
            </div>
          </div>
          <p className="mt-2 text-sm text-slate-soft">This preview uses the same live vendor data customers see on the public marketplace.</p>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {[
              { label: "Business name", value: vendor.name },
              { label: "Category", value: vendor.categorySlug.replace(/-/g, " ") },
              { label: "Location", value: vendor.location },
              { label: "Trust score", value: `${vendor.trustScore.toFixed(1)} / 5.0` },
              { label: "Events completed", value: String(vendor.eventsCompleted) },
              { label: "Active packages", value: String(vendor.packages.length) },
            ].map((item) => (
              <div key={item.label} className="rounded-[8px] bg-ivory p-3">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-soft">{item.label}</p>
                <p className="mt-1 text-sm font-semibold text-slate">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10">
          <Tabs
            tabs={[
              { id: "requests", label: "Booking Requests", count: metrics.requests.length },
              { id: "packages", label: "Packages", count: vendor.packages.length },
              { id: "availability", label: "Availability" },
              { id: "analytics", label: "Analytics" },
            ]}
            panels={{
              requests: <VendorRequestsClient initial={vendor.slug === "pushpa-florals-and-decor" ? vendorRequests : []} />,
              packages: (
                <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                  {vendor.packages.map((pkg) => (
                    <div key={pkg.id} className="rounded-[8px] border border-slate/8 bg-white p-5 shadow-soft">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-soft">{pkg.tier}</p>
                      <p className="mt-1 font-display text-xl text-slate">{pkg.name}</p>
                      <p className="mt-2 font-display text-2xl text-burgundy-deep">{formatLKR(pkg.price)}</p>
                      <ul className="mt-4 space-y-1.5 text-sm text-slate-soft">
                        {pkg.inclusions.slice(0, 3).map((inclusion) => (
                          <li key={inclusion}>- {inclusion}</li>
                        ))}
                      </ul>
                      <Button href="/dashboard/vendor/packages" variant="secondary" size="sm" className="mt-5" fullWidth icon={<Pencil size={13} />}>
                        Edit package
                      </Button>
                    </div>
                  ))}
                </div>
              ),
              availability: (
                <div className="rounded-[8px] border border-slate/8 bg-white p-6 shadow-soft">
                  <p className="font-display text-lg text-burgundy-deep">Availability status</p>
                  <p className="mt-1 text-sm text-slate-soft">
                    Currently accepting bookings. Manage your full calendar and booking status on the dedicated availability page.
                  </p>
                  <Button href="/dashboard/vendor/availability" size="sm" className="mt-5">
                    Manage availability
                  </Button>
                </div>
              ),
              analytics: (
                <div className="space-y-5">
                  <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
                    <div className="rounded-[8px] border border-slate/8 bg-white p-6 shadow-soft">
                      <p className="text-sm font-semibold uppercase tracking-wide text-slate-soft">Views trend</p>
                      <div className="mt-5 flex h-52 items-end gap-3">
                        {metrics.viewsTrend.map((point) => (
                          <div key={point.label} className="flex flex-1 flex-col items-center gap-2">
                            <div className="flex h-full w-full items-end">
                              <div className="w-full rounded-t-[8px] bg-burgundy" style={{ height: `${Math.max(10, (point.value / maxViews) * 100)}%` }} />
                            </div>
                            <p className="text-[11px] text-slate-soft">{point.label}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <StatCard label="Inquiry conversion" value={`${metrics.conversionRate}%`} />
                      <StatCard label="Response rate" value={`${metrics.responseRate}%`} />
                      <StatCard label="Accepted inquiries" value={String(metrics.acceptedRequests)} />
                      <StatCard label="Completed revenue" value={formatLKR(metrics.completedRevenue)} />
                    </div>
                  </div>

                  <div className="rounded-[8px] border border-slate/8 bg-white p-6 shadow-soft">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold uppercase tracking-wide text-slate-soft">Earnings trend</p>
                        <p className="mt-2 font-display text-4xl text-burgundy-deep">{formatLKR(metrics.activeRevenue)}</p>
                      </div>
                      <Badge tone="gold">Live from your booking history</Badge>
                    </div>
                    <div className="mt-5 flex h-44 items-end gap-3">
                      {metrics.earningsTimeline.map((point) => (
                        <div key={point.label} className="flex flex-1 flex-col items-center gap-2">
                          <div className="flex h-full w-full items-end">
                            <div className="w-full rounded-t-[8px] bg-gold" style={{ height: `${Math.max(10, (point.value / maxEarnings) * 100)}%` }} />
                          </div>
                          <p className="text-[11px] text-slate-soft">{point.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-[8px] border border-gold/20 bg-gold/10 p-6">
                    <div className="flex items-start gap-3">
                      <Sparkles size={18} className="mt-1 text-gold-deep" />
                      <div>
                        <p className="font-display text-xl text-burgundy-deep">Performance insight</p>
                        <p className="mt-2 text-sm leading-relaxed text-slate-soft">
                          Your current inquiry conversion rate is {metrics.conversionRate}% with a {metrics.responseRate}% response rate. Higher response consistency and fresh gallery/profile updates usually lift discovery performance first.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ),
            }}
          />
        </div>
      </div>
    </div>
  );
}
