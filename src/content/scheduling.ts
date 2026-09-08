import { z } from "zod";

/**
 * Availability for the AI scheduling assistant on the Contact page.
 *
 * This is the single source of truth the deterministic slot engine
 * (`src/lib/scheduling/slots.ts`) reads. The Claude model never invents
 * times — it only turns a recruiter's message into constraints, and the
 * engine generates concrete slots from the config below and filters them.
 * If a request falls outside these windows the assistant says so and
 * offers the nearest open slots.
 *
 * EDIT THESE VALUES. Everything is expressed in `timezone` local time.
 */

const hhmm = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "time must be 24-hour HH:MM");

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "date must be YYYY-MM-DD");

export const schedulingConfigSchema = z.object({
  /** IANA timezone name. All windows/labels are computed in this zone. */
  timezone: z.string().min(1),
  /** Short label shown to visitors, e.g. "ET". */
  timezoneLabel: z.string().min(1),
  /**
   * Recurring weekly availability — the times Harshvardhan is FREE for a
   * call. `day` is 0 (Sunday) .. 6 (Saturday). Anything not covered here is
   * treated as busy (classes, labs, two IT jobs). Multiple windows per day
   * are allowed. Optional `note` is surfaced to the visitor for that slot.
   */
  weekly: z
    .array(
      z.object({
        day: z.number().int().min(0).max(6),
        start: hhmm,
        end: hhmm,
        note: z.string().optional(),
      }),
    )
    .min(1),
  /** Meeting lengths offered, in minutes. The first is the default. */
  durationsMin: z.array(z.number().int().positive()).min(1),
  /** Granularity of start times, in minutes (e.g. 30 → :00 and :30). */
  slotStepMin: z.number().int().positive(),
  /** Earliest a meeting may be booked, measured from now. */
  leadTimeHours: z.number().int().nonnegative(),
  /** How far ahead slots are offered. */
  horizonDays: z.number().int().positive(),
  /** Full days with no availability (exams, travel), as YYYY-MM-DD. */
  blackoutDates: z.array(isoDate).default([]),
  /** Free-text context the assistant can pass on to the visitor. */
  notes: z.string().optional(),
});

export type SchedulingConfig = z.infer<typeof schedulingConfigSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Harshvardhan's real weekly schedule (America/New_York).
//
//   Mon   8:00–9:25 class · 12:00–1:25 class · then free
//   Tue   8:00–9:25 class · 12:00–1:25 class · 2:00–3:25 class · 6:00–10:00 IT
//   Wed   8:00–9:25 class · 12:00–1:25 class · (sometimes 2:00–3:30 meeting) ·
//         3:40–6:25 bio lab · then free
//   Thu   same as Tue, plus 4:00–11:00 IT
//   Fri   8:00 AM–12:00 PM IT · 1:00–6:00 PM IT · then free  (12–1 gap too tight)
//   Sat   working remotely — can take a 30-min call; audio easiest
//   Sun   same as Saturday — working remotely, a 30-min call is doable
//
// The mid-day gap (≈9:25–12:00) is free every weekday. Windows below add a
// buffer around each class/shift. Trim or extend to taste.
// ─────────────────────────────────────────────────────────────────────────────
const schedulingData: z.input<typeof schedulingConfigSchema> = {
  timezone: "America/New_York",
  timezoneLabel: "ET",
  weekly: [
    // Monday — mid-day gap, then open all afternoon
    { day: 1, start: "10:00", end: "11:30" },
    { day: 1, start: "13:30", end: "18:00" },

    // Tuesday — mid-day gap, then after the 2–3:25 class before the 6pm IT job
    { day: 2, start: "10:00", end: "11:30" },
    { day: 2, start: "15:45", end: "17:45" },

    // Wednesday — mid-day gap, then evening after bio lab
    { day: 3, start: "10:00", end: "11:30" },
    { day: 3, start: "18:45", end: "20:15", note: "evening" },

    // Thursday — mid-day gap only (4pm–11pm IT job kills the afternoon)
    { day: 4, start: "10:00", end: "11:30" },

    // Friday — only opens up in the evening
    { day: 5, start: "18:30", end: "20:00", note: "evening" },

    // Weekend — working remotely, but a 30-min call fits; audio easiest
    { day: 6, start: "10:00", end: "16:00", note: "remote / audio" },
    { day: 0, start: "10:00", end: "16:00", note: "remote / audio" },
  ],
  durationsMin: [30],
  slotStepMin: 30,
  leadTimeHours: 24,
  horizonDays: 14,
  blackoutDates: [],
  notes:
    "Weekday openings are the late-morning gap between classes; Monday afternoons are wide open. " +
    "Wednesday and Friday only work in the evening. Weekend calls (Sat/Sun) are remote while he's " +
    "working — audio is easiest, video is possible but harder.",
};

export const schedulingConfig = schedulingConfigSchema.parse(schedulingData);
