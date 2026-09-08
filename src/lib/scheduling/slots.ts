import type { SchedulingConfig } from "@/content/scheduling";
import type { MeetingConstraints, MeetingSlot, TimeOfDay } from "./types";

/**
 * Deterministic slot engine. Given the hand-maintained availability config
 * and "now", it produces every concrete bookable slot in the horizon. The
 * Claude model's only influence is the `constraints` passed to `filterSlots`
 * — it can never introduce a time that isn't generated here, so any slot the
 * UI shows is provably inside Harshvardhan's stated availability and lead time.
 */

const DAY_MS = 86_400_000;

/** Minutes that local wall-clock time is ahead of UTC, for `at`, in `timeZone`. */
function zoneOffsetMs(timeZone: string, at: Date): number {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const p: Record<string, number> = {};
  for (const part of dtf.formatToParts(at)) {
    if (part.type !== "literal") p[part.type] = Number(part.value);
  }
  const asUTC = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second);
  return asUTC - at.getTime();
}

/** UTC instant for a wall-clock date/time in `timeZone` (two-pass, DST-safe). */
function zonedTimeToUtc(
  timeZone: string,
  y: number,
  m: number,
  d: number,
  hh: number,
  mm: number,
): Date {
  const guess = Date.UTC(y, m - 1, d, hh, mm);
  const o1 = zoneOffsetMs(timeZone, new Date(guess));
  let utc = guess - o1;
  const o2 = zoneOffsetMs(timeZone, new Date(utc));
  if (o2 !== o1) utc = guess - o2;
  return new Date(utc);
}

/** The calendar Y/M/D shown in `timeZone` for instant `at`. */
function ymdInZone(timeZone: string, at: Date): { y: number; m: number; d: number } {
  const dtf = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const [y, m, d] = dtf.format(at).split("-").map(Number);
  return { y, m, d };
}

/** The hour (0–23) shown in `timeZone` for instant `at`. */
function hourInZone(timeZone: string, at: Date): number {
  return Number(
    new Intl.DateTimeFormat("en-US", { timeZone, hour: "2-digit", hourCycle: "h23" }).format(at),
  );
}

