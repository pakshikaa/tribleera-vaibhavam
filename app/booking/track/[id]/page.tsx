import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Phone, MessageCircle } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { LifecycleTracker } from "@/components/booking/LifecycleTracker";
import { BookingStatusBadge } from "@/components/dashboard/StatusBadge";
import { Button } from "@/components/ui/Button";
import { formatLKR, formatDate } from "@/lib/utils/format";
import { getBookingById, bookings } from "@/lib/data/bookings";
import { getVendorBySlug } from "@/lib/data/vendors";
import { getCategoryBySlug } from "@/lib/data/categories";
import { BackButton } from "@/components/ui/BackButton";

export function generateStaticParams() {
  return bookings.map((b) => ({ id: b.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  return { title: `Track Booking ${id}` };
}

export default async function BookingTrackingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const booking = getBookingById(id);
  if (!booking) notFound();

  return (
    <div className="bg-ivory">
      <section className="border-b border-slate/8 bg-white py-10">
        <Container>
          <BackButton href="/dashboard/customer" label="My bookings" className="mb-4" />
        </Container>
        <Container className="flex flex-wrap items-center justify-between gap-3">
          <SectionHeading eyebrow={`Booking ${booking.id}`} title="Tracking your booking" />
          <BookingStatusBadge status={booking.status} />
        </Container>
      </section>

      <Container className="py-10 md:py-14">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1fr_340px]">
          <div className="space-y-8">
            <div className="rounded-[8px] border border-slate/8 bg-white p-6 shadow-soft">
              <LifecycleTracker status={booking.status} />
            </div>

            <div>
              <h2 className="font-display text-xl">Booked services</h2>
              <div className="mt-4 space-y-3">
                {booking.items.map((item) => {
                  const vendor = getVendorBySlug(item.vendorId);
                  return (
                    <div key={item.categorySlug} className="rounded-[8px] border border-slate/8 bg-white p-5 shadow-soft">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="text-xs font-medium uppercase tracking-wide text-gold-deep">
                            {getCategoryBySlug(item.categorySlug)?.name}
                          </p>
                          <p className="font-display text-lg text-slate">{item.vendorName}</p>
                          <p className="text-xs text-slate-soft">{item.packageName} package &middot; {formatLKR(item.price)}</p>
                        </div>
                        {vendor && (
                          <div className="flex gap-2">
                            <Button href={`tel:${vendor.phone}`} size="sm" variant="secondary" icon={<Phone size={13} />}>
                              Call
                            </Button>
                            <Button
                              href={`https://wa.me/${vendor.whatsapp.replace(/[^\d]/g, "")}`}
                              size="sm"
                              variant="secondary"
                              icon={<MessageCircle size={13} />}
                            >
                              WhatsApp
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <aside>
            <div className="sticky top-28 space-y-4 rounded-[8px] border border-slate/8 bg-white p-6 shadow-soft">
              <p className="font-display text-lg text-slate">Booking details</p>
              <dl className="space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <dt className="text-slate-soft">Event date</dt>
                  <dd className="font-medium text-slate">{formatDate(booking.eventDate)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-soft">Requested on</dt>
                  <dd className="font-medium text-slate">{formatDate(booking.createdAt)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-soft">Service total</dt>
                  <dd className="font-medium text-slate">{formatLKR(booking.serviceTotal)}</dd>
                </div>
                <div className="flex justify-between border-t border-slate/8 pt-2.5">
                  <dt className="font-semibold text-burgundy-deep">Paid now</dt>
                  <dd className="font-semibold text-burgundy-deep">{formatLKR(booking.payableNow)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-soft">Remaining balance</dt>
                  <dd className="font-medium text-slate">{formatLKR(booking.remainingBalance)}</dd>
                </div>
              </dl>
              <Button href="/dashboard/customer" variant="secondary" fullWidth>
                Back to dashboard
              </Button>
            </div>
          </aside>
        </div>
      </Container>
    </div>
  );
}
