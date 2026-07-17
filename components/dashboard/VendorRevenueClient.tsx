"use client";

import { useState } from "react";
import { TrendingUp } from "lucide-react";
import { StatCard } from "@/components/ui/StatCard";
import { VendorPageHeader } from "@/components/dashboard/VendorPageHeader";
import { Badge } from "@/components/ui/Badge";
import { formatDate, formatLKR } from "@/lib/utils/format";
import { getCurrentVendorMetrics, subscribeVendorMetrics } from "@/lib/utils/vendorMetrics";
import { useSyncExternalStore } from "react";

export function VendorRevenueClient() {
  const metrics = useSyncExternalStore(subscribeVendorMetrics, getCurrentVendorMetrics, getCurrentVendorMetrics);
  const [renderedAt] = useState(() => Date.now());
  const pendingPayout = metrics.payoutHistory
    .filter((entry) => new Date(entry.payoutDate).getTime() >= renderedAt)
    .reduce((sum, entry) => sum + entry.amount, 0);

  return (
    <div className="space-y-8" data-portal="true">
      <VendorPageHeader
        title="Revenue"
        description="Track your earnings, payout timing, and completed booking history."
      />

      <div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard label="Revenue this month" value={formatLKR(metrics.revenueThisMonth)} icon={<TrendingUp size={18} />} />
          <StatCard label="Completed revenue" value={formatLKR(metrics.completedRevenue)} delta="Paid after completed events" />
          <StatCard label="Pending payout" value={formatLKR(pendingPayout)} delta="Scheduled from completed events" />
          <StatCard label="Events completed" value={String(metrics.payoutHistory.length)} />
        </div>

        <div className="mt-6 rounded-[10px] border border-gold/20 bg-gold/[0.06] p-5">
          <p className="text-sm font-semibold text-slate">Next payout</p>
          {metrics.nextPayout ? (
            <>
              <p className="mt-2 font-display text-3xl text-burgundy-deep">{formatLKR(metrics.nextPayout.amount)}</p>
              <p className="mt-1 text-sm text-slate-soft">
                Your next payout is scheduled for {formatDate(metrics.nextPayout.payoutDate)} from booking {metrics.nextPayout.bookingId}.
              </p>
            </>
          ) : (
            <p className="mt-2 text-sm text-slate-soft">No upcoming payout is scheduled yet. Payouts appear here 3 business days after completed events.</p>
          )}
        </div>

        <div className="mt-8">
          <h2 className="mb-4 font-display text-lg text-slate">Payout timeline</h2>
          {metrics.payoutHistory.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-soft">No completed-event payouts yet.</p>
          ) : (
            <div className="space-y-3">
              {metrics.payoutHistory.map((entry) => {
                const paid = new Date(entry.payoutDate).getTime() < renderedAt;
                return (
                  <div key={entry.bookingId} className="rounded-[8px] border border-slate/8 bg-white p-5 shadow-soft">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="font-medium text-slate">{entry.customerName}</p>
                        <p className="text-xs text-slate-soft">Booking {entry.bookingId} · Event {formatDate(entry.eventDate)}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-display text-xl text-burgundy-deep">{formatLKR(entry.amount)}</p>
                        <Badge tone={paid ? "success" : "warning"}>{paid ? "Payout due/processed" : "Scheduled payout"}</Badge>
                      </div>
                    </div>
                    <p className="mt-3 text-sm text-slate-soft">Payout target date: {formatDate(entry.payoutDate)}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
