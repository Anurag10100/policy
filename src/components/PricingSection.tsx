"use client";

const plans = [
  {
    name: "Free",
    price: "0",
    period: "forever",
    description: "Weekly digest to get started",
    features: [
      "Weekly Policy Pulse digest",
      "2 sectors included",
      "Newsletter delivery only",
      "Community access",
    ],
    cta: "Start Free",
    href: "/login",
    highlighted: false,
  },
  {
    name: "Professional",
    price: "25,000",
    period: "/month",
    description: "Real-time intelligence for compliance teams",
    features: [
      "Real-time email & WhatsApp alerts",
      "All 7 sectors included",
      "Full AI-generated briefs",
      "Personalised impact analysis",
      "Custom watchlist tracking",
      "Search & filter dashboard",
      "API access (coming soon)",
    ],
    cta: "Start 14-Day Trial",
    href: "/subscribe?plan=professional",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "1,50,000",
    period: "/month",
    description: "Full intelligence suite for large teams",
    features: [
      "Everything in Professional",
      "Unlimited team seats",
      "Custom tracking rules",
      "Dedicated analyst briefs",
      "Quarterly deep-dive reports",
      "Priority support",
      "White-label option",
    ],
    cta: "Contact Us",
    href: "mailto:enterprise@policyai.com",
    highlighted: false,
  },
];

export function PricingSection() {
  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-4">
        Intelligence That Pays for Itself
      </h2>
      <p className="text-[var(--text-muted)] text-center mb-12">
        One missed regulation can cost crores. Start tracking today.
      </p>
      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`rounded-xl p-7 border transition-all ${
              plan.highlighted
                ? "bg-[var(--bg-card)] border-[var(--accent)] ring-1 ring-[var(--accent)]/30"
                : "bg-[var(--bg-card)] border-[var(--border)] hover:border-[var(--text-dim)]"
            }`}
          >
            {plan.highlighted && (
              <div className="text-[var(--accent)] text-xs font-bold uppercase tracking-wider mb-2 mono">
                Most Popular
              </div>
            )}
            <h3 className="text-xl font-bold text-white mb-1" style={{ fontFamily: "DM Sans, sans-serif" }}>
              {plan.name}
            </h3>
            <p className="text-sm text-[var(--text-dim)] mb-4">
              {plan.description}
            </p>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-[var(--text-dim)] text-lg">&#8377;</span>
              <span className="text-3xl font-bold text-white mono">
                {plan.price}
              </span>
              <span className="text-[var(--text-dim)] text-sm">
                {plan.period}
              </span>
            </div>
            <ul className="space-y-3 mb-8">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm">
                  <span className={plan.highlighted ? "text-[var(--accent)]" : "text-[var(--severity-low)]"}>
                    ✓
                  </span>
                  <span className="text-[var(--text-muted)]">{f}</span>
                </li>
              ))}
            </ul>
            <a
              href={plan.href}
              className={`block text-center py-3 rounded-lg font-semibold transition-colors ${
                plan.highlighted
                  ? "bg-[var(--accent)] text-[var(--bg)] hover:bg-[var(--accent-hover)]"
                  : "bg-[var(--bg)]/60 text-[var(--text)] border border-[var(--border)] hover:border-[var(--text-dim)]"
              }`}
            >
              {plan.cta}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
