import type { Metadata } from "next";
import { AdminVendorApprovalClient } from "@/components/dashboard/AdminVendorApprovalClient";
import { vendorApplications } from "@/lib/data/users";
import { BackButton } from "@/components/ui/BackButton";

export const metadata: Metadata = { title: "Vendor Approvals — Admin" };

export default function AdminVendorApprovalPage() {
  return (
    <div className="space-y-6">
      <BackButton href="/dashboard/admin" label="Admin" className="mb-4" />
      <div>
        <h1 className="font-display text-2xl font-bold text-slate">Vendor Approvals</h1>
        <p className="mt-1 text-sm text-slate-soft">
          Review new vendor applications before they go live to customers.
        </p>
      </div>
      <AdminVendorApprovalClient initial={vendorApplications} />
    </div>
  );
}
