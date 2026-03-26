import { NextRequest, NextResponse } from "next/server";
import { summarizeDocument } from "@/lib/summarizer";

export async function POST(req: NextRequest) {
  const { title, content, source, sector } = await req.json();

  if (!content) {
    return NextResponse.json(
      { error: "Missing content to summarize" },
      { status: 400 }
    );
  }

  const summary = await summarizeDocument({ title, content, source, sector });

  return NextResponse.json({ summary });
}
