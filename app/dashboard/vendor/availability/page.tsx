import type { Metadata } from "next";
import { VendorAvailabilityClient } from "@/components/dashboard/VendorAvailabilityClient";
import { VendorPageHeader } from "@/components/dashboard/VendorPageHeader";

export const metadata: Metadata = { title: "Availability — Vendor Dashboard" };

export default function VendorAvailabilityPage() {
  return (
    <div className="space-y-8" data-portal="true">
      <VendorPageHeader
        title="Availability"
        description="Let customers know when you're open for new bookings, and keep your calendar accurate."
      />
      <VendorAvailabilityClient />
    </div>
  );
}
