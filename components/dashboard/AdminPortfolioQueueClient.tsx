"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, ImageIcon, XCircle } from "lucide-react";
import { readLocalStorage, writeLocalStorage } from "@/lib/utils/browser-storage";
import { generateId, safePush } from "@/lib/utils/store";
import { formatDateShort } from "@/lib/utils/format";
import { appendVendorGalleryPhoto, writeVendorPhoto } from "@/lib/utils/vendorPortal";

interface PortfolioSubmission {
  id: string;
  vendorSlug: string;
  vendorName: string;
  photo: string;
  submittedAt: string;
  /** "photo" = profile photo (default for older entries); "gallery" = portfolio image. */
  kind?: "photo" | "gallery";
}

const QUEUE_KEY = "tv-moderation-queue";

/**
 * Vendor photo submissions awaiting review — nothing a vendor uploads goes
 * live until an admin approves it here (W-18).
 */
export function AdminPortfolioQueueClient() {
  const [queue, setQueue] = useState<PortfolioSubmission[] | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setQueue(readLocalStorage<PortfolioSubmission[]>(QUEUE_KEY, []));
  }, []);

  function resolve(submission: PortfolioSubmission, approved: boolean) {
    const remaining = (queue ?? []).filter((entry) => entry.id !== submission.id);
    setQueue(remaining);
    writeLocalStorage(QUEUE_KEY, remaining);

    if (approved) {
      // Publish to the per-vendor stores that liveVendors merges into the
      // public profile (imageUrl / galleryUrls).
      if (submission.kind === "gallery") {
        appendVendorGalleryPhoto(submission.vendorSlug, submission.photo);
      } else {
        writeVendorPhoto(submission.vendorSlug, submission.photo);
      }
    }

    safePush("tv-admin-notifications", {
      id: generateId("AN"),
      type: "moderation",
      message: `${submission.vendorName}'s ${submission.kind === "gallery" ? "gallery photo" : "profile photo"} ${approved ? "approved and published" : "rejected"}`,
      time: new Date().toISOString(),
      icon: approved ? "✅" : "🚫",
    });

    safePush(`tv-vendor-notifications-${submission.vendorSlug}`, {
      id: generateId("VN"),
      type: "moderation",
      message: approved
        ? `Your ${submission.kind === "gallery" ? "gallery photo" : "profile photo"} was approved and is now live.`
        : `Your ${submission.kind === "gallery" ? "gallery photo" : "profile photo"} was rejected. Contact support for details.`,
      time: new Date().toISOString(),
      read: false,
    });
  }

  if (!queue) return null;

  return (
    <div className="rounded-[10px] border border-slate/10 bg-white">
      <div className="flex items-center gap-2 border-b border-slate/8 px-5 py-4">
        <ImageIcon size={16} className="text-burgundy" aria-hidden="true" />
        <h2 className="font-display text-base font-semibold text-slate">Portfolio Submissions</h2>
        {queue.length > 0 && (
          <span className="ml-auto rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-amber-800">
            {queue.length} pending
          </span>
        )}
      </div>
      {queue.length === 0 ? (
        <div className="px-5 py-10 text-center">
          <CheckCircle2 size={28} className="mx-auto mb-2 text-success" aria-hidden="true" />
          <p className="text-sm font-semibold text-slate">No photos awaiting review</p>
          <p className="mt-1 text-xs text-slate-soft">New vendor uploads land here before going live.</p>
        </div>
      ) : (
        <div className="divide-y divide-slate/8">
          {queue.map((submission) => (
            <div key={submission.id} className="flex flex-wrap items-center gap-4 px-5 py-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={submission.photo}
                alt={`Submission from ${submission.vendorName}`}
                className="h-16 w-16 shrink-0 rounded-[8px] border border-slate/10 object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate">{submission.vendorName}</p>
                <p className="text-xs text-slate-soft">
                  {submission.vendorSlug} · submitted {formatDateShort(submission.submittedAt)}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => resolve(submission, false)}
                  className="flex items-center gap-1.5 rounded-[6px] border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 transition-colors hover:bg-red-100"
                >
                  <XCircle size={13} aria-hidden="true" /> Reject
                </button>
                <button
                  onClick={() => resolve(submission, true)}
                  className="flex items-center gap-1.5 rounded-[6px] bg-success px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:opacity-90"
                >
                  <CheckCircle2 size={13} aria-hidden="true" /> Approve & publish
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
