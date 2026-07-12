import type { Metadata } from "next";
import { BackButton } from "@/components/ui/BackButton";
import { AdminPaymentsClient } from "@/components/dashboard/AdminPaymentsClient";

export const metadata: Metadata = { title: "Payments — Admin" };

export default function AdminPaymentsPage() {
  return (
    <div className="space-y-6">
      <BackButton href="/dashboard/admin" label="Admin" className="mb-4" />
      <AdminPaymentsClient />
    </div>
  );
}
