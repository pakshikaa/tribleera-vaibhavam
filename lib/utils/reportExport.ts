import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

/**
 * Branded PDF report/statement generation for both portals.
 *
 * Every document carries the standard TRIBLEERA VAIBHAVAM letterhead —
 * logo, brand name, contact line, report title, period, generated-at
 * timestamp — plus a numbered footer on every page.
 */

const BRAND = {
  name: "TRIBLEERA VAIBHAVAM",
  tagline: "Premium Tamil Wedding Marketplace",
  address: "Jaffna, Sri Lanka",
  website: "www.tribleera.com",
  email: "hello@tribleera.com",
  logoPath: "/logo/tribleera-mark-192.png",
};

const BURGUNDY: [number, number, number] = [92, 4, 39];
const GOLD: [number, number, number] = [212, 175, 106];
const SLATE: [number, number, number] = [31, 41, 55];
const SLATE_SOFT: [number, number, number] = [107, 114, 128];
const IVORY: [number, number, number] = [250, 247, 242];

const PAGE_MARGIN = 14;

export interface ReportColumn {
  header: string;
  key: string;
  align?: "left" | "right" | "center";
}

export interface ReportSummaryRow {
  label: string;
  value: string;
}

export interface ReportPdfOptions {
  filename: string;
  title: string;
  /** e.g. "Period: This month" or "Statement for Pushpa Florals & Decor" */
  subtitle?: string;
  columns: ReportColumn[];
  rows: Array<Record<string, string | number>>;
  /** Totals block rendered after the table, right-aligned. */
  summary?: ReportSummaryRow[];
}

async function loadLogoDataUrl(): Promise<string | null> {
  try {
    const response = await fetch(BRAND.logoPath);
    if (!response.ok) return null;
    const blob = await response.blob();
    return await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : null);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

function drawLetterhead(doc: jsPDF, logo: string | null, title: string, subtitle?: string): number {
  const pageWidth = doc.internal.pageSize.getWidth();

  if (logo) {
    doc.addImage(logo, "PNG", PAGE_MARGIN, 12, 16, 16);
  }

  const textX = logo ? PAGE_MARGIN + 20 : PAGE_MARGIN;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(...BURGUNDY);
  doc.text(BRAND.name, textX, 19);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(...SLATE_SOFT);
  doc.text(`${BRAND.tagline} — ${BRAND.address}`, textX, 24.5);

  doc.setFontSize(8.5);
  doc.text(BRAND.website, pageWidth - PAGE_MARGIN, 16, { align: "right" });
  doc.text(BRAND.email, pageWidth - PAGE_MARGIN, 20.5, { align: "right" });
  const generatedAt = new Date().toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  doc.text(`Generated: ${generatedAt}`, pageWidth - PAGE_MARGIN, 25, { align: "right" });

  // Brand rule — gold over burgundy, the letterhead divider.
  doc.setDrawColor(...GOLD);
  doc.setLineWidth(0.8);
  doc.line(PAGE_MARGIN, 31, pageWidth - PAGE_MARGIN, 31);
  doc.setDrawColor(...BURGUNDY);
  doc.setLineWidth(0.3);
  doc.line(PAGE_MARGIN, 32.2, pageWidth - PAGE_MARGIN, 32.2);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(...SLATE);
  doc.text(title, PAGE_MARGIN, 41);

  let tableStart = 46;
  if (subtitle) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(...SLATE_SOFT);
    doc.text(subtitle, PAGE_MARGIN, 46.5);
    tableStart = 52;
  }
  return tableStart;
}

function drawFooters(doc: jsPDF) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const pageCount = doc.getNumberOfPages();

  for (let page = 1; page <= pageCount; page += 1) {
    doc.setPage(page);
    doc.setDrawColor(...GOLD);
    doc.setLineWidth(0.4);
    doc.line(PAGE_MARGIN, pageHeight - 14, pageWidth - PAGE_MARGIN, pageHeight - 14);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(...SLATE_SOFT);
    doc.text(`${BRAND.name} · ${BRAND.website} · ${BRAND.email}`, PAGE_MARGIN, pageHeight - 9);
    doc.text("System-generated document — valid without signature.", PAGE_MARGIN, pageHeight - 5.5);
    doc.text(`Page ${page} of ${pageCount}`, pageWidth - PAGE_MARGIN, pageHeight - 9, { align: "right" });
  }
}

