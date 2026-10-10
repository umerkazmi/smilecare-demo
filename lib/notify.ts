import type { ClientConfig } from "./clients";

export type Lead = {
  name: string;
  contact: string;
  summary: string;
  urgency: "low" | "medium" | "high";
  details: { label: string; value: string }[];
};

const BADGE: Record<Lead["urgency"], string> = {
  high: "HOT",
  medium: "WARM",
  low: "NEW",
};

function esc(s: string) {
  return s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
}

export async function sendLeadEmail(
  client: ClientConfig,
  lead: Lead,
  transcript: { role: string; content: string }[],
): Promise<{ sent: boolean; reason?: string }> {
  const to = process.env[client.notifyEnv] || process.env.LEAD_NOTIFY_EMAIL;
  const key = process.env.RESEND_API_KEY;
  if (!key || !to) {
    console.log("[lead] email not configured, lead:", JSON.stringify(lead));
    return { sent: false, reason: "email not configured" };
  }
  const from = process.env.RESEND_FROM || "Front Desk <onboarding@resend.dev>";
  const badge = BADGE[lead.urgency];
  const rows = lead.details
    .map((d) => `<tr><td style="padding:4px 12px 4px 0;color:#64748b">${esc(d.label)}</td><td>${esc(d.value)}</td></tr>`)
    .join("");
  const convo = transcript
    .map((m) => `<p style="margin:4px 0"><b>${m.role === "user" ? "Visitor" : client.assistantName}:</b> ${esc(m.content)}</p>`)
    .join("");
  const html = `<div style="font-family:system-ui,sans-serif;max-width:560px">
    <h2 style="margin:0 0 8px">${badge} lead: ${esc(lead.name)}</h2>
    <p style="margin:0 0 12px"><b>Contact:</b> ${esc(lead.contact)}</p>
    <p style="margin:0 0 12px">${esc(lead.summary)}</p>
    <table style="font-size:14px;margin-bottom:16px">${rows}</table>
    <h3 style="margin:16px 0 4px;font-size:14px">Conversation</h3>${convo}
    <p style="color:#94a3b8;font-size:12px;margin-top:16px">Captured by ${esc(client.assistantName)}, ${esc(client.businessName)}</p>
  </div>`;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [to],
        subject: `${badge} lead: ${lead.name} (${client.businessName})`,
        html,
      }),
    });
    if (!res.ok) {
      const t = await res.text();
      console.error("[lead] resend error", res.status, t);
      return { sent: false, reason: `resend ${res.status}` };
    }
    return { sent: true };
  } catch (e) {
    console.error("[lead] resend failed", e);
    return { sent: false, reason: "network" };
  }
}
