import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { vendors } from "@/lib/data/vendors";
import { SearchMemory } from "@/components/vendor/SearchMemory";
import { VendorsDirectoryClient } from "@/components/vendor/VendorsDirectoryClient";

export const metadata: Metadata = {
  title: "Browse Vendors",
  description:
    "Search verified Tamil wedding vendors by category, city and budget on TRIBLEERA VAIBHAVAM — Jaffna's premium wedding marketplace.",
  openGraph: {
    title: "Find Your Wedding Vendors | TRIBLEERA VAIBHAVAM",
    description:
      "Verified Tamil wedding vendors across Jaffna, Colombo and beyond. Filter by category, budget and trust score.",
    url: "/vendors",
  },
};

interface SearchParams {
  category?: string;
  city?: string;
  sort?: string;
  q?: string;
  minPrice?: string;
  maxPrice?: string;
  minTrust?: string;
}

export default async function VendorsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;

  return (
    <div className="bg-ivory">
      <SearchMemory />
      <VendorsDirectoryClient initialVendors={vendors} searchParams={params} />
    </div>
  );
}
