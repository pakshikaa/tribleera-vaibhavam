import type { Metadata } from "next";
import { ShortlistPageClient } from "@/components/vendor/ShortlistPageClient";

export const metadata: Metadata = {
  title: "Your Shortlist",
  description: "Your shortlisted vendors on TRIBLEERA VAIBHAVAM — saved studios for your Jaffna wedding.",
  robots: { index: false, follow: false },
};

export default function ShortlistPage() {
  return <ShortlistPageClient />;
}
