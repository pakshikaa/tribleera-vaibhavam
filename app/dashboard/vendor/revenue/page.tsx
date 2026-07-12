import type { Metadata } from "next";
import { VendorRevenueClient } from "@/components/dashboard/VendorRevenueClient";

export const metadata: Metadata = { title: "Revenue | Vendor Dashboard" };

export default function VendorRevenuePage() {
  return <VendorRevenueClient />;
}
