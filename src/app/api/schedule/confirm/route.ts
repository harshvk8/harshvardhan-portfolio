import { NextResponse, type NextRequest } from "next/server";
import { schedulingConfig } from "@/content/scheduling";
import { siteConfig } from "@/lib/site";
import { confirmLimiter, dayLimiter, getIp, withinLimits } from "@/lib/ratelimit";
import { findBookableSlot } from "@/lib/scheduling/slots";
import type { ScheduleConfirmResponse } from "@/lib/scheduling/types";

/** Finalises a meeting the visitor picked in the scheduling chat. Re-derives
 *  the slot from availability (a stale or tampered time is rejected), then
 *  notifies Harshvardhan by email when Resend is configured. */

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function icsStamp(d: Date): string {
  return d
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}Z$/, "Z");
}

function buildIcs(start: Date, end: Date, name: string, email: string, note: string): string {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//harshvardhan portfolio//scheduling//EN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${icsStamp(start)}-${Math.random().toString(36).slice(2)}@harshvardhan.portfolio`,
    `DTSTAMP:${icsStamp(new Date())}`,
    `DTSTART:${icsStamp(start)}`,
    `DTEND:${icsStamp(end)}`,
    `SUMMARY:Intro call — ${name} × ${siteConfig.name}`,
    `DESCRIPTION:Requested via the portfolio scheduling assistant.${
      note ? ` Note: ${note.replace(/\n/g, " ")}` : ""
    }`,
    `ORGANIZER;CN=${siteConfig.name}:mailto:${siteConfig.email}`,
    `ATTENDEE;CN=${name};RSVP=TRUE:mailto:${email}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return lines.join("\r\n");
}

function googleUrl(start: Date, end: Date, name: string): string {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `Intro call — ${name} × ${siteConfig.name}`,
    dates: `${icsStamp(start)}/${icsStamp(end)}`,
    details: "Requested via the portfolio scheduling assistant.",
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

async function notify(params: {
  name: string;
  email: string;
  note: string;
  slotLabel: string;
  start: Date;
  end: Date;
}): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.SCHEDULE_NOTIFY_EMAIL || siteConfig.email;
  const from = process.env.SCHEDULE_FROM_EMAIL || "Portfolio Scheduler <onboarding@resend.dev>";
  if (!key) {
    console.warn(
      `[schedule] booking (no email configured): ${params.slotLabel} — ${params.name} <${params.email}>` +
        (params.note ? ` — "${params.note}"` : ""),
    );
    return false;
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to,
        reply_to: params.email,
        subject: `Meeting request — ${params.name} — ${params.slotLabel}`,
        text: [
          `${params.name} <${params.email}> booked an intro call.`,
          ``,
          `When: ${params.slotLabel}`,
          `Start: ${params.start.toISOString()}`,
          `End:   ${params.end.toISOString()}`,
          params.note ? `\nNote:\n${params.note}` : "",
          ``,
          `Sent by the portfolio scheduling assistant.`,
        ].join("\n"),
      }),
    });
    if (!res.ok) {
      console.error("[schedule] Resend responded", res.status, await res.text());
      return false;
    }
    return true;
  } catch (err) {
    console.error("[schedule] notify failed:", err);
    return false;
  }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const ip = getIp(req);
  if (!(await withinLimits(ip, [confirmLimiter, dayLimiter]))) {
    return NextResponse.json(
      { error: "Too many booking attempts today. Email me directly — see the options above." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const b = body as {
    slot?: { startISO?: unknown };
    name?: unknown;
    email?: unknown;
    note?: unknown;
  };
  const name = typeof b.name === "string" ? b.name.trim() : "";
  const email = typeof b.email === "string" ? b.email.trim() : "";
  const note = typeof b.note === "string" ? b.note.trim().slice(0, 1000) : "";
  const startISO = typeof b.slot?.startISO === "string" ? b.slot.startISO : "";

  if (name.length < 2 || name.length > 100) {
    return NextResponse.json({ error: "Please enter your name." }, { status: 400 });
  }
  if (!EMAIL_RE.test(email) || email.length > 200) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  const slot = findBookableSlot(schedulingConfig, new Date(), startISO);
  if (!slot) {
    return NextResponse.json(
      { error: "That time is no longer available. Pick another slot." },
      { status: 409 },
    );
  }

  const start = new Date(slot.startISO);
  const end = new Date(slot.endISO);
  const notified = await notify({ name, email, note, slotLabel: slot.label, start, end });

  const payload: ScheduleConfirmResponse = {
    ok: true,
    slotLabel: slot.label,
    calendar: {
      googleUrl: googleUrl(start, end, name),
      ics: buildIcs(start, end, name, email, note),
    },
    notified,
  };
  return NextResponse.json(payload);
}
