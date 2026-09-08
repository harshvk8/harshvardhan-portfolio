import { promises as dns } from "node:dns";
import { NextResponse, type NextRequest } from "next/server";
import { schedulingConfig } from "@/content/scheduling";
import { siteConfig } from "@/lib/site";
import { confirmLimiter, dayLimiter, getIp, withinLimits } from "@/lib/ratelimit";
import { findBookableSlot } from "@/lib/scheduling/slots";
import type { ScheduleConfirmResponse } from "@/lib/scheduling/types";

/** Finalises a meeting the visitor picked in the scheduling chat. Re-derives
 *  the slot from availability (a stale or tampered time is rejected), checks
 *  the email domain can actually receive mail, then notifies Harshvardhan by
 *  email when Resend is configured. */

export const runtime = "nodejs";

const EMAIL_RE = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,}$/;

/** Common throwaway/test domains — reject outright. */
const DISPOSABLE = new Set([
  "example.com",
  "example.org",
  "test.com",
  "test.test",
  "mailinator.com",
  "guerrillamail.com",
  "10minutemail.com",
  "tempmail.com",
  "trashmail.com",
  "yopmail.com",
  "sharklasers.com",
  "getnada.com",
]);

/**
 * Does this domain accept mail? true → has MX or an address record;
 * false → the domain resolves nothing usable; null → DNS itself failed
 * (transient), so the caller shouldn't hold it against the visitor.
 */
async function emailDomainReachable(domain: string): Promise<boolean | null> {
  try {
    const mx = await dns.resolveMx(domain);
    return mx.some((r) => r.exchange);
  } catch (err) {
    const code = (err as NodeJS.ErrnoException).code;
    if (code === "ENOTFOUND" || code === "ENODATA") {
      // No MX record — a domain can still receive mail on its A/AAAA record.
      try {
        await dns.lookup(domain);
        return true;
      } catch {
        return false;
      }
    }
    console.error("[schedule] MX lookup error for", domain, code);
    return null;
  }
}

function validPhone(raw: string): boolean {
  if (!/^[+(]?[\d\s().-]{6,}$/.test(raw)) return false;
  const digits = raw.replace(/\D/g, "");
  return digits.length >= 7 && digits.length <= 15;
}

function icsStamp(d: Date): string {
  return d
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}Z$/, "Z");
}

function buildIcs(
  start: Date,
  end: Date,
  name: string,
  email: string,
  phone: string,
  note: string,
): string {
  const desc = ["Requested via the portfolio scheduling assistant."];
  if (phone) desc.push(`Phone: ${phone}`);
  if (note) desc.push(`Note: ${note.replace(/\n/g, " ")}`);
  return [
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
    `DESCRIPTION:${desc.join(" ")}`,
    `ORGANIZER;CN=${siteConfig.name}:mailto:${siteConfig.email}`,
    `ATTENDEE;CN=${name};RSVP=TRUE:mailto:${email}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
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
  phone: string;
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
        (params.phone ? ` — ${params.phone}` : "") +
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
          `When:  ${params.slotLabel}`,
          `Start: ${params.start.toISOString()}`,
          `End:   ${params.end.toISOString()}`,
          params.phone ? `Phone: ${params.phone}` : "",
          params.note ? `\nNote:\n${params.note}` : "",
          ``,
          `Sent by the portfolio scheduling assistant.`,
        ]
          .filter((l) => l !== "")
          .join("\n"),
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
    slot?: { startISO?: unknown; endISO?: unknown };
    name?: unknown;
    email?: unknown;
    phone?: unknown;
    note?: unknown;
  };
  const name = typeof b.name === "string" ? b.name.trim() : "";
  const email = typeof b.email === "string" ? b.email.trim() : "";
  const phone = typeof b.phone === "string" ? b.phone.trim().slice(0, 40) : "";
  const note = typeof b.note === "string" ? b.note.trim().slice(0, 1000) : "";
  const startISO = typeof b.slot?.startISO === "string" ? b.slot.startISO : "";
  const endISO = typeof b.slot?.endISO === "string" ? b.slot.endISO : undefined;

  const nameParts = name.split(/\s+/).filter((p) => /\p{L}/u.test(p));
  if (nameParts.length < 2 || name.length > 100) {
    return NextResponse.json({ error: "Please enter your first and last name." }, { status: 400 });
  }

  if (!EMAIL_RE.test(email) || email.length > 200) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }
  const domain = email.slice(email.lastIndexOf("@") + 1).toLowerCase();
  if (DISPOSABLE.has(domain)) {
    return NextResponse.json(
      { error: "Please use a real email address so the meeting can be confirmed." },
      { status: 400 },
    );
  }
  const reachable = await emailDomainReachable(domain);
  if (reachable === false) {
    return NextResponse.json(
      { error: "That email domain can't receive mail — check for a typo." },
      { status: 400 },
    );
  }

  if (phone && !validPhone(phone)) {
    return NextResponse.json(
      { error: "That phone number doesn't look right — fix it or leave it blank." },
      { status: 400 },
    );
  }

  const slot = findBookableSlot(schedulingConfig, new Date(), startISO, endISO);
  if (!slot) {
    return NextResponse.json(
      { error: "That time is no longer available. Pick another slot." },
      { status: 409 },
    );
  }

  const start = new Date(slot.startISO);
  const end = new Date(slot.endISO);
  const slotLabel = slot.note ? `${slot.label} · ${slot.note}` : slot.label;
  const notified = await notify({ name, email, phone, note, slotLabel, start, end });

  const payload: ScheduleConfirmResponse = {
    ok: true,
    slotLabel,
    calendar: {
      googleUrl: googleUrl(start, end, name),
      ics: buildIcs(start, end, name, email, phone, note),
    },
    notified,
  };
  return NextResponse.json(payload);
}
