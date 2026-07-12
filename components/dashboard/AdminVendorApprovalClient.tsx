"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { Check, ChevronDown, ChevronUp, Download, Mail, Phone, Search, TrendingUp, X } from "lucide-react";
import { VendorApplication } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { EmptyState } from "@/components/ui/EmptyState";
import { ShieldCheck } from "lucide-react";
import { formatDate, formatLKR } from "@/lib/utils/format";
import { categories, getCategoryBySlug } from "@/lib/data/categories";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils/cn";
import {
  appendAuditLog,
  computeVendorPerformance,
  downloadCsv,
  emitAdminDataChanged,
  getAdminSnapshot,
  subscribeAdminData,
  type ApprovedVendorRecord,
} from "@/lib/utils/adminLiveData";

type FilterTab = "all" | "pending" | "approved" | "rejected";

const REJECT_REASONS = [
  "Incomplete portfolio",
  "Service area not covered",
  "Pricing outside guidelines",
  "Documentation incomplete",
  "Other",
];

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function AdminVendorApprovalClient({ initial }: { initial: VendorApplication[] }) {
  const { showToast } = useToast();
  const snapshot = useSyncExternalStore(subscribeAdminData, getAdminSnapshot, () => ({
    bookings: [],
    vendors: [],
    applications: initial,
    approvedVendorRecords: [],
    notifications: [],
    pendingPayments: [],
    auditLog: [],
    disputes: [],
    refunds: [],
    users: [],
  }));

  const [tab, setTab] = useState<FilterTab>("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [rejectDialog, setRejectDialog] = useState<{ ids: string[]; names: string[] } | null>(null);
  const [rejectReason, setRejectReason] = useState(REJECT_REASONS[0]);
  const [adminNotes, setAdminNotes] = useState<Record<string, string>>({});
  const [query, setQuery] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [vendorEdits, setVendorEdits] = useState<Record<string, { categorySlug: string; additionalCategoryRequest: string }>>({});
  const [suspendDialog, setSuspendDialog] = useState<{ vendor: ApprovedVendorRecord; reason: string } | null>(null);

  const apps = snapshot.applications;
  const liveVendors = snapshot.vendors.filter((vendor) => vendor.status === "approved");
  const approvedRecords = snapshot.approvedVendorRecords;

  function persistApplications(updated: VendorApplication[]) {
    try {
      localStorage.setItem("TRIBLEERA-vendor-applications", JSON.stringify(updated));
      emitAdminDataChanged();
    } catch {}
  }

  function persistApprovedRecords(updated: ApprovedVendorRecord[]) {
    try {
      localStorage.setItem("TRIBLEERA-approved-vendors", JSON.stringify(updated));
      emitAdminDataChanged();
      window.dispatchEvent(new Event("tribleera-live-vendors"));
    } catch {}
  }

  function sendVendorNotice(record: ApprovedVendorRecord, subject: string, message: string) {
    try {
      const outbox = JSON.parse(localStorage.getItem("tv-vendor-email-outbox") ?? "[]");
      outbox.unshift({
        id: `EMAIL-${Date.now()}`,
        to: record.email ?? "vendor@example.com",
        vendorSlug: record.slug,
        subject,
        message,
        sentAt: new Date().toISOString(),
      });
      localStorage.setItem("tv-vendor-email-outbox", JSON.stringify(outbox.slice(0, 100)));
      const notices = JSON.parse(localStorage.getItem(`tv-vendor-notices-${record.slug}`) ?? "[]");
      notices.unshift({ subject, message, sentAt: new Date().toISOString() });
      localStorage.setItem(`tv-vendor-notices-${record.slug}`, JSON.stringify(notices.slice(0, 20)));
      emitAdminDataChanged();
    } catch {}
  }

  function approveOne(app: VendorApplication) {
    const approvedVendor = {
      slug: app.slug ?? slugify(app.businessName),
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
      emailVerified: app.emailVerified ?? false,
      additionalCategoryRequests: app.requestedAdditionalCategories ?? [],
    } satisfies ApprovedVendorRecord;

    const nextApproved = approvedRecords.filter((record) => record.slug !== approvedVendor.slug);
    nextApproved.push(approvedVendor);
    persistApprovedRecords(nextApproved);

    const updatedApps = apps.map((item) => (item.id === app.id ? { ...item, status: "approved" as const } : item));
    persistApplications(updatedApps);
    appendAuditLog({
      actor: "Admin",
      action: "Approved vendor application",
      entityType: "vendor",
      entityId: app.id,
      entityLabel: app.businessName,
      details: `${app.businessName} approved for ${getCategoryBySlug(app.categorySlug)?.name ?? app.categorySlug}.`,
    });
  }

  function approve(app: VendorApplication) {
    approveOne(app);
    showToast(`${app.businessName} approved. Login: ${app.phone} / vendor2026`, "success");
  }

  function bulkApprove() {
    const selectedApps = apps.filter((item) => selectedIds.includes(item.id) && item.status === "pending");
    if (selectedApps.length === 0) return;
    selectedApps.forEach(approveOne);
    setSelectedIds([]);
    showToast(`${selectedApps.length} vendor application${selectedApps.length !== 1 ? "s" : ""} approved.`, "success");
  }

  function confirmReject() {
    if (!rejectDialog) return;
    const idSet = new Set(rejectDialog.ids);
    const updated = apps.map((item) =>
      idSet.has(item.id) ? { ...item, status: "suspended" as const, adminNotes: rejectReason } : item
    );
    persistApplications(updated);
    rejectDialog.ids.forEach((id, index) =>
      appendAuditLog({
        actor: "Admin",
        action: "Rejected vendor application",
        entityType: "vendor",
        entityId: id,
        entityLabel: rejectDialog.names[index] ?? id,
        details: `Reason: ${rejectReason}`,
      })
    );
    setSelectedIds((prev) => prev.filter((id) => !idSet.has(id)));
    showToast(`${rejectDialog.ids.length} application${rejectDialog.ids.length !== 1 ? "s" : ""} rejected.`, "success");
    setRejectDialog(null);
    setRejectReason(REJECT_REASONS[0]);
  }

  function suspendVendor() {
    if (!suspendDialog) return;
    const vendor = suspendDialog.vendor;
    const updated = approvedRecords.map((record) =>
      record.slug === vendor.slug
        ? { ...record, status: "suspended", suspensionReason: suspendDialog.reason || "Admin review pending" }
        : record
    );
    persistApprovedRecords(updated);
    sendVendorNotice(
      vendor,
      "TRIBLEERA vendor account suspended",
      `Your vendor account has been suspended. Reason: ${suspendDialog.reason || "Admin review pending"}. Contact TRIBLEERA support if you need clarification.`
    );
    appendAuditLog({
      actor: "Admin",
      action: "Suspended vendor account",
      entityType: "vendor",
      entityId: vendor.slug,
      entityLabel: vendor.businessName,
      details: suspendDialog.reason || "Admin review pending",
    });
    showToast(`${vendor.businessName} suspended and vendor notice queued.`, "success");
    setSuspendDialog(null);
  }

  function saveVendorCategory(record: ApprovedVendorRecord) {
    const edit = vendorEdits[record.slug];
    if (!edit) return;
    const updatedRecords = approvedRecords.map((item) =>
      item.slug === record.slug
        ? {
            ...item,
            categorySlug: edit.categorySlug,
            category: edit.categorySlug,
            additionalCategoryRequests: edit.additionalCategoryRequest
              ? edit.additionalCategoryRequest.split(",").map((entry) => entry.trim()).filter(Boolean)
              : item.additionalCategoryRequests ?? [],
          }
        : item
    );
    persistApprovedRecords(updatedRecords);
    const updatedApps = apps.map((item) =>
      (item.slug ?? slugify(item.businessName)) === record.slug
        ? {
            ...item,
            categorySlug: edit.categorySlug,
            category: edit.categorySlug,
            requestedAdditionalCategories: edit.additionalCategoryRequest
              ? edit.additionalCategoryRequest.split(",").map((entry) => entry.trim()).filter(Boolean)
              : item.requestedAdditionalCategories,
          }
        : item
    );
    persistApplications(updatedApps);
    appendAuditLog({
      actor: "Admin",
      action: "Updated vendor category",
      entityType: "vendor",
      entityId: record.slug,
      entityLabel: record.businessName,
      details: `Primary category set to ${getCategoryBySlug(edit.categorySlug)?.name ?? edit.categorySlug}.`,
    });
    showToast(`${record.businessName} category updated.`, "success");
  }

  const filtered = useMemo(() => apps.filter((app) => {
    if (tab === "pending" && app.status !== "pending") return false;
    if (tab === "approved" && app.status !== "approved") return false;
    if (tab === "rejected" && app.status !== "suspended") return false;
    if (cityFilter && app.city !== cityFilter) return false;
    if (categoryFilter && app.categorySlug !== categoryFilter) return false;
    if (!query) return true;
    const haystack = `${app.businessName} ${app.city} ${app.categorySlug} ${app.ownerName}`.toLowerCase();
    return haystack.includes(query.toLowerCase());
  }), [apps, tab, cityFilter, categoryFilter, query]);

  const pendingCards = filtered.filter((app) => app.status === "pending");
  const pendingCount = apps.filter((app) => app.status === "pending").length;
  const cityOptions = Array.from(new Set([...apps.map((app) => app.city), ...liveVendors.map((vendor) => vendor.city)])).sort();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 rounded-[10px] border border-slate/10 bg-white p-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 items-center gap-2 rounded-[8px] border border-slate/15 bg-ivory px-3 py-2">
          <Search size={14} className="text-slate-soft" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by business, city, owner"
            className="w-full bg-transparent text-sm text-slate outline-none"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <select value={cityFilter} onChange={(event) => setCityFilter(event.target.value)} className="rounded-[8px] border border-slate/15 bg-white px-3 py-2 text-sm text-slate">
            <option value="">All cities</option>
            {cityOptions.map((city) => <option key={city} value={city}>{city}</option>)}
          </select>
          <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)} className="rounded-[8px] border border-slate/15 bg-white px-3 py-2 text-sm text-slate">
            <option value="">All categories</option>
            {categories.map((category) => <option key={category.slug} value={category.slug}>{category.name}</option>)}
          </select>
          <Button
            size="sm"
            variant="secondary"
            icon={<Download size={14} />}
            onClick={() =>
              downloadCsv("tribleera-vendor-applications.csv", filtered.map((app) => ({
                business_name: app.businessName,
                owner_name: app.ownerName,
                category: getCategoryBySlug(app.categorySlug)?.name ?? app.categorySlug,
                city: app.city,
                status: app.status,
                submitted_at: app.submittedAt,
                phone: app.phone,
                email: app.email,
              })))
            }
          >
            Export applications
          </Button>
          <Button
            size="sm"
            variant="secondary"
            icon={<Download size={14} />}
            onClick={() =>
              downloadCsv("tribleera-live-vendors.csv", liveVendors.map((vendor) => {
                const perf = computeVendorPerformance(snapshot, vendor.slug);
                return {
                  vendor: vendor.name,
                  category: getCategoryBySlug(vendor.categorySlug)?.name ?? vendor.categorySlug,
                  city: vendor.city,
                  requests_received: perf.received,
                  accepted: perf.accepted,
                  response_rate: perf.responseRate,
                  avg_review: perf.averageReview.toFixed(2),
                  revenue_generated: perf.revenueGenerated,
                };
              }))
            }
          >
            Export live vendors
          </Button>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto border-b border-slate/8 pb-1 scrollbar-hide">
        {(["all", "pending", "approved", "rejected"] as FilterTab[]).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setTab(item)}
            className={cn(
              "flex shrink-0 items-center gap-1.5 whitespace-nowrap border-b-2 px-4 py-2.5 text-sm font-medium capitalize transition-colors",
              tab === item ? "border-burgundy text-burgundy" : "border-transparent text-slate-soft hover:text-slate"
            )}
          >
            {item}
            {item === "pending" && pendingCount > 0 && (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-burgundy text-[9px] font-bold text-white">
                {pendingCount}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="rounded-[10px] border border-slate/10 bg-white p-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-display text-lg text-slate">Vendor performance dashboard</h2>
            <p className="mt-1 text-sm text-slate-soft">Requests, response rate, reviews, and revenue by vendor.</p>
          </div>
          <TrendingUp size={18} className="text-burgundy" />
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate/8 text-left text-slate-soft">
                <th className="pb-3 font-medium">Vendor</th>
                <th className="pb-3 font-medium">Requests</th>
                <th className="pb-3 font-medium">Accepted</th>
                <th className="pb-3 font-medium">Response rate</th>
                <th className="pb-3 font-medium">Avg review</th>
                <th className="pb-3 font-medium">Trend</th>
                <th className="pb-3 font-medium">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {liveVendors.map((vendor) => {
                const perf = computeVendorPerformance(snapshot, vendor.slug);
                return (
                  <tr key={vendor.id} className="border-b border-slate/8">
                    <td className="py-3 font-medium text-slate">{vendor.name}</td>
                    <td className="py-3 text-slate-soft">{perf.received}</td>
                    <td className="py-3 text-slate-soft">{perf.accepted} ({perf.acceptanceRate}%)</td>
                    <td className="py-3 text-slate-soft">{perf.responseRate}%</td>
                    <td className="py-3 text-slate-soft">{perf.averageReview ? perf.averageReview.toFixed(1) : "—"}</td>
                    <td className={cn("py-3", perf.reviewTrend >= 0 ? "text-emerald-700" : "text-rose-700")}>
                      {perf.averageReview ? `${perf.reviewTrend >= 0 ? "+" : ""}${perf.reviewTrend.toFixed(2)}` : "—"}
                    </td>
                    <td className="py-3 text-slate-soft">{formatLKR(perf.revenueGenerated)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-[10px] border border-slate/10 bg-white p-5">
        <h2 className="font-display text-lg text-slate">Approved vendor controls</h2>
        <p className="mt-1 text-sm text-slate-soft">Change primary category, store additional category requests, and suspend with a vendor notice.</p>
        <div className="mt-4 space-y-4">
          {approvedRecords.length === 0 ? (
            <p className="text-sm text-slate-soft">No approved vendor records stored yet.</p>
          ) : approvedRecords.map((record) => {
            const edit = vendorEdits[record.slug] ?? {
              categorySlug: record.categorySlug,
              additionalCategoryRequest: (record.additionalCategoryRequests ?? []).join(", "),
            };
            return (
              <div key={record.slug} className="rounded-[8px] border border-slate/8 p-4">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="font-medium text-slate">{record.businessName}</p>
                    <p className="text-xs text-slate-soft">{record.email ?? "No email"} · {record.city}</p>
                    {record.status === "suspended" && (
                      <p className="mt-1 text-xs font-medium text-rose-700">Suspended: {record.suspensionReason ?? "No reason recorded"}</p>
                    )}
                  </div>
                  <div className="grid gap-2 md:grid-cols-[180px_1fr_auto_auto]">
                    <select
                      value={edit.categorySlug}
                      onChange={(event) => setVendorEdits((prev) => ({ ...prev, [record.slug]: { ...edit, categorySlug: event.target.value } }))}
                      className="rounded-[8px] border border-slate/15 bg-white px-3 py-2 text-sm text-slate"
                    >
                      {categories.map((category) => <option key={category.slug} value={category.slug}>{category.name}</option>)}
                    </select>
                    <input
                      value={edit.additionalCategoryRequest}
                      onChange={(event) => setVendorEdits((prev) => ({ ...prev, [record.slug]: { ...edit, additionalCategoryRequest: event.target.value } }))}
                      placeholder="Additional category requests, comma-separated"
                      className="rounded-[8px] border border-slate/15 bg-white px-3 py-2 text-sm text-slate outline-none"
                    />
                    <Button size="sm" variant="secondary" onClick={() => saveVendorCategory(record)}>
                      Save category
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => setSuspendDialog({ vendor: record, reason: record.suspensionReason ?? "" })}>
                      Suspend vendor
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {apps.length === 0 ? (
        <EmptyState
          icon={<ShieldCheck size={28} />}
          title="No applications right now"
          description="New vendor sign-ups will appear here for review."
        />
      ) : filtered.length === 0 ? (
        <p className="py-8 text-center text-sm text-slate-soft">No applications match the current filters.</p>
      ) : (
        <div className="space-y-4">
          {pendingCards.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 rounded-[10px] border border-slate/10 bg-white p-4">
              <button
                type="button"
                onClick={() => setSelectedIds(selectedIds.length === pendingCards.length ? [] : pendingCards.map((app) => app.id))}
                className="rounded-[8px] border border-slate/15 px-3 py-2 text-xs font-semibold text-slate"
              >
                {selectedIds.length === pendingCards.length ? "Clear selection" : "Select all pending"}
              </button>
              <Button size="sm" icon={<Check size={14} />} onClick={bulkApprove}>Bulk approve</Button>
              <Button
                size="sm"
                variant="secondary"
                icon={<X size={14} />}
                onClick={() => setRejectDialog({ ids: selectedIds, names: apps.filter((item) => selectedIds.includes(item.id)).map((item) => item.businessName) })}
              >
                Bulk reject
              </Button>
              <span className="text-xs text-slate-soft">{selectedIds.length} selected</span>
            </div>
          )}

          {filtered.map((app) => {
            const selected = selectedIds.includes(app.id);
            return (
              <div key={app.id} className="overflow-hidden rounded-[8px] border border-slate/8 bg-white shadow-soft">
                <div className="flex flex-wrap items-start justify-between gap-3 p-5">
                  <div className="flex items-start gap-3">
                    {app.status === "pending" && (
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={() => setSelectedIds((prev) => selected ? prev.filter((id) => id !== app.id) : [...prev, app.id])}
                        className="mt-3 h-4 w-4 accent-burgundy"
                      />
                    )}
                    <Avatar name={app.businessName} size={44} />
                    <div>
                      <p className="font-display text-lg text-slate">{app.businessName}</p>
                      <p className="text-xs text-slate-soft">
                        {getCategoryBySlug(app.categorySlug)?.name ?? app.categorySlug} · {app.city}
                        {app.experienceYears > 0 && ` · ${app.experienceYears} yrs`}
                      </p>
                      <div className="mt-1 flex flex-wrap gap-3 text-xs text-slate-soft">
                        <span className="flex items-center gap-1"><Phone size={11} /> {app.phone}</span>
                        <span className="flex items-center gap-1"><Mail size={11} /> {app.email}</span>
                        <span>Submitted {formatDate(app.submittedAt)}</span>
                        {app.portfolioCount != null && <span>{app.portfolioCount} photo{app.portfolioCount !== 1 ? "s" : ""} submitted</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      tone={app.status === "approved" ? "success" : app.status === "suspended" ? "danger" : "warning"}
                      className="capitalize"
                    >
                      {app.status === "suspended" ? "Rejected" : app.status}
                    </Badge>
                    {app.startingPrice && <span className="text-sm font-semibold text-burgundy-deep">from {formatLKR(app.startingPrice)}</span>}
                  </div>
                </div>

                {expanded === app.id && (
                  <div className="border-t border-slate/8 px-5 pb-5 pt-4">
                    {app.tagline && <p className="mb-2 text-sm italic text-slate-soft">&ldquo;{app.tagline}&rdquo;</p>}
                    <p className="text-sm leading-relaxed text-slate-soft">{app.about}</p>
                    {app.location && <p className="mt-2 text-xs text-slate-soft">Location: {app.location}</p>}
                    {app.whatsapp && <p className="mt-1 text-xs text-slate-soft">WhatsApp: {app.whatsapp}</p>}

                    <div className="mt-4 rounded-[8px] border border-slate/8 bg-ivory p-4">
                      <p className="text-sm font-semibold text-slate">Document verification</p>
                      <div className="mt-3 grid gap-3 md:grid-cols-3">
                        {["business_registration", "nic_copy", "portfolio_sample"].map((kind) => {
                          const docs = (app.documents ?? []).filter((item) => item.kind === kind);
                          return (
                            <div key={kind} className="rounded-[8px] border border-slate/10 bg-white p-3">
                              <p className="text-xs font-semibold uppercase tracking-wide text-slate-soft">
                                {kind === "business_registration" ? "Business registration" : kind === "nic_copy" ? "NIC copy" : "Portfolio samples"}
                              </p>
                              {docs.length === 0 ? (
                                <p className="mt-2 text-xs text-rose-700">No file uploaded</p>
                              ) : (
                                <div className="mt-2 space-y-1">
                                  {docs.map((doc) => (
                                    <p key={doc.id} className="text-xs text-slate-soft">{doc.fileName}</p>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="mt-4">
                      <label className="block text-xs font-semibold uppercase tracking-wide text-slate-soft">Admin notes</label>
                      <textarea
                        rows={2}
                        value={adminNotes[app.id] ?? app.adminNotes ?? ""}
                        onChange={(event) => setAdminNotes((prev) => ({ ...prev, [app.id]: event.target.value }))}
                        placeholder="Internal notes about this application…"
                        className="mt-1.5 w-full rounded-[6px] border border-slate/15 bg-ivory px-3 py-2 text-sm text-slate placeholder:text-slate/40 focus:border-burgundy/40 focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-3 border-t border-slate/8 px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
                  <button
                    type="button"
                    onClick={() => setExpanded(expanded === app.id ? null : app.id)}
                    className="flex items-center gap-1 text-xs font-medium text-slate-soft hover:text-slate"
                  >
                    {expanded === app.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    {expanded === app.id ? "Hide details" : "View details"}
                  </button>
                  {app.status === "pending" && (
                    <div className="grid w-full grid-cols-1 gap-2 sm:flex sm:w-auto">
                      <Button size="sm" variant="secondary" icon={<X size={14} />} fullWidth onClick={() => setRejectDialog({ ids: [app.id], names: [app.businessName] })}>
                        Reject
                      </Button>
                      <Button size="sm" icon={<Check size={14} />} fullWidth onClick={() => approve(app)}>
                        Approve
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {rejectDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate/50 px-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-[12px] bg-white p-6 shadow-lift">
            <h3 className="font-display text-xl text-burgundy-deep">Reject application</h3>
            <p className="mt-1 text-sm text-slate-soft">
              Rejecting <strong>{rejectDialog.names.join(", ")}</strong>. Select a reason:
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
            <div className="mt-6 grid grid-cols-1 gap-3 sm:flex sm:justify-end">
              <Button variant="secondary" size="sm" fullWidth onClick={() => setRejectDialog(null)}>Cancel</Button>
              <Button variant="primary" size="sm" fullWidth onClick={confirmReject}>Confirm rejection</Button>
            </div>
          </div>
        </div>
      )}

      {suspendDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate/50 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[12px] bg-white p-6 shadow-lift">
            <h3 className="font-display text-xl text-burgundy-deep">Suspend vendor</h3>
            <p className="mt-1 text-sm text-slate-soft">
              This will block login and queue a vendor notification email explaining the reason.
            </p>
            <textarea
              rows={3}
              value={suspendDialog.reason}
              onChange={(event) => setSuspendDialog({ ...suspendDialog, reason: event.target.value })}
              placeholder="Suspension reason"
              className="mt-4 w-full rounded-[6px] border border-slate/15 bg-ivory px-3 py-2 text-sm text-slate placeholder:text-slate/40 focus:border-burgundy/40 focus:outline-none"
            />
            <div className="mt-6 grid grid-cols-1 gap-3 sm:flex sm:justify-end">
              <Button variant="secondary" size="sm" fullWidth onClick={() => setSuspendDialog(null)}>Cancel</Button>
              <Button variant="primary" size="sm" fullWidth onClick={suspendVendor}>Suspend vendor</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
