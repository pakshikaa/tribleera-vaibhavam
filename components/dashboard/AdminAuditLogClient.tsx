"use client";

import { useSyncExternalStore } from "react";
import { FileCheck2 } from "lucide-react";
import { getAdminSnapshot, subscribeAdminData } from "@/lib/utils/adminLiveData";
import { formatDate, formatDateShort } from "@/lib/utils/format";

export function AdminAuditLogClient() {
  const snapshot = useSyncExternalStore(subscribeAdminData, getAdminSnapshot, getAdminSnapshot);
  const items = snapshot.auditLog.slice(0, 8);

  return (
    <div className="rounded-[10px] border border-slate/10 bg-white">
      <div className="flex items-center gap-2 border-b border-slate/8 px-5 py-4">
        <FileCheck2 size={16} className="text-burgundy" />
        <h2 className="font-display text-base font-semibold text-slate">Admin Audit Log</h2>
      </div>
      <div className="divide-y divide-slate/8">
        {items.length === 0 ? (
          <p className="px-5 py-6 text-sm text-slate-soft">No admin actions recorded yet.</p>
        ) : (
          items.map((item) => (
            <div key={item.id} className="px-5 py-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-medium text-slate">{item.action}</p>
                <p className="text-xs text-slate-soft">{formatDate(item.at)} · {formatDateShort(item.at)}</p>
              </div>
              <p className="mt-1 text-sm text-slate-soft">
                {item.actor} · {item.entityLabel}
              </p>
              {item.details && <p className="mt-1 text-xs text-slate-soft">{item.details}</p>}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

