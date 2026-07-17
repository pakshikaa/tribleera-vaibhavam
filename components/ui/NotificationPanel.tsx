"use client";

import Link from "next/link";
import { Bell, BadgeCheck, CircleAlert, MessageSquareQuote, Undo2 } from "lucide-react";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useNotifications, type NotificationItem } from "@/context/NotificationContext";
import { relativeTime } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";

function getNotificationIcon(type: NotificationItem["type"]) {
  switch (type) {
    case "booking_confirmed":
    case "vendor_accepted":
    case "payment_verified":
    case "request_sent":
      return <BadgeCheck size={16} className="text-gold-deep" />;
    case "refund_approved":
      return <Undo2 size={16} className="text-burgundy" />;
    case "review_received":
    case "review_prompt":
      return <MessageSquareQuote size={16} className="text-slate" />;
    case "payment_submitted":
      return <BadgeCheck size={16} className="text-amber-600" />;
    default:
      return <CircleAlert size={16} className="text-danger" />;
  }
}

export function NotificationPanel({ triggerClassName }: { triggerClassName?: string }) {
  const { notifications, unreadCount, markAllRead, markRead } = useNotifications();

  return (
    <Sheet>
      <SheetTrigger
        aria-label="Notifications"
        className={cn("relative rounded-lg p-2 transition-colors", triggerClassName)}
      >
        <Bell size={20} strokeWidth={1.75} />
        {unreadCount > 0 && (
          <span className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[9px] font-bold text-burgundy-deep">
            {unreadCount}
          </span>
        )}
      </SheetTrigger>
      <SheetContent className="w-full max-w-md">
        {/* pr-10 keeps "Mark all read" clear of the sheet's absolute ✕ button. */}
        <div className="mb-6 flex items-center justify-between gap-3 pr-10">
          <SheetTitle>Notifications</SheetTitle>
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllRead}
              className="text-sm font-semibold text-burgundy hover:text-burgundy-deep"
            >
              Mark all read
            </button>
          )}
        </div>
        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto pr-1">
          {notifications.length === 0 && (
            <div className="rounded-[8px] border border-dashed border-slate/20 bg-white px-5 py-10 text-center">
              <Bell size={22} className="mx-auto mb-2 text-slate/30" />
              <p className="text-sm font-medium text-slate">No notifications yet</p>
              <p className="mt-1 text-xs text-slate-soft">Booking updates and vendor replies land here.</p>
            </div>
          )}
          {notifications
            .slice()
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .map((item) => (
              <SheetClose key={item.id} asChild>
                <Link
                  href={item.href}
                  onClick={() => markRead(item.id)}
                  className="flex gap-3 rounded-[8px] border border-slate/8 bg-white p-4 shadow-soft transition-colors hover:border-burgundy/20"
                >
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ivory">
                    {getNotificationIcon(item.type)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className={cn("text-sm leading-snug text-slate", !item.read && "font-semibold")}>{item.title}</p>
                      {!item.read && <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-sky-500" />}
                    </div>
                    <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-soft">{item.message}</p>
                    <p className="mt-2 text-[11px] font-medium text-slate-soft">{relativeTime(item.createdAt)}</p>
                  </div>
                </Link>
              </SheetClose>
            ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
