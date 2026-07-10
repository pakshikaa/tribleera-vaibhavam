"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Calendar, CheckCircle2, Edit3, Mail, MapPin, Phone, Save, User } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { useShortlist } from "@/context/ShortlistContext";
import { readActiveCustomerProfile, writeActiveCustomerProfile } from "@/lib/utils/customer-profile";
import type { CustomerProfile } from "@/types";

type EditableKey = "name" | "email" | "phone" | "city" | "partnerName" | "weddingDate";

const FIELDS: {
  icon: typeof User;
  label: string;
  key: EditableKey;
  type: string;
  placeholder: string;
  editable: boolean;
}[] = [
  { icon: User,     label: "Full name",     key: "name",        type: "text",  placeholder: "Your full name",   editable: true },
  { icon: Mail,     label: "Email address", key: "email",       type: "email", placeholder: "you@example.com",  editable: false },
  { icon: Phone,    label: "Phone number",  key: "phone",       type: "tel",   placeholder: "+94 77 XXX XXXX", editable: true },
  { icon: MapPin,   label: "City",          key: "city",        type: "text",  placeholder: "Your city",        editable: true },
  { icon: User,     label: "Partner name",  key: "partnerName", type: "text",  placeholder: "Partner's name",   editable: true },
  { icon: Calendar, label: "Wedding date",  key: "weddingDate", type: "date",  placeholder: "",                 editable: true },
];

export default function CustomerProfilePage() {
  const { count: shortlistCount, hydrated: slHydrated } = useShortlist();
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);

  // Profile lives in localStorage keyed by the signed-in email, so it can
  // only be read after mount.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProfile(readActiveCustomerProfile());
  }, []);

  function handleSave() {
    if (!profile) return;
    writeActiveCustomerProfile(profile);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ivory">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-burgundy border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory">
      <Container className="max-w-2xl py-8 md:py-12">
        <Link
          href="/dashboard/customer"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-slate-soft transition-all hover:-translate-x-0.5 hover:text-burgundy"
        >
          <ArrowLeft size={15} /> My Dashboard
        </Link>

        <div className="mb-6">
          <h1 className="font-display text-2xl text-burgundy-deep">My Profile</h1>
          <p className="mt-1 text-sm text-slate-soft">
            Manage your personal information and wedding details
          </p>
        </div>

        {/* Avatar + name card */}
        <div className="mb-4 flex items-center gap-5 rounded-[12px] border border-slate/10 bg-white p-6 shadow-soft">
          <div className="flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-burgundy to-burgundy-deep shadow-[0_4px_16px_rgba(92,4,39,0.25)]">
            <span className="text-[26px] font-bold leading-none text-gold">
              {(profile.name || "?").charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="min-w-0">
            <p className="truncate text-lg font-bold text-slate">{profile.name || "Your Name"}</p>
            <p className="truncate text-[13px] text-slate-soft">{profile.email}</p>
            <p className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-gold/15 px-2 py-0.5 text-[11px] font-semibold text-burgundy">
              <CheckCircle2 size={11} aria-hidden="true" /> TRIBLEERA customer
            </p>
          </div>
          <button
            onClick={() => setEditing((v) => !v)}
            className="ml-auto flex min-h-11 items-center gap-1.5 rounded-[6px] border border-slate/15 bg-white px-3.5 text-[13px] font-medium text-slate transition-colors hover:border-burgundy/30 hover:text-burgundy"
          >
            <Edit3 size={14} aria-hidden="true" />
            {editing ? "Cancel" : "Edit"}
          </button>
        </div>

        {/* Info fields */}
        <div className="mb-4 rounded-[12px] border border-slate/10 bg-white p-6 shadow-soft">
          <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-soft">
            Personal information
          </p>

          {FIELDS.map(({ icon: Icon, label, key, type, placeholder, editable }) => (
            <div key={key} className="flex items-center gap-3.5 border-b border-slate/5 py-3 last:border-b-0">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] bg-gold/15">
                <Icon size={15} className="text-burgundy" aria-hidden="true" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-[10.5px] uppercase tracking-[0.1em] text-slate-soft">{label}</p>
                  {!editable && (
                    <span className="rounded-[3px] bg-slate-100 px-1.5 py-0.5 text-[9px] font-semibold text-slate-400">
                      FIXED
                    </span>
                  )}
                </div>
                {editing && editable ? (
                  <input
                    type={type}
                    value={profile[key] ?? ""}
                    onChange={(e) => setProfile((p) => (p ? { ...p, [key]: e.target.value } : p))}
                    placeholder={placeholder}
                    className="mt-0.5 w-full border-b-[1.5px] border-gold bg-transparent py-1 text-sm text-slate outline-none placeholder:text-slate/30"
                  />
                ) : profile[key] ? (
                  <p className="mt-0.5 truncate text-sm text-slate">{profile[key]}</p>
                ) : (
                  <p className="mt-0.5 text-sm italic text-slate/35">Add {label.toLowerCase()}</p>
                )}
                {!editable && (
                  <p className="mt-1 text-[10px] text-slate-400">
                    Email cannot be changed. Contact support if needed.
                  </p>
                )}
              </div>
            </div>
          ))}

          {editing && (
            <button
              onClick={handleSave}
              className="mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-[6px] bg-gradient-to-br from-burgundy to-burgundy-deep text-sm font-semibold text-white shadow-[0_4px_18px_rgba(92,4,39,0.3)] transition-all hover:-translate-y-0.5"
            >
              <Save size={15} aria-hidden="true" />
              Save changes
            </button>
          )}

          {saved && (
            <div className="mt-3 rounded-[6px] border border-success/30 bg-success-pale px-3.5 py-2.5 text-center text-[13px] font-medium text-success">
              ✓ Profile updated successfully
            </div>
          )}
        </div>

        {/* Account stats */}
        <div className="grid grid-cols-2 gap-2.5">
          <Link
            href="/shortlist"
            className="rounded-[10px] border border-slate/10 bg-white p-4 text-center shadow-soft transition-all hover:-translate-y-0.5 hover:border-burgundy/25"
          >
            <p className="text-[28px] font-bold leading-none text-burgundy">
              {slHydrated ? shortlistCount : "–"}
            </p>
            <p className="mt-1.5 text-[11px] text-slate-soft">Vendors shortlisted</p>
          </Link>
          <Link
            href="/dashboard/customer"
            className="rounded-[10px] border border-slate/10 bg-white p-4 text-center shadow-soft transition-all hover:-translate-y-0.5 hover:border-burgundy/25"
          >
            <p className="text-[28px] font-bold leading-none text-success">1</p>
            <p className="mt-1.5 text-[11px] text-slate-soft">Bookings made</p>
          </Link>
        </div>
      </Container>
    </div>
  );
}
