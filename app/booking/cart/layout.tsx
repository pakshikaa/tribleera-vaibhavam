import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your cart",
  description: "Review your selected wedding vendors and packages before checkout.",
  robots: { index: false, follow: false },
};

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return children;
}