export async function downloadReportPdf({ filename, title, subtitle, columns, rows, summary }: ReportPdfOptions) {
  if (typeof window === "undefined") return;

  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const logo = await loadLogoDataUrl();
  const tableStart = drawLetterhead(doc, logo, title, subtitle);
  const pageWidth = doc.internal.pageSize.getWidth();

  autoTable(doc, {
    startY: tableStart,
    margin: { left: PAGE_MARGIN, right: PAGE_MARGIN, top: 20, bottom: 20 },
    head: [columns.map((column) => column.header)],
    body: rows.map((row) => columns.map((column) => String(row[column.key] ?? ""))),
    styles: { font: "helvetica", fontSize: 8, cellPadding: 2.2, textColor: SLATE },
    headStyles: { fillColor: BURGUNDY, textColor: [255, 255, 255], fontSize: 8, fontStyle: "bold" },
    alternateRowStyles: { fillColor: IVORY },
    columnStyles: Object.fromEntries(
      columns.map((column, index) => [index, { halign: column.align ?? "left" }])
    ),
  });

  if (summary && summary.length > 0) {
    const table = (doc as jsPDF & { lastAutoTable?: { finalY: number } }).lastAutoTable;
    let y = (table?.finalY ?? tableStart) + 8;
    const pageHeight = doc.internal.pageSize.getHeight();
    const blockHeight = summary.length * 6 + 6;
    if (y + blockHeight > pageHeight - 18) {
      doc.addPage();
      y = 24;
    }

    const boxWidth = 74;
    const boxX = pageWidth - PAGE_MARGIN - boxWidth;
    doc.setFillColor(...IVORY);
    doc.setDrawColor(...GOLD);
    doc.setLineWidth(0.4);
    doc.roundedRect(boxX, y - 4, boxWidth, blockHeight, 1.5, 1.5, "FD");

    summary.forEach((entry, index) => {
      const rowY = y + 1.5 + index * 6;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(...SLATE_SOFT);
      doc.text(entry.label, boxX + 4, rowY);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...BURGUNDY);
      doc.text(entry.value, boxX + boxWidth - 4, rowY, { align: "right" });
    });
  }

  drawFooters(doc);
  doc.save(filename);
}

export interface InvoicePdfOptions {
  filename: string;
  /** e.g. "Customer Invoice", "Vendor Payout Statement" */
  title: string;
  invoiceId: string;
  billTo: string;
  issuedAt: string;
  rows: Array<{ label: string; amount: number }>;
  note?: string;
}

const formatInvoiceAmount = (amount: number) => `LKR ${amount.toLocaleString("en-LK")}`;

/** Branded invoice/bill — letterhead, invoice meta block, line items, total. */
export async function downloadInvoicePdf({ filename, title, invoiceId, billTo, issuedAt, rows, note }: InvoicePdfOptions) {
  if (typeof window === "undefined") return;

  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const logo = await loadLogoDataUrl();
  drawLetterhead(doc, logo, title);
  const pageWidth = doc.internal.pageSize.getWidth();

  // Invoice meta block — number, dates, bill-to.
  const metaY = 48;
  doc.setFillColor(...IVORY);
  doc.setDrawColor(...GOLD);
  doc.setLineWidth(0.4);
  doc.roundedRect(PAGE_MARGIN, metaY, pageWidth - PAGE_MARGIN * 2, 20, 1.5, 1.5, "FD");

  const issuedLabel = new Date(issuedAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...SLATE_SOFT);
  doc.text("INVOICE NO", PAGE_MARGIN + 5, metaY + 6.5);
  doc.text("ISSUED", PAGE_MARGIN + 70, metaY + 6.5);
  doc.text("BILL TO", PAGE_MARGIN + 5, metaY + 14);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(...SLATE);
  doc.text(invoiceId, PAGE_MARGIN + 5, metaY + 10.5);
  doc.text(issuedLabel, PAGE_MARGIN + 70, metaY + 10.5);
  doc.text(billTo, PAGE_MARGIN + 22, metaY + 14);

  const total = rows.reduce((sum, row) => sum + row.amount, 0);

  autoTable(doc, {
    startY: metaY + 26,
    margin: { left: PAGE_MARGIN, right: PAGE_MARGIN, bottom: 24 },
    head: [["Description", "Amount"]],
    body: rows.map((row) => [row.label, formatInvoiceAmount(row.amount)]),
    foot: [["Total", formatInvoiceAmount(total)]],
    styles: { font: "helvetica", fontSize: 9.5, cellPadding: 3, textColor: SLATE },
    headStyles: { fillColor: BURGUNDY, textColor: [255, 255, 255], fontSize: 9, fontStyle: "bold" },
    footStyles: { fillColor: GOLD, textColor: BURGUNDY, fontSize: 10.5, fontStyle: "bold" },
    alternateRowStyles: { fillColor: IVORY },
    columnStyles: { 1: { halign: "right", cellWidth: 52 } },
  });

  if (note) {
    const table = (doc as jsPDF & { lastAutoTable?: { finalY: number } }).lastAutoTable;
    const y = (table?.finalY ?? 110) + 10;
    doc.setFont("helvetica", "italic");
    doc.setFontSize(8.5);
    doc.setTextColor(...SLATE_SOFT);
    doc.text(doc.splitTextToSize(note, pageWidth - PAGE_MARGIN * 2), PAGE_MARGIN, y);
  }

  drawFooters(doc);
  doc.save(filename);
}

/** Generic CSV download — mirrors the admin helper for non-admin surfaces. */
export function downloadCsvFile(filename: string, rows: Array<Record<string, string | number>>) {
  if (typeof window === "undefined" || rows.length === 0) return;
  const headers = Object.keys(rows[0]);
  const escape = (value: string | number) => {
    const text = String(value ?? "");
    return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
  };
  const csv = [headers.join(","), ...rows.map((row) => headers.map((key) => escape(row[key])).join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = window.URL.createObjectURL(blob);
  const link = window.document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  window.URL.revokeObjectURL(url);
}
