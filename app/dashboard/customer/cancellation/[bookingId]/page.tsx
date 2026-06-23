import Link from "next/link";
import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = { title: "Booking Cancelled" };

export default async function CustomerCancellationPage({
  params,
}: {
  params: Promise<{ bookingId: string }>;
}) {
  const { bookingId } = await params;

  return (
    <div className="bg-ivory py-16">
      <Container className="max-w-2xl">
        <div className="rounded-[12px] border border-slate/10 bg-white p-8 shadow-soft">
          <CheckCircle2 size={32} className="text-burgundy" />
          <h1 className="mt-4 font-display text-4xl text-slate">Booking Cancelled</h1>
          <p className="mt-3 text-base text-slate-soft">
            {bookingId} has been cancelled. Any eligible refund will usually appear within 3-5 business days.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button href="/dashboard/customer#refunds" variant="gold">
              Track Refund
            </Button>
            <Link href="/dashboard/customer" className="inline-flex items-center text-sm font-semibold text-burgundy hover:underline">
              Return to dashboard
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
