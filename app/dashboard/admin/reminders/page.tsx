import { bookings } from "@/lib/data/bookings";
import { Calendar } from "lucide-react";
import { formatLKR } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";

function getDaysUntil(dateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const event = new Date(dateStr);
  event.setHours(0, 0, 0, 0);
  return Math.ceil((event.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export default function RemindersPage() {
  const upcoming = bookings
    .filter((b) => b.status === "confirmed")
    .map((b) => ({ ...b, daysUntil: getDaysUntil(b.eventDate) }))
    .filter((b) => b.daysUntil >= 0 && b.daysUntil <= 7)
    .sort((a, b) => a.daysUntil - b.daysUntil);

  const today = upcoming.filter((b) => b.daysUntil === 0);
  const tomorrow = upcoming.filter((b) => b.daysUntil === 1);
  const in3Days = upcoming.filter((b) => b.daysUntil >= 2 && b.daysUntil <= 3);
  const thisWeek = upcoming.filter((b) => b.daysUntil >= 4 && b.daysUntil <= 7);

  const groups = [
    { label: "Today", items: today, color: "bg-red-50 border-red-200", badge: "bg-red-500" },
    { label: "Tomorrow", items: tomorrow, color: "bg-amber-50 border-amber-200", badge: "bg-amber-500" },
    { label: "Within 3 days", items: in3Days, color: "bg-gold/5 border-gold/30", badge: "bg-gold-deep" },
    { label: "This week", items: thisWeek, color: "bg-ivory border-slate/10", badge: "bg-slate" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-slate">Upcoming Event Reminders</h1>
        <p className="mt-1 text-sm text-slate-soft">
          Events in the next 7 days — {upcoming.length} total
        </p>
      </div>

      {upcoming.length === 0 ? (
        <div className="rounded-[10px] border border-slate/10 bg-white p-12 text-center">
          <Calendar size={32} className="mx-auto mb-3 text-slate/30" />
          <p className="font-semibold text-slate">No events this week</p>
          <p className="mt-1 text-sm text-slate-soft">All clear for the next 7 days.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {groups.filter((g) => g.items.length > 0).map((group) => (
            <div key={group.label}>
              <div className="mb-3 flex items-center gap-2">
                <span className={`rounded-full px-3 py-1 text-xs font-bold text-white ${group.badge}`}>
                  {group.label}
                </span>
                <span className="text-xs text-slate-soft">
                  {group.items.length} event{group.items.length > 1 ? "s" : ""}
                </span>
              </div>
              <div className={`overflow-hidden rounded-[10px] border ${group.color}`}>
                {group.items.map((b, i) => (
                  <div
                    key={b.id}
                    className={cn(
                      "flex items-center justify-between px-5 py-4",
                      i > 0 && "border-t border-slate/8"
                    )}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-burgundy/10 font-display text-sm font-bold text-burgundy-deep">
                        {b.daysUntil === 0 ? (
                          "!"
                        ) : (
                          <>
                            {b.daysUntil}
                            <span className="text-[9px]">d</span>
                          </>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-slate">
                          {b.vendorName ?? b.items[0]?.vendorName ?? "—"}
                        </p>
                        <p className="text-xs text-slate-soft">
                          {b.categorySlug ?? b.items[0]?.categorySlug ?? "—"} · {b.customerName}
                        </p>
                        <p className="mt-0.5 text-xs text-slate-soft">
                          {b.location ?? b.customerCity}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-display text-base font-semibold text-burgundy">{b.eventDate}</p>
                      <p className="text-xs text-slate-soft">{formatLKR(b.serviceTotal)} booking</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
