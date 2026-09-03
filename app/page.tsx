"use client";

import { useState } from "react";


type Lead = {
  name: string;
  contact: string;
  treatment: string;
  patientType: string;
  preferredTime: string;
  status: "New" | "Warm" | "Hot";
};
type Message = {
  role: "assistant" | "user";
  text: string;
};

const responses: Record<string, string> = {
  whitening:
    "Great choice! Teeth whitening is one of our most popular treatments. Are you looking to have it done soon?",
  soon: "Perfect. We have appointments available this week. Are you a new patient or have you visited SmileCare before?",
  new:
    "Welcome to SmileCare! 😊 What day would work best for you?",
  existing:
    "Welcome back! 😊 What day would work best for you?",
};

export default function Home() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "Hi! 👋 I'm SmileCare's AI assistant. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [leadCaptured, setLeadCaptured] = useState(false);

  const [lead, setLead] = useState<Lead>({
  name: "",
  contact: "",
  treatment: "",
  patientType: "",
  preferredTime: "",
  status: "New",
});


  function sendMessage(text?: string) {
    const message = (text ?? input).trim();

    if (!message) return;

    setMessages((current) => [
      ...current,
      { role: "user", text: message },
    ]);

    setInput("");

    setTimeout(() => {
      let reply =
        "Thanks for letting me know! I can help you with that. Would you like to book an appointment?";

      const lower = message.toLowerCase();
      // Capture treatment
if (
  lower.includes("whitening") ||
  lower.includes("white teeth")
) {
  setLead((prev) => ({
    ...prev,
    treatment: "Teeth Whitening",
    status: "Warm",
  }));
}

// Capture patient type
if (lower.includes("new")) {
  setLead((prev) => ({
    ...prev,
    patientType: "New Patient",
  }));
}

if (lower.includes("existing")) {
  setLead((prev) => ({
    ...prev,
    patientType: "Existing Patient",
  }));
}

// Capture preferred appointment time
if (
  lower.includes("friday") ||
  lower.includes("saturday") ||
  lower.includes("morning") ||
  lower.includes("afternoon") ||
  lower.includes("evening")
) {
  setLead((prev) => ({
    ...prev,
    preferredTime: message,
    status: "Hot",
  }));
}

      if (
        lower.includes("whitening") ||
        lower.includes("white") ||
        lower.includes("teeth")
      ) {
        reply = responses.whitening;
      } else if (
        lower.includes("yes") ||
        lower.includes("soon") ||
        lower.includes("this week")
      ) {
        reply = responses.soon;
      } else if (lower.includes("new")) {
        reply = responses.new;
      } else if (lower.includes("existing")) {
        reply = responses.existing;
      } else if (
        lower.includes("friday") ||
        lower.includes("appointment")
      ) {
        reply =
          "Excellent! I can reserve Friday at 2:30 PM for you. May I have your name and phone number to confirm the appointment?";
        setLeadCaptured(true);
      }

      setMessages((current) => [
        ...current,
        { role: "assistant", text: reply },
      ]);
    }, 600);
  }

  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* Lead Capture Preview */}
