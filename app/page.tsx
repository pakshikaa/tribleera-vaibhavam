import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { ServiceShowcase } from "@/components/home/ServiceShowcase";
import { WhyTribleera } from "@/components/home/WhyTribleera";
import { FeaturedVendors } from "@/components/home/FeaturedVendors";
import { WeddingStory } from "@/components/home/WeddingStory";
import { Testimonials } from "@/components/home/Testimonials";
import { BookingJourney } from "@/components/home/BookingJourney";
import { PremiumCTA } from "@/components/home/PremiumCTA";

export const metadata: Metadata = {
  // `absolute` bypasses the root layout's title template deterministically —
  // this page was rendering with the brand suffix silently dropped when
  // relying on template substitution (confirmed live via Playwright).
  title: { absolute: "TRIBLEERA VAIBHAVAM | Plan Your Perfect Celebration" },
  description:
    "Jaffna's premium wedding concierge — verified photographers, decorators, bridal makeup artists, cake ateliers and invitation designers, bookable with secure milestone payments.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "TRIBLEERA VAIBHAVAM | Plan Your Perfect Celebration",
    description: "Jaffna's premium wedding concierge — curated, verified vendors, transparent pricing.",
    url: "/",
  },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <ServiceShowcase />
      <WhyTribleera />
      <FeaturedVendors />
      <WeddingStory />
      <Testimonials />
      <BookingJourney />
      <PremiumCTA />
    </>
  );
}
