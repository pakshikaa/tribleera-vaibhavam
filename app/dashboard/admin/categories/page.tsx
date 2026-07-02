import type { Metadata } from "next";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { AdminCategoriesClient } from "@/components/dashboard/AdminCategoriesClient";
import { categories, comingSoonCategories } from "@/lib/data/categories";
import { BackButton } from "@/components/ui/BackButton";

export const metadata: Metadata = { title: "Categories — Admin" };

export default function AdminCategoriesPage() {
  return (
    <div className="space-y-6">
      <BackButton href="/dashboard/admin" label="Admin" className="mb-4" />
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate">Category Management</h1>
          <p className="mt-1 text-sm text-slate-soft">
            Control which service categories customers can browse and book.
          </p>
        </div>
        <Button icon={<Plus size={15} />}>Add category</Button>
      </div>
      <AdminCategoriesClient active={categories} comingSoon={comingSoonCategories} />
    </div>
  );
}
