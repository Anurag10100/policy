import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase-server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic();

export async function POST(req: NextRequest) {
  const supabase = createServiceClient();
  const { document_id, user_id } = await req.json();

  if (!document_id || !user_id) {
    return NextResponse.json(
      { error: "document_id and user_id required" },
      { status: 400 }
    );
  }

  // Fetch org profile
  const { data: org } = await supabase
    .from("org_profiles")
    .select("*")
    .eq("user_id", user_id)
    .maybeSingle();

  if (!org) {
    return NextResponse.json(
      { error: "complete_profile" },
      { status: 400 }
    );
  }

  // Check cache
  const { data: existing } = await supabase
    .from("impact_summaries")
    .select("*")
    .eq("document_id", document_id)
    .eq("user_id", user_id)
    .maybeSingle();

  if (existing) {
    return NextResponse.json(existing);
  }

  // Fetch summary
  const { data: doc } = await supabase
    .from("documents")
    .select("*, summary:summaries(*)")
    .eq("id", document_id)
    .single();

  if (!doc?.summary) {
    return NextResponse.json(
      { error: "Document summary not found" },
      { status: 404 }
    );
  }

  try {
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2000,
      system:
        "You are a regulatory compliance advisor for Indian enterprises. Given a regulatory change and an organisation profile, analyse the specific impact and required actions. Respond with valid JSON only.",
      messages: [
        {
          role: "user",
          content: `Regulatory Change:
${doc.summary.summary_full}

Organisation:
Company: ${org.company_name}
Industry: ${org.industry}
States: ${(org.states_of_operation || []).join(", ")}
Regulatory Exposure: ${(org.regulatory_exposure || []).join(", ")}
Priority Areas: ${(org.priority_keywords || []).join(", ")}

Return JSON:
{
  "impact_text": "3-4 paragraph org-specific analysis",
  "action_required": boolean,
  "urgency": "immediate | this_week | this_month | monitor",
  "action_items": ["action 1", "action 2", "action 3"],
  "risk_level": "critical | high | medium | low | none",
  "affected_business_areas": ["area1", "area2"]
}`,
        },
      ],
    });

    const text =
      message.content[0].type === "text" ? message.content[0].text : "";
    const cleaned = text
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/, "");
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON in response");
    const parsed = JSON.parse(jsonMatch[0]);

    const { data: impact, error } = await supabase
      .from("impact_summaries")
      .insert({
        document_id,
        user_id,
        org_profile_id: org.id,
        impact_text: parsed.impact_text,
        action_required: parsed.action_required,
        urgency: parsed.urgency,
        action_items: parsed.action_items,
        risk_level: parsed.risk_level,
        affected_business_areas: parsed.affected_business_areas,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: "Failed to save", detail: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(impact);
  } catch (err) {
    return NextResponse.json(
      { error: "AI analysis failed", detail: String(err) },
      { status: 500 }
    );
  }
}
