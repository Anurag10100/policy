import fs from "fs/promises";
import path from "path";

interface PolicySummary {
  title: string;
  sector: string;
  source: string;
  summary: string;
  keyChanges: string[];
  affectedEntities: string[];
  actionRequired: string;
  effectiveDate: string | null;
}

async function getSampleSummaries(): Promise<PolicySummary[]> {
  try {
    const data = await fs.readFile(
      path.join(process.cwd(), "data", "summaries.json"),
      "utf-8"
    );
    return JSON.parse(data);
  } catch {
    return [
      {
        title: "RBI Updates NBFC Lending Guidelines",
        sector: "BFSI",
        source: "Reserve Bank of India",
        summary:
          "The RBI has revised guidelines for NBFC lending, introducing stricter capital adequacy requirements and enhanced disclosure norms for digital lending platforms.",
        keyChanges: [
          "Minimum capital adequacy ratio increased to 15% for all NBFCs",
          "Digital lending platforms must disclose all-in cost of lending",
          "New KYC requirements for micro-lending under INR 50,000",
        ],
        affectedEntities: [
          "NBFCs",
          "Digital lending platforms",
          "Fintech companies",
        ],
        actionRequired:
          "All NBFCs must comply with revised capital requirements by Q3 2026.",
        effectiveDate: "2026-07-01",
      },
      {
        title: "SEBI Tightens FPI Disclosure Requirements",
        sector: "BFSI",
        source: "Securities and Exchange Board of India",
        summary:
          "SEBI has mandated additional disclosure requirements for FPIs with concentrated holdings exceeding 50% in a single corporate group.",
        keyChanges: [
          "FPIs with >50% holdings in single group must provide granular beneficial ownership data",
          "Enhanced monitoring framework for P-Note issuers",
          "Quarterly disclosure timeline reduced from 30 to 15 days",
        ],
        affectedEntities: [
          "FPIs",
          "Custodians",
          "P-Note issuers",
          "Asset managers",
        ],
        actionRequired:
          "Custodians must implement enhanced monitoring systems. FPIs must review portfolio concentration levels.",
        effectiveDate: "2026-04-15",
      },
    ];
  }
}

export default async function NewsletterPreview() {
  const summaries = await getSampleSummaries();
  const today = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-[var(--color-primary)] text-white p-6 rounded-t-xl">
          <p className="text-sm text-blue-300 mb-1">Preview</p>
          <h1 className="text-2xl font-bold">PolicyAI Weekly Briefing</h1>
          <p className="text-blue-200 text-sm mt-1">
            BFSI Sector | Week of {today}
          </p>
        </div>

        <div className="bg-white p-6 rounded-b-xl shadow-sm">
          <p className="text-gray-500 text-sm mb-6">
            {summaries.length} regulatory update
            {summaries.length !== 1 ? "s" : ""} this week. AI-summarized for
            quick action.
          </p>

          {summaries.map((s, i) => (
            <div
              key={i}
              className="border-l-4 border-[var(--color-primary)] bg-gray-50 p-4 rounded-r-lg mb-4"
            >
              <h3 className="font-bold text-[var(--color-primary)] mb-2">
                {s.title}
              </h3>
              <p className="text-gray-600 text-sm mb-3">{s.summary}</p>
              <p className="text-xs text-gray-400 mb-2">
                <strong>Source:</strong> {s.source} |{" "}
                <strong>Effective:</strong> {s.effectiveDate || "Not specified"}
              </p>

              {s.keyChanges.length > 0 && (
                <div className="mb-2">
                  <p className="text-xs font-semibold text-gray-700 mb-1">
                    Key Changes:
                  </p>
                  <ul className="text-xs text-gray-600 list-disc pl-4 space-y-0.5">
                    {s.keyChanges.map((c, j) => (
                      <li key={j}>{c}</li>
                    ))}
                  </ul>
                </div>
              )}

              <p className="text-xs text-red-600 mt-2">
                <strong>Action Required:</strong> {s.actionRequired}
              </p>
            </div>
          ))}

          <div className="border-t pt-4 mt-6 text-center text-xs text-gray-400">
            <p>
              Powered by <strong>PolicyAI</strong> — India&apos;s AI-native
              policy intelligence platform
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <a
            href="/"
            className="text-[var(--color-primary)] text-sm hover:underline"
          >
            &larr; Back to PolicyAI
          </a>
        </div>
      </div>
    </main>
  );
}
