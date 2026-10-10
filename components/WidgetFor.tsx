import ChatWidget from "./ChatWidget";
import { getClient } from "@/lib/clients";

// Server component: pulls only the public fields of a client's config into the widget.
export default function WidgetFor({ client, defaultOpen }: { client: string; defaultOpen?: boolean }) {
  const c = getClient(client);
  if (!c) return null;
  return (
    <ChatWidget
      client={c.key}
      assistantName={c.assistantName}
      businessName={c.businessName}
      brandColor={c.brandColor}
      greeting={c.greeting}
      disclosure={c.disclosure}
      quickReplies={c.quickReplies}
      defaultOpen={defaultOpen}
    />
  );
}
