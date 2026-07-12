import type { Metadata } from "next";
import { BackButton } from "@/components/ui/BackButton";
import { AdminReportsClient } from "@/components/dashboard/AdminReportsClient";

export const metadata: Metadata = { title: "Reports — Admin" };

export default function AdminReportsPage() {
  return (
    <div className="space-y-6">
      <BackButton href="/dashboard/admin" label="Admin" className="mb-4" />
      <AdminReportsClient />
    </div>
  );
}
