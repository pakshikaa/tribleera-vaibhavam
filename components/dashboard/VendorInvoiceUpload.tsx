"use client";

import { useEffect, useRef, useState } from "react";
import { FileCheck2, FileUp } from "lucide-react";
import { readLocalStorage } from "@/lib/utils/browser-storage";
import { generateId, safePush } from "@/lib/utils/store";
import { useToast } from "@/components/ui/Toast";

interface InvoiceRecord {
  id: string;
  bookingId: string;
  vendorSlug: string;
  vendorName: string;
  fileName: string;
  dataUrl: string;
  submittedAt: string;
  status: "submitted";
}

const INVOICES_KEY = "tv-vendor-invoices";

/**
 * Post-event invoice submission (V-27) — the paper trail TRIBLEERA needs to
 * release the vendor's remaining payout.
 */
export function VendorInvoiceUpload({
  bookingId,
  vendorSlug,
  vendorName,
}: {
  bookingId: string;
  vendorSlug: string;
  vendorName: string;
}) {
  const { showToast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const invoices = readLocalStorage<InvoiceRecord[]>(INVOICES_KEY, []);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSubmitted(invoices.some((inv) => inv.bookingId === bookingId && inv.vendorSlug === vendorSlug));
  }, [bookingId, vendorSlug]);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      showToast("Invoice must be under 5MB (PDF, JPG or PNG).", "error");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      safePush(INVOICES_KEY, {
        id: generateId("INV"),
        bookingId,
        vendorSlug,
        vendorName,
        fileName: file.name,
        dataUrl: reader.result as string,
        submittedAt: new Date().toISOString(),
        status: "submitted",
      } satisfies InvoiceRecord);
      safePush("tv-admin-notifications", {
        id: generateId("AN"),
        type: "invoice",
        message: `${vendorName} submitted an invoice for ${bookingId} — review for payout`,
        time: new Date().toISOString(),
        icon: "🧾",
        urgent: true,
      });
      setSubmitted(true);
      showToast("Invoice submitted — payout is processed after admin review.", "success");
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  if (submitted) {
    return (
      <span className="flex items-center gap-1.5 text-xs font-medium text-success">
        <FileCheck2 size={14} aria-hidden="true" /> Invoice submitted
      </span>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="inline-flex min-h-9 items-center gap-1.5 rounded-[6px] border border-burgundy/25 bg-burgundy/5 px-3 text-xs font-semibold text-burgundy transition-colors hover:bg-burgundy/10"
      >
        <FileUp size={13} aria-hidden="true" /> Upload invoice for payout
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,image/jpeg,image/png"
        className="sr-only"
        onChange={handleFile}
        aria-label="Upload invoice"
      />
    </>
  );
}
