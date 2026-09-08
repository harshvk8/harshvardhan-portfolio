import Anthropic from "@anthropic-ai/sdk";
import { NextResponse, type NextRequest } from "next/server";
import { schedulingConfig } from "@/content/scheduling";
import { chatLimiter, dayLimiter, getIp, withinLimits } from "@/lib/ratelimit";
import { siteConfig } from "@/lib/site";
import { describeAvailability, filterSlots, generateSlots } from "@/lib/scheduling/slots";
import type { ChatTurn, MeetingConstraints, ScheduleChatResponse } from "@/lib/scheduling/types";

/** Recruiter-facing scheduling chat. The model turns the conversation into
 *  constraints and writes a short reply; the deterministic engine
 *  (`slots.ts`) produces the actual bookable times. See the Contact page.
 *
 *  Cost control for time-wasters:
 *   - a blunt profanity regex warns with no model call at all
 *   - every turn is first triaged on Haiku; an off-topic message never
 *     reaches Sonnet
 *   - once a visitor has been warned, the full pass also runs on Haiku
 *   - two warnings and the conversation is closed (no further model calls) */

export const runtime = "nodejs";

const SONNET = "claude-sonnet-5"; // per the plan: recruiter-facing scheduling flow
const HAIKU = "claude-haiku-4-5"; // triage, and the full pass once a visitor is flagged
const MAX_TURNS = 12;
const MAX_CHARS = 600;

/** Profanity / hostility — an immediate warning, no model call. Blunt on purpose. */
const PROFANITY =
  /\b(f+u+c+k+\w*|f\*+ck|fuk|motherf\w*|s+h+i+t+\w*|bull ?shit|b+i+t+c+h+\w*|cunt|assh?ole|dick(head)?|bastard|whore|slut|dumbass|jack ?ass|piss off|screw you|n[i1]gg\w*|f[a4]gg?\w*|retard)\b/i;

/** Every warning contains this so strikes can be counted from history alone. */
const OFF_TOPIC_MARK = "I can only help with scheduling";
const WARN_1 = `${OFF_TOPIC_MARK} a call with Harshvardhan. What day works for you?`;
const WARN_2 = `${OFF_TOPIC_MARK}. If your next message isn't about booking a call, I'll close this chat.`;
const ENDED = `Closing this chat here. If you'd like to schedule a call, email ${siteConfig.email}.`;

const EMPTY_CONSTRAINTS: MeetingConstraints = {
  preferredDays: [],
  timeOfDay: [],
  earliestDate: "",
  latestDate: "",
  durationMin: 0,
  theirTimezone: "",
};

const TRIAGE_SYSTEM = [
  "You triage one message for the scheduling assistant on Harshvardhan Kumar Nimesh's portfolio,",
  "where a recruiter books a short intro call with him.",
  "intent='scheduling' if the visitor's message is about arranging that call — availability, days,",
  "times, timezones, duration, logistics, confirming, or a lead-in to it (including short replies",
  "like 'yes', 'next week', or giving a name).",
  "intent='off_topic' for anything else: unrelated questions, homework, coding or medical help,",
  "jokes, tests, roleplay, hostility, sexual or profane content.",
  "When genuinely unsure, choose 'scheduling'.",
].join(" ");

const TRIAGE_TOOL: Anthropic.Tool = {
  name: "triage",
  strict: true,
  description: "Classify the visitor's latest message.",
  input_schema: {
    type: "object",
    additionalProperties: false,
    properties: { intent: { type: "string", enum: ["scheduling", "off_topic"] } },
    required: ["intent"],
  },
};

const TOOL: Anthropic.Tool = {
  name: "propose_meeting_slots",
  strict: true,
  description:
    "Record the meeting constraints extracted from the conversation and a short reply. " +
    "You never state specific open times — the app computes and shows real slots from these fields.",
  input_schema: {
    type: "object",
    additionalProperties: false,
    properties: {
      reply: {
        type: "string",
        description:
          "Reply to the visitor. 1–2 sentences, warm and direct, no lists. If key info is " +
          "missing, end with ONE short question. When showingSlots is true, say you're pulling " +
          "up times (the app shows them as buttons under this message).",
      },
      preferredDays: {
        type: "array",
        items: { type: "string" },
        description:
          'Full weekday names the visitor wants ("Monday"), or "weekday" / "weekend". ' +
          "Empty array if unspecified.",
      },
      timeOfDay: {
        type: "array",
        items: { type: "string", enum: ["morning", "afternoon", "evening"] },
        description: "Parts of the day the visitor prefers. Empty array if unspecified.",
      },
      earliestDate: {
        type: "string",
        description:
          "Earliest acceptable date as YYYY-MM-DD, resolved from today's date given below " +
          '(e.g. "next week" → the Monday of next week). Empty string if unspecified.',
      },
      latestDate: {
        type: "string",
        description: "Latest acceptable date as YYYY-MM-DD, or empty string.",
      },
      durationMin: {
        type: "number",
        description: `Requested meeting length in minutes (${schedulingConfig.durationsMin.join(
          " or ",
        )}). 0 if the visitor didn't say.`,
      },
      theirTimezone: {
        type: "string",
        description:
          "The visitor's own timezone if they mention one (free text, e.g. 'London'). " +
          "Empty string otherwise. Informational only.",
      },
      showingSlots: {
        type: "boolean",
        description:
          "True once there is enough to show times — even a vague 'sometime next week' is enough. " +
          "False only while still asking the first clarifying question.",
      },
      intent: {
        type: "string",
        enum: ["scheduling", "off_topic"],
        description:
          "'scheduling' for anything about booking this call — availability, days, times, timezones, " +
          "duration, logistics, or greetings leading there. 'off_topic' for everything else: " +
          "unrelated questions, jokes, tests, hostility, sexual or profane messages.",
      },
    },
    required: [
      "reply",
      "preferredDays",
      "timeOfDay",
      "earliestDate",
      "latestDate",
      "durationMin",
      "theirTimezone",
      "showingSlots",
      "intent",
    ],
  },
};