<div className="hidden fixed bottom-6 left-6 z-40 w-80 rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl">
  <div className="mb-4 flex items-center justify-between">
    <h3 className="font-bold text-slate-900">
      Current Lead
    </h3>

    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${
        lead.status === "Hot"
          ? "bg-red-100 text-red-700"
          : lead.status === "Warm"
          ? "bg-yellow-100 text-yellow-700"
          : "bg-slate-100 text-slate-600"
      }`}
    >
      {lead.status}
    </span>
  </div>

  <div className="space-y-3 text-sm">
    <div>
      <p className="text-slate-400">Treatment</p>
      <p className="font-medium text-slate-800">
        {lead.treatment || "Not captured yet"}
      </p>
    </div>

    <div>
      <p className="text-slate-400">Patient</p>
      <p className="font-medium text-slate-800">
        {lead.patientType || "Not captured yet"}
      </p>
    </div>

    <div>
      <p className="text-slate-400">Preferred Time</p>
      <p className="font-medium text-slate-800">
        {lead.preferredTime || "Not captured yet"}
      </p>
    </div>
  </div>
</div>
      {/* Navigation */}
      <nav className="border-b border-slate-100 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-xl text-white">
              ✦
            </div>

            <div>
              <div className="text-lg font-bold">SmileCare</div>
              <div className="text-xs text-slate-500">
                Modern Family Dentistry
              </div>
            </div>
          </div>

          <button
            onClick={() => setOpen(true)}
            className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            Book an Appointment
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-slate-50">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 md:grid-cols-2">
          <div>
            <div className="mb-5 inline-flex rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm">
              Trusted dental care for the whole family
            </div>

            <h1 className="text-5xl font-bold leading-tight tracking-tight md:text-6xl">
              A healthier smile starts{" "}
              <span className="text-slate-500">here.</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              From routine checkups to cosmetic dentistry, our friendly team
              provides modern, comfortable dental care tailored to you.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <button
                onClick={() => setOpen(true)}
                className="rounded-full bg-slate-900 px-7 py-3.5 font-semibold text-white transition hover:bg-slate-700"
              >
                Book an Appointment
              </button>

              <button
                onClick={() => setOpen(true)}
                className="rounded-full border border-slate-300 bg-white px-7 py-3.5 font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Ask a Question
              </button>
            </div>

            <div className="mt-10 flex gap-8 text-sm text-slate-500">
              <div>
                <div className="font-bold text-slate-900">4.9/5</div>
                Patient rating
              </div>

              <div>
                <div className="font-bold text-slate-900">15+</div>
                Years experience
              </div>

              <div>
                <div className="font-bold text-slate-900">Same week</div>
                Appointments
              </div>
            </div>
          </div>

          {/* Hero visual */}
          <div className="relative">
            <div className="rounded-3xl bg-slate-200 p-3 shadow-xl">
              <div className="flex min-h-[420px] items-center justify-center rounded-2xl bg-white">
                <div className="text-center">
                  <div className="mx-auto mb-5 flex h-28 w-28 items-center justify-center rounded-full bg-slate-100 text-6xl">
                    🦷
                  </div>

                  <h2 className="text-2xl font-bold">
                    Comfortable care.
                  </h2>

                  <p className="mt-2 text-slate-500">
                    Confident smiles.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">
            Our services
          </p>

          <h2 className="mt-3 text-3xl font-bold">
            Everything your smile needs.
          </h2>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {[
            {
              icon: "✨",
              title: "Teeth Whitening",
              text: "Brighten your smile with professional whitening treatment.",
            },
            {
              icon: "😁",
              title: "Cosmetic Dentistry",
              text: "Create the smile you've always wanted with modern treatments.",
            },
            {
              icon: "🦷",
              title: "General Dentistry",
              text: "Routine examinations, cleaning, fillings and preventative care.",
            },
          ].map((service) => (
            <div
              key={service.title}
              className="rounded-2xl border border-slate-200 p-7 transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="text-3xl">{service.icon}</div>

              <h3 className="mt-5 text-xl font-bold">
                {service.title}
              </h3>

              <p className="mt-3 leading-7 text-slate-600">
                {service.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate-900 text-white">
        <div className="mx-auto max-w-6xl px-6 py-16 text-center">
          <h2 className="text-3xl font-bold">
            Ready for your next appointment?
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-slate-300">
            Our team is here to help you find the right treatment and
            appointment time.
          </p>

          <button
            onClick={() => setOpen(true)}
            className="mt-7 rounded-full bg-white px-7 py-3.5 font-semibold text-slate-900 transition hover:bg-slate-200"
          >
            Talk to our AI Assistant
          </button>
        </div>
      </section>

      {/* Floating AI button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 flex items-center gap-3 rounded-full bg-slate-900 px-5 py-4 text-white shadow-2xl transition hover:scale-105"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-lg">
            ✦
          </span>

          <span className="font-semibold">Ask SmileCare AI</span>
        </button>
      )}

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-5 right-5 z-50 flex h-[650px] w-[380px] max-w-[calc(100vw-40px)] flex-col overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-slate-200">
          {/* Header */}
          <div className="bg-slate-900 px-5 py-5 text-white">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-bold">SmileCare AI</div>
                <div className="mt-1 text-xs text-slate-300">
                  ● Online · Usually replies instantly
                </div>
              </div>

              <button
                onClick={() => setOpen(false)}
                className="text-xl text-slate-300 hover:text-white"
              >
                ×
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 space-y-4 overflow-y-auto bg-slate-50 p-5">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                    message.role === "user"
                      ? "rounded-br-md bg-slate-900 text-white"
                      : "rounded-bl-md bg-white text-slate-700 shadow-sm"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}

            {leadCaptured && (
              <div className="rounded-2xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">
                <div className="font-bold">✓ Appointment opportunity created</div>
                <div className="mt-1">
                  Friday · 2:30 PM · Teeth Whitening
                </div>
              </div>
            )}
          </div>

          {/* Quick actions */}
          <div className="border-t border-slate-100 bg-white p-3">
            <div className="mb-3 flex gap-2 overflow-x-auto">
              <button
                onClick={() => sendMessage("I'm interested in teeth whitening")}
                className="whitespace-nowrap rounded-full border border-slate-200 px-3 py-2 text-xs font-medium hover:bg-slate-50"
              >
                Teeth whitening
              </button>

              <button
                onClick={() => sendMessage("I want an appointment this week")}
                className="whitespace-nowrap rounded-full border border-slate-200 px-3 py-2 text-xs font-medium hover:bg-slate-50"
              >
                Appointment
              </button>
            </div>

            <div className="flex gap-2">
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") sendMessage();
                }}
                placeholder="Type your message..."
                className="min-w-0 flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
              />

              <button
                onClick={() => sendMessage()}
                className="rounded-xl bg-slate-900 px-4 text-white"
              >
                ↑
              </button>
            </div>

            <div className="mt-2 text-center text-[10px] text-slate-400">
              Powered by SmileCare AI
            </div>
          </div>
        </div>
      )}
    </main>
  );
}