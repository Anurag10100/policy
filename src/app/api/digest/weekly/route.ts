import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase-server";
import Anthropic from "@anthropic-ai/sdk";
import { Resend } from "resend";

const anthropic = new Anthropic();

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServiceClient();
  const sevenDaysAgo = new Date(
    Date.now() - 7 * 24 * 60 * 60 * 1000
  ).toISOString();

  // Fetch recent documents with summaries
  const { data: docs } = await supabase
    .from("documents")
    .select("*, source:sources(name, short_name), sector:sectors(name, slug), summary:summaries(*)")
    .gte("published_at", sevenDaysAgo)
    .not("summary", "is", null)
    .order("published_at", { ascending: false });

  if (!docs || docs.length === 0) {
    return NextResponse.json({ message: "No documents this week" });
  }

  // Group by sector
  const bySector: Record<string, typeof docs> = {};
  for (const doc of docs) {
    const slug = doc.sector?.slug || "general";
    if (!bySector[slug]) bySector[slug] = [];
    bySector[slug].push(doc);
  }

  const weekEnding = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  let sectorsSent = 0;
  let emailsSent = 0;

  for (const [sectorSlug, sectorDocs] of Object.entries(bySector)) {
    const sectorName =
      sectorDocs[0]?.sector?.name || sectorSlug.toUpperCase();

    // Build summary text for Claude
    const summariesText = sectorDocs
      .map(
        (d: Record<string, unknown>, i: number) => {
          const source = d.source as Record<string, unknown> | null;
          const summary = d.summary as Record<string, unknown> | null;
          return `${i + 1}. [${source?.short_name}] ${d.title}\n   Severity: ${summary?.severity}\n   ${summary?.summary_short}`;
        }
      )
      .join("\n\n");

    let digestMarkdown: string;
    try {
      const message = await anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2000,
        messages: [
          {
            role: "user",
            content: `Generate a Policy Pulse weekly brief for ${sectorName} sector.
Week ending ${weekEnding}. Here are the regulatory changes:

${summariesText}

Return markdown with sections:
## THIS WEEK IN ${sectorName.toUpperCase()}
## TOP CHANGES (max 5, numbered)
## COMPLIANCE DEADLINES THIS MONTH
## WHAT TO WATCH NEXT WEEK`,
          },
        ],
      });
      digestMarkdown =
        message.content[0].type === "text"
          ? message.content[0].text
          : "Unable to generate digest.";
    } catch {
      digestMarkdown = `## THIS WEEK IN ${sectorName.toUpperCase()}\n\n${sectorDocs.length} regulatory updates this week. Visit policyai.com for details.`;
    }

    // Convert markdown to simple HTML
    const digestHtml = digestMarkdown
      .replace(/^## (.+)$/gm, '<h2 style="color:#c9a84c;margin-top:24px">$1</h2>')
      .replace(/^### (.+)$/gm, '<h3 style="color:#e2e8f0">$1</h3>')
      .replace(/^\d+\.\s(.+)$/gm, '<div style="margin:8px 0;padding-left:16px">• $1</div>')
      .replace(/\n/g, "<br/>");

    const appUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000";

    const emailHtml = `<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:600px;margin:0 auto;padding:20px;background:#0d0f14;color:#e2e8f0">
  <div style="text-align:center;margin-bottom:24px">
    <span style="color:#c9a84c;font-weight:700;font-size:22px">PolicyAI</span>
    <br/><span style="color:#64748b;font-size:13px">Policy Pulse — Weekly Brief</span>
  </div>
  <div style="background:#1a1d27;padding:24px;border-radius:12px;border:1px solid #2a2d37">
    ${digestHtml}
  </div>
  <div style="text-align:center;margin-top:24px">
    <a href="${appUrl}/dashboard" style="display:inline-block;background:#c9a84c;color:#0d0f14;padding:12px 32px;border-radius:8px;text-decoration:none;font-weight:600">View All Briefs on Dashboard</a>
  </div>
  <div style="text-align:center;margin-top:20px;font-size:11px;color:#64748b">
    <a href="${appUrl}/unsubscribe" style="color:#64748b">Unsubscribe</a> · PolicyAI · policyai.com
  </div>
</body></html>`;

    // Fetch subscribers for this sector
    const { data: subscribers } = await supabase
      .from("newsletter_subscribers")
      .select("email")
      .contains("sectors", [sectorSlug]);

    // Also free-tier users subscribed to this sector
    const { data: freeUsers } = await supabase
      .from("users")
      .select("email")
      .eq("plan", "free")
      .contains("subscribed_sectors", [sectorSlug]);

    const allEmails = new Set<string>();
    subscribers?.forEach((s: { email: string }) => allEmails.add(s.email));
    freeUsers?.forEach((u: { email: string }) => allEmails.add(u.email));

    for (const email of allEmails) {
      try {
        await getResend().emails.send({
          from: "PolicyAI <digest@policyai.com>",
          to: [email],
          subject: `Policy Pulse: ${sectorName} — Week of ${weekEnding}`,
          html: emailHtml,
        });
        emailsSent++;
      } catch {
        // Continue
      }
    }

    sectorsSent++;
  }

  return NextResponse.json({ sectors_sent: sectorsSent, emails_sent: emailsSent });
}
