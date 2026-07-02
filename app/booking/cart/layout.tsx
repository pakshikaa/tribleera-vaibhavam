import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your cart",
  description: "Review your TRIBLEERA VAIBHAVAM cart — selected vendors and packages before secure checkout.",
  robots: { index: false, follow: false },
};

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return children;
}
