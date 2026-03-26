import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase-server";
import { Resend } from "resend";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

function severityBadge(severity: string) {
  const colors: Record<string, { bg: string; text: string }> = {
    high: { bg: "#dc2626", text: "#ffffff" },
    medium: { bg: "#f59e0b", text: "#000000" },
    low: { bg: "#22c55e", text: "#ffffff" },
  };
  const c = colors[severity] || colors.low;
  return `<span style="display:inline-block;background:${c.bg};color:${c.text};padding:2px 10px;border-radius:12px;font-size:12px;font-weight:600;text-transform:uppercase">${severity}</span>`;
}

function buildAlertEmail(doc: {
  title: string;
  source_name: string;
  severity: string;
  summary_short: string;
  key_dates: Array<{ label: string; date: string }>;
  document_id: string;
  impact?: {
    risk_level?: string;
    urgency?: string;
    action_items?: string[];
  };
  has_profile?: boolean;
}) {
  const appUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

  const keyDatesHtml =
    doc.key_dates?.length > 0
      ? `<div style="margin:12px 0"><strong>Key Dates:</strong><ul style="margin:4px 0">${doc.key_dates.map((d) => `<li>${d.label}: ${d.date}</li>`).join("")}</ul></div>`
      : "";

  const impactHtml =
    doc.impact && doc.has_profile
      ? `<div style="background:#fef3c7;padding:12px;border-radius:8px;margin:12px 0">
          <strong>Impact on Your Organisation</strong><br/>
          <span style="font-size:13px">Risk: ${doc.impact.risk_level || "N/A"} | Urgency: ${doc.impact.urgency || "N/A"}</span>
          ${doc.impact.action_items?.slice(0, 2).map((a) => `<br/>→ ${a}`).join("") || ""}
          <br/><a href="${appUrl}/dashboard/brief/${doc.document_id}?tab=impact" style="color:#b45309;font-weight:600">See Full Impact Analysis →</a>
        </div>`
      : doc.has_profile === false
        ? `<div style="font-size:12px;color:#64748b;margin-top:8px">Get personalised impact analysis → <a href="${appUrl}/onboarding" style="color:#c9a84c">Complete your profile</a></div>`
        : "";

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:600px;margin:0 auto;padding:20px;background:#0d0f14;color:#e2e8f0">
  <div style="text-align:center;margin-bottom:20px">
    <span style="color:#c9a84c;font-weight:700;font-size:20px">PolicyAI</span>
  </div>
  <div style="background:#1a1d27;padding:24px;border-radius:12px;border:1px solid #2a2d37">
    <div style="margin-bottom:12px">${severityBadge(doc.severity)} <span style="color:#94a3b8;font-size:13px;margin-left:8px">${doc.source_name}</span></div>
    <h2 style="margin:0 0 12px 0;color:#ffffff;font-size:18px">${doc.title}</h2>
    <p style="color:#cbd5e1;font-size:14px;line-height:1.6">${doc.summary_short}</p>
    ${keyDatesHtml}
    ${impactHtml}
    <a href="${appUrl}/dashboard/brief/${doc.document_id}" style="display:inline-block;background:#c9a84c;color:#0d0f14;padding:10px 24px;border-radius:8px;text-decoration:none;font-weight:600;margin-top:16px">Read Full Brief</a>
  </div>
  <div style="text-align:center;margin-top:20px;font-size:11px;color:#64748b">
    <a href="${appUrl}/unsubscribe" style="color:#64748b">Unsubscribe</a> · PolicyAI · policyai.com
  </div>
</body></html>`;
}

export async function POST(req: NextRequest) {
  const supabase = createServiceClient();
  const { document_id } = await req.json();

  if (!document_id) {
    return NextResponse.json(
      { error: "document_id required" },
      { status: 400 }
    );
  }

  // Fetch document + summary
  const { data: doc } = await supabase
    .from("documents")
    .select("*, source:sources(name, short_name), sector:sectors(slug, name), summary:summaries(*)")
    .eq("id", document_id)
    .single();

  if (!doc || !doc.summary) {
    return NextResponse.json(
      { error: "Document or summary not found" },
      { status: 404 }
    );
  }

  // Find users subscribed to this sector (paid users only for real-time alerts)
  const sectorSlug = doc.sector?.slug;
  const { data: users } = await supabase
    .from("users")
    .select("*")
    .neq("plan", "free")
    .contains("subscribed_sectors", sectorSlug ? [sectorSlug] : []);

  // Also find users with matching tracked items
  const { data: trackedUsers } = await supabase
    .from("tracked_items")
    .select("user_id, track_value")
    .eq("is_active", true);

  const matchedTrackedUserIds = new Set<string>();
  if (trackedUsers) {
    for (const item of trackedUsers) {
      const val = item.track_value.toLowerCase();
      const titleLower = doc.title.toLowerCase();
      const tagsLower = (doc.summary.tags || []).map((t: string) =>
        t.toLowerCase()
      );
      if (titleLower.includes(val) || tagsLower.some((t: string) => t.includes(val))) {
        matchedTrackedUserIds.add(item.user_id);
      }
    }
  }

  // Merge user lists
  const allUserIds = new Set(
    (users || []).map((u: { id: string }) => u.id)
  );
  for (const uid of matchedTrackedUserIds) allUserIds.add(uid);

  let sent = 0;
  for (const userId of allUserIds as Set<string>) {
    let user = (users || []).find((u: { id: string }) => u.id === userId);
    if (!user) {
      const { data } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();
      user = data;
    }
    if (!user || user.plan === "free") continue;

    // Check for org profile
    const { data: orgProfile } = await supabase
      .from("org_profiles")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();

    let impact;
    if (orgProfile) {
      try {
        const appUrl = process.env.VERCEL_URL
          ? `https://${process.env.VERCEL_URL}`
          : "http://localhost:3000";
        const impactRes = await fetch(`${appUrl}/api/impact`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ document_id, user_id: userId }),
        });
        if (impactRes.ok) impact = await impactRes.json();
      } catch {
        // Non-blocking
      }
    }

    const isTrackedMatch = matchedTrackedUserIds.has(userId);
    const emailSubject = isTrackedMatch
      ? `🔔 Match: ${doc.title.slice(0, 60)}`
      : `${doc.summary.severity === "high" ? "🔴" : "🟡"} ${doc.source?.short_name}: ${doc.title.slice(0, 50)}`;

    const html = buildAlertEmail({
      title: doc.title,
      source_name: doc.source?.name || "Unknown",
      severity: doc.summary.severity,
      summary_short: doc.summary.summary_short,
      key_dates: doc.summary.key_dates || [],
      document_id,
      impact,
      has_profile: !!orgProfile,
    });

    try {
      await getResend().emails.send({
        from: "PolicyAI Alerts <alerts@policyai.com>",
        to: [user.email],
        subject: emailSubject,
        html,
      });

      await supabase.from("alerts").insert({
        user_id: userId,
        document_id,
        triggered_by: isTrackedMatch ? "watchlist" : "sector_subscription",
        channel: "email",
      });

      sent++;
    } catch {
      // Log but continue
    }
  }

  return NextResponse.json({ sent, total_users: allUserIds.size });
}
