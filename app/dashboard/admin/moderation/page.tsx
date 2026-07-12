import type { Metadata } from "next";
import { ShieldCheck, AlertTriangle } from "lucide-react";
import { vendors } from "@/lib/data/vendors";
import { cn } from "@/lib/utils/cn";
import { BackButton } from "@/components/ui/BackButton";
import { AdminPortfolioQueueClient } from "@/components/dashboard/AdminPortfolioQueueClient";

export const metadata: Metadata = { title: "Moderation — Admin" };

const FLAG_REASONS = [
  "Misleading portfolio images",
  "Unresponsive to customer messages",
  "Price mismatch after booking",
  "Reported no-show",
];

export default function AdminModerationPage() {
  const suspended = vendors.filter((v) => v.status === "suspended");
  const pending = vendors.filter((v) => v.status === "pending");

  return (
    <div className="space-y-6">
      <BackButton href="/dashboard/admin" label="Admin" className="mb-4" />
      <div>
        <h1 className="font-display text-2xl font-bold text-slate">Moderation</h1>
        <p className="mt-1 text-sm text-slate-soft">
          Review flagged vendors, suspended accounts and platform policy issues.
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {[
          { label: "Suspended vendors", value: suspended.length, color: "text-red-600" },
          { label: "Pending review", value: pending.length, color: "text-amber-600" },
          { label: "Active flags", value: FLAG_REASONS.length, color: "text-burgundy" },
        ].map((s) => (
          <div key={s.label} className="rounded-[10px] border border-slate/10 bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-soft">{s.label}</p>
            <p className={cn("mt-2 font-display text-2xl font-bold", s.color)}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Portfolio photo review queue — vendor uploads publish only from here */}
      <AdminPortfolioQueueClient />

      {/* Flag queue */}
      <div className="rounded-[10px] border border-slate/10 bg-white">
        <div className="border-b border-slate/8 px-5 py-4 flex items-center gap-2">
          <AlertTriangle size={16} className="text-amber-500" />
          <h2 className="font-display text-base font-semibold text-slate">Active Policy Flags</h2>
        </div>
        {FLAG_REASONS.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <ShieldCheck size={32} className="mx-auto mb-3 text-success" />
            <p className="font-semibold text-slate">No active flags</p>
          </div>
        ) : (
          <div className="divide-y divide-slate/8">
            {FLAG_REASONS.map((reason, i) => (
              <div key={i} className="flex items-center justify-between px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-amber-400" />
                  <p className="text-sm text-slate">{reason}</p>
                </div>
                <div className="flex gap-2">
                  <button className="rounded-[6px] border border-slate/15 px-3 py-1.5 text-xs font-medium text-slate-soft hover:bg-ivory">
                    Dismiss
                  </button>
                  <button className="rounded-[6px] bg-burgundy px-3 py-1.5 text-xs font-medium text-white hover:bg-burgundy-deep">
                    Review
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Suspended vendors */}
      {suspended.length > 0 && (
        <div className="rounded-[10px] border border-slate/10 bg-white">
          <div className="border-b border-slate/8 px-5 py-4">
            <h2 className="font-display text-base font-semibold text-slate">Suspended Vendors</h2>
          </div>
          <div className="divide-y divide-slate/8">
            {suspended.map((v) => (
              <div key={v.id} className="flex items-center justify-between px-5 py-4">
                <div>
                  <p className="font-medium text-slate">{v.name}</p>
                  <p className="text-xs text-slate-soft">{v.categorySlug} · {v.city}</p>
                </div>
                <button className="rounded-[6px] border border-success/30 bg-success-pale px-3 py-1.5 text-xs font-medium text-success hover:bg-success/10">
                  Reinstate
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
