import type { Metadata } from "next";

export const metadata: Metadata = { title: "Complete Your Profile | TRIBLERERA Vendor" };

export default function SetupLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
