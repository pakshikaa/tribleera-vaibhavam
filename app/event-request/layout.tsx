import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Plan Your Wedding",
  description: "Create a premium event request and receive matched vendor responses across TRIBLEERA categories.",
};

export default function EventRequestLayout({ children }: { children: React.ReactNode }) {
  return children;
}
