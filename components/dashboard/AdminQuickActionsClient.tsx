"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { safeGet } from "@/lib/utils/store";

interface QuickAction {
  label: string;
  count: number;
  href: string;
  color: string;
}

export function AdminQuickActionsClient({ staticActions }: { staticActions: QuickAction[] }) {
  const [pendingPayments, setPendingPayments] = useState(() => safeGet<unknown[]>("tv-payments-pending", []).length);

  useEffect(() => {
    const interval = setInterval(() => {
      setPendingPayments(safeGet<unknown[]>("tv-payments-pending", []).length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const actions = staticActions.map((action) =>
    action.label === "Payments to verify" ? { ...action, count: action.count + pendingPayments } : action
  );

  if (!actions.some((a) => a.count > 0)) return null;

  return (
    <div className="rounded-[10px] border border-amber-200 bg-amber-50 p-5">
      <div className="mb-3 flex items-center gap-2">
        <AlertCircle size={16} className="text-amber-600" />
        <p className="text-sm font-semibold text-amber-800">Needs your attention</p>
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {actions.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className={cn("rounded-[8px] border p-3 transition-all hover:shadow-sm", action.color)}
          >
            <p className="font-display text-2xl font-bold">{action.count}</p>
            <p className="mt-0.5 text-xs font-medium">{action.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
