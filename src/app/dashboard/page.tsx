import { createClient } from "@/lib/supabase-server";
import { DashboardFeed } from "@/components/DashboardFeed";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ sector?: string; filter?: string; q?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch user profile for subscribed sectors
  let subscribedSectors: string[] = [];
  if (user) {
    const { data: profile } = await supabase
      .from("users")
      .select("subscribed_sectors, plan")
      .eq("id", user.id)
      .single();
    subscribedSectors = profile?.subscribed_sectors || [];
  }

  // Build query
  let query = supabase
    .from("documents")
    .select(
      "id, title, published_at, url, source:sources(name, short_name), sector:sectors(name, slug), summary:summaries(summary_short, severity, tags)"
    )
    .not("summary", "is", null)
    .order("published_at", { ascending: false })
    .limit(50);

  if (params.sector) {
    const { data: sectorRow } = await supabase
      .from("sectors")
      .select("id")
      .eq("slug", params.sector)
      .single();
    if (sectorRow) {
      query = query.eq("sector_id", sectorRow.id);
    }
  }

  const { data: documents } = await query;

  // Format for client (Supabase returns arrays for joins without .single())
  const feed = (documents || []).map((d: Record<string, unknown>) => {
    const source = (Array.isArray(d.source) ? d.source[0] : d.source) as Record<string, unknown> | null;
    const sector = (Array.isArray(d.sector) ? d.sector[0] : d.sector) as Record<string, unknown> | null;
    const summary = (Array.isArray(d.summary) ? d.summary[0] : d.summary) as Record<string, unknown> | null;
    return {
      id: d.id as string,
      title: d.title as string,
      publishedAt: d.published_at as string,
      url: d.url as string,
      sourceName: (source?.short_name as string) || "Unknown",
      sectorName: (sector?.name as string) || "General",
      sectorSlug: (sector?.slug as string) || "",
      summaryShort: (summary?.summary_short as string) || "",
      severity: (summary?.severity as string) || "low",
      tags: (summary?.tags as string[]) || [],
    };
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">
          {params.sector
            ? `${feed[0]?.sectorName || params.sector.toUpperCase()} Intelligence`
            : "Your Policy Feed"}
        </h1>
        <p className="text-[var(--text-muted)] text-sm">
          {feed.length} regulatory updates
          {params.sector ? ` in ${params.sector.toUpperCase()}` : ""}
        </p>
      </div>
      <DashboardFeed
        initialFeed={feed}
        activeSector={params.sector || "all"}
        activeFilter={params.filter || "all"}
        searchQuery={params.q || ""}
      />
    </div>
  );
}
