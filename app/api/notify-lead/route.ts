import { getClient } from "@/lib/clients";
import { sendLeadEmail, type Lead } from "@/lib/notify";

// Optional manual endpoint (e.g. for the embeddable widget or a form).
export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { client?: string; lead?: Lead } | null;
  const client = getClient(body?.client);
  if (!client || !body?.lead?.name || !body.lead.contact)
    return Response.json({ error: "Bad request" }, { status: 400 });
  const r = await sendLeadEmail(client, body.lead, []);
  return Response.json(r);
}
