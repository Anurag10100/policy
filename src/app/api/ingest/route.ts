import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase-server";
import { XMLParser } from "fast-xml-parser";

const parser = new XMLParser({ ignoreAttributes: false });

async function ingestRSS(
  supabase: ReturnType<typeof createServiceClient>,
  source: { id: string; feed_url: string; sector_id: string | null }
) {
  const res = await fetch(source.feed_url, {
    headers: { "User-Agent": "PolicyAI/1.0" },
  });
  if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);

  const xml = await res.text();
  const parsed = parser.parse(xml);

  const channel = parsed?.rss?.channel ?? parsed?.feed;
  if (!channel) return { ingested: 0, skipped: 0 };

  const items: unknown[] = Array.isArray(channel.item)
    ? channel.item
    : channel.item
      ? [channel.item]
      : Array.isArray(channel.entry)
        ? channel.entry
        : channel.entry
          ? [channel.entry]
          : [];

  let ingested = 0;
  let skipped = 0;

  for (const raw of items) {
    const item = raw as Record<string, unknown>;
    const link =
      typeof item.link === "string"
        ? item.link
        : (item.link as Record<string, unknown>)?.["@_href"] ?? "";
    const externalId = String(link || item.guid || item.id || "");
    if (!externalId) {
      skipped++;
      continue;
    }

    const title = String(item.title || "Untitled");
    const description = String(item.description || item.summary || item.content || "");
    const pubDate = item.pubDate || item.published || item.updated;

    // Check if already exists
    const { data: existing } = await supabase
      .from("documents")
      .select("id")
      .eq("source_id", source.id)
      .eq("external_id", externalId)
      .maybeSingle();

    if (existing) {
      skipped++;
      continue;
    }

    const { data: doc, error } = await supabase
      .from("documents")
      .insert({
        source_id: source.id,
        sector_id: source.sector_id,
        external_id: externalId,
        title,
        raw_content: description,
        published_at: pubDate ? new Date(String(pubDate)).toISOString() : null,
        url: String(link),
      })
      .select("id")
      .single();

    if (error) {
      skipped++;
      continue;
    }

    // Trigger summarisation (fire-and-forget to avoid timeout)
    try {
      const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        ? process.env.VERCEL_URL
          ? `https://${process.env.VERCEL_URL}`
          : "http://localhost:3000"
        : "http://localhost:3000";

      fetch(`${baseUrl}/api/summarise`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ document_id: doc.id }),
      }).catch(() => {});
    } catch {
      // Non-blocking
    }

    ingested++;
  }

  // Update last fetched
  await supabase
    .from("sources")
    .update({ last_fetched_at: new Date().toISOString() })
    .eq("id", source.id);

  return { ingested, skipped };
}

export async function POST(req: NextRequest) {
  const supabase = createServiceClient();
  const { source_id } = await req.json();

  if (!source_id) {
    return NextResponse.json({ error: "source_id required" }, { status: 400 });
  }

  const { data: source, error } = await supabase
    .from("sources")
    .select("*")
    .eq("id", source_id)
    .single();

  if (error || !source) {
    return NextResponse.json({ error: "Source not found" }, { status: 404 });
  }

  if (source.feed_type !== "rss") {
    return NextResponse.json(
      { error: "Only RSS ingestion supported currently" },
      { status: 400 }
    );
  }

  try {
    const result = await ingestRSS(supabase, source);
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: String(err) },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  // CRON_SECRET protection
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServiceClient();
  const { data: sources } = await supabase
    .from("sources")
    .select("*")
    .eq("is_active", true)
    .eq("feed_type", "rss");

  if (!sources || sources.length === 0) {
    return NextResponse.json({ message: "No active RSS sources" });
  }

  const results = [];
  for (const source of sources) {
    try {
      const result = await ingestRSS(supabase, source);
      results.push({ source: source.short_name, ...result });
    } catch (err) {
      results.push({ source: source.short_name, error: String(err) });
    }
  }

  return NextResponse.json({ results });
}
