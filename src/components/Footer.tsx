export function Footer() {
  return (
    <footer className="py-12 px-6 bg-gray-900 text-gray-400">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <span className="text-white font-bold text-lg">PolicyAI</span>
          <p className="text-sm mt-1">
            India&apos;s AI-powered policy intelligence platform.
          </p>
        </div>
        <div className="flex gap-6 text-sm">
          <a href="#verticals" className="hover:text-white">
            Sectors
          </a>
          <a href="#pricing" className="hover:text-white">
            Pricing
          </a>
          <a href="mailto:hello@policyai.com" className="hover:text-white">
            Contact
          </a>
        </div>
        <p className="text-sm">&copy; 2026 PolicyAI. All rights reserved.</p>
      </div>
    </footer>
  );
}
