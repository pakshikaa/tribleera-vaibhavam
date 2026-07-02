import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Payment",
  description: "Securely pay your advance to TRIBLEERA VAIBHAVAM escrow — 20% advance plus 3% platform fee.",
  robots: { index: false, follow: false },
};

export default function PaymentLayout({ children }: { children: React.ReactNode }) {
  return children;
}
