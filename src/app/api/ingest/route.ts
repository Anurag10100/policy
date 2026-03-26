import { NextResponse } from "next/server";
import { ingestRBICirculars, ingestSEBICirculars } from "@/lib/ingestion";

export async function POST() {
  const results = await Promise.allSettled([
    ingestRBICirculars(),
    ingestSEBICirculars(),
  ]);

  const summary = results.map((r, i) => ({
    source: i === 0 ? "RBI" : "SEBI",
    status: r.status,
    count: r.status === "fulfilled" ? r.value.length : 0,
    error: r.status === "rejected" ? String(r.reason) : undefined,
  }));

  return NextResponse.json({ ingested: summary });
}
