import type { Metadata } from "next";
import { Bell, Eye, CalendarDays, Pencil, TrendingUp } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { StatCard } from "@/components/ui/StatCard";
import { Tabs } from "@/components/ui/Tabs";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { MotifArt } from "@/components/ui/MotifArt";
import { VendorRequestsClient } from "@/components/dashboard/VendorRequestsClient";
import { formatLKR } from "@/lib/utils/format";
import { getVendorBySlug } from "@/lib/data/vendors";
import { vendorRequests } from "@/lib/data/vendorRequests";

export const metadata: Metadata = { title: "Vendor Dashboard" };

const VENDOR_SLUG = "pushpa-florals-and-decor";

export default function VendorDashboardPage() {
  const vendor = getVendorBySlug(VENDOR_SLUG)!;
  const newRequests = vendorRequests.filter((r) => r.status === "new").length;
  const trustPercent = Math.round(vendor.trustScore * 20);

  return (
    <div className="bg-ivory">
      <section className="border-b border-slate/8 bg-white py-10">
        <Container className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 overflow-hidden rounded-[8px] shadow-soft">
              <MotifArt variant={vendor.motif} tone={vendor.tone} seed={vendor.id.length} />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-gold-deep">
                Premium Partner Dashboard
              </p>
              <div className="flex items-center gap-2">
                <h1 className="font-display text-2xl text-burgundy-deep">Welcome back, {vendor.name}</h1>
                {vendor.verified && <Badge tone="rose">Verified</Badge>}
              </div>
              <p className="text-sm text-slate-soft">{vendor.location}</p>
            </div>
          </div>
          <Button variant="secondary" icon={<Pencil size={15} />}>
            Edit profile
          </Button>
        </Container>
      </section>

      <Container className="py-10 md:py-14">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-[200px_1fr]">
          <div className="flex flex-col items-center justify-center rounded-[8px] border-2 border-burgundy/30 bg-white p-6 text-center shadow-soft">
            <p className="font-display text-4xl text-burgundy-deep">{trustPercent}</p>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-soft">Trust Score</p>
            <p className="mt-2 font-display text-sm text-burgundy-deep">Exceptional Performance</p>
            <div className="mt-3 flex flex-wrap justify-center gap-1.5">
              <Badge tone="rose">Top Rated</Badge>
              <Badge tone="gold">Elite Status</Badge>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-2">
            <StatCard label="New requests" value={String(newRequests)} icon={<Bell size={18} />} />
            <StatCard label="Profile views (30d)" value="2,184" delta="+12.4% vs last month" icon={<Eye size={18} />} />
            <StatCard label="Events completed" value={String(vendor.eventsCompleted)} icon={<CalendarDays size={18} />} />
            <StatCard label="Response rate" value="99%" icon={<TrendingUp size={18} />} />
          </div>
        </div>

        <div className="mt-10">
          <Tabs
            tabs={[
              { id: "requests", label: "Booking Requests", count: vendorRequests.length },
              { id: "packages", label: "Packages", count: vendor.packages.length },
              { id: "availability", label: "Availability" },
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
                        {pkg.inclusions.slice(0, 3).map((i) => (
                          <li key={i}>&bull; {i}</li>
                        ))}
                      </ul>
                      <Button variant="secondary" size="sm" className="mt-5" fullWidth icon={<Pencil size={13} />}>
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
                    Currently accepting bookings, with 4 dates blocked. Manage your full calendar and booking status
                    on the dedicated availability page.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {["Dec 4, 2026", "Dec 12, 2026", "Jan 18, 2027", "Feb 2, 2027"].map((d) => (
                      <Badge key={d} tone="danger">
                        {d}
                      </Badge>
                    ))}
                  </div>
                  <Button href="/dashboard/vendor/availability" size="sm" className="mt-5">
                    Manage availability
                  </Button>
                </div>
              ),
            }}
          />
        </div>
      </Container>
    </div>
  );
}
