"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp, CalendarPlus, Check, Download, Loader2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site";
import type {
  MeetingSlot,
  ScheduleChatResponse,
  ScheduleConfirmResponse,
} from "@/lib/scheduling/types";

type Msg = {
  id: string;
  role: "user" | "assistant";
  content: string;
  /** UI-only greeting — not sent to the model. */
  seed?: boolean;
  slots?: MeetingSlot[];
  note?: string;
};

const GREETING =
  "Tell me roughly when works — a day, a week, mornings vs. afternoons — and I'll pull up open times for a call with Harshvardhan.";

const uid = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);

export function Scheduler() {
  const [started, setStarted] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [ended, setEnded] = useState(false);
  const [selected, setSelected] = useState<MeetingSlot | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [result, setResult] = useState<ScheduleConfirmResponse | null>(null);

  const threadRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    threadRef.current?.scrollTo({ top: threadRef.current.scrollHeight });
  }, [messages, pending, selected, result]);

  function start() {
    setStarted(true);
    setMessages([{ id: uid(), role: "assistant", content: GREETING, seed: true }]);
    requestAnimationFrame(() => inputRef.current?.focus());
  }

  async function send() {
    const text = input.trim();
    if (!text || pending || ended) return;
    setError(null);
    setInput("");
    const next: Msg[] = [...messages, { id: uid(), role: "user", content: text }];
    setMessages(next);
    setPending(true);
    try {
      const res = await fetch("/api/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: next.filter((m) => !m.seed).map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = (await res.json()) as ScheduleChatResponse & { error?: string };
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setMessages((prev) => [
        ...prev,
        {
          id: uid(),
          role: "assistant",
          content: data.reply,
          slots: data.slots?.length ? data.slots : undefined,
          note: data.note,
        },
      ]);
      if (data.ended) setEnded(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setPending(false);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }

  async function confirm() {
    if (!selected || confirming) return;
    setError(null);
    setConfirming(true);
    try {
      const res = await fetch("/api/schedule/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slot: { startISO: selected.startISO, endISO: selected.endISO },
          name,
          email,
          phone,
          note,
        }),
      });
      const data = (await res.json()) as ScheduleConfirmResponse & { error?: string };
      if (!res.ok) throw new Error(data.error || "Couldn't confirm that time.");
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't confirm that time.");
    } finally {
      setConfirming(false);
    }
  }

  function downloadIcs() {
    if (!result) return;
    const blob = new Blob([result.calendar.ics], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "intro-call.ics";
    a.click();
    URL.revokeObjectURL(url);
  }

  // ── Idle ──────────────────────────────────────────────────────────────────
  if (!started) {
    return (
      <div className="border-border bg-surface/40 mt-8 rounded-xl border p-5">
        <div className="flex items-center gap-2">
          <Sparkles className="text-accent h-4 w-4" />
          <h2 className="text-sm font-medium">Schedule with my AI assistant</h2>
        </div>
        <p className="text-muted mt-2 text-sm">
          Talk through a time in a couple of lines instead of an email thread. It reads your
          preferred day and time, then shows real open slots. Browsing times needs nothing;
          confirming needs your full name and email.
        </p>
        <button
          type="button"
          onClick={start}
          className="bg-accent text-accent-foreground mt-4 inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-[filter] hover:brightness-110"
        >
          <Sparkles className="h-4 w-4" /> Start scheduling
        </button>
      </div>
    );
  }

  // ── Confirmed ─────────────────────────────────────────────────────────────
  if (result) {
    return (
      <div className="border-border bg-surface/40 mt-8 rounded-xl border p-5">
        <div className="flex items-center gap-2">
          <span className="grid h-6 w-6 place-items-center rounded-full bg-green-500/15 text-green-600 dark:text-green-400">
            <Check className="h-4 w-4" />
          </span>
          <h2 className="text-sm font-medium">You&apos;re on the calendar</h2>
        </div>
        <p className="mt-3 text-sm">
          <span className="font-medium">{result.slotLabel}</span>
        </p>
        <p className="text-muted mt-1 text-sm">
          {result.notified
            ? "Harshvardhan has been emailed the details and will send an invite."
            : "Save it below. Harshvardhan will confirm by email shortly."}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <a
            href={result.calendar.googleUrl}
            target="_blank"
            rel="noreferrer"
            className="border-border hover:bg-surface inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm"
          >
            <CalendarPlus className="h-4 w-4" /> Google Calendar
          </a>
          <button
            type="button"
            onClick={downloadIcs}
            className="border-border hover:bg-surface inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm"
          >
            <Download className="h-4 w-4" /> Download .ics
          </button>
        </div>
      </div>
    );
  }

  // ── Chat + confirm ────────────────────────────────────────────────────────
  return (
    <div className="border-border bg-surface/40 mt-8 flex flex-col overflow-hidden rounded-xl border">
      <div className="border-border/60 flex items-center gap-2 border-b px-4 py-3">
        <Sparkles className="text-accent h-4 w-4" />
        <h2 className="text-sm font-medium">Schedule with my AI assistant</h2>
      </div>

      <div
        ref={threadRef}
        className="flex max-h-[26rem] min-h-[14rem] flex-col gap-3 overflow-y-auto p-4"
        aria-live="polite"
      >
        {messages.map((m) => (
          <div
            key={m.id}
            className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}
          >
            <div className="max-w-[85%]">
              <div
                className={cn(
                  "rounded-2xl px-3.5 py-2 text-sm",
                  m.role === "user"
                    ? "bg-accent text-accent-foreground rounded-br-sm"
                    : "bg-surface border-border text-foreground rounded-bl-sm border",
                )}
              >
                {m.content}
              </div>

              {m.note ? <p className="text-muted mt-1.5 text-xs">{m.note}</p> : null}

              {m.slots?.length ? (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {m.slots.map((s) => {
                    const active = selected?.id === s.id;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setSelected(active ? null : s)}
                        aria-pressed={active}
                        className={cn(
                          "rounded-md border px-2.5 py-1.5 text-xs transition-colors",
                          active
                            ? "border-accent bg-accent/10 text-foreground"
                            : "border-border hover:bg-surface text-muted hover:text-foreground",
                        )}
                      >
                        {s.label} · {s.durationMin} min
                        {s.note ? ` · ${s.note}` : ""}
                      </button>
                    );
                  })}
                </div>
              ) : null}
            </div>
          </div>
        ))}

        {pending ? (
          <div className="flex justify-start">
            <div className="bg-surface border-border text-muted inline-flex items-center gap-2 rounded-2xl rounded-bl-sm border px-3.5 py-2 text-sm">
              <Loader2 className="h-3.5 w-3.5 animate-spin" /> thinking…
            </div>
          </div>
        ) : null}
      </div>

      {selected ? (
        <div className="border-border/60 border-t p-4">
          <p className="text-sm">
            Confirm <span className="font-medium">{selected.label}</span> ({selected.durationMin}{" "}
            min)
          </p>
          <p className="text-muted mt-1 text-xs">Required to confirm: your full name and email.</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <label className="block">
              <span className="sr-only">Your full name</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full name (first and last) *"
                autoComplete="name"
                className="border-border bg-background focus:border-accent w-full rounded-md border px-3 py-2 text-sm outline-none"
              />
            </label>
            <label className="block">
              <span className="sr-only">Your email</span>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email *"
                type="email"
                autoComplete="email"
                className="border-border bg-background focus:border-accent w-full rounded-md border px-3 py-2 text-sm outline-none"
              />
            </label>
          </div>
          <label className="mt-2 block">
            <span className="sr-only">Phone number</span>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone or business number (optional)"
              type="tel"
              autoComplete="tel"
              className="border-border bg-background focus:border-accent w-full rounded-md border px-3 py-2 text-sm outline-none"
            />
          </label>
          <label className="mt-2 block">
            <span className="sr-only">Anything to add</span>
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Role, company, or context (optional)"
              className="border-border bg-background focus:border-accent w-full rounded-md border px-3 py-2 text-sm outline-none"
            />
          </label>
          <div className="mt-3 flex items-center gap-2">
            <button
              type="button"
              onClick={confirm}
              disabled={
                confirming ||
                name.trim().split(/\s+/).filter(Boolean).length < 2 ||
                !email.includes("@")
              }
              className="bg-accent text-accent-foreground inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-[filter] hover:brightness-110 disabled:opacity-50"
            >
              {confirming ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Check className="h-4 w-4" />
              )}
              Confirm meeting
            </button>
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="text-muted hover:text-foreground px-2 py-2 text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : ended ? (
        <p className="border-border/60 text-muted border-t px-4 py-3 text-xs">
          This chat is closed. Email{" "}
          <a href={`mailto:${siteConfig.email}`} className="text-accent">
            {siteConfig.email}
          </a>{" "}
          to schedule.
        </p>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void send();
          }}
          className="border-border/60 flex items-end gap-2 border-t p-3"
        >
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void send();
              }
            }}
            rows={1}
            placeholder="e.g. sometime next week, afternoons"
            className="text-foreground max-h-28 flex-1 resize-none bg-transparent px-2 py-2 text-sm outline-none"
          />
          <button
            type="submit"
            disabled={pending || !input.trim()}
            aria-label="Send"
            className="bg-accent text-accent-foreground inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md transition-[filter] hover:brightness-110 disabled:opacity-40"
          >
            <ArrowUp className="h-4 w-4" />
          </button>
        </form>
      )}

      {error ? (
        <p className="border-border/60 border-t px-4 py-2 text-xs text-red-600 dark:text-red-400">
          {error}
        </p>
      ) : null}

      <p className="text-muted border-border/60 border-t px-4 py-2.5 text-[11px] leading-relaxed">
        Your messages are sent to Anthropic (Claude) to read your preferred timing. Nothing is saved
        until you confirm with your full name and email — that books the slot and emails it to
        Harshvardhan.
      </p>
    </div>
  );
}
