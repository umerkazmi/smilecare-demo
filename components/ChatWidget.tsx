"use client";

import { useEffect, useRef, useState } from "react";

type Msg = { role: "user" | "assistant"; content: string };

export type WidgetProps = {
  client: string;
  assistantName: string;
  businessName: string;
  brandColor: string;
  greeting: string;
  disclosure?: string;
  quickReplies?: string[];
  defaultOpen?: boolean;
  onLead?: () => void;
};

export default function ChatWidget(p: WidgetProps) {
  const [open, setOpen] = useState(!!p.defaultOpen);
  const [messages, setMessages] = useState<Msg[]>([{ role: "assistant", content: p.greeting }]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<null | "sent" | "saved">(null);
  const endRef = useRef<HTMLDivElement>(null);

  // Any element with data-open-chat opens the widget (lets static pages use plain buttons).
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if ((e.target as HTMLElement | null)?.closest("[data-open-chat]")) setOpen(true);
    };
    document.addEventListener("click", h);
    return () => document.removeEventListener("click", h);
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, busy, open]);

  async function send(text?: string) {
    const content = (text ?? input).trim();
    if (!content || busy) return;
    const next: Msg[] = [...messages, { role: "user", content }];
    setMessages(next);
    setInput("");
    setBusy(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // the greeting is UI-only context; send everything after it plus it as assistant turn
        body: JSON.stringify({ client: p.client, messages: next }),
      });
      const data = await res.json();
      setMessages([...next, { role: "assistant", content: data.reply || data.error || "Sorry, something went wrong." }]);
      if (data.leadCaptured) {
        setDone(data.notified ? "sent" : "saved");
        p.onLead?.();
      }
    } catch {
      setMessages([
        ...next,
        { role: "assistant", content: "Sorry, I lost connection. Please try again in a moment." },
      ]);
    } finally {
      setBusy(false);
    }
  }

  const showChips = messages.length === 1 && !!p.quickReplies?.length;

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        aria-label={`Chat with ${p.assistantName}`}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-full px-5 py-4 text-white shadow-2xl transition hover:scale-105"
        style={{ backgroundColor: p.brandColor }}
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-sm font-bold" style={{ color: p.brandColor }}>
          {p.assistantName[0]}
        </span>
        <span className="font-semibold">Chat with {p.assistantName}</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 flex h-[620px] max-h-[calc(100vh-40px)] w-[380px] max-w-[calc(100vw-40px)] flex-col overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-slate-200">
      <div className="px-5 py-4 text-white" style={{ backgroundColor: p.brandColor }}>
        <div className="flex items-center justify-between">
          <div>
            <div className="font-bold">{p.assistantName} · {p.businessName}</div>
            <div className="mt-0.5 text-xs opacity-80">Online · replies instantly</div>
          </div>
          <button onClick={() => setOpen(false)} aria-label="Close chat" className="text-2xl leading-none opacity-80 hover:opacity-100">
            ×
          </button>
        </div>
        {p.disclosure && <div className="mt-2 text-[11px] leading-4 opacity-80">{p.disclosure}</div>}
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50 p-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-6 ${
                m.role === "user" ? "text-white" : "bg-white text-slate-800 shadow-sm ring-1 ring-slate-200"
              }`}
              style={m.role === "user" ? { backgroundColor: p.brandColor } : undefined}
            >
              {m.content}
            </div>
          </div>
        ))}
        {busy && (
          <div className="flex justify-start">
            <div className="rounded-2xl bg-white px-4 py-3 text-sm text-slate-400 shadow-sm ring-1 ring-slate-200">
              <span className="animate-pulse">typing…</span>
            </div>
          </div>
        )}
        {showChips && (
          <div className="flex flex-wrap gap-2 pt-1">
            {p.quickReplies!.map((q) => (
              <button
                key={q}
                onClick={() => send(q)}
                className="rounded-full border bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
                style={{ borderColor: p.brandColor }}
              >
                {q}
              </button>
            ))}
          </div>
        )}
        {done && (
          <div className="rounded-xl bg-emerald-50 px-3 py-2 text-xs text-emerald-800 ring-1 ring-emerald-200">
            {done === "sent" ? "Your details were sent to the team." : "Your details were captured."}
          </div>
        )}
        <div ref={endRef} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
        className="flex gap-2 border-t border-slate-200 bg-white p-3"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message…"
          maxLength={1500}
          className="flex-1 rounded-full border border-slate-300 px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-500"
        />
        <button
          type="submit"
          disabled={busy || !input.trim()}
          className="rounded-full px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-40"
          style={{ backgroundColor: p.brandColor }}
        >
          Send
        </button>
      </form>
    </div>
  );
}
