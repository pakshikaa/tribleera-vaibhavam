"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils/cn";

interface ActivityItem {
  time: string;
  type: string;
  message: string;
  icon: string;
}

interface StoredNotification {
  type: string;
  message: string;
  time: string;
  icon: string;
}

const TYPE_COLORS: Record<string, string> = {
  vendor_update: "bg-blue-50 border-blue-200 text-blue-700",
  vendor_register: "bg-success-pale border-success/30 text-success",
  payment: "bg-gold/10 border-gold/30 text-gold-deep",
  payment_verified: "bg-success-pale border-success/30 text-success",
  event_completed: "bg-gold/10 border-gold/30 text-gold-deep",
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

const ADMIN_NOTIFICATIONS_KEY = "tv-admin-notifications";

function readLiveItems(): ActivityItem[] {
  try {
    const notifs: StoredNotification[] = JSON.parse(window.localStorage.getItem(ADMIN_NOTIFICATIONS_KEY) ?? "[]");
    return notifs.map((n) => ({ ...n, time: timeAgo(n.time) }));
  } catch {
    return [];
  }
}

export function AdminActivityFeedClient({ staticFeed }: { staticFeed: ActivityItem[] }) {
  const [liveItems, setLiveItems] = useState<ActivityItem[]>([]);

  useEffect(() => {
    // One-time hydration from a browser-only store; see CartContext for the
    // same documented exception to the set-state-in-effect rule.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLiveItems(readLiveItems());
    const interval = setInterval(() => setLiveItems(readLiveItems()), 10000);
    return () => clearInterval(interval);
  }, []);

  const items = [...liveItems, ...staticFeed];

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
