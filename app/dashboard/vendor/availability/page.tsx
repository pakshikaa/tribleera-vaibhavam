import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { VendorAvailabilityClient } from "@/components/dashboard/VendorAvailabilityClient";

export const metadata: Metadata = { title: "Availability — Vendor Dashboard" };

export default function VendorAvailabilityPage() {
  return (
    <div className="bg-ivory">
      <section className="border-b border-slate/8 bg-white py-10">
        <Container>
          <SectionHeading
            eyebrow="Vendor"
            title="Availability status"
            description="Let customers know when you're open for new bookings, and keep your calendar accurate."
          />
        </Container>
      </section>
      <Container className="py-10 md:py-14">
        <VendorAvailabilityClient />
      </Container>
    </div>
  );
}
