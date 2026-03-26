export function Hero() {
  return (
    <section className="pt-28 pb-20 px-6 bg-gradient-to-b from-[var(--color-primary)] to-[#2d5a8e]">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-block bg-amber-500/20 text-amber-300 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
          Launching with BFSI — Founding Subscribers Get 40% Off
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
          AI-Powered Policy Intelligence for India
        </h1>
        <p className="text-xl text-blue-200 mb-10 max-w-2xl mx-auto">
          Never miss a regulatory change again. Get AI-summarized policy updates
          from RBI, SEBI, IRDAI and 50+ government sources — delivered weekly to
          your inbox.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#subscribe"
            className="bg-[var(--color-accent)] text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-amber-600 transition-colors"
          >
            Start Free Trial
          </a>
          <a
            href="#how-it-works"
            className="border border-white/30 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-white/10 transition-colors"
          >
            See How It Works
          </a>
        </div>
        <p className="text-blue-300/70 text-sm mt-6">
          Trusted by delegates from Elets BFSI, Healthcare & Energy summits
        </p>
      </div>
    </section>
  );
}
