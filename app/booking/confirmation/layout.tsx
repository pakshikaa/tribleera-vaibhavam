import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Booking confirmed",
  description: "Your TRIBLEERA VAIBHAVAM booking has been confirmed.",
  robots: { index: false, follow: false },
};

export default function ConfirmationLayout({ children }: { children: React.ReactNode }) {
  return children;
}
