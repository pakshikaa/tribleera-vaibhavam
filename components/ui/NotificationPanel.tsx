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
      return <BadgeCheck size={16} className="text-gold-deep" />;
    case "refund_approved":
      return <Undo2 size={16} className="text-burgundy" />;
    case "review_received":
      return <MessageSquareQuote size={16} className="text-slate" />;
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
        <div className="mb-6 flex items-center justify-between gap-3">
          <SheetTitle>Notifications</SheetTitle>
          <button
            type="button"
            onClick={markAllRead}
            className="text-sm font-semibold text-burgundy hover:text-burgundy-deep"
          >
            Mark all read
          </button>
        </div>
        <div className="space-y-3 overflow-y-auto pr-1">
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
