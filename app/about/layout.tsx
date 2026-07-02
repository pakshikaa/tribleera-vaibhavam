import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About TRIBLEERA VAIBHAVAM",
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
