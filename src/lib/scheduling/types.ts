/** Shared types for the AI scheduling assistant (Contact page). */

export type ChatRole = "user" | "assistant";

export type ChatTurn = { role: ChatRole; content: string };

export type TimeOfDay = "morning" | "afternoon" | "evening";

/**
 * What the Claude model extracts from the conversation. It never contains
 * concrete times — the deterministic engine turns these into real slots.
 */
export type MeetingConstraints = {
  /** Full weekday names ("Monday") and/or "weekday" / "weekend". */
  preferredDays: string[];
  timeOfDay: TimeOfDay[];
  /** YYYY-MM-DD, or "" if unspecified. */
  earliestDate: string;
  latestDate: string;
  /** 0 when unspecified; otherwise one of the configured durations. */
  durationMin: number;
  /** Free text if the recruiter mentioned their own timezone; informational. */
  theirTimezone: string;
};

/** A concrete, bookable slot produced by the engine. */
export type MeetingSlot = {
  /** Stable id derived from the start instant. */
  id: string;
  startISO: string;
  endISO: string;
  durationMin: number;
  /** Human label in the host's timezone, e.g. "Wed, Sep 9 · 4:00–4:30 PM ET". */
  label: string;
  /** Optional per-window tag, e.g. "remote / audio". */
  note?: string;
};

export type ScheduleChatRequest = {
  messages: ChatTurn[];
};

export type ScheduleChatResponse = {
  reply: string;
  slots: MeetingSlot[];
  constraints: MeetingConstraints;
  /** True once the model believes it has enough to show times. */
  showingSlots: boolean;
  /** Set when slots is empty because nothing matched — the engine widened. */
  note?: string;
  /** This turn was an off-topic / profane message and got a warning. */
  warning?: boolean;
  /** The conversation is closed (too many off-topic messages). The client
   *  should stop accepting input; no further requests will be answered. */
  ended?: boolean;
};

export type ScheduleConfirmRequest = {
  slot: { startISO: string; endISO: string };
  name: string;
  email: string;
  /** Optional direct or business phone number. */
  phone?: string;
  note?: string;
};

export type ScheduleConfirmResponse = {
  ok: true;
  slotLabel: string;
  /** Links the visitor can use to add the meeting to their own calendar. */
  calendar: { googleUrl: string; ics: string };
  /** Whether Harshvardhan was actually notified (email configured). */
  notified: boolean;
};
