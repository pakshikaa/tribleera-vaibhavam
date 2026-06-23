import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Payment",
  description: "Securely pay your advance and platform fee to confirm your booking.",
  robots: { index: false, follow: false },
};

export default function PaymentLayout({ children }: { children: React.ReactNode }) {
  return children;
}
