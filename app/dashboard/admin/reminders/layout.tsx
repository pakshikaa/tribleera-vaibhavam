import type { Metadata } from "next";

export const metadata: Metadata = { title: "Reminders | TRIBLERERA Admin" };

export default function RemindersLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
