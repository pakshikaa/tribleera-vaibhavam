"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Circle, ListChecks, Plus, Trash2 } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Field";
import { readLocalStorage, writeLocalStorage } from "@/lib/utils/browser-storage";

interface ChecklistTask {
  id: string;
  label: string;
  phase: string;
  done: boolean;
  href?: string;
  custom?: boolean;
}

const STORAGE_KEY = "TRIBLEERA-wedding-checklist";

const PHASES = ["6+ months before", "3–6 months before", "1–3 months before", "Final weeks"];

const DEFAULT_TASKS: ChecklistTask[] = [
  { id: "date-venue",   label: "Fix the wedding date and venue",              phase: PHASES[0], done: false },
  { id: "budget",       label: "Agree the overall budget with both families", phase: PHASES[0], done: false },
  { id: "photographer", label: "Book your photographer",                      phase: PHASES[0], done: false, href: "/vendors?category=photography" },
  { id: "decorator",    label: "Book your decorator and mandap",              phase: PHASES[0], done: false, href: "/vendors?category=decoration" },
  { id: "guest-list",   label: "Draft the guest list",                        phase: PHASES[1], done: false },
  { id: "makeup",       label: "Book bridal makeup and trials",               phase: PHASES[1], done: false, href: "/vendors?category=bridal-makeup" },
  { id: "invitations",  label: "Order invitation cards",                      phase: PHASES[1], done: false, href: "/vendors?category=invitation" },
  { id: "saree",        label: "Shop the bridal saree and jewellery",         phase: PHASES[1], done: false },
  { id: "cake",         label: "Order the wedding cake",                      phase: PHASES[2], done: false, href: "/vendors?category=cakes" },
  { id: "send-invites", label: "Send invitations to guests",                  phase: PHASES[2], done: false },
  { id: "menu",         label: "Finalise the catering menu",                  phase: PHASES[2], done: false },
  { id: "timeline",     label: "Confirm the event-day timeline with vendors", phase: PHASES[3], done: false },
  { id: "payments",     label: "Settle vendor balances",                      phase: PHASES[3], done: false, href: "/dashboard/customer" },
  { id: "emergency",    label: "Pack an event-day emergency kit",             phase: PHASES[3], done: false },
];

export function WeddingChecklistClient() {
  const [tasks, setTasks] = useState<ChecklistTask[] | null>(null);
  const [newTask, setNewTask] = useState("");
  const [newPhase, setNewPhase] = useState(PHASES[0]);

  useEffect(() => {
    const stored = readLocalStorage<ChecklistTask[]>(STORAGE_KEY, []);
    // Merge: stored state wins per id; new defaults appear for older saves.
    const merged = DEFAULT_TASKS.map((task) => stored.find((s) => s.id === task.id) ?? task);
    const customs = stored.filter((s) => s.custom);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTasks([...merged, ...customs]);
  }, []);

  useEffect(() => {
    if (tasks) writeLocalStorage(STORAGE_KEY, tasks);
  }, [tasks]);

  const doneCount = useMemo(() => (tasks ?? []).filter((t) => t.done).length, [tasks]);
  const total = tasks?.length ?? 0;
  const pct = total > 0 ? Math.round((doneCount / total) * 100) : 0;

  function toggle(id: string) {
    setTasks((prev) => prev?.map((t) => (t.id === id ? { ...t, done: !t.done } : t)) ?? prev);
  }

  function removeCustom(id: string) {
    setTasks((prev) => prev?.filter((t) => t.id !== id) ?? prev);
  }

  function addCustom(e: React.FormEvent) {
    e.preventDefault();
    const label = newTask.trim();
    if (!label) return;
    setTasks((prev) => [
      ...(prev ?? []),
      { id: `custom-${Date.now()}`, label, phase: newPhase, done: false, custom: true },
    ]);
    setNewTask("");
  }

  if (!tasks) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-burgundy border-t-transparent" />
      </div>
    );
  }

  return (
    <Container className="max-w-3xl py-10 md:py-14">
      {/* Progress */}
      <div className="mb-8 rounded-[12px] border border-slate/10 bg-white p-6 shadow-soft">
        <div className="flex items-center justify-between gap-4">
          <p className="flex items-center gap-2 font-display text-lg text-slate">
            <ListChecks size={18} className="text-burgundy" aria-hidden="true" /> Your progress
          </p>
          <p className="text-sm font-semibold text-burgundy-deep">
            {doneCount}/{total} done
          </p>
        </div>
        <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-ivory-deep">
          <div
            className="h-full rounded-full bg-gradient-to-r from-burgundy to-gold transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-slate-soft">
          {pct === 100
            ? "Everything is ticked off — enjoy your celebration! 🎉"
            : `${pct}% planned. Book pending services through your vendor directory.`}
        </p>
      </div>

      {/* Phases */}
      {PHASES.map((phase) => {
        const phaseTasks = tasks.filter((t) => t.phase === phase);
        if (phaseTasks.length === 0) return null;
        return (
          <section key={phase} aria-label={phase} className="mb-7">
            <h2 className="mb-3 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-soft">{phase}</h2>
            <div className="overflow-hidden rounded-[10px] border border-slate/10 bg-white shadow-soft">
              {phaseTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-3 border-b border-slate/5 px-4 py-3 last:border-b-0"
                >
                  <button
                    onClick={() => toggle(task.id)}
                    aria-label={task.done ? `Mark "${task.label}" as pending` : `Mark "${task.label}" as done`}
                    className="shrink-0"
                  >
                    {task.done ? (
                      <CheckCircle2 size={20} className="text-success" aria-hidden="true" />
                    ) : (
                      <Circle size={20} className="text-slate/25 transition-colors hover:text-burgundy" aria-hidden="true" />
                    )}
                  </button>
                  <p className={`flex-1 text-sm ${task.done ? "text-slate/40 line-through" : "text-slate"}`}>
                    {task.label}
                  </p>
                  {!task.done && task.href && (
                    <Link href={task.href} className="shrink-0 text-xs font-semibold text-burgundy hover:underline">
                      Book now →
                    </Link>
                  )}
                  {task.custom && (
                    <button
                      onClick={() => removeCustom(task.id)}
                      aria-label={`Delete "${task.label}"`}
                      className="shrink-0 text-slate-soft transition-colors hover:text-danger"
                    >
                      <Trash2 size={14} aria-hidden="true" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>
        );
      })}

      {/* Add custom task */}
      <form onSubmit={addCustom} className="rounded-[10px] border border-dashed border-slate/20 bg-white p-5">
        <p className="mb-3 text-sm font-semibold text-slate">Add your own task</p>
        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-end">
          <div className="flex-1">
            <Input
              label="Task"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="e.g. Book the nadaswaram ensemble"
            />
          </div>
          <div>
            <label htmlFor="checklist-phase" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-soft">
              When
            </label>
            <select
              id="checklist-phase"
              value={newPhase}
              onChange={(e) => setNewPhase(e.target.value)}
              className="min-h-12 w-full rounded-[6px] border border-slate/20 bg-white px-3 py-2 text-sm text-slate focus:border-burgundy focus:outline-none sm:w-auto"
            >
              {PHASES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
          <Button type="submit" icon={<Plus size={15} />}>
            Add
          </Button>
        </div>
      </form>
    </Container>
  );
}
