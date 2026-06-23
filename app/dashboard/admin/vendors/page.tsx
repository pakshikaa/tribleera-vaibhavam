import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AdminVendorApprovalClient } from "@/components/dashboard/AdminVendorApprovalClient";
import { vendorApplications } from "@/lib/data/users";

export const metadata: Metadata = { title: "Vendor Approvals — Admin" };

export default function AdminVendorApprovalPage() {
  return (
    <div className="bg-ivory">
      <section className="border-b border-slate/8 bg-white py-10">
        <Container>
          <SectionHeading
            eyebrow="Admin"
            title="Vendor approvals"
            description="Review new vendor applications before they go live to customers."
          />
        </Container>
      </section>
      <Container className="py-10 md:py-14">
        <AdminVendorApprovalClient initial={vendorApplications} />
      </Container>
    </div>
  );
}
