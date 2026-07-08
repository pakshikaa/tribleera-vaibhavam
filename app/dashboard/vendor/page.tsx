import type { Metadata } from "next";
import { AlertTriangle, Bell, CalendarDays, Eye, ExternalLink, Pencil, Sparkles, TrendingUp } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { StatCard } from "@/components/ui/StatCard";
import { Tabs } from "@/components/ui/Tabs";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { MotifArt } from "@/components/ui/MotifArt";
import { VendorRequestsClient } from "@/components/dashboard/VendorRequestsClient";
import { formatDate, formatLKR } from "@/lib/utils/format";
import { getVendorBySlug } from "@/lib/data/vendors";
import { vendorRequests } from "@/lib/data/vendorRequests";
import { bookings } from "@/lib/data/bookings";

export const metadata: Metadata = { title: "Vendor Dashboard" };

const VENDOR_SLUG = "pushpa-florals-and-decor";

// Module-scope so the impure Date.now() read is an opaque call from the
// component's perspective — same pattern as generateBookingId().
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
        <circle
          cx={32}
          cy={32}
          r={radius}
          fill="none"
          stroke="#D4AF6A"
          strokeWidth={5}
          strokeDasharray={`${filled} ${circumference}`}
          strokeLinecap="round"
        />
      </svg>
      <p className="absolute font-display text-base font-bold text-gold-light">{score}</p>
    </div>
  );
}

