import type { Metadata } from "next";
import { Wallet, TrendingUp, ClipboardList, AlertCircle } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StatCard } from "@/components/ui/StatCard";
import { Table, THead, Th, Td, Tr } from "@/components/ui/Table";
import { BookingStatusBadge } from "@/components/dashboard/StatusBadge";
import { formatLKR, formatDateShort } from "@/lib/utils/format";
import { bookings } from "@/lib/data/bookings";

export const metadata: Metadata = { title: "Booking & Payment Monitoring — Admin" };

export default function AdminBookingsPage() {
  const totalVolume = bookings.reduce((s, b) => s + b.serviceTotal, 0);
  const totalFees = bookings.reduce((s, b) => s + b.platformFee, 0);
  const totalCollected = bookings.reduce((s, b) => s + b.payableNow, 0);
  const pendingCount = bookings.filter((b) => b.status === "pending").length;

  return (
    <div className="bg-ivory">
      <section className="border-b border-slate/8 bg-white py-10">
        <Container>
          <SectionHeading
            eyebrow="Admin"
            title="Bookings & payments"
            description="Monitor every transaction flowing through the platform, in real time."
          />
        </Container>
      </section>

      <Container className="py-10 md:py-14">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard label="Gross booking volume" value={formatLKR(totalVolume)} icon={<TrendingUp size={18} />} />
          <StatCard label="Platform fees earned" value={formatLKR(totalFees)} icon={<Wallet size={18} />} />
          <StatCard label="Collected to date" value={formatLKR(totalCollected)} icon={<ClipboardList size={18} />} />
          <StatCard
            label="Awaiting confirmation"
            value={String(pendingCount)}
            deltaTone={pendingCount > 0 ? "danger" : "success"}
            icon={<AlertCircle size={18} />}
          />
        </div>

        <div className="mt-10">
          <Table>
            <THead>
              <Th>Booking ID</Th>
              <Th>Customer</Th>
              <Th>Date</Th>
              <Th>Items</Th>
              <Th>Service total</Th>
              <Th>Platform fee</Th>
              <Th>Payable now</Th>
              <Th>Status</Th>
            </THead>
            <tbody>
              {bookings.map((b) => (
                <Tr key={b.id}>
                  <Td className="font-medium text-burgundy-deep">{b.id}</Td>
                  <Td>
                    {b.customerName}
                    <span className="block text-xs text-slate-soft">{b.customerCity}</span>
                  </Td>
                  <Td>{formatDateShort(b.eventDate)}</Td>
                  <Td>{b.items.length}</Td>
                  <Td>{formatLKR(b.serviceTotal)}</Td>
                  <Td>{formatLKR(b.platformFee)}</Td>
                  <Td className="font-medium">{formatLKR(b.payableNow)}</Td>
                  <Td>
                    <BookingStatusBadge status={b.status} />
                  </Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Container>
    </div>
  );
}
