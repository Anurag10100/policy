import { createServiceClient } from "@/lib/supabase-server";

function SeverityBadge({ severity }: { severity: string }) {
  const colors: Record<string, string> = {
    high: "bg-red-500/20 text-red-400 border-red-500/30",
    medium: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    low: "bg-green-500/20 text-green-400 border-green-500/30",
  };
  return (
    <span
      className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${colors[severity] || colors.low}`}
    >
      {severity.toUpperCase()}
    </span>
  );
}

// Sample data as fallback when DB isn't connected
const sampleAlerts = [
  {
    id: "1",
    title: "RBI Revises NBFC Capital Adequacy Norms",
    severity: "high",
    source_name: "RBI",
    summary_short:
      "Minimum capital adequacy ratio for NBFCs increased to 15%. Digital lending platforms must disclose all-in cost of lending. Effective Q3 2026.",
    published_at: "2026-03-24T10:00:00Z",
  },
  {
    id: "2",
    title: "SEBI Tightens FPI Disclosure Requirements",
    severity: "high",
    source_name: "SEBI",
    summary_short:
      "FPIs with >50% holdings in single group must provide granular beneficial ownership data. Quarterly disclosure timeline reduced to 15 days.",
    published_at: "2026-03-23T14:00:00Z",
  },
  {
    id: "3",
    title: "MNRE Releases Draft Green Hydrogen Standards",
    severity: "medium",
    source_name: "MNRE",
    summary_short:
      "New standards for green hydrogen production and certification. Industry consultation period open until April 30, 2026.",
    published_at: "2026-03-22T09:00:00Z",
  },
  {
    id: "4",
    title: "MoE Updates NEP Implementation Guidelines",
    severity: "medium",
    source_name: "MoE",
    summary_short:
      "Revised implementation timeline for NEP 2020 reforms in higher education. New compliance deadlines for universities and colleges.",
    published_at: "2026-03-21T11:00:00Z",
  },
  {
    id: "5",
    title: "IRDAI Circular on Cyber Insurance Frameworks",
    severity: "medium",
    source_name: "IRDAI",
    summary_short:
      "Mandatory cyber insurance guidelines for all general insurers. Standardised policy terms and claim settlement procedures.",
    published_at: "2026-03-20T16:00:00Z",
  },
  {
    id: "6",
    title: "TRAI Consultation on Spectrum Sharing Norms",
    severity: "low",
    source_name: "TRAI",
    summary_short:
      "Open consultation on updated spectrum sharing and trading framework. Comments invited from industry stakeholders.",
    published_at: "2026-03-19T12:00:00Z",
  },
];

export async function AlertCards() {
  let alerts = sampleAlerts;

  try {
    const supabase = createServiceClient();
    const { data } = await supabase
      .from("documents")
      .select(
        "id, title, published_at, source:sources(name, short_name), summary:summaries(summary_short, severity)"
      )
      .not("summary", "is", null)
      .order("published_at", { ascending: false })
      .limit(6);

    if (data && data.length > 0) {
      alerts = data.map((d: Record<string, unknown>) => {
        const source = (Array.isArray(d.source) ? d.source[0] : d.source) as Record<string, unknown> | null;
        const summary = (Array.isArray(d.summary) ? d.summary[0] : d.summary) as Record<string, unknown> | null;
        return {
          id: d.id as string,
          title: d.title as string,
          severity: (summary?.severity as string) || "low",
          source_name: (source?.short_name as string) || "Unknown",
          summary_short: (summary?.summary_short as string) || "",
          published_at: d.published_at as string,
        };
      });
    }
  } catch {
    // Use sample data
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5 hover:border-[var(--accent)]/30 transition-all animate-fade-in"
        >
          <div className="flex items-center gap-2 mb-3">
            <SeverityBadge severity={alert.severity} />
            <span className="text-xs text-[var(--text-dim)] mono">
              {alert.source_name}
            </span>
          </div>
          <h3 className="font-semibold text-white text-sm mb-2 line-clamp-2" style={{ fontFamily: "DM Sans, sans-serif" }}>
            {alert.title}
          </h3>
          <p className="text-sm text-[var(--text-muted)] line-clamp-3 mb-3">
            {alert.summary_short}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-[var(--text-dim)]">
              {alert.published_at
                ? new Date(alert.published_at).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    timeZone: "Asia/Kolkata",
                  })
                : ""}
            </span>
            <a
              href={`/dashboard/brief/${alert.id}`}
              className="text-xs text-[var(--accent)] hover:text-[var(--accent-hover)] font-medium"
            >
              Read Brief →
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}
