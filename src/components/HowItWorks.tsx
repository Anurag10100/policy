const steps = [
  {
    step: "1",
    title: "We Ingest",
    description:
      "Our AI pipeline continuously monitors gazette notifications, ministry circulars, regulator updates, and state government orders across 50+ sources.",
  },
  {
    step: "2",
    title: "AI Summarizes",
    description:
      "Claude AI reads every document and generates plain-English summaries — what changed, who it affects, and what action is needed.",
  },
  {
    step: "3",
    title: "You Act",
    description:
      "Get a curated weekly briefing for your sector. No noise, no jargon — just the policy changes that matter to your business.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((s) => (
            <div key={s.step} className="text-center">
              <div className="w-12 h-12 bg-[var(--color-primary)] text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                {s.step}
              </div>
              <h3 className="text-lg font-bold mb-2">{s.title}</h3>
              <p className="text-[var(--color-muted)]">{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
