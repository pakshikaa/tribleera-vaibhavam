import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AdminDisputesClient } from "@/components/dashboard/AdminDisputesClient";
import { disputeCases } from "@/lib/data/disputes";

export const metadata: Metadata = { title: "Disputes & Cancellations — Admin" };

export default function AdminDisputesPage() {
  return (
    <div className="bg-ivory">
      <section className="border-b border-slate/8 bg-white py-10">
        <Container>
          <SectionHeading
            eyebrow="Admin"
            title="Disputes & cancellation review"
            description="Cancellations, refunds, vendor no-shows, duplicate payments and reported misuse — all routed here for resolution."
          />
        </Container>
      </section>
      <Container className="py-10 md:py-14">
        <AdminDisputesClient initial={disputeCases} />
      </Container>
    </div>
  );
}
