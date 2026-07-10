import { Badge } from "@/components/ui/Badge";
import { BookingStatus } from "@/types";

const MAP: Record<BookingStatus, { label: string; tone: "success" | "warning" | "burgundy" | "slate" | "danger" }> = {
  pending: { label: "Pending", tone: "warning" },
  confirmed: { label: "Confirmed", tone: "burgundy" },
  advance_paid: { label: "Advance Paid", tone: "success" },
  cancellation_requested: { label: "Cancellation Requested", tone: "warning" },
  completed: { label: "Completed", tone: "slate" },
  cancelled: { label: "Cancelled", tone: "danger" },
};

export function BookingStatusBadge({ status }: { status: BookingStatus }) {
  const m = MAP[status];
  return <Badge tone={m.tone}>{m.label}</Badge>;
}
