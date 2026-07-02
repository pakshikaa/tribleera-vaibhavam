"use client";

import { useState } from "react";
import { Check, ChevronDown, ChevronUp, Mail, Phone, X } from "lucide-react";
import { VendorApplication } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { EmptyState } from "@/components/ui/EmptyState";
import { ShieldCheck } from "lucide-react";
import { formatDate, formatLKR } from "@/lib/utils/format";
import { getCategoryBySlug } from "@/lib/data/categories";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils/cn";

type FilterTab = "all" | "pending" | "approved" | "rejected";

const REJECT_REASONS = [
  "Incomplete portfolio",
  "Service area not covered",
  "Pricing outside guidelines",
  "Documentation incomplete",
  "Other",
];

export function AdminVendorApprovalClient({ initial }: { initial: VendorApplication[] }) {
  const { showToast } = useToast();
  const [apps, setApps] = useState<VendorApplication[]>(() => {
    if (typeof window === "undefined") return initial;
    try {
      const stored = JSON.parse(
        localStorage.getItem("triblerera-vendor-applications") ?? "[]"
      ) as VendorApplication[];
      return [...stored, ...initial];
    } catch {
      return initial;
    }
  });
  const [tab, setTab] = useState<FilterTab>("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [rejectDialog, setRejectDialog] = useState<{ id: string; name: string } | null>(null);
  const [rejectReason, setRejectReason] = useState(REJECT_REASONS[0]);
  const [adminNotes, setAdminNotes] = useState<Record<string, string>>({});

  function persistApplications(updated: VendorApplication[]) {
    try {
      // Only save the localStorage-sourced ones (non-static)
      const staticIds = new Set(initial.map((a) => a.id));
      const dynamicApps = updated.filter((a) => !staticIds.has(a.id));
      localStorage.setItem("triblerera-vendor-applications", JSON.stringify(dynamicApps));
    } catch {}
  }

  function approve(app: VendorApplication) {
    const approvedVendor = {
      slug: app.slug ?? app.businessName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
      businessName: app.businessName,
      ownerName: app.ownerName,
      phone: app.phone,
      whatsapp: app.whatsapp ?? app.phone,
      email: app.email,
      category: app.category ?? app.categorySlug,
      categorySlug: app.categorySlug,
      city: app.city,
      location: app.location ?? app.city,
      tagline: app.tagline ?? "",
      about: app.about,
      experienceYears: app.experienceYears,
      startingPrice: app.startingPrice ?? 15000,
      password: "vendor2026",
      status: "approved",
      approvedAt: new Date().toISOString(),
      profileComplete: false,
    };

    try {
      const existing = JSON.parse(localStorage.getItem("triblerera-approved-vendors") ?? "[]");
      const filtered = existing.filter((v: { slug: string }) => v.slug !== approvedVendor.slug);
      filtered.push(approvedVendor);
      localStorage.setItem("triblerera-approved-vendors", JSON.stringify(filtered));
    } catch {}

    const updated = apps.map((a) => (a.id === app.id ? { ...a, status: "approved" as const } : a));
    setApps(updated);
    persistApplications(updated);

    showToast(
      `${app.businessName} approved. Login: ${app.phone} / vendor2026`,
      "success"
    );
  }

  function confirmReject() {
    if (!rejectDialog) return;
    const updated = apps.map((a) =>
      a.id === rejectDialog.id ? { ...a, status: "suspended" as const, adminNotes: rejectReason } : a
    );
    setApps(updated);
    persistApplications(updated);
    showToast(`${rejectDialog.name} application rejected.`, "success");
    setRejectDialog(null);
    setRejectReason(REJECT_REASONS[0]);
  }

  const filtered = apps.filter((a) => {
    if (tab === "pending") return a.status === "pending";
    if (tab === "approved") return a.status === "approved";
    if (tab === "rejected") return a.status === "suspended";
    return true;
  });

  const pendingCount = apps.filter((a) => a.status === "pending").length;

  if (apps.length === 0) {
    return (
      <EmptyState
        icon={<ShieldCheck size={28} />}
        title="No applications right now"
        description="New vendor sign-ups will appear here for review."
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter tabs */}
      <div className="flex gap-1 border-b border-slate/8">
        {(["all", "pending", "approved", "rejected"] as FilterTab[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={cn(
              "flex items-center gap-1.5 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors capitalize",
              tab === t
                ? "border-burgundy text-burgundy"
                : "border-transparent text-slate-soft hover:text-slate"
            )}
          >
            {t}
            {t === "pending" && pendingCount > 0 && (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-burgundy text-[9px] font-bold text-white">
                {pendingCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="py-8 text-center text-sm text-slate-soft">No applications in this category.</p>
      )}

      <div className="space-y-4">
        {filtered.map((app) => (
          <div key={app.id} className="overflow-hidden rounded-[8px] border border-slate/8 bg-white shadow-soft">
            {/* Card header */}
            <div className="flex flex-wrap items-start justify-between gap-3 p-5">
              <div className="flex items-center gap-3">
                <Avatar name={app.businessName} size={44} />
                <div>
                  <p className="font-display text-lg text-slate">{app.businessName}</p>
                  <p className="text-xs text-slate-soft">
                    {getCategoryBySlug(app.categorySlug)?.name ?? app.categorySlug}
                    {" · "}{app.city}
                    {app.experienceYears > 0 && ` · ${app.experienceYears} yrs`}
                  </p>
                  <div className="mt-1 flex flex-wrap gap-3 text-xs text-slate-soft">
                    <span className="flex items-center gap-1"><Phone size={11} /> {app.phone}</span>
                    <span className="flex items-center gap-1"><Mail size={11} /> {app.email}</span>
                    <span>Submitted {formatDate(app.submittedAt)}</span>
                    {app.portfolioCount != null && (
                      <span>{app.portfolioCount} photo{app.portfolioCount !== 1 ? "s" : ""} submitted</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  tone={
                    app.status === "approved" ? "success"
                    : app.status === "suspended" ? "danger"
                    : "warning"
                  }
                  className="capitalize"
                >
                  {app.status === "suspended" ? "Rejected" : app.status}
                </Badge>
                {app.startingPrice && (
                  <span className="text-sm font-semibold text-burgundy-deep">
                    from {formatLKR(app.startingPrice)}
                  </span>
                )}
              </div>
            </div>

            {/* Expanded detail */}
            {expanded === app.id && (
              <div className="border-t border-slate/8 px-5 pb-5 pt-4">
                {app.tagline && (
                  <p className="mb-2 text-sm italic text-slate-soft">&ldquo;{app.tagline}&rdquo;</p>
                )}
                <p className="text-sm leading-relaxed text-slate-soft">{app.about}</p>
                {app.location && (
                  <p className="mt-2 text-xs text-slate-soft">Location: {app.location}</p>
                )}
                {app.whatsapp && (
                  <p className="mt-1 text-xs text-slate-soft">WhatsApp: {app.whatsapp}</p>
                )}
                <p className="mt-3 text-xs text-slate-soft">
                  Portfolio: photos are reviewed privately or via separate file transfer.
                </p>
                <div className="mt-4">
                  <label className="block text-xs font-semibold uppercase tracking-wide text-slate-soft">
                    Admin notes
                  </label>
                  <textarea
                    rows={2}
                    value={adminNotes[app.id] ?? app.adminNotes ?? ""}
                    onChange={(e) => setAdminNotes((prev) => ({ ...prev, [app.id]: e.target.value }))}
                    placeholder="Internal notes about this application…"
                    className="mt-1.5 w-full rounded-[6px] border border-slate/15 bg-ivory px-3 py-2 text-sm text-slate placeholder:text-slate/40 focus:border-burgundy/40 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-slate/8 px-5 py-3">
              <button
                type="button"
                onClick={() => setExpanded(expanded === app.id ? null : app.id)}
                className="flex items-center gap-1 text-xs font-medium text-slate-soft hover:text-slate"
              >
                {expanded === app.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                {expanded === app.id ? "Hide details" : "View details"}
              </button>
              {app.status === "pending" && (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    icon={<X size={14} />}
                    onClick={() => setRejectDialog({ id: app.id, name: app.businessName })}
                  >
                    Reject
                  </Button>
                  <Button
                    size="sm"
                    icon={<Check size={14} />}
                    onClick={() => approve(app)}
                  >
                    Approve
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Reject dialog */}
      {rejectDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate/50 px-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-[12px] bg-white p-6 shadow-lift">
            <h3 className="font-display text-xl text-burgundy-deep">Reject application</h3>
            <p className="mt-1 text-sm text-slate-soft">
              Rejecting <strong>{rejectDialog.name}</strong>. Select a reason:
            </p>
            <div className="mt-4 space-y-2">
              {REJECT_REASONS.map((reason) => (
                <label key={reason} className="flex cursor-pointer items-center gap-2.5 text-sm text-slate">
                  <input
                    type="radio"
                    name="reject-reason"
                    value={reason}
                    checked={rejectReason === reason}
                    onChange={() => setRejectReason(reason)}
                    className="accent-burgundy"
                  />
                  {reason}
                </label>
              ))}
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="secondary" size="sm" onClick={() => setRejectDialog(null)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={confirmReject}>
                Confirm rejection
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
