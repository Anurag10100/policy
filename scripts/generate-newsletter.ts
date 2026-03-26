import fs from "fs/promises";
import path from "path";
import { generateNewsletterHTML } from "../src/lib/newsletter";
import type { PolicySummary } from "../src/lib/summarizer";

async function main() {
  const sector = process.argv[2] || "BFSI";

  console.log(`=== PolicyAI Newsletter Generator ===`);
  console.log(`Sector: ${sector}\n`);

  const summariesPath = path.join(process.cwd(), "data", "summaries.json");

  let summaries: PolicySummary[];
  try {
    const data = await fs.readFile(summariesPath, "utf-8");
    summaries = JSON.parse(data);
  } catch {
    console.log("No summaries found. Run 'npm run ingest' first.");
    console.log("Generating sample newsletter with demo data...\n");

    summaries = [
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
        affectedEntities: ["NBFCs", "Digital lending platforms", "Fintech companies"],
        actionRequired:
          "All NBFCs must comply with revised capital requirements by Q3 2026. Digital lenders must update disclosure formats.",
        effectiveDate: "2026-07-01",
        originalLength: 5000,
        summarizedAt: new Date().toISOString(),
      },
      {
        title: "SEBI Tightens FPI Disclosure Requirements",
        sector: "BFSI",
        source: "Securities and Exchange Board of India",
        summary:
          "SEBI has mandated additional disclosure requirements for Foreign Portfolio Investors with concentrated holdings exceeding 50% in a single corporate group.",
        keyChanges: [
          "FPIs with >50% holdings in single group must provide granular beneficial ownership data",
          "Enhanced monitoring framework for P-Note issuers",
          "Quarterly disclosure timeline reduced from 30 to 15 days",
        ],
        affectedEntities: ["FPIs", "Custodians", "P-Note issuers", "Asset managers"],
        actionRequired:
          "Custodians must implement enhanced monitoring systems. FPIs must review portfolio concentration levels.",
        effectiveDate: "2026-04-15",
        originalLength: 3200,
        summarizedAt: new Date().toISOString(),
      },
    ];
  }

  const sectorSummaries = summaries.filter(
    (s) => s.sector.toUpperCase() === sector.toUpperCase()
  );

  const today = new Date();
  const weekOf = today.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const html = generateNewsletterHTML(
    sector,
    sectorSummaries.length > 0 ? sectorSummaries : summaries,
    weekOf
  );

  const outputDir = path.join(process.cwd(), "data");
  await fs.mkdir(outputDir, { recursive: true });
  const outputPath = path.join(
    outputDir,
    `newsletter-${sector.toLowerCase()}-${today.toISOString().split("T")[0]}.html`
  );
  await fs.writeFile(outputPath, html);

  console.log(`Newsletter generated: ${outputPath}`);
  console.log(`Contains ${sectorSummaries.length || summaries.length} policy updates`);
}

main().catch(console.error);
