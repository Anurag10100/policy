import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase-server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic();

const SYSTEM_PROMPT = `You are a senior regulatory intelligence analyst specialising in Indian policy and regulation. Analyse regulatory documents and produce structured intelligence briefs for CXOs and compliance heads. Always respond with valid JSON only. No markdown, no preamble, no code fences.`;

function buildUserPrompt(doc: {
  title: string;
  raw_content: string;
  source_name: string;
  sector_name: string;
}) {
  return `Analyse this Indian regulatory document and return a JSON object:
{
  "summary_short": "2-3 sentence executive TL;DR",
  "summary_full": "Full analysis in markdown with sections: ## What Changed, ## Who Is Affected, ## Key Dates, ## What To Do",
  "severity": "high | medium | low",
  "tags": ["keyword1", "keyword2"],
  "key_dates": [{"label": "string", "date": "YYYY-MM-DD"}],
  "doc_type": "circular | gazette | press_release | bill | guideline"
}
Source: ${doc.source_name} | Sector: ${doc.sector_name}
Title: ${doc.title}
Content: ${doc.raw_content.slice(0, 4000)}`;
}

async function callClaude(
  systemPrompt: string,
  userPrompt: string,
  retry = false
): Promise<Record<string, unknown>> {
  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2000,
    system: systemPrompt,
    messages: [
      {
        role: "user",
        content: retry ? userPrompt + "\n\nReturn ONLY raw JSON." : userPrompt,
      },
    ],
  });

  const text =
    message.content[0].type === "text" ? message.content[0].text : "";

  // Strip code fences if present
  const cleaned = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("No JSON found in response");

  return JSON.parse(jsonMatch[0]);
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

  // Check if summary already exists
  const { data: existingSummary } = await supabase
    .from("summaries")
    .select("id")
    .eq("document_id", document_id)
    .maybeSingle();

  if (existingSummary) {
    return NextResponse.json({ summary_id: existingSummary.id, cached: true });
  }

  // Fetch document with source and sector
  const { data: doc, error: docError } = await supabase
    .from("documents")
    .select("*, source:sources(name, short_name, summaries_today), sector:sectors(name, slug)")
    .eq("id", document_id)
    .single();

  if (docError || !doc) {
    return NextResponse.json({ error: "Document not found" }, { status: 404 });
  }

  // Rate limit: max 50 Claude calls per hour per source
  if (doc.source?.summaries_today >= 50) {
    return NextResponse.json(
      { error: "Rate limit exceeded for this source" },
      { status: 429 }
    );
  }

  const userPrompt = buildUserPrompt({
    title: doc.title,
    raw_content: doc.raw_content || doc.title,
    source_name: doc.source?.name || "Unknown",
    sector_name: doc.sector?.name || "General",
  });

  let parsed: Record<string, unknown>;
  try {
    parsed = await callClaude(SYSTEM_PROMPT, userPrompt);
  } catch {
    try {
      parsed = await callClaude(SYSTEM_PROMPT, userPrompt, true);
    } catch (retryErr) {
      return NextResponse.json(
        { error: "Failed to parse AI response", detail: String(retryErr) },
        { status: 500 }
      );
    }
  }

  const { data: summary, error: insertError } = await supabase
    .from("summaries")
    .insert({
      document_id,
      summary_short: parsed.summary_short,
      summary_full: parsed.summary_full,
      severity: parsed.severity,
      tags: parsed.tags,
      key_dates: parsed.key_dates,
    })
    .select("id")
    .single();

  if (insertError) {
    return NextResponse.json(
      { error: "Failed to save summary", detail: insertError.message },
      { status: 500 }
    );
  }

  // Increment summaries_today counter
  await supabase
    .from("sources")
    .update({ summaries_today: (doc.source?.summaries_today || 0) + 1 })
    .eq("id", doc.source_id);

  return NextResponse.json({ summary_id: summary.id });
}
