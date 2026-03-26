import { SectorGrid } from "@/components/SectorGrid";
import { AlertCards } from "@/components/AlertCards";
import { NewsletterForm } from "@/components/NewsletterForm";
import { PricingSection } from "@/components/PricingSection";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-[var(--bg)]/90 backdrop-blur-md border-b border-[var(--border)]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="text-xl font-bold text-[var(--accent)]" style={{ fontFamily: "Playfair Display, serif" }}>
            PolicyAI
          </span>
          <a
            href="#subscribe"
            className="bg-[var(--accent)] text-[var(--bg)] px-5 py-2 rounded-lg text-sm font-semibold hover:bg-[var(--accent-hover)] transition-colors"
          >
            Subscribe
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-24 px-6 text-center">
        <div className="max-w-4xl mx-auto animate-fade-in">
          <div className="inline-block bg-[var(--accent)]/10 text-[var(--accent)] text-sm font-medium px-4 py-1.5 rounded-full mb-6 mono">
            Tracking 7 sectors · 50+ regulatory bodies · Updated every 2 hours
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight bg-gradient-to-r from-white to-[var(--text-muted)] bg-clip-text text-transparent">
            India&apos;s Regulatory Intelligence Platform
          </h1>
          <p className="text-xl text-[var(--text-muted)] mb-10 max-w-2xl mx-auto leading-relaxed">
            AI-powered policy tracking for CXOs and compliance heads.
            Every RBI circular, SEBI notification, and ministry order —
            summarised, scored, and delivered before it hits the news.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/login"
              className="bg-[var(--accent)] text-[var(--bg)] px-8 py-3.5 rounded-lg text-lg font-semibold hover:bg-[var(--accent-hover)] transition-colors pulse-glow"
            >
              Start Free Trial
            </a>
            <a
              href="#sectors"
              className="border border-[var(--border)] text-[var(--text)] px-8 py-3.5 rounded-lg text-lg font-semibold hover:border-[var(--text-dim)] transition-colors"
            >
              Explore Sectors
            </a>
          </div>
        </div>
      </section>

      {/* Sectors */}
      <section id="sectors" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">
            Seven Sectors. Complete Coverage.
          </h2>
          <p className="text-[var(--text-muted)] text-center mb-12 max-w-xl mx-auto">
            Every regulatory body that matters to Indian enterprise — tracked, indexed, and intelligence-ready.
          </p>
          <SectorGrid />
        </div>
      </section>

      {/* Latest Alerts */}
      <section className="py-20 px-6 border-t border-[var(--border)]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">
            Latest Intelligence
          </h2>
          <p className="text-[var(--text-muted)] text-center mb-12">
            Real-time regulatory updates, AI-analysed and severity-scored.
          </p>
          <AlertCards />
        </div>
      </section>

      {/* Newsletter Subscribe */}
      <section id="subscribe" className="py-20 px-6 border-t border-[var(--border)]">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Policy Pulse Weekly</h2>
          <p className="text-[var(--text-muted)] mb-8">
            Free weekly digest of the regulatory changes that matter.
            Pick your sectors. Cancel anytime.
          </p>
          <NewsletterForm />
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-6 border-t border-[var(--border)]">
        <PricingSection />
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-[var(--border)]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-[var(--text-dim)] text-sm">
          <span className="text-[var(--accent)] font-bold text-lg" style={{ fontFamily: "Playfair Display, serif" }}>
            PolicyAI
          </span>
          <div className="flex gap-6">
            <a href="#sectors" className="hover:text-[var(--text)]">Sectors</a>
            <a href="#pricing" className="hover:text-[var(--text)]">Pricing</a>
            <a href="mailto:hello@policyai.com" className="hover:text-[var(--text)]">Contact</a>
          </div>
          <span>&copy; 2026 PolicyAI. All rights reserved.</span>
        </div>
      </footer>
    </main>
  );
}
