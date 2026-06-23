import type { Metadata } from "next";
import { CustomerDashboardClient } from "@/components/dashboard/CustomerDashboardClient";

export const metadata: Metadata = { title: "Customer Dashboard" };

export default function CustomerDashboardPage() {
  return <CustomerDashboardClient />;
}
