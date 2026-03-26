"use client";

import { usePathname } from "next/navigation";

const sectors = [
  { slug: "all", name: "All Sectors", icon: "📊" },
  { slug: "bfsi", name: "BFSI", icon: "🏦" },
  { slug: "healthcare", name: "Healthcare", icon: "🏥" },
  { slug: "energy", name: "Energy", icon: "⚡" },
  { slug: "education", name: "Education", icon: "🎓" },
  { slug: "smartcities", name: "Smart Cities", icon: "🏙️" },
  { slug: "defence", name: "Defence", icon: "🛡️" },
  { slug: "egov", name: "eGovernance", icon: "🏛️" },
];

const navItems = [
  { href: "/dashboard", label: "Feed", icon: "📰" },
  { href: "/dashboard/watchlist", label: "Watchlist", icon: "🔔" },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-64 bg-[var(--bg-card)] border-r border-[var(--border)] p-4">
      <a
        href="/"
        className="text-xl font-bold text-[var(--accent)] mb-8 px-3"
        style={{ fontFamily: "Playfair Display, serif" }}
      >
        PolicyAI
      </a>

      <nav className="space-y-1 mb-6">
        {navItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
              pathname === item.href
                ? "bg-[var(--accent)]/10 text-[var(--accent)]"
                : "text-[var(--text-muted)] hover:text-white hover:bg-[var(--bg-card-hover)]"
            }`}
          >
            <span>{item.icon}</span>
            {item.label}
          </a>
        ))}
      </nav>

      <div className="px-3 mb-3">
        <p className="text-xs text-[var(--text-dim)] uppercase tracking-wider font-semibold">
          Sectors
        </p>
      </div>
      <nav className="space-y-0.5 flex-1">
        {sectors.map((s) => (
          <a
            key={s.slug}
            href={s.slug === "all" ? "/dashboard" : `/dashboard?sector=${s.slug}`}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[var(--text-muted)] hover:text-white hover:bg-[var(--bg-card-hover)] transition-colors"
          >
            <span className="text-base">{s.icon}</span>
            {s.name}
          </a>
        ))}
      </nav>

      <div className="border-t border-[var(--border)] pt-4 mt-4">
        <a
          href="/subscribe"
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[var(--accent)] hover:bg-[var(--accent)]/10 transition-colors"
        >
          ⚡ Upgrade Plan
        </a>
      </div>
    </aside>
  );
}
