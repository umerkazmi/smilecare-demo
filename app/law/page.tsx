import WidgetFor from "@/components/WidgetFor";

export const metadata = { title: "Lakeshore Construction Law (demo)" };

export default function LawDemo() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <nav className="border-b border-slate-200">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div>
            <div className="text-lg font-bold tracking-tight">Lakeshore Construction Law</div>
            <div className="text-xs text-slate-500">Demo site for an AI receptionist</div>
          </div>
          <button data-open-chat className="rounded-full bg-[#1e3a5f] px-5 py-2.5 text-sm font-semibold text-white">
            Free consultation
          </button>
        </div>
      </nav>

      <section className="bg-slate-50">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">Construction law</p>
          <h1 className="mt-3 max-w-3xl text-5xl font-bold leading-tight tracking-tight">
            Get paid. Protect your project. Resolve the dispute.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            Mechanic&apos;s liens, payment disputes, construction defects and contracts for contractors,
            subcontractors, owners and developers.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-5 md:grid-cols-3">
          {[
            ["Mechanic's liens", "Protect your right to payment when a project owner or general contractor doesn't pay."],
            ["Payment disputes", "Recover money owed on completed work, change orders and retainage."],
            ["Contracts and defects", "Contract review, construction defect claims and construction litigation."],
          ].map(([t, d]) => (
            <div key={t} className="rounded-2xl border border-slate-200 p-7">
              <h3 className="text-xl font-bold">{t}</h3>
              <p className="mt-3 leading-7 text-slate-600">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="contact" className="bg-[#1e3a5f] text-white">
        <div className="mx-auto max-w-6xl px-6 py-14 text-center">
          <h2 className="text-3xl font-bold">Calling after hours or from a job site?</h2>
          <p className="mx-auto mt-4 max-w-xl text-slate-200">
            Our assistant takes down your situation any time and requests a consultation with an attorney.
          </p>
        </div>
      </section>

      <WidgetFor client="lawfirm" />
    </main>
  );
}
