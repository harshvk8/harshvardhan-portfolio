import Anthropic from "@anthropic-ai/sdk";
import { NextResponse, type NextRequest } from "next/server";
import { schedulingConfig } from "@/content/scheduling";
import { chatLimiter, dayLimiter, getIp, withinLimits } from "@/lib/ratelimit";
import { filterSlots, generateSlots } from "@/lib/scheduling/slots";
import type { ChatTurn, MeetingConstraints, ScheduleChatResponse } from "@/lib/scheduling/types";

/** Recruiter-facing scheduling chat. The model turns the conversation into
 *  constraints and writes a short reply; the deterministic engine
 *  (`slots.ts`) produces the actual bookable times. See the Contact page. */

export const runtime = "nodejs";

const MODEL = "claude-sonnet-5"; // per the plan: fast, instruction-following, recruiter-facing
const MAX_TURNS = 12;
const MAX_CHARS = 600;

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
    "Rules:",
    "1. Replies are 1–2 sentences. Warm, direct, action-oriented. No bullet lists, no filler.",
    "2. Always call propose_meeting_slots. Your job is to extract constraints and write the reply.",
    "3. You do NOT have his calendar. Never state, guess, or imply specific open times — the app",
    "   generates real slots from his availability and shows them as buttons under your reply.",
    "4. Move toward times fast. Any hint of timing ('next week', 'Tuesday', 'mornings') is enough —",
    "   set showingSlots true and say you're pulling up times.",
    "5. To CONFIRM, the app needs the visitor's name and email. Mention this only when they're about",
    "   to pick a slot — not earlier. They can browse times without giving anything.",
    "6. If asked what's required: name and email to confirm; nothing to look at times.",
    "7. Politely decline anything that isn't about scheduling this call.",
  ].join("\n");
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

  const client = new Anthropic({ apiKey });

  let toolInput: (MeetingConstraints & { reply: string; showingSlots: boolean }) | null = null;
  try {
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 800,
      output_config: { effort: "low" },
      system: systemPrompt(),
      tools: [TOOL],
      tool_choice: { type: "tool", name: TOOL.name },
      messages: turns.map((t) => ({ role: t.role, content: t.content })),
    });

    const block = response.content.find((c): c is Anthropic.ToolUseBlock => c.type === "tool_use");
    if (block) {
      const input = block.input as Record<string, unknown>;
      toolInput = {
        reply: typeof input.reply === "string" ? input.reply : "",
        preferredDays: Array.isArray(input.preferredDays) ? (input.preferredDays as string[]) : [],
        timeOfDay: Array.isArray(input.timeOfDay)
          ? (input.timeOfDay as MeetingConstraints["timeOfDay"])
          : [],
        earliestDate: typeof input.earliestDate === "string" ? input.earliestDate : "",
        latestDate: typeof input.latestDate === "string" ? input.latestDate : "",
        durationMin: typeof input.durationMin === "number" ? input.durationMin : 0,
        theirTimezone: typeof input.theirTimezone === "string" ? input.theirTimezone : "",
        showingSlots: input.showingSlots === true,
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

  const { reply, showingSlots, ...constraints } = toolInput;

  let slots: ScheduleChatResponse["slots"] = [];
  let note: string | undefined;
  if (showingSlots) {
    const all = generateSlots(schedulingConfig, new Date());
    const result = filterSlots(schedulingConfig, all, constraints);
    slots = result.slots;
    note = result.note;
  }

  const payload: ScheduleChatResponse = {
    reply,
    slots,
    constraints,
    showingSlots,
    note,
  };
  return NextResponse.json(payload);
}
