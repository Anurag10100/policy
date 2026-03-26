import { createClient } from "@/lib/supabase-server";
import { BriefView } from "@/components/BriefView";
import { notFound } from "next/navigation";

export default async function BriefPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { id } = await params;
  const { tab } = await searchParams;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: doc } = await supabase
    .from("documents")
    .select(
      "*, source:sources(name, short_name), sector:sectors(name, slug), summary:summaries(*)"
    )
    .eq("id", id)
    .single();

  if (!doc) notFound();

  // Get related documents (same sector, last 7 days)
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const { data: related } = await supabase
    .from("documents")
    .select(
      "id, title, published_at, source:sources(short_name), summary:summaries(severity)"
    )
    .eq("sector_id", doc.sector_id)
    .neq("id", id)
    .gte("published_at", weekAgo)
    .not("summary", "is", null)
    .order("published_at", { ascending: false })
    .limit(5);

  // Check for existing impact summary
  let impactSummary = null;
  let hasOrgProfile = false;
  if (user) {
    const { data: orgProfile } = await supabase
      .from("org_profiles")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();
    hasOrgProfile = !!orgProfile;

    if (orgProfile) {
      const { data: impact } = await supabase
        .from("impact_summaries")
        .select("*")
        .eq("document_id", id)
        .eq("user_id", user.id)
        .maybeSingle();
      impactSummary = impact;
    }
  }

  return (
    <BriefView
      document={{
        id: doc.id,
        title: doc.title,
        url: doc.url,
        publishedAt: doc.published_at,
        sourceName: doc.source?.name || "Unknown",
        sourceShortName: doc.source?.short_name || "",
        sectorName: doc.sector?.name || "General",
      }}
      summary={
        doc.summary
          ? {
              summaryShort: doc.summary.summary_short,
              summaryFull: doc.summary.summary_full,
              severity: doc.summary.severity,
              tags: doc.summary.tags || [],
              keyDates: doc.summary.key_dates || [],
            }
          : null
      }
      related={(related || []).map((r: Record<string, unknown>) => {
        const src = Array.isArray(r.source) ? r.source[0] : r.source;
        const sum = Array.isArray(r.summary) ? r.summary[0] : r.summary;
        return {
          id: r.id as string,
          title: r.title as string,
          publishedAt: r.published_at as string,
          sourceShortName: (src as Record<string, unknown>)?.short_name as string || "",
          severity: (sum as Record<string, unknown>)?.severity as string || "low",
        };
      })}
      impactSummary={impactSummary}
      hasOrgProfile={hasOrgProfile}
      userId={user?.id || null}
      initialTab={tab || "brief"}
    />
  );
}
