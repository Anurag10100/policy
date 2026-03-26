import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase-server";

export async function POST(req: NextRequest) {
  const { email, sectors, source } = await req.json();

  if (!email || !sectors?.length) {
    return NextResponse.json(
      { error: "Email and at least one sector required" },
      { status: 400 }
    );
  }

  const supabase = createServiceClient();

  const { error } = await supabase
    .from("newsletter_subscribers")
    .upsert(
      { email, sectors, source: source || "website", subscribed_at: new Date().toISOString() },
      { onConflict: "email" }
    );

  if (error) {
    return NextResponse.json(
      { error: "Failed to subscribe" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
