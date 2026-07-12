import type { Metadata } from "next";
import { AdminDisputesClient } from "@/components/dashboard/AdminDisputesClient";
import { BackButton } from "@/components/ui/BackButton";

export const metadata: Metadata = { title: "Disputes - Admin" };

export default function AdminDisputesPage() {
  return (
    <div className="space-y-6">
      <BackButton href="/dashboard/admin" label="Admin" className="mb-4" />
      <div>
        <h1 className="font-display text-2xl font-bold text-slate">Disputes & Cancellations</h1>
        <p className="mt-1 text-sm text-slate-soft">Track dispute SLA deadlines, customer cancellations, and refund resolution status.</p>
      </div>
      <AdminDisputesClient />
    </div>
  );
}
