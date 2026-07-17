import type { ReactNode } from "react";

/** Consistent page title block for vendor portal pages — mirrors the admin portal header pattern. */
export function VendorPageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate">{title}</h1>
        {description && <p className="mt-1 text-sm text-slate-soft">{description}</p>}
      </div>
      {actions && <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">{actions}</div>}
    </div>
  );
}
