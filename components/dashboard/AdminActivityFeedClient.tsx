"use client";

import { useMemo, useSyncExternalStore } from "react";
import { useAdminAuth } from "@/components/dashboard/AdminAuthContext";
import { cn } from "@/lib/utils/cn";
import { getAdminSnapshot, subscribeAdminData } from "@/lib/utils/adminLiveData";

interface ActivityItem {
  time: string;
  type: string;
  message: string;
  icon: string;
}

const TYPE_COLORS: Record<string, string> = {
  vendor_update: "bg-blue-50 border-blue-200 text-blue-700",
  vendor_register: "bg-success-pale border-success/30 text-success",
  payment: "bg-gold/10 border-gold/30 text-gold-deep",
  payment_verified: "bg-success-pale border-success/30 text-success",
  event_completed: "bg-gold/10 border-gold/30 text-gold-deep",
  request_submitted: "bg-blue-50 border-blue-200 text-blue-700",
  request_rerouted: "bg-amber-50 border-amber-200 text-amber-800",
  dispute: "bg-rose-pale border-rose/30 text-burgundy",
};

function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

export function AdminActivityFeedClient({ staticFeed }: { staticFeed: ActivityItem[] }) {
  const adminSession = useAdminAuth();
  const snapshot = useSyncExternalStore(subscribeAdminData, getAdminSnapshot, getAdminSnapshot);

  const liveItems = useMemo<ActivityItem[]>(
    () => {
      const allowedTypes =
        adminSession?.role === "content_admin"
          ? ["vendor_update", "vendor_register", "request_submitted", "request_rerouted"]
          : adminSession?.role === "finance_admin"
            ? ["payment", "payment_verified", "event_completed", "dispute"]
            : null;

      return (
      snapshot.notifications
        .filter((item) => !allowedTypes || allowedTypes.includes(item.type))
        .map((item) => ({
          type: item.type,
          message: item.message,
          icon: item.icon ?? "*",
          time: timeAgo(item.time),
        }))
      );
    },
    [adminSession?.role, snapshot.notifications]
  );

  const items = [...liveItems, ...staticFeed].slice(0, 12);

  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex items-start gap-3 rounded-[8px] border border-slate/8 bg-white p-4">
          <span className="text-xl">{item.icon}</span>
          <div className="flex-1">
            <p className="text-sm text-slate">{item.message}</p>
            <p className="mt-0.5 text-[11px] text-slate-soft">{item.time}</p>
          </div>
          <span
            className={cn(
              "rounded-full border px-2 py-0.5 text-[10px] font-semibold",
              TYPE_COLORS[item.type] ?? "bg-ivory border-slate/10 text-slate-soft"
            )}
          >
            {item.type.replace("_", " ")}
          </span>
        </div>
      ))}
    </div>
  );
}
