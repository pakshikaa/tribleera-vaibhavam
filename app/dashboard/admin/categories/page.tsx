import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { AdminCategoriesClient } from "@/components/dashboard/AdminCategoriesClient";
import { categories, comingSoonCategories } from "@/lib/data/categories";
import { Plus } from "lucide-react";

export const metadata: Metadata = { title: "Category Management — Admin" };

export default function AdminCategoriesPage() {
  return (
    <div className="bg-ivory">
      <section className="border-b border-slate/8 bg-white py-10">
        <Container className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            eyebrow="Admin"
            title="Category management"
            description="Control which service categories customers can browse and book right now."
          />
          <Button icon={<Plus size={15} />}>Add category</Button>
        </Container>
      </section>
      <Container className="py-10 md:py-14">
        <AdminCategoriesClient active={categories} comingSoon={comingSoonCategories} />
      </Container>
    </div>
  );
}
