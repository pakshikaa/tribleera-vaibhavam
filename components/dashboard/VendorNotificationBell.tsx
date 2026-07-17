"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Bell } from "lucide-react";
import { readLocalStorage, writeLocalStorage } from "@/lib/utils/browser-storage";
import { getCurrentVendorSlug } from "@/lib/utils/vendorPortal";
import { formatDateShort } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";

interface VendorNotification {
  id: string;
  type?: string;
  message: string;
  time: string;
  read?: boolean;
}

function notificationsKey(slug: string) {
  return `tv-vendor-notifications-${slug}`;
}

/**
 * In-dashboard notification bell for vendors (V-24): unread badge, dropdown
 * feed, 15s polling of the per-vendor store, and native browser
 * notifications for items that arrive while the dashboard is open.
 */
export function VendorNotificationBell() {
  const [slug, setSlug] = useState("");
  const [items, setItems] = useState<VendorNotification[]>([]);
  const [open, setOpen] = useState(false);
  // Sidebar placement (desktop) needs the panel to open rightward; the mobile
  // top-bar placement needs it leftward — pick based on where the bell sits.
  const [alignLeft, setAlignLeft] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const knownIds = useRef<Set<string> | null>(null);

  const refresh = useCallback((vendorSlug: string) => {
    const list = readLocalStorage<VendorNotification[]>(notificationsKey(vendorSlug), []);
    setItems([...list].reverse());

    // Fire a browser notification for anything new since the last poll.
    if (knownIds.current) {
      const fresh = list.filter((n) => !knownIds.current?.has(n.id));
      if (fresh.length > 0 && typeof Notification !== "undefined" && Notification.permission === "granted") {
        fresh.forEach((n) => {
          try {
            new Notification("TRIBLEERA Vendor Portal", { body: n.message });
          } catch {}
        });
      }
    }
    knownIds.current = new Set(list.map((n) => n.id));
  }, []);

  useEffect(() => {
    const vendorSlug = getCurrentVendorSlug() ?? "";
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSlug(vendorSlug);
    if (!vendorSlug) return;
    refresh(vendorSlug);
    const interval = setInterval(() => refresh(vendorSlug), 15_000);
    return () => clearInterval(interval);
  }, [refresh]);

  const unread = items.filter((n) => !n.read).length;

  function handleToggle() {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) setAlignLeft(rect.left + rect.width / 2 < window.innerWidth / 2);
    const next = !open;
    setOpen(next);
    if (typeof Notification !== "undefined" && Notification.permission === "default") {
      Notification.requestPermission().catch(() => {});
    }
    if (next && unread > 0 && slug) {
      const list = readLocalStorage<VendorNotification[]>(notificationsKey(slug), []);
      const marked = list.map((n) => ({ ...n, read: true }));
      writeLocalStorage(notificationsKey(slug), marked);
      setItems([...marked].reverse());
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={handleToggle}
        aria-label={unread > 0 ? `Notifications — ${unread} unread` : "Notifications"}
        className="relative flex h-11 w-11 items-center justify-center rounded-lg text-slate-soft transition-colors hover:bg-ivory hover:text-burgundy"
      >
        <Bell size={18} aria-hidden="true" />
        {unread > 0 && (
          <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-burgundy px-1 text-[9px] font-bold leading-none text-white">
            {unread}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div
            className={cn(
              "absolute top-[calc(100%+8px)] z-50 w-[300px] max-w-[calc(100vw-24px)] overflow-hidden rounded-[10px] border border-slate/10 bg-white shadow-[0_8px_32px_rgba(0,0,0,0.14)]",
              alignLeft ? "left-0" : "right-0"
            )}
          >
            <div className="border-b border-slate/10 bg-ivory px-4 py-3">
              <p className="text-[13px] font-semibold text-slate">Notifications</p>
              <p className="mt-0.5 text-[11px] text-slate-soft">
                Requests, approvals and payouts land here
              </p>
            </div>
            <div className="max-h-[320px] overflow-y-auto">
              {items.length === 0 ? (
                <p className="px-4 py-8 text-center text-[13px] text-slate-soft">No notifications yet.</p>
              ) : (
                items.slice(0, 15).map((n) => (
                  <div key={n.id} className="border-b border-slate/5 px-4 py-3 last:border-b-0">
                    <p className="text-[13px] leading-snug text-slate">{n.message}</p>
                    <p className="mt-1 text-[11px] text-slate-soft">{formatDateShort(n.time)}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
