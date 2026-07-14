import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vendor Login | TRIBLEERA VAIBHAVAM",
  description: "Sign in to your TRIBLEERA vendor partner portal.",
};

export default function VendorLoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
