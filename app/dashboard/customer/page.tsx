import type { Metadata } from "next";
import { CustomerDashboardClient } from "@/components/dashboard/CustomerDashboardClient";

export const metadata: Metadata = { title: "My Bookings" };

export default function CustomerDashboardPage() {
  return <CustomerDashboardClient />;
}
