"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Clock, LifeBuoy, Send } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Field";
import { useToast } from "@/components/ui/Toast";
import { BackButton } from "@/components/ui/BackButton";
import { readLocalStorage } from "@/lib/utils/browser-storage";
import { generateId, safePush } from "@/lib/utils/store";
import { getCurrentVendorSlug } from "@/lib/utils/vendorPortal";
import { formatDateShort } from "@/lib/utils/format";

interface SupportTicket {
  id: string;
  vendorSlug: string;
  vendorName: string;
  category: string;
  subject: string;
  message: string;
  status: "open" | "resolved";
  createdAt: string;
}

const TICKETS_KEY = "tv-support-tickets";

const TICKET_CATEGORIES = ["Payments & payouts", "Booking issue", "Profile & photos", "Account access", "Other"];

/** Vendor-specific support channel (V-26) — tickets, not a generic contact form. */
export default function VendorSupportPage() {
  const { showToast } = useToast();
  const [slug, setSlug] = useState("");
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [category, setCategory] = useState(TICKET_CATEGORIES[0]);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const vendorSlug = getCurrentVendorSlug() ?? "";
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSlug(vendorSlug);
    setTickets(
      readLocalStorage<SupportTicket[]>(TICKETS_KEY, [])
        .filter((t) => t.vendorSlug === vendorSlug)
        .reverse()
    );
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;
    let vendorName = "Vendor";
    try {
      vendorName = sessionStorage.getItem("vendor-name") || vendorName;
    } catch {}
    const ticket: SupportTicket = {
      id: generateId("TKT"),
      vendorSlug: slug,
      vendorName,
      category,
      subject: subject.trim(),
      message: message.trim(),
      status: "open",
      createdAt: new Date().toISOString(),
    };
    safePush(TICKETS_KEY, ticket);
    safePush("tv-admin-notifications", {
      id: generateId("AN"),
      type: "support",
      message: `Support ticket from ${vendorName}: ${ticket.subject}`,
      time: ticket.createdAt,
      icon: "🛟",
      urgent: true,
    });
    setTickets((prev) => [ticket, ...prev]);
    setSubject("");
    setMessage("");
    showToast("Ticket submitted — the TRIBLEERA team replies within 24 hours.", "success");
  }

  return (
    <div className="bg-ivory py-8 md:py-10">
      <Container className="max-w-3xl">
        <BackButton href="/dashboard/vendor" label="Dashboard" className="mb-4" />
        <div className="mb-6">
          <h1 className="flex items-center gap-2 font-display text-2xl text-burgundy-deep">
            <LifeBuoy size={22} aria-hidden="true" /> Vendor support
          </h1>
          <p className="mt-1 text-sm text-slate-soft">
            Platform problem? Raise a ticket — replies land in your notifications within 24 hours.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-[12px] border border-slate/8 bg-white p-6 shadow-soft">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="ticket-category" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-soft">
                Category
              </label>
              <select
                id="ticket-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="min-h-12 w-full rounded-[6px] border border-slate/20 bg-white px-3 py-2 text-sm text-slate focus:border-burgundy focus:outline-none"
              >
                {TICKET_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <Input label="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Short summary" required />
          </div>
          <div className="mt-4">
            <Textarea
              label="Describe the problem"
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="What happened, when, and what you expected"
              required
            />
          </div>
          <Button type="submit" className="mt-5" icon={<Send size={15} />}>
            Submit ticket
          </Button>
        </form>

        <div className="mt-8">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-soft">Your tickets</p>
          {tickets.length === 0 ? (
            <p className="rounded-[10px] border border-dashed border-slate/20 bg-white px-5 py-8 text-center text-sm text-slate-soft">
              No tickets yet — raise one above when you need help.
            </p>
          ) : (
            <div className="space-y-3">
              {tickets.map((t) => (
                <div key={t.id} className="rounded-[10px] border border-slate/10 bg-white p-4 shadow-soft">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-slate">{t.subject}</p>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                        t.status === "resolved" ? "bg-success-pale text-success" : "bg-amber-50 text-amber-800"
                      }`}
                    >
                      {t.status === "resolved" ? <CheckCircle2 size={11} /> : <Clock size={11} />}
                      {t.status === "resolved" ? "Resolved" : "Open"}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-soft">
                    {t.category} · {t.id} · {formatDateShort(t.createdAt)}
                  </p>
                  <p className="mt-2 text-[13px] leading-relaxed text-slate-soft">{t.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
