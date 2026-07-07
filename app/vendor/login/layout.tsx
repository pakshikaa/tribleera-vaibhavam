import type { Metadata } from "next";

export const metadata: Metadata = { title: "Vendor Login" };

export default function VendorLoginLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-ivory">{children}</div>;
}
