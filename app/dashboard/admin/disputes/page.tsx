import type { Metadata } from "next";
import { AdminDisputesClient } from "@/components/dashboard/AdminDisputesClient";
import { disputeCases } from "@/lib/data/disputes";

export const metadata: Metadata = { title: "Disputes — Admin" };

export default function AdminDisputesPage() {
  const openCount = disputeCases.filter((c) => c.status === "open").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate">Disputes & Cancellations</h1>
        <p className="mt-1 text-sm text-slate-soft">
          {openCount > 0
            ? `${openCount} open case${openCount !== 1 ? "s" : ""} need your attention.`
            : "All disputes resolved — no open cases."}
        </p>
      </div>
      <AdminDisputesClient initial={disputeCases} />
    </div>
  );
}
