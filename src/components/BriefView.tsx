"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";

interface BriefViewProps {
  document: {
    id: string;
    title: string;
    url: string;
    publishedAt: string;
    sourceName: string;
    sourceShortName: string;
    sectorName: string;
  };
  summary: {
    summaryShort: string;
    summaryFull: string;
    severity: string;
    tags: string[];
    keyDates: Array<{ label: string; date: string }>;
  } | null;
  related: Array<{
    id: string;
    title: string;
    publishedAt: string;
    sourceShortName: string;
    severity: string;
  }>;
  impactSummary: {
    impact_text: string;
    action_required: boolean;
    urgency: string;
    action_items: string[];
    risk_level: string;
    affected_business_areas: string[];
  } | null;
  hasOrgProfile: boolean;
  userId: string | null;
  initialTab: string;
}

function SeverityBadge({ severity }: { severity: string }) {
  const styles: Record<string, string> = {
    high: "bg-red-500/20 text-red-400 border-red-500/30",
    medium: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    low: "bg-green-500/20 text-green-400 border-green-500/30",
  };
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${styles[severity] || styles.low}`}>
      {severity.toUpperCase()}
    </span>
  );
}

function RiskBadge({ level }: { level: string }) {
  const styles: Record<string, string> = {
    critical: "bg-red-600/20 text-red-400",
    high: "bg-orange-500/20 text-orange-400",
    medium: "bg-yellow-500/20 text-yellow-400",
    low: "bg-green-500/20 text-green-400",
    none: "bg-gray-500/20 text-gray-400",
  };
  return (
    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${styles[level] || styles.none}`}>
      Risk: {level.toUpperCase()}
    </span>
  );
}

