"use client";

import { useState } from "react";
import Link from "next/link";
import { Inbox, Mail, Search } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Field";
import { BackButton } from "@/components/ui/BackButton";
import { readLocalStorage } from "@/lib/utils/browser-storage";

interface OutboxEmail {
  id: string;
  to: string;
  subject: string;
  message?: string;
  body?: string;
  href?: string;
  ctaLabel?: string;
  sentAt?: string;
  createdAt?: string;
}

const OUTBOX_KEY = "tv-vendor-email-outbox";

/**
 * Demo mailbox — in production these emails go to the vendor's real inbox.
 * Here they land in a local outbox so the register → admin approval →
 * credentials → sign-in flow can be walked end-to-end.
 */
export default function VendorMailboxPage() {
  const [email, setEmail] = useState("");
  const [emails, setEmails] = useState<OutboxEmail[] | null>(null);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const all = readLocalStorage<OutboxEmail[]>(OUTBOX_KEY, []);
    const needle = email.trim().toLowerCase();
    setEmails(all.filter((item) => (item.to ?? "").toLowerCase() === needle));
  }

  return (
    <div className="bg-ivory py-10 md:py-14" data-portal="true">
      <Container className="max-w-2xl">
        <BackButton href="/vendor/login" label="Vendor sign in" className="mb-4" />
        <div className="mb-6">
          <h1 className="flex items-center gap-2 font-display text-2xl text-burgundy-deep">
            <Inbox size={22} aria-hidden="true" /> TRIBLEERA mailbox
          </h1>
          <p className="mt-1 text-sm text-slate-soft">
            Demo inbox — approval credentials, verification links and password resets sent to your email land here.
            In production these arrive in your real inbox.
          </p>
        </div>

        <form onSubmit={handleSearch} className="flex flex-col gap-2.5 rounded-[12px] border border-slate/8 bg-white p-5 shadow-soft sm:flex-row sm:items-end">
          <div className="flex-1">
            <Input
              label="Your registered email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@studio.com"
              required
            />
          </div>
          <Button type="submit" icon={<Search size={15} />}>
            Open mailbox
          </Button>
        </form>

        {emails !== null && (
          <div className="mt-6 space-y-3">
            {emails.length === 0 ? (
              <p className="rounded-[10px] border border-dashed border-slate/20 bg-white px-5 py-8 text-center text-sm text-slate-soft">
                No emails for <strong>{email}</strong> yet — register first, or wait for admin approval.
              </p>
            ) : (
              emails.map((item) => (
                <div key={item.id} className="rounded-[10px] border border-slate/10 bg-white p-5 shadow-soft">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="flex items-center gap-1.5 text-sm font-semibold text-slate">
                      <Mail size={14} className="text-burgundy" aria-hidden="true" /> {item.subject}
                    </p>
                    <span className="text-[11px] text-slate-soft">
                      {item.sentAt ?? item.createdAt
                        ? new Date((item.sentAt ?? item.createdAt) as string).toLocaleString("en-LK")
                        : "—"}
                    </span>
                  </div>
                  <p className="mt-3 whitespace-pre-line rounded-[8px] bg-ivory p-4 text-[13px] leading-relaxed text-slate">
                    {item.message ?? item.body ?? ""}
                  </p>
                  {item.href && (
                    <Link
                      href={item.href}
                      className="mt-3 inline-flex rounded-[6px] bg-burgundy px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-burgundy-deep"
                    >
                      {item.ctaLabel ?? "Open link"} →
                    </Link>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </Container>
    </div>
  );
}
