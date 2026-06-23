import type { Metadata } from "next";
import { ShortlistPageClient } from "@/components/vendor/ShortlistPageClient";

export const metadata: Metadata = {
  title: "Your Shortlist",
  description: "Saved vendors you're considering for your Jaffna wedding.",
  robots: { index: false, follow: false },
};

export default function ShortlistPage() {
  return <ShortlistPageClient />;
}