function systemPrompt(): string {
  const now = new Date();
  const todayLabel = new Intl.DateTimeFormat("en-US", {
    timeZone: schedulingConfig.timezone,
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(now);
  const todayISO = new Intl.DateTimeFormat("en-CA", {
    timeZone: schedulingConfig.timezone,
  }).format(now);

  return [
    "You are the scheduling assistant on Harshvardhan Kumar Nimesh's developer portfolio.",
    "A recruiter or hiring manager wants a short intro call with him.",
    "",
    `Today is ${todayLabel} (${todayISO}). Harshvardhan's timezone is ${schedulingConfig.timezone} (${schedulingConfig.timezoneLabel}).`,
    "",
    "His weekly availability (he is busy — classes and two IT jobs — at every other time):",
    describeAvailability(schedulingConfig),
    schedulingConfig.notes ? `\nContext: ${schedulingConfig.notes}` : "",
    "",
    "Rules:",
    "1. Replies are 1–2 sentences. Warm, direct, action-oriented. No bullet lists, no filler.",
    "2. Always call propose_meeting_slots. Your job is to extract constraints and write the reply.",
    "3. Never state, guess, or invent a specific open time — the app generates real slots from the",
    "   availability above and shows them as buttons under your reply. You MAY describe the",
    "   availability in general terms (e.g. 'Wednesdays only work in the evening').",
    "4. If they ask about a specific day: tell them his open window(s) that day from the list above,",
    "   or if that day has none, say he's booked that day (classes / work) and offer the nearest days.",
    "5. Move toward times fast. Any hint of timing ('next week', 'Tuesday', 'mornings') is enough —",
    "   set showingSlots true and say you're pulling up times.",
    "6. To CONFIRM, the app needs the visitor's full name and email. Mention this only when they're",
    "   about to pick a slot — not earlier. They can browse times without giving anything.",
    "7. If asked what's required: full name and email to confirm; nothing to look at times.",
    "8. Politely decline anything that isn't about scheduling this call, and set intent='off_topic'.",
    "9. Every tool field is plain text — no XML, tags, or markup inside any value.",
  ]
    .filter(Boolean)
    .join("\n");
}

/** Strip any tool-call / XML markup a model may bleed into a string field. */
function cleanText(v: unknown, max = 400): string {
  if (typeof v !== "string") return "";
  return v
    .replace(/<\/?[a-z_][^>]*>/gi, " ")
    .replace(/<\/?(?:antml|parameter|invoke|function)[^]*$/i, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

function sanitizeTurns(raw: unknown): ChatTurn[] | null {
  if (!Array.isArray(raw)) return null;
  const turns: ChatTurn[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") return null;
    const role = (item as ChatTurn).role;
    const content = (item as ChatTurn).content;
    if (role !== "user" && role !== "assistant") return null;
    if (typeof content !== "string") return null;
    turns.push({ role, content: content.slice(0, MAX_CHARS) });
  }
  return turns.slice(-MAX_TURNS);
}

function warningResponse(priorWarnings: number): NextResponse {
  const payload: ScheduleChatResponse = {
    reply: priorWarnings >= 1 ? WARN_2 : WARN_1,
    slots: [],
    constraints: EMPTY_CONSTRAINTS,
    showingSlots: false,
    warning: true,
  };
  return NextResponse.json(payload);
}

/** Cheap Haiku classification of the latest message. null = call failed. */
async function triageIsOffTopic(client: Anthropic, turns: ChatTurn[]): Promise<boolean | null> {
  const prevAssistant = [...turns].reverse().find((t) => t.role === "assistant");
  const last = turns[turns.length - 1].content;
  const content = prevAssistant
    ? `Assistant: ${prevAssistant.content}\nVisitor: ${last}\n\nClassify the visitor's message.`
    : last;
  try {
    const r = await client.messages.create({
      model: HAIKU,
      max_tokens: 128,
      system: TRIAGE_SYSTEM,
      tools: [TRIAGE_TOOL],
      tool_choice: { type: "tool", name: TRIAGE_TOOL.name },
      messages: [{ role: "user", content }],
    });
    const block = r.content.find((c): c is Anthropic.ToolUseBlock => c.type === "tool_use");
    const intent = (block?.input as { intent?: unknown } | undefined)?.intent;
    return intent === "off_topic";
  } catch (err) {
    console.error("[schedule] triage failed:", err);
    return null;
  }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "The scheduling assistant isn't configured on this deployment." },
      { status: 503 },
    );
  }

  const ip = getIp(req);
  if (!(await withinLimits(ip, [chatLimiter, dayLimiter]))) {
    return NextResponse.json(
      { error: "That's a lot of messages in a short window — try again in a few minutes." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const turns = sanitizeTurns((body as { messages?: unknown }).messages);
  if (!turns || turns.length === 0 || turns[turns.length - 1].role !== "user") {
    return NextResponse.json({ error: "Expected a non-empty message list." }, { status: 400 });
  }

  // Strikes are counted straight from the transcript (both warnings carry
  // OFF_TOPIC_MARK), so the client can't reset them. Two warnings, then the
  // conversation is closed and no further model calls are made.
  const priorWarnings = turns.filter(
    (t) => t.role === "assistant" && t.content.includes(OFF_TOPIC_MARK),
  ).length;
  if (priorWarnings >= 2) {
    const ended: ScheduleChatResponse = {
      reply: ENDED,
      slots: [],
      constraints: EMPTY_CONSTRAINTS,
      showingSlots: false,
      ended: true,
    };
    return NextResponse.json(ended);
  }

  const lastUserContent = turns[turns.length - 1].content;
  const client = new Anthropic({ apiKey });

  // 1. Zero-cost gate.
  if (PROFANITY.test(lastUserContent)) return warningResponse(priorWarnings);

  // 2. Cheap Haiku triage before spending Sonnet. Skipped once a visitor has
  //    been warned — the full pass below then runs on Haiku and classifies
  //    inline, so no Sonnet call is ever spent on a flagged conversation.
  if (priorWarnings === 0) {
    const offTopic = await triageIsOffTopic(client, turns);
    if (offTopic === true) return warningResponse(priorWarnings);
  }

  // 3. Full extraction pass. Haiku once flagged, Sonnet otherwise.
  const heavyModel = priorWarnings >= 1 ? HAIKU : SONNET;
  let toolInput:
    (MeetingConstraints & { reply: string; showingSlots: boolean; intent: string }) | null = null;
  try {
    const response = await client.messages.create({
      model: heavyModel,
      max_tokens: 800,
      ...(heavyModel === SONNET ? { output_config: { effort: "medium" as const } } : {}),
      system: systemPrompt(),
      tools: [TOOL],
      tool_choice: { type: "tool", name: TOOL.name },
      messages: turns.map((t) => ({ role: t.role, content: t.content })),
    });

    const block = response.content.find((c): c is Anthropic.ToolUseBlock => c.type === "tool_use");
    if (block) {
      const input = block.input as Record<string, unknown>;
      const isoDate = (v: unknown) =>
        typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v) ? v : "";
      toolInput = {
        reply: cleanText(input.reply, 600),
        preferredDays: Array.isArray(input.preferredDays)
          ? input.preferredDays
              .map((d) => cleanText(d, 20))
              .filter(Boolean)
              .slice(0, 7)
          : [],
        timeOfDay: Array.isArray(input.timeOfDay)
          ? (input.timeOfDay.filter(
              (t) => t === "morning" || t === "afternoon" || t === "evening",
            ) as MeetingConstraints["timeOfDay"])
          : [],
        earliestDate: isoDate(input.earliestDate),
        latestDate: isoDate(input.latestDate),
        durationMin: typeof input.durationMin === "number" ? input.durationMin : 0,
        theirTimezone: cleanText(input.theirTimezone, 60),
        showingSlots: input.showingSlots === true,
        intent: input.intent === "off_topic" ? "off_topic" : "scheduling",
      };
    }
  } catch (err) {
    if (err instanceof Anthropic.RateLimitError) {
      return NextResponse.json(
        { error: "The assistant is busy right now — try again in a moment." },
        { status: 429 },
      );
    }
    console.error("[schedule] model call failed:", err);
    return NextResponse.json(
      { error: "The assistant hit an error. Email works too — see the options above." },
      { status: 502 },
    );
  }

  if (!toolInput || !toolInput.reply) {
    return NextResponse.json(
      { error: "The assistant didn't respond cleanly — try rephrasing." },
      { status: 502 },
    );
  }

  const { reply, showingSlots, intent, ...constraints } = toolInput;

  // Full pass still flagged it off-topic (e.g. triage was lenient / skipped).
  if (intent === "off_topic") return warningResponse(priorWarnings);

  let slots: ScheduleChatResponse["slots"] = [];
  let note: string | undefined;
  if (showingSlots) {
    const all = generateSlots(schedulingConfig, new Date());
    const result = filterSlots(schedulingConfig, all, constraints);
    slots = result.slots;
    note = result.note;
  }

  const payload: ScheduleChatResponse = { reply, slots, constraints, showingSlots, note };
  return NextResponse.json(payload);
}
