import type { Metadata } from "next";
import { VendorDashboardClient } from "@/components/dashboard/VendorDashboardClient";

export const metadata: Metadata = { title: "Vendor Dashboard" };

export default function VendorDashboardPage() {
  return <VendorDashboardClient />;
}
