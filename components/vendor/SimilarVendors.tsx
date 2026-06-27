import { Container } from "@/components/ui/Container";
import { VendorCard } from "@/components/vendor/VendorCard";
import { vendors } from "@/lib/data/vendors";

export function SimilarVendors({
  categorySlug,
  currentSlug,
}: {
  categorySlug: string;
  currentSlug: string;
}) {
  const similar = vendors
    .filter(
      (v) =>
        v.categorySlug === categorySlug &&
        v.slug !== currentSlug &&
        v.status === "approved"
    )
    .slice(0, 3);

  if (similar.length === 0) return null;

  return (
    <section className="border-t border-slate/8 bg-ivory py-12">
      <Container>
        <h2 className="mb-6 font-display text-2xl text-slate">Similar studios</h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {similar.map((v) => (
            <VendorCard key={v.id} vendor={v} />
          ))}
        </div>
      </Container>
    </section>
  );
}
