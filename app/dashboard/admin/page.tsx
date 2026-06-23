import type { Metadata } from "next";
import Link from "next/link";
import { Store, Users, Wallet, ShieldAlert, ArrowRight, LayoutGrid, Scale } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StatCard } from "@/components/ui/StatCard";
import { Tabs } from "@/components/ui/Tabs";
import { AdminUsersClient } from "@/components/dashboard/AdminUsersClient";
import { BookingStatusBadge } from "@/components/dashboard/StatusBadge";
import { formatLKR, formatDateShort } from "@/lib/utils/format";
import { vendors } from "@/lib/data/vendors";
import { bookings } from "@/lib/data/bookings";
import { users, vendorApplications } from "@/lib/data/users";
import { disputeCases } from "@/lib/data/disputes";

export const metadata: Metadata = { title: "Admin Dashboard" };

const QUICK_LINKS = [
  {
    href: "/dashboard/admin/vendors",
    icon: Store,
    title: "Vendor approvals",
    description: `${vendorApplications.length} application${vendorApplications.length !== 1 ? "s" : ""} awaiting review`,
  },
  {
    href: "/dashboard/admin/bookings",
    icon: Wallet,
    title: "Bookings & payments",
    description: "Monitor every transaction and platform fee in real time",
  },
  {
    href: "/dashboard/admin/disputes",
    icon: Scale,
    title: "Disputes & cancellations",
    description: `${disputeCases.filter((c) => c.status === "open").length} case${disputeCases.filter((c) => c.status === "open").length !== 1 ? "s" : ""} need attention`,
  },
  {
    href: "/dashboard/admin/categories",
    icon: LayoutGrid,
    title: "Category management",
    description: "Control which services are live for customers",
  },
];

export default function AdminDashboardPage() {
  const totalFees = bookings.reduce((s, b) => s + b.platformFee, 0);
  const activeVendors = vendors.filter((v) => v.status === "approved").length;

  return (
    <div className="bg-ivory">
      <section className="border-b border-slate/8 bg-white py-10">
        <Container>
          <SectionHeading eyebrow="Admin" title="Platform overview" />
        </Container>
      </section>

      <Container className="py-10 md:py-14">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard label="Active vendors" value={String(activeVendors)} icon={<Store size={18} />} />
          <StatCard label="Pending approvals" value={String(vendorApplications.length)} deltaTone="danger" icon={<ShieldAlert size={18} />} />
          <StatCard label="Total bookings" value={String(bookings.length)} icon={<Users size={18} />} />
          <StatCard label="Platform fees earned" value={formatLKR(totalFees)} icon={<Wallet size={18} />} />
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {QUICK_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="group flex items-center justify-between rounded-[8px] border border-slate/8 bg-white p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-burgundy/8 text-burgundy">
                  <l.icon size={20} />
                </div>
                <div>
                  <p className="font-display text-lg text-slate">{l.title}</p>
                  <p className="text-sm text-slate-soft">{l.description}</p>
                </div>
              </div>
              <ArrowRight size={18} className="shrink-0 text-gold-deep opacity-0 transition-opacity group-hover:opacity-100" />
            </Link>
          ))}
        </div>

        <div className="mt-10">
          <Tabs
            tabs={[
              { id: "activity", label: "Recent bookings", count: bookings.length },
              { id: "users", label: "Manage users", count: users.length },
            ]}
            panels={{
              activity: (
                <div className="space-y-3">
                  {bookings.map((b) => (
                    <div key={b.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate/8 bg-white px-4 py-3.5">
                      <div>
                        <p className="text-sm font-semibold text-slate">
                          {b.id} <span className="font-normal text-slate-soft">&middot; {b.customerName}</span>
                        </p>
                        <p className="text-xs text-slate-soft">{formatDateShort(b.createdAt)} &middot; {b.items.length} vendor(s)</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-burgundy-deep">{formatLKR(b.payableNow)}</span>
                        <BookingStatusBadge status={b.status} />
                      </div>
                    </div>
                  ))}
                </div>
              ),
              users: <AdminUsersClient initial={users} />,
            }}
          />
        </div>
      </Container>
    </div>
  );
}
