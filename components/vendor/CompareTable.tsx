"use client";

import Link from "next/link";
import { Clock, ShieldCheck, Star } from "lucide-react";
import type { Vendor } from "@/types";
import { getCategoryBySlug } from "@/lib/data/categories";
import { formatLKR } from "@/lib/utils/format";

/**
 * Side-by-side comparison of shortlisted vendors: price, packages, rating,
 * experience and responsiveness in one scannable table.
 */
export function CompareTable({ vendors }: { vendors: Vendor[] }) {
  if (vendors.length < 2) return null;

  const compared = vendors.slice(0, 4);
  const cheapest = Math.min(...compared.map((v) => v.startingPrice));

  const rows: { label: string; render: (v: Vendor) => React.ReactNode }[] = [
    {
      label: "Service",
      render: (v) => getCategoryBySlug(v.categorySlug)?.name ?? v.categorySlug,
    },
    {
      label: "Starting price",
      render: (v) => (
        <span className={v.startingPrice === cheapest ? "font-bold text-success" : "font-semibold text-burgundy-deep"}>
          {formatLKR(v.startingPrice)}
          {v.startingPrice === cheapest && <span className="ml-1.5 rounded-full bg-success-pale px-1.5 py-0.5 text-[9px] font-bold uppercase text-success">Lowest</span>}
        </span>
      ),
    },
    {
      label: "Trust score",
      render: (v) => (
        <span className="inline-flex items-center gap-1 font-semibold text-slate">
          <Star size={11} className="fill-gold text-gold" aria-hidden="true" /> {v.trustScore.toFixed(1)}
        </span>
      ),
    },
    {
      label: "Packages",
      render: (v) =>
        v.packages.length > 0
          ? `${v.packages.length} (${formatLKR(Math.min(...v.packages.map((p) => p.price)))} – ${formatLKR(Math.max(...v.packages.map((p) => p.price)))})`
          : "On request",
    },
    { label: "Experience", render: (v) => `${v.experienceYears} years · ${v.eventsCompleted} events` },
    {
      label: "Response time",
      render: (v) => (
        <span className="inline-flex items-center gap-1 text-emerald-700">
          <Clock size={11} aria-hidden="true" /> {v.responseTime.replace(/^Usually responds\s*/i, "")}
        </span>
      ),
    },
    { label: "City", render: (v) => v.city },
  ];

  return (
    <div className="overflow-x-auto rounded-[10px] border border-slate/10 bg-white shadow-soft">
      <table className="w-full min-w-[560px] border-collapse text-left text-[13px]">
        <thead>
          <tr className="border-b border-slate/10 bg-ivory">
            <th className="w-[130px] px-4 py-3 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-soft">
              Compare
            </th>
            {compared.map((v) => (
              <th key={v.slug} className="px-4 py-3">
                <Link href={`/vendors/${v.slug}`} className="font-display text-sm font-semibold text-burgundy-deep hover:underline">
                  {v.name}
                </Link>
                {v.verified && (
                  <span className="mt-1 flex items-center gap-1 text-[10px] font-medium text-slate-soft">
                    <ShieldCheck size={10} className="text-burgundy" aria-hidden="true" /> Verified
                  </span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(({ label, render }, i) => (
            <tr key={label} className={i % 2 === 1 ? "bg-ivory/60" : undefined}>
              <td className="px-4 py-2.5 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-slate-soft">
                {label}
              </td>
              {compared.map((v) => (
                <td key={v.slug} className="px-4 py-2.5 text-slate">
                  {render(v)}
                </td>
              ))}
            </tr>
          ))}
          <tr className="border-t border-slate/10">
            <td className="px-4 py-3" />
            {compared.map((v) => (
              <td key={v.slug} className="px-4 py-3">
                <Link
                  href={`/vendors/${v.slug}/packages`}
                  className="inline-flex rounded-[5px] bg-burgundy px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-burgundy-deep"
                >
                  View packages
                </Link>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