export default function VendorDashboardPage() {
  const vendor = getVendorBySlug(VENDOR_SLUG)!;
  const newRequests = vendorRequests.filter((request) => request.status === "new").length;
  const trustPercent = Math.round(vendor.trustScore * 20);
  const vendorBookings = bookings.filter((booking) => booking.items.some((item) => item.vendorId === vendor.id));
  const completedRevenue = vendorBookings
    .filter((booking) => booking.status === "completed")
    .reduce((sum, booking) => sum + booking.items.filter((item) => item.vendorId === vendor.id).reduce((itemSum, item) => itemSum + item.price, 0), 0);
  const averageBookingValue = vendorBookings.length
    ? Math.round(vendorBookings.reduce((sum, booking) => sum + booking.items.filter((item) => item.vendorId === vendor.id).reduce((itemSum, item) => itemSum + item.price, 0), 0) / vendorBookings.length)
    : 0;
  const monthlyTarget = 450000;
  const monthlyProgress = Math.min(100, Math.round((completedRevenue / monthlyTarget) * 100));

  const upcomingSoon = vendorBookings
    .filter((b) => b.status !== "cancelled" && b.status !== "completed")
    .map((b) => ({ ...b, daysUntil: daysUntil(b.eventDate) }))
    .filter((b) => b.daysUntil >= 0 && b.daysUntil <= 3)
    .sort((a, b) => a.daysUntil - b.daysUntil);

  return (
    <div className="bg-ivory">
      <section
        className="py-10"
        style={{ background: "linear-gradient(135deg, #15040C 0%, #5C0427 100%)" }}
      >
        <Container className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 overflow-hidden rounded-[8px] shadow-soft">
              <MotifArt variant={vendor.motif} tone={vendor.tone} seed={vendor.id.length} />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-gold">Premium Partner Dashboard</p>
              <div className="flex items-center gap-2">
                <h1 className="font-display text-2xl text-cream">Welcome back, {vendor.name}</h1>
                {vendor.verified && <Badge tone="rose">Verified</Badge>}
              </div>
              <p className="text-sm text-cream-dim">{vendor.location}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <TrustScoreRing score={trustPercent} />
            <div className="flex flex-wrap gap-2">
              <Button href="/dashboard/vendor/profile" variant="glass" icon={<Pencil size={15} />}>
                Edit profile
              </Button>
              <Button href="/dashboard/vendor/packages" variant="gold">
                Manage packages
              </Button>
            </div>
          </div>
        </Container>
      </section>

      <Container className="py-10 md:py-14">
        {upcomingSoon.length > 0 && (
          <div className="mb-8 rounded-[10px] border border-gold/30 bg-gold/[0.08] p-5">
            <div className="flex items-center gap-2 text-amber-900">
              <AlertTriangle size={18} className="text-gold-deep" />
              <p className="font-display text-base font-semibold text-burgundy-deep">Upcoming event — action required</p>
            </div>
            <div className="mt-3 space-y-2">
              {upcomingSoon.map((b) => (
                <div
                  key={b.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-[8px] bg-white/70 px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-semibold text-slate">{b.customerName}</p>
                    <p className="text-xs text-slate-soft">{formatDate(b.eventDate)}</p>
                  </div>
                  <p className="font-display text-2xl font-bold text-burgundy-deep">
                    {b.daysUntil === 0 ? "Today" : b.daysUntil === 1 ? "1 day" : `${b.daysUntil} days`}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          <StatCard label="New requests" value={String(newRequests)} icon={<Bell size={18} />} accent="burgundy" />
          <StatCard
            label="Profile views (30d)"
            value="2,184"
            delta="+12.4% vs last month"
            icon={<Eye size={18} />}
            accent="gold"
          />
          <StatCard label="Events completed" value={String(vendor.eventsCompleted)} icon={<CalendarDays size={18} />} accent="success" />
          <StatCard label="Response rate" value="99%" icon={<TrendingUp size={18} />} accent="info" />
        </div>

        {/* Your public profile card */}
        <div className="mt-8 rounded-[10px] border border-slate/8 bg-white p-6 shadow-ambient">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-xl text-burgundy-deep">Your public profile</h2>
            <div className="flex gap-2">
              <Button href="/dashboard/vendor/profile" variant="secondary" size="sm" icon={<Pencil size={14} />}>
                Edit
              </Button>
              <Button href={`/vendors/${vendor.slug}`} variant="secondary" size="sm" icon={<ExternalLink size={14} />}>
                View live
              </Button>
            </div>
          </div>
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
              { id: "requests", label: "Booking Requests", count: vendorRequests.length },
              { id: "packages", label: "Packages", count: vendor.packages.length },
              { id: "availability", label: "Availability" },
              { id: "analytics", label: "Analytics" },
            ]}
            panels={{
              requests: <VendorRequestsClient initial={vendorRequests} />,
              packages: (
                <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                  {vendor.packages.map((pkg) => (
                    <div key={pkg.id} className="rounded-[8px] border border-slate/8 bg-white p-5 shadow-soft">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-soft">{pkg.tier}</p>
                      <p className="mt-1 font-display text-xl text-slate">{pkg.name}</p>
                      <p className="mt-2 font-display text-2xl text-burgundy-deep">{formatLKR(pkg.price)}</p>
                      <ul className="mt-4 space-y-1.5 text-sm text-slate-soft">
                        {pkg.inclusions.slice(0, 3).map((inclusion) => (
                          <li key={inclusion}>• {inclusion}</li>
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
                    Currently accepting bookings, with 4 dates blocked. Manage your full calendar and booking status on the dedicated availability page.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {["Dec 4, 2026", "Dec 12, 2026", "Jan 18, 2027", "Feb 2, 2027"].map((date) => (
                      <Badge key={date} tone="danger">
                        {date}
                      </Badge>
                    ))}
                  </div>
                  <Button href="/dashboard/vendor/availability" size="sm" className="mt-5">
                    Manage availability
                  </Button>
                </div>
              ),
              analytics: (
                <div className="space-y-5">
                  <div className="rounded-[8px] border border-slate/8 bg-white p-6 shadow-soft">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold uppercase tracking-wide text-slate-soft">Revenue Overview</p>
                        <p className="mt-2 font-display text-4xl text-burgundy-deep">{formatLKR(completedRevenue)}</p>
                      </div>
                      <Badge tone="gold">↑ +12.5% from last month</Badge>
                    </div>
                    <div className="mt-5">
                      <div className="flex items-center justify-between text-sm text-slate-soft">
                        <span>Current month vs target</span>
                        <span>{monthlyProgress}%</span>
                      </div>
                      <div className="mt-2 h-3 rounded-full bg-ivory">
                        <div className="h-3 rounded-full bg-burgundy" style={{ width: `${monthlyProgress}%` }} />
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    <div className="rounded-[8px] border border-slate/8 bg-white p-6 shadow-soft">
                      <p className="font-display text-lg text-slate">Service Popularity</p>
                      {[
                        { label: "Essential Package", value: 45 },
                        { label: "Signature Package", value: 35 },
                        { label: "Heritage Package", value: 20 },
                      ].map((row) => (
                        <div key={row.label} className="mt-4">
                          <div className="flex items-center justify-between text-sm text-slate-soft">
                            <span>{row.label}</span>
                            <span>{row.value}%</span>
                          </div>
                          <div className="mt-2 h-2 rounded-full bg-ivory">
                            <div className="h-2 rounded-full bg-burgundy" style={{ width: `${row.value}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <StatCard label="Response Rate" value="99%" />
                      <StatCard label="Booking Success" value="94%" />
                      <StatCard label="Avg Booking Value" value={formatLKR(averageBookingValue)} />
                      <StatCard label="Trust Score" value={vendor.trustScore.toFixed(1)} />
                    </div>
                  </div>

                  <div className="rounded-[8px] border border-gold/20 bg-gold/10 p-6">
                    <div className="flex items-start gap-3">
                      <Sparkles size={18} className="mt-1 text-gold-deep" />
                      <div>
                        <p className="font-display text-xl text-burgundy-deep">Market Perspective</p>
                        <p className="mt-2 text-sm leading-relaxed text-slate-soft">
                          Your decoration packages are performing above 78% of similar vendors in {vendor.city}. Focus on updating your gallery to increase conversion.
                        </p>
                        <ul className="mt-4 space-y-2 text-sm text-slate-soft">
                          <li>• Update your availability calendar - vendors with updated calendars appear 42% higher in searches.</li>
                          <li>• Add client testimonial photos to your gallery (0 uploaded).</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ),
            }}
          />
        </div>
      </Container>
    </div>
  );
}
