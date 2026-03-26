"use client";

import { useState, useMemo } from "react";

interface FeedItem {
  id: string;
  title: string;
  publishedAt: string;
  url: string;
  sourceName: string;
  sectorName: string;
  sectorSlug: string;
  summaryShort: string;
  severity: string;
  tags: string[];
}

function SeverityBadge({ severity }: { severity: string }) {
  const styles: Record<string, string> = {
    high: "bg-red-500/20 text-red-400 border-red-500/30",
    medium: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    low: "bg-green-500/20 text-green-400 border-green-500/30",
  };
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${styles[severity] || styles.low}`}>
      {severity.toUpperCase()}
    </span>
  );
}

const filters = [
  { value: "all", label: "All" },
  { value: "high", label: "High Impact" },
  { value: "this_week", label: "This Week" },
];

export function DashboardFeed({
  initialFeed,
  activeSector,
  activeFilter,
  searchQuery: initialSearch,
}: {
  initialFeed: FeedItem[];
  activeSector: string;
  activeFilter: string;
  searchQuery: string;
}) {
  const [search, setSearch] = useState(initialSearch);
  const [filter, setFilter] = useState(activeFilter);

  const filtered = useMemo(() => {
    let items = initialFeed;

    if (filter === "high") {
      items = items.filter((i) => i.severity === "high");
    } else if (filter === "this_week") {
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      items = items.filter((i) => new Date(i.publishedAt) >= weekAgo);
    }

    if (search) {
      const q = search.toLowerCase();
      items = items.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          i.tags.some((t) => t.toLowerCase().includes(q)) ||
          i.sourceName.toLowerCase().includes(q)
      );
    }

    return items;
  }, [initialFeed, filter, search]);

  return (
    <div>
      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search documents, tags, regulators..."
          className="flex-1 px-4 py-2.5 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg text-white text-sm placeholder:text-[var(--text-dim)] focus:border-[var(--accent)] focus:outline-none"
        />
        <div className="flex gap-2">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                filter === f.value
                  ? "bg-[var(--accent)]/20 border-[var(--accent)] text-[var(--accent)]"
                  : "bg-[var(--bg-card)] border-[var(--border)] text-[var(--text-dim)] hover:border-[var(--text-dim)]"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Feed */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-[var(--text-dim)]">
            <p className="text-lg mb-2">No documents found</p>
            <p className="text-sm">Try adjusting your filters or search query.</p>
          </div>
        ) : (
          filtered.map((item) => (
            <a
              key={item.id}
              href={`/dashboard/brief/${item.id}`}
              className="block bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5 hover:border-[var(--accent)]/30 hover:bg-[var(--bg-card-hover)] transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <SeverityBadge severity={item.severity} />
                    <span className="text-xs text-[var(--text-dim)] mono">
                      {item.sourceName}
                    </span>
                    <span className="text-xs text-[var(--text-dim)]">·</span>
                    <span className="text-xs text-[var(--text-dim)]">
                      {item.sectorName}
                    </span>
                  </div>
                  <h3 className="font-semibold text-white mb-1.5 line-clamp-1" style={{ fontFamily: "DM Sans, sans-serif" }}>
                    {item.title}
                  </h3>
                  <p className="text-sm text-[var(--text-muted)] line-clamp-2">
                    {item.summaryShort}
                  </p>
                  {item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {item.tags.slice(0, 4).map((tag) => (
                        <span
                          key={tag}
                          className="text-xs bg-[var(--bg)]/60 text-[var(--text-dim)] px-2 py-0.5 rounded mono"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs text-[var(--text-dim)]">
                    {item.publishedAt
                      ? new Date(item.publishedAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          timeZone: "Asia/Kolkata",
                        })
                      : ""}
                  </span>
                  <div className="text-xs text-[var(--accent)] mt-1">
                    Read Brief →
                  </div>
                </div>
              </div>
            </a>
          ))
        )}
      </div>
    </div>
  );
}
