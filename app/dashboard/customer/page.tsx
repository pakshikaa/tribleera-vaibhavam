import type { Metadata } from "next";
import { CalendarClock, Wallet, ClipboardList, MapPin } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { StatCard } from "@/components/ui/StatCard";
import { Tabs } from "@/components/ui/Tabs";
import { Avatar } from "@/components/ui/Avatar";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Field";
import { BookingStatusBadge } from "@/components/dashboard/StatusBadge";
import { formatLKR, formatDate } from "@/lib/utils/format";
import { getBookingsForCustomer } from "@/lib/data/bookings";
import { getCategoryBySlug } from "@/lib/data/categories";

export const metadata: Metadata = { title: "Customer Dashboard" };

const CUSTOMER_NAME = "Niranjala & Kajan";

export default function CustomerDashboardPage() {
  const bookings = getBookingsForCustomer(CUSTOMER_NAME);
  const active = bookings.filter((b) => b.status !== "completed" && b.status !== "cancelled");
  const totalPaid = bookings.reduce((sum, b) => sum + b.payableNow, 0);
  const nextEvent = bookings[0]?.eventDate;

  return (
    <div className="bg-ivory">
      <section className="border-b border-slate/8 bg-white py-10">
        <Container className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <Avatar name={CUSTOMER_NAME} size={56} />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-soft">Welcome back</p>
              <h1 className="font-display text-2xl">{CUSTOMER_NAME}</h1>
              <p className="flex items-center gap-1 text-sm text-slate-soft">
                <MapPin size={13} /> Jaffna
              </p>
            </div>
          </div>
          <Button href="/services" size="md">
            Plan another category
          </Button>
        </Container>
      </section>

      <Container className="py-10 md:py-14">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard label="Active bookings" value={String(active.length)} icon={<ClipboardList size={18} />} />
          <StatCard label="Total paid to date" value={formatLKR(totalPaid)} icon={<Wallet size={18} />} />
          <StatCard
            label="Next event"
            value={nextEvent ? formatDate(nextEvent) : "—"}
            icon={<CalendarClock size={18} />}
          />
        </div>

        <div className="mt-10">
          <Tabs
            tabs={[{ id: "bookings", label: "My Bookings", count: bookings.length }, { id: "profile", label: "Profile" }]}
            panels={{
              bookings:
                bookings.length === 0 ? (
                  <EmptyState
                    icon={<ClipboardList size={28} />}
                    title="No bookings yet"
                    description="Once you book a vendor, it will show up here with full payment tracking."
                    action={<Button href="/services">Start planning</Button>}
                  />
                ) : (
                  <div className="space-y-4">
                    {bookings.map((b) => (
                      <div key={b.id} className="rounded-[8px] border border-slate/8 bg-white p-5 shadow-soft md:p-6">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div>
                            <p className="font-display text-lg text-slate">{b.id}</p>
                            <p className="text-xs text-slate-soft">Event date: {formatDate(b.eventDate)}</p>
                          </div>
                          <BookingStatusBadge status={b.status} />
                        </div>
                        <div className="mt-4 divide-y divide-slate/8 border-y border-slate/8">
                          {b.items.map((item) => (
                            <div key={item.categorySlug} className="flex items-center justify-between py-2.5 text-sm">
                              <div>
                                <span className="text-slate-soft">{getCategoryBySlug(item.categorySlug)?.name}: </span>
                                <span className="font-medium text-slate">{item.vendorName}</span>
                              </div>
                              <span className="text-slate-soft">{formatLKR(item.price)}</span>
                            </div>
                          ))}
                        </div>
                        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm">
                          <span className="text-slate-soft">
                            Paid now <span className="font-semibold text-burgundy-deep">{formatLKR(b.payableNow)}</span> &middot;
                            Remaining <span className="font-semibold text-slate">{formatLKR(b.remainingBalance)}</span>
                          </span>
                          <Button href={`/booking/track/${b.id}`} variant="tertiary" size="sm">
                            Track booking
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ),
              profile: (
                <div className="max-w-lg rounded-[8px] border border-slate/8 bg-white p-6 shadow-soft">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Input label="Full name" defaultValue={CUSTOMER_NAME} />
                    <Input label="City" defaultValue="Jaffna" />
                    <Input label="Phone" defaultValue="+94 77 410 0012" />
                    <Input label="Email" defaultValue="niranjala.kajan@example.com" type="email" />
                  </div>
                  <Button className="mt-5">Save changes</Button>
                </div>
              ),
            }}
          />
        </div>
      </Container>
    </div>
  );
}
