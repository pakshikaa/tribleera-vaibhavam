"use client";

import { useEffect, useState } from "react";
import { MessageSquareText, Send } from "lucide-react";
import { readLocalStorage, writeLocalStorage } from "@/lib/utils/browser-storage";
import { cn } from "@/lib/utils/cn";

interface ThreadMessage {
  id: string;
  author: string;
  role: "customer" | "vendor" | "guest";
  text: string;
  at: string;
}

function threadKey(bookingId: string) {
  return `tv-messages-${bookingId}`;
}

function resolveSender(): { author: string; role: ThreadMessage["role"] } {
  try {
    if (sessionStorage.getItem("vendor-auth") === "true") {
      return { author: sessionStorage.getItem("vendor-name") || "Vendor", role: "vendor" };
    }
    if (sessionStorage.getItem("customer-auth")) {
      return { author: sessionStorage.getItem("customer-name") || "Customer", role: "customer" };
    }
  } catch {}
  return { author: "Family member", role: "guest" };
}

/**
 * On-platform message record per booking (V-25) — keeps a dispute-proof
 * conversation trail instead of everything disappearing into WhatsApp.
 */
export function BookingMessageThread({ bookingId }: { bookingId: string }) {
  const [messages, setMessages] = useState<ThreadMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [sender, setSender] = useState<{ author: string; role: ThreadMessage["role"] }>({
    author: "Family member",
    role: "guest",
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSender(resolveSender());
    setMessages(readLocalStorage<ThreadMessage[]>(threadKey(bookingId), []));
    const interval = setInterval(() => {
      setMessages(readLocalStorage<ThreadMessage[]>(threadKey(bookingId), []));
    }, 10_000);
    return () => clearInterval(interval);
  }, [bookingId]);

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    const next = [
      ...readLocalStorage<ThreadMessage[]>(threadKey(bookingId), []),
      { id: `MSG-${Date.now()}`, author: sender.author, role: sender.role, text, at: new Date().toISOString() },
    ];
    writeLocalStorage(threadKey(bookingId), next);
    setMessages(next);
    setDraft("");
  }

  return (
    <div className="rounded-[10px] border border-slate/10 bg-white shadow-soft">
      <div className="flex items-center gap-2 border-b border-slate/8 px-5 py-3.5">
        <MessageSquareText size={15} className="text-burgundy" aria-hidden="true" />
        <p className="text-sm font-semibold text-slate">Booking messages</p>
        <p className="ml-auto text-[11px] text-slate-soft">Kept on record for dispute support</p>
      </div>
      <div className="max-h-[260px] space-y-3 overflow-y-auto px-5 py-4">
        {messages.length === 0 ? (
          <p className="py-4 text-center text-[13px] text-slate-soft">
            No messages yet — questions asked here stay attached to this booking.
          </p>
        ) : (
          messages.map((m) => (
            <div key={m.id} className={cn("max-w-[85%]", m.role === "vendor" ? "ml-auto text-right" : "")}>
              <div
                className={cn(
                  "inline-block rounded-[10px] px-3.5 py-2 text-[13px] leading-relaxed",
                  m.role === "vendor" ? "bg-burgundy text-white" : "bg-ivory text-slate"
                )}
              >
                {m.text}
              </div>
              <p className="mt-1 text-[10.5px] text-slate-soft">
                {m.author} · {new Date(m.at).toLocaleString("en-LK", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" })}
              </p>
            </div>
          ))
        )}
      </div>
      <form onSubmit={handleSend} className="flex items-center gap-2 border-t border-slate/8 px-4 py-3">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={`Message as ${sender.author}…`}
          aria-label="Type a message"
          className="min-h-11 flex-1 rounded-[6px] border border-slate/20 bg-white px-3 text-sm text-slate outline-none focus:border-burgundy"
        />
        <button
          type="submit"
          aria-label="Send message"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[6px] bg-burgundy text-white transition-colors hover:bg-burgundy-deep"
        >
          <Send size={15} aria-hidden="true" />
        </button>
      </form>
    </div>
  );
}
