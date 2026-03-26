const plans = [
  {
    name: "Founding Subscriber",
    price: "3,000",
    period: "/month",
    description: "Early access — limited to first 50 subscribers",
    features: [
      "Weekly AI-summarized policy briefing",
      "Choose your sector (BFSI, Healthcare, Energy, or EdTech)",
      "Plain-English regulatory summaries",
      "Source document links",
      "Email delivery every Monday",
    ],
    cta: "Claim Founding Rate",
    highlighted: true,
  },
  {
    name: "Standard",
    price: "5,000",
    period: "/month",
    description: "Full access after founding slots are filled",
    features: [
      "Everything in Founding plan",
      "All 4 sector briefings included",
      "Priority access to upcoming dashboard",
      "Quarterly deep-dive reports",
      "WhatsApp alerts (coming soon)",
    ],
    cta: "Join Waitlist",
    highlighted: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-4">
          Simple, Transparent Pricing
        </h2>
        <p className="text-[var(--color-muted)] text-center mb-12">
          Start with the newsletter. Platform access coming in Phase 2.
        </p>
        <div className="grid md:grid-cols-2 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-xl p-8 ${
                plan.highlighted
                  ? "bg-[var(--color-primary)] text-white ring-2 ring-[var(--color-accent)]"
                  : "bg-white border border-gray-200"
              }`}
            >
              {plan.highlighted && (
                <div className="text-amber-400 text-sm font-semibold mb-2">
                  LIMITED OFFER
                </div>
              )}
              <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
              <p
                className={`text-sm mb-4 ${plan.highlighted ? "text-blue-200" : "text-[var(--color-muted)]"}`}
              >
                {plan.description}
              </p>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold">&#8377;{plan.price}</span>
                <span
                  className={
                    plan.highlighted
                      ? "text-blue-200"
                      : "text-[var(--color-muted)]"
                  }
                >
                  {plan.period}
                </span>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <span
                      className={
                        plan.highlighted ? "text-amber-400" : "text-green-500"
                      }
                    >
                      &#10003;
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href="#subscribe"
                className={`block text-center py-3 rounded-lg font-semibold transition-colors ${
                  plan.highlighted
                    ? "bg-[var(--color-accent)] text-white hover:bg-amber-600"
                    : "bg-gray-100 text-[var(--color-primary)] hover:bg-gray-200"
                }`}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
