import { ReactNode } from "react";

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[8px] border border-dashed border-slate/15 bg-white/60 px-6 py-14 text-center">
      {icon && <div className="mb-4 text-gold-deep">{icon}</div>}
      <p className="font-display text-xl text-slate">{title}</p>
      {description && <p className="mt-2 max-w-sm text-sm text-slate-soft">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