function isoDate(y: number, m: number, d: number): string {
  return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

function parseHHMM(s: string): number {
  const [h, m] = s.split(":").map(Number);
  return h * 60 + m;
}

function labelFor(config: SchedulingConfig, start: Date, end: Date): string {
  const day = new Intl.DateTimeFormat("en-US", {
    timeZone: config.timezone,
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(start);
  const t = (at: Date) =>
    new Intl.DateTimeFormat("en-US", {
      timeZone: config.timezone,
      hour: "numeric",
      minute: "2-digit",
    }).format(at);
  return `${day} · ${t(start)}–${t(end)} ${config.timezoneLabel}`;
}

/** Every bookable slot from `now` to the end of the horizon. */
export function generateSlots(config: SchedulingConfig, now: Date): MeetingSlot[] {
  const earliest = now.getTime() + config.leadTimeHours * 3_600_000;
  const today = ymdInZone(config.timezone, now);
  const anchor = Date.UTC(today.y, today.m - 1, today.d);
  const slots: MeetingSlot[] = [];
  const seen = new Set<string>();

  for (let offset = 0; offset <= config.horizonDays; offset++) {
    const cal = new Date(anchor + offset * DAY_MS);
    const y = cal.getUTCFullYear();
    const m = cal.getUTCMonth() + 1;
    const d = cal.getUTCDate();
    const weekday = cal.getUTCDay();

    if (config.blackoutDates.includes(isoDate(y, m, d))) continue;

    for (const w of config.weekly) {
      if (w.day !== weekday) continue;
      const winStart = parseHHMM(w.start);
      const winEnd = parseHHMM(w.end);

      for (const durationMin of config.durationsMin) {
        for (let t = winStart; t + durationMin <= winEnd; t += config.slotStepMin) {
          const start = zonedTimeToUtc(config.timezone, y, m, d, Math.floor(t / 60), t % 60);
          if (start.getTime() < earliest) continue;
          const end = new Date(start.getTime() + durationMin * 60_000);
          const id = `${start.toISOString()}_${durationMin}`;
          if (seen.has(id)) continue;
          seen.add(id);
          slots.push({
            id,
            startISO: start.toISOString(),
            endISO: end.toISOString(),
            durationMin,
            label: labelFor(config, start, end),
          });
        }
      }
    }
  }

  slots.sort((a, b) => a.startISO.localeCompare(b.startISO) || a.durationMin - b.durationMin);
  return slots;
}

const TOD_RANGES: Record<TimeOfDay, [number, number]> = {
  morning: [0, 12],
  afternoon: [12, 17],
  evening: [17, 24],
};

/** Weekday name shown in `timeZone` for instant `at`. */
function weekdayNameInZone(timeZone: string, at: Date): string {
  return new Intl.DateTimeFormat("en-US", { timeZone, weekday: "long" }).format(at);
}

function matchesDay(config: SchedulingConfig, slot: MeetingSlot, wanted: string[]): boolean {
  if (wanted.length === 0) return true;
  const name = weekdayNameInZone(config.timezone, new Date(slot.startISO));
  const lower = wanted.map((w) => w.toLowerCase());
  const isWeekend = name === "Saturday" || name === "Sunday";
  if (lower.includes("weekday") && !isWeekend) return true;
  if (lower.includes("weekend") && isWeekend) return true;
  return lower.includes(name.toLowerCase());
}

function matchesTimeOfDay(config: SchedulingConfig, slot: MeetingSlot, tod: TimeOfDay[]): boolean {
  if (tod.length === 0) return true;
  const h = hourInZone(config.timezone, new Date(slot.startISO));
  return tod.some((band) => {
    const [lo, hi] = TOD_RANGES[band];
    return h >= lo && h < hi;
  });
}

/**
 * Narrow generated slots by the model's extracted constraints. Returns at
 * most `limit`. If nothing matches, widens: drops time-of-day, then day,
 * then date bounds — and reports what it relaxed via `note`.
 */
export function filterSlots(
  config: SchedulingConfig,
  all: MeetingSlot[],
  c: MeetingConstraints,
  limit = 6,
): { slots: MeetingSlot[]; note?: string } {
  const validDurations = new Set(config.durationsMin);
  const wantDuration = validDurations.has(c.durationMin) ? c.durationMin : 0;

  const byDate = (s: MeetingSlot) => {
    const date = s.startISO.slice(0, 10);
    if (c.earliestDate && date < c.earliestDate) return false;
    if (c.latestDate && date > c.latestDate) return false;
    return true;
  };
  const byDuration = (s: MeetingSlot) => (wantDuration ? s.durationMin === wantDuration : true);

  const full = all.filter(
    (s) =>
      byDate(s) &&
      byDuration(s) &&
      matchesDay(config, s, c.preferredDays) &&
      matchesTimeOfDay(config, s, c.timeOfDay),
  );
  if (full.length) return { slots: dedupeByStart(full).slice(0, limit) };

  const noTod = all.filter(
    (s) => byDate(s) && byDuration(s) && matchesDay(config, s, c.preferredDays),
  );
  if (noTod.length)
    return {
      slots: dedupeByStart(noTod).slice(0, limit),
      note: "Nothing in that part of the day is open — here's what's free on those days.",
    };

  const noDay = all.filter((s) => byDate(s) && byDuration(s));
  if (noDay.length)
    return {
      slots: dedupeByStart(noDay).slice(0, limit),
      note: "Those days are full — these are the nearest open times.",
    };

  return {
    slots: dedupeByStart(all.filter(byDuration)).slice(0, limit),
    note: "Nothing matched that window — here are the soonest available times.",
  };
}

/** One slot per start instant (prefer the default/first duration). */
function dedupeByStart(slots: MeetingSlot[]): MeetingSlot[] {
  const out: MeetingSlot[] = [];
  const seen = new Set<string>();
  for (const s of slots) {
    const key = s.startISO;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(s);
  }
  return out;
}

/**
 * Re-derive slots and confirm `startISO` is a real, still-bookable slot.
 * Called on the confirm path so a tampered or stale slot is rejected.
 */
export function findBookableSlot(
  config: SchedulingConfig,
  now: Date,
  startISO: string,
): MeetingSlot | null {
  const start = new Date(startISO);
  if (Number.isNaN(start.getTime())) return null;
  return generateSlots(config, now).find((s) => s.startISO === start.toISOString()) ?? null;
}
