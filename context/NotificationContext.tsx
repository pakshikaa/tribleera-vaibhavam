"use client";

import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { readLocalStorage, writeLocalStorage } from "@/lib/utils/browser-storage";

export interface NotificationItem {
  id: string;
  type:
    | "booking_confirmed"
    | "vendor_accepted"
    | "vendor_rejected"
    | "review_received"
    | "payment_verified"
    | "refund_approved"
    | "dispute_update";
  title: string;
  message: string;
  href: string;
  read: boolean;
  createdAt: string;
}

const STORAGE_KEY = "tribleera-notifications";

const defaultNotifications: NotificationItem[] = [
  {
    id: "notif-1",
    type: "vendor_accepted",
    title: "Jaffna Frames Studio accepted your request",
    message: "Their signature package starts from LKR 135,000. Review the response and proceed to payment.",
    href: "/dashboard/customer",
    read: false,
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
  {
    id: "notif-2",
    type: "payment_verified",
    title: "Your advance payment was verified",
    message: "The deposit slip for booking TRB-20260451 was approved by the admin team.",
    href: "/dashboard/customer",
    read: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "notif-3",
    type: "review_received",
    title: "Pushpa Florals received your review",
    message: "Your feedback is now visible on the vendor profile for other couples.",
    href: "/vendors/pushpa-florals-and-decor",
    read: true,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "notif-4",
    type: "booking_confirmed",
    title: "Booking TRB-20260451 confirmed",
    message: "The vendor locked in your requested date and milestone timeline.",
    href: "/booking/track/TRB-20260451",
    read: true,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "notif-5",
    type: "refund_approved",
    title: "Refund of LKR 13,200 approved",
    message: "The refund is being processed and should reflect in 3 to 5 business days.",
    href: "/dashboard/customer",
    read: false,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

interface NotificationContextValue {
  notifications: NotificationItem[];
  unreadCount: number;
  markRead: (id: string) => void;
  markAllRead: () => void;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    if (typeof window === "undefined") return defaultNotifications;
    const stored = readLocalStorage<NotificationItem[] | null>(STORAGE_KEY, null);
    return stored && stored.length > 0 ? stored : defaultNotifications;
  });

  useEffect(() => {
    writeLocalStorage(STORAGE_KEY, notifications);
  }, [notifications]);

  const value = useMemo<NotificationContextValue>(
    () => ({
      notifications,
      unreadCount: notifications.filter((item) => !item.read).length,
      markRead: (id) => {
        setNotifications((prev) => prev.map((item) => (item.id === id ? { ...item, read: true } : item)));
      },
      markAllRead: () => {
        setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));
      },
    }),
    [notifications]
  );

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within NotificationProvider");
  }

  return context;
}
