import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PackageSelectionClient } from "@/components/vendor/PackageSelectionClient";
import { getVendorBySlug, vendors } from "@/lib/data/vendors";

export function generateStaticParams() {
  return vendors.map((v) => ({ id: v.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const vendor = getVendorBySlug(id);
  if (!vendor) return {};
  return { title: `Packages — ${vendor.name}` };
}

export default async function PackageSelectionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const vendor = getVendorBySlug(id);
  if (!vendor) notFound();

  return (
    <div className="bg-ivory">
      <section className="border-b border-slate/8 bg-white py-10 md:py-14">
        <Container>
          <SectionHeading
            eyebrow={vendor.name}
            title="Choose your package."
            description="Every tier includes transparent pricing — add one to your booking cart and continue planning your other categories."
          />
        </Container>
      </section>

      <Container className="py-10 md:py-14">
        <PackageSelectionClient vendor={vendor} />
      </Container>
    </div>
  );
}
