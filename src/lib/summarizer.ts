import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

interface DocumentInput {
  title?: string;
  content: string;
  source?: string;
  sector?: string;
}

export interface PolicySummary {
  title: string;
  sector: string;
  source: string;
  summary: string;
  keyChanges: string[];
  affectedEntities: string[];
  actionRequired: string;
  effectiveDate: string | null;
  originalLength: number;
  summarizedAt: string;
}

export async function summarizeDocument(
  doc: DocumentInput
): Promise<PolicySummary> {
  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1500,
    messages: [
      {
        role: "user",
        content: `You are a regulatory intelligence analyst specializing in Indian policy and regulation.

Analyze the following government/regulatory document and produce a structured summary.

Document Title: ${doc.title || "Unknown"}
Source: ${doc.source || "Unknown"}
Sector: ${doc.sector || "General"}

Document Content:
${doc.content}

Respond in JSON format with these fields:
{
  "title": "A clear, concise title for this update",
  "sector": "BFSI | Healthcare | Energy | EdTech | General",
  "source": "The issuing authority",
  "summary": "2-3 sentence plain-English summary of what this document says and why it matters",
  "keyChanges": ["List of specific regulatory changes introduced"],
  "affectedEntities": ["Types of organizations/individuals affected"],
  "actionRequired": "What compliance teams need to do in response",
  "effectiveDate": "When this takes effect (null if not specified)"
}`,
      },
    ],
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "";

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Failed to parse AI summary response");
  }

  const parsed = JSON.parse(jsonMatch[0]);

  return {
    ...parsed,
    originalLength: doc.content.length,
    summarizedAt: new Date().toISOString(),
  };
}
