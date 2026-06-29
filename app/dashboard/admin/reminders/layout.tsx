import type { Metadata } from "next";

export const metadata: Metadata = { title: "Reminders | TRIBLEERA Admin" };

export default function RemindersLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
