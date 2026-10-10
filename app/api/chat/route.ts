import { buildSystemPrompt, getClient } from "@/lib/clients";
import { sendLeadEmail, type Lead } from "@/lib/notify";

type Msg = { role: "user" | "assistant"; content: string };

const MODEL = process.env.OPENAI_MODEL || "gpt-4.1-mini";
const MAX_MESSAGES = 30;
const MAX_CHARS = 1500;

// Very small in-memory rate limit (per server instance). Enough to stop casual abuse in a demo.
const hits = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now();
  const arr = (hits.get(ip) || []).filter((t) => now - t < 60_000);
  arr.push(now);
  hits.set(ip, arr);
  return arr.length > 20;
}

const SAVE_LEAD_TOOL = {
  type: "function",
  name: "save_lead",
  description:
    "Save the lead and notify the business. Call once, only after you have the person's name, a phone or email, and what they need.",
  strict: true,
  parameters: {
    type: "object",
    additionalProperties: false,
    properties: {
      name: { type: "string" },
      contact: { type: "string", description: "Phone number or email" },
      summary: { type: "string", description: "One or two sentences on what they need" },
      urgency: { type: "string", enum: ["low", "medium", "high"] },
      details: {
        type: "array",
        description: "Other collected facts as label/value pairs, e.g. Matter type, Deadline, Preferred time",
        items: {
          type: "object",
          additionalProperties: false,
          properties: { label: { type: "string" }, value: { type: "string" } },
          required: ["label", "value"],
        },
      },
    },
    required: ["name", "contact", "summary", "urgency", "details"],
  },
};

type OutputItem = {
  type: string;
  call_id?: string;
  name?: string;
  arguments?: string;
  content?: { type: string; text?: string }[];
};

async function callOpenAI(apiKey: string, instructions: string, input: unknown[]) {
  const res = await fetch(`${process.env.OPENAI_BASE_URL || "https://api.openai.com/v1"}/responses`, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODEL,
      instructions,
      input,
      tools: [SAVE_LEAD_TOOL],
      max_output_tokens: 400,
      store: false,
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`openai ${res.status}: ${text.slice(0, 300)}`);
  }
  return (await res.json()) as { output: OutputItem[] };
}

function textOf(output: OutputItem[]) {
  return output
    .filter((o) => o.type === "message")
    .flatMap((o) => o.content || [])
    .filter((c) => c.type === "output_text")
    .map((c) => c.text || "")
    .join("")
    .trim();
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (limited(ip)) return Response.json({ error: "Too many messages, please slow down." }, { status: 429 });

  let body: { client?: string; messages?: Msg[] };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Bad request" }, { status: 400 });
  }

  const client = getClient(body.client);
  if (!client) return Response.json({ error: "Unknown client" }, { status: 400 });

  const messages = (body.messages || [])
    .filter((m) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .slice(-MAX_MESSAGES)
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_CHARS) }));
  if (!messages.length || messages[messages.length - 1].role !== "user")
    return Response.json({ error: "No message" }, { status: 400 });

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey)
    return Response.json(
      { reply: "I'm not fully set up yet. Please leave your name and phone number and the team will contact you.", error: "no_key" },
      { status: 200 },
    );

  const instructions = buildSystemPrompt(client);
  try {
    const first = await callOpenAI(apiKey, instructions, messages);
    const call = first.output.find((o) => o.type === "function_call" && o.name === "save_lead");

    if (!call) {
      return Response.json({ reply: textOf(first.output) || "Sorry, could you say that again?" });
    }

    let lead: Lead | null = null;
    try {
      lead = JSON.parse(call.arguments || "{}") as Lead;
    } catch {}
    let emailed = false;
    if (lead && lead.name && lead.contact) {
      const r = await sendLeadEmail(client, lead, messages);
      emailed = r.sent;
    }

    const followUp = await callOpenAI(apiKey, instructions, [
      ...messages,
      ...first.output,
      { type: "function_call_output", call_id: call.call_id, output: JSON.stringify({ saved: !!lead, team_notified: emailed }) },
    ]);
    return Response.json({
      reply:
        textOf(followUp.output) ||
        "Thank you. I've passed your details to the team and they will be in touch.",
      leadCaptured: !!lead,
      notified: emailed,
    });
  } catch (e) {
    console.error("[chat]", e);
    return Response.json({
      reply: "Sorry, I'm having trouble right now. Please leave your name and phone number and the team will call you back.",
      error: "upstream",
    });
  }
}
