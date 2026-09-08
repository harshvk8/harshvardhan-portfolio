import { z } from "zod";

/**
 * Availability for the AI scheduling assistant on the Contact page.
 *
 * This is the single source of truth the deterministic slot engine
 * (`src/lib/scheduling/slots.ts`) reads. The Claude model never invents
 * times — it only turns a recruiter's message into constraints, and the
 * engine generates concrete slots from the config below and filters them.
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
   * Recurring weekly availability. `day` is 0 (Sunday) .. 6 (Saturday).
   * Multiple windows per day are allowed (add more entries).
   */
  weekly: z
    .array(
      z.object({
        day: z.number().int().min(0).max(6),
        start: hhmm,
        end: hhmm,
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
  /** Full days with no availability (holidays, travel), as YYYY-MM-DD. */
  blackoutDates: z.array(isoDate).default([]),
});

export type SchedulingConfig = z.infer<typeof schedulingConfigSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// EDIT ME — Harshvardhan's real availability.
// Placeholder: weekday late afternoons ET, plus Wednesday late morning.
// ─────────────────────────────────────────────────────────────────────────────
const schedulingData: z.input<typeof schedulingConfigSchema> = {
  timezone: "America/New_York",
  timezoneLabel: "ET",
  weekly: [
    { day: 1, start: "16:00", end: "18:30" }, // Monday
    { day: 2, start: "16:00", end: "18:30" }, // Tuesday
    { day: 3, start: "10:30", end: "12:00" }, // Wednesday
    { day: 3, start: "16:00", end: "18:30" }, // Wednesday
    { day: 4, start: "16:00", end: "18:30" }, // Thursday
  ],
  durationsMin: [30, 20],
  slotStepMin: 30,
  leadTimeHours: 24,
  horizonDays: 14,
  blackoutDates: [],
};

export const schedulingConfig = schedulingConfigSchema.parse(schedulingData);
