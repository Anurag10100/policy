import { createClient } from "@/lib/supabase-server";
import { WatchlistManager } from "@/components/WatchlistManager";
import { redirect } from "next/navigation";

export default async function WatchlistPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: items } = await supabase
    .from("tracked_items")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  // Count matches for each tracked item (documents from last 7 days)
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const { data: recentDocs } = await supabase
    .from("documents")
    .select("id, title, summary:summaries(tags)")
    .gte("published_at", weekAgo);

  const matchCounts: Record<string, number> = {};
  for (const item of items || []) {
    const val = item.track_value.toLowerCase();
    matchCounts[item.id] = (recentDocs || []).filter((d: Record<string, unknown>) => {
      const titleMatch = (d.title as string).toLowerCase().includes(val);
      const summary = (Array.isArray(d.summary) ? d.summary[0] : d.summary) as Record<string, unknown> | null;
      const tagMatch = ((summary?.tags as string[]) || []).some((t: string) =>
        t.toLowerCase().includes(val)
      );
      return titleMatch || tagMatch;
    }).length;
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">Watchlist</h1>
        <p className="text-[var(--text-muted)] text-sm">
          Track specific keywords, ministries, or bill numbers. Get alerts when matches are found.
        </p>
      </div>
      <WatchlistManager
        initialItems={(items || []).map((item) => ({
          ...item,
          matchCount: matchCounts[item.id] || 0,
        }))}
        userId={user.id}
      />
    </div>
  );
}
