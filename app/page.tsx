import WidgetFor from "@/components/WidgetFor";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
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
            data-open-chat
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
                data-open-chat
                className="rounded-full bg-slate-900 px-7 py-3.5 font-semibold text-white transition hover:bg-slate-700"
              >
                Book an Appointment
              </button>

              <button
                data-open-chat
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
            data-open-chat
            className="mt-7 rounded-full bg-white px-7 py-3.5 font-semibold text-slate-900 transition hover:bg-slate-200"
          >
            Talk to our AI Assistant
          </button>
        </div>
      </section>
      <WidgetFor client="smilecare" />
    </main>
  );
}