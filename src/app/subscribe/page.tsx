"use client";

import { PricingSection } from "@/components/PricingSection";
import { RazorpayCheckout } from "@/components/RazorpayCheckout";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SubscribeContent() {
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan");

  if (plan === "professional") {
    return (
      <main className="min-h-screen flex items-center justify-center px-6 py-12">
        <div className="max-w-md w-full animate-fade-in">
          <div className="text-center mb-8">
            <span className="text-2xl font-bold text-[var(--accent)]" style={{ fontFamily: "Playfair Display, serif" }}>
              PolicyAI
            </span>
            <h1 className="text-2xl font-bold text-white mt-4 mb-2">
              Professional Plan
            </h1>
            <p className="text-[var(--text-muted)]">
              Real-time regulatory intelligence for your team
            </p>
          </div>

          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-6 mb-6">
            <div className="flex items-baseline justify-between mb-6">
              <div>
                <span className="text-[var(--text-dim)] text-lg">₹</span>
                <span className="text-4xl font-bold text-white mono">25,000</span>
                <span className="text-[var(--text-dim)]">/month</span>
              </div>
              <span className="text-xs text-[var(--accent)] bg-[var(--accent)]/10 px-3 py-1 rounded-full">
                14-day free trial
              </span>
            </div>
            <ul className="space-y-2 mb-6 text-sm text-[var(--text-muted)]">
              <li>✓ Real-time email & WhatsApp alerts</li>
              <li>✓ All 7 sectors included</li>
              <li>✓ Personalised impact analysis</li>
              <li>✓ Custom watchlist tracking</li>
            </ul>
            <RazorpayCheckout
              amount={2500000}
              planName="Professional"
              description="PolicyAI Professional — Monthly"
            />
          </div>

          <div className="text-center">
            <a href="/dashboard" className="text-sm text-[var(--text-dim)] hover:text-[var(--text)]">
              ← Back to Dashboard
            </a>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen py-20 px-6">
      <PricingSection />
    </main>
  );
}

export default function SubscribePage() {
  return (
    <Suspense>
      <SubscribeContent />
    </Suspense>
  );
}
