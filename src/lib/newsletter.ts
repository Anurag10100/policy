import type { PolicySummary } from "./summarizer";

export function generateNewsletterHTML(
  sector: string,
  summaries: PolicySummary[],
  weekOf: string
): string {
  const sectorColors: Record<string, string> = {
    BFSI: "#1e3a5f",
    Healthcare: "#166534",
    Energy: "#b45309",
    EdTech: "#7c3aed",
  };

  const color = sectorColors[sector] || "#1e3a5f";

  const summaryBlocks = summaries
    .map(
      (s) => `
    <div style="background: #f8fafc; border-left: 4px solid ${color}; padding: 16px; margin-bottom: 16px; border-radius: 0 8px 8px 0;">
      <h3 style="margin: 0 0 8px 0; color: ${color}; font-size: 16px;">${s.title}</h3>
      <p style="margin: 0 0 8px 0; color: #475569; font-size: 14px;">${s.summary}</p>
      <p style="margin: 0 0 4px 0; font-size: 13px; color: #64748b;">
        <strong>Source:</strong> ${s.source} | <strong>Effective:</strong> ${s.effectiveDate || "Not specified"}
      </p>
      ${
        s.keyChanges.length > 0
          ? `<div style="margin-top: 8px;">
          <p style="font-size: 13px; font-weight: 600; color: #334155; margin: 0 0 4px 0;">Key Changes:</p>
          <ul style="margin: 0; padding-left: 16px; font-size: 13px; color: #475569;">
            ${s.keyChanges.map((c) => `<li>${c}</li>`).join("")}
          </ul>
        </div>`
          : ""
      }
      <p style="margin: 8px 0 0 0; font-size: 13px; color: #dc2626;">
        <strong>Action Required:</strong> ${s.actionRequired}
      </p>
    </div>
  `
    )
    .join("");

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 640px; margin: 0 auto; padding: 20px; color: #1e293b;">
  <div style="background: ${color}; color: white; padding: 24px; border-radius: 12px; margin-bottom: 24px;">
    <h1 style="margin: 0; font-size: 22px;">PolicyAI Weekly Briefing</h1>
    <p style="margin: 8px 0 0 0; opacity: 0.8; font-size: 14px;">${sector} Sector | Week of ${weekOf}</p>
  </div>
  <p style="color: #64748b; font-size: 14px; margin-bottom: 20px;">
    ${summaries.length} regulatory update${summaries.length !== 1 ? "s" : ""} this week. AI-summarized for quick action.
  </p>
  ${summaryBlocks}
  <div style="border-top: 1px solid #e2e8f0; padding-top: 16px; margin-top: 24px; font-size: 12px; color: #94a3b8; text-align: center;">
    <p>Powered by <strong>PolicyAI</strong> — India's AI-native policy intelligence platform</p>
    <p><a href="https://policyai.com" style="color: ${color};">policyai.com</a></p>
  </div>
</body>
</html>`;
}
