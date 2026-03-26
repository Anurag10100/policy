export function Header() {
  return (
    <header className="fixed top-0 w-full bg-white/90 backdrop-blur-sm border-b border-gray-100 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[var(--color-primary)] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">P</span>
          </div>
          <span className="text-xl font-bold text-[var(--color-primary)]">
            PolicyAI
          </span>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm text-[var(--color-muted)]">
          <a href="#verticals" className="hover:text-[var(--color-primary)]">
            Sectors
          </a>
          <a href="#how-it-works" className="hover:text-[var(--color-primary)]">
            How It Works
          </a>
          <a href="#pricing" className="hover:text-[var(--color-primary)]">
            Pricing
          </a>
        </nav>
        <a
          href="#subscribe"
          className="bg-[var(--color-accent)] text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-amber-600 transition-colors"
        >
          Subscribe Now
        </a>
      </div>
    </header>
  );
}