function UrgencyChip({ urgency }: { urgency: string }) {
  const labels: Record<string, string> = {
    immediate: "Immediate Action",
    this_week: "This Week",
    this_month: "This Month",
    monitor: "Monitor",
  };
  const styles: Record<string, string> = {
    immediate: "bg-red-500/20 text-red-400",
    this_week: "bg-orange-500/20 text-orange-400",
    this_month: "bg-yellow-500/20 text-yellow-400",
    monitor: "bg-blue-500/20 text-blue-400",
  };
  return (
    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${styles[urgency] || styles.monitor}`}>
      {labels[urgency] || urgency}
    </span>
  );
}

export function BriefView({
  document: doc,
  summary,
  related,
  impactSummary: initialImpact,
  hasOrgProfile,
  userId,
  initialTab,
}: BriefViewProps) {
  const [tab, setTab] = useState(initialTab);
  const [impact, setImpact] = useState(initialImpact);
  const [loadingImpact, setLoadingImpact] = useState(false);
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set());

  async function generateImpact() {
    if (!userId) return;
    setLoadingImpact(true);
    try {
      const res = await fetch("/api/impact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ document_id: doc.id, user_id: userId }),
      });
      if (res.ok) {
        const data = await res.json();
        setImpact(data);
      }
    } catch {
      // Handle error
    }
    setLoadingImpact(false);
  }

  function toggleChecked(idx: number) {
    setCheckedItems((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  }

  async function copyBrief() {
    const text = summary?.summaryFull || summary?.summaryShort || doc.title;
    await navigator.clipboard.writeText(text);
  }

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-3">
          {summary && <SeverityBadge severity={summary.severity} />}
          <span className="text-sm text-[var(--text-dim)] mono">{doc.sourceShortName}</span>
          <span className="text-sm text-[var(--text-dim)]">·</span>
          <span className="text-sm text-[var(--text-dim)]">{doc.sectorName}</span>
          <span className="text-sm text-[var(--text-dim)]">·</span>
          <span className="text-sm text-[var(--text-dim)]">
            {doc.publishedAt
              ? new Date(doc.publishedAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  timeZone: "Asia/Kolkata",
                })
              : ""}
          </span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-3">
          {doc.title}
        </h1>
        <p className="text-[var(--text-muted)] text-sm">
          Source: {doc.sourceName}
          {doc.url && (
            <>
              {" · "}
              <a
                href={doc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--accent)] hover:underline"
              >
                Original Document ↗
              </a>
            </>
          )}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-[var(--border)]">
        <button
          onClick={() => setTab("brief")}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
            tab === "brief"
              ? "border-[var(--accent)] text-[var(--accent)]"
              : "border-transparent text-[var(--text-dim)] hover:text-[var(--text)]"
          }`}
        >
          Brief
        </button>
        <button
          onClick={() => setTab("impact")}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
            tab === "impact"
              ? "border-[var(--accent)] text-[var(--accent)]"
              : "border-transparent text-[var(--text-dim)] hover:text-[var(--text)]"
          }`}
        >
          Impact on Your Organisation
        </button>
      </div>

      {tab === "brief" && summary && (
        <div className="animate-fade-in">
          {/* Summary short */}
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5 mb-6">
            <p className="text-[var(--text)] leading-relaxed">{summary.summaryShort}</p>
          </div>

          {/* Key dates timeline */}
          {summary.keyDates.length > 0 && (
            <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5 mb-6">
              <h3 className="text-sm font-semibold text-[var(--accent)] uppercase tracking-wider mb-3" style={{ fontFamily: "DM Sans, sans-serif" }}>
                Key Dates
              </h3>
              <div className="space-y-2">
                {summary.keyDates.map((kd, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-sm mono text-[var(--accent)] whitespace-nowrap">
                      {kd.date}
                    </span>
                    <div className="w-2 h-2 rounded-full bg-[var(--accent)]" />
                    <span className="text-sm text-[var(--text-muted)]">
                      {kd.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Full analysis */}
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-6 mb-6 prose prose-invert prose-sm max-w-none [&_h2]:text-[var(--accent)] [&_h2]:text-base [&_h2]:font-bold [&_h2]:mt-6 [&_h2]:mb-3 [&_p]:text-[var(--text-muted)] [&_li]:text-[var(--text-muted)] [&_strong]:text-white">
            <ReactMarkdown>{summary.summaryFull}</ReactMarkdown>
          </div>

          {/* Tags */}
          {summary.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {summary.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-dim)] px-3 py-1 rounded-full mono"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Copy button */}
          <button
            onClick={copyBrief}
            className="text-sm text-[var(--text-dim)] hover:text-[var(--accent)] transition-colors mb-8"
          >
            📋 Copy Brief
          </button>
        </div>
      )}

      {tab === "impact" && (
        <div className="animate-fade-in">
          {!hasOrgProfile ? (
            <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-8 text-center">
              <p className="text-[var(--text-muted)] mb-4">
                Complete your organisation profile to see personalised impact analysis.
              </p>
              <a
                href="/onboarding"
                className="inline-block bg-[var(--accent)] text-[var(--bg)] px-6 py-2.5 rounded-lg font-semibold hover:bg-[var(--accent-hover)] transition-colors"
              >
                Complete Profile
              </a>
            </div>
          ) : !impact ? (
            <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-8 text-center">
              <p className="text-[var(--text-muted)] mb-4">
                Generate an AI-powered impact analysis specific to your organisation.
              </p>
              <button
                onClick={generateImpact}
                disabled={loadingImpact}
                className="bg-[var(--accent)] text-[var(--bg)] px-6 py-2.5 rounded-lg font-semibold hover:bg-[var(--accent-hover)] transition-colors disabled:opacity-50"
              >
                {loadingImpact ? "Analysing..." : "Analyse Impact"}
              </button>
            </div>
          ) : (
            <div>
              {/* Risk & Urgency badges */}
              <div className="flex gap-3 mb-6">
                <RiskBadge level={impact.risk_level} />
                <UrgencyChip urgency={impact.urgency} />
              </div>

              {/* Impact text */}
              <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-6 mb-6">
                <p className="text-[var(--text)] leading-relaxed whitespace-pre-line">
                  {impact.impact_text}
                </p>
              </div>

              {/* Action items */}
              {impact.action_items?.length > 0 && (
                <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5 mb-6">
                  <h3 className="text-sm font-semibold text-[var(--accent)] uppercase tracking-wider mb-3" style={{ fontFamily: "DM Sans, sans-serif" }}>
                    Action Items
                  </h3>
                  <div className="space-y-2">
                    {impact.action_items.map((item, i) => (
                      <label
                        key={i}
                        className="flex items-start gap-3 cursor-pointer group"
                      >
                        <input
                          type="checkbox"
                          checked={checkedItems.has(i)}
                          onChange={() => toggleChecked(i)}
                          className="mt-1 accent-[var(--accent)]"
                        />
                        <span
                          className={`text-sm ${
                            checkedItems.has(i)
                              ? "text-[var(--text-dim)] line-through"
                              : "text-[var(--text-muted)] group-hover:text-white"
                          }`}
                        >
                          {i + 1}. {item}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Affected areas */}
              {impact.affected_business_areas?.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {impact.affected_business_areas.map((area) => (
                    <span
                      key={area}
                      className="text-xs bg-[var(--accent)]/10 text-[var(--accent)] px-3 py-1 rounded-full"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              )}

              {/* Regenerate */}
              <button
                onClick={generateImpact}
                disabled={loadingImpact}
                className="text-sm text-[var(--text-dim)] hover:text-[var(--accent)] transition-colors"
              >
                🔄 Regenerate Analysis
              </button>
            </div>
          )}
        </div>
      )}

      {/* Related documents */}
      {related.length > 0 && (
        <div className="mt-10 border-t border-[var(--border)] pt-8">
          <h3 className="text-lg font-bold text-white mb-4">Related Updates</h3>
          <div className="space-y-2">
            {related.map((r) => (
              <a
                key={r.id}
                href={`/dashboard/brief/${r.id}`}
                className="flex items-center gap-3 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-3 hover:border-[var(--accent)]/30 transition-all"
              >
                <SeverityBadge severity={r.severity} />
                <span className="text-sm text-[var(--text-muted)] flex-1 line-clamp-1">
                  {r.title}
                </span>
                <span className="text-xs text-[var(--text-dim)] mono">{r.sourceShortName}</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
