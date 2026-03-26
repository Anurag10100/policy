import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const SUBSCRIBERS_FILE = path.join(process.cwd(), "data", "subscribers.json");

interface Subscriber {
  email: string;
  name: string;
  sector: string;
  subscribedAt: string;
}

async function getSubscribers(): Promise<Subscriber[]> {
  try {
    const data = await fs.readFile(SUBSCRIBERS_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function saveSubscribers(subscribers: Subscriber[]) {
  await fs.mkdir(path.dirname(SUBSCRIBERS_FILE), { recursive: true });
  await fs.writeFile(SUBSCRIBERS_FILE, JSON.stringify(subscribers, null, 2));
}

export async function POST(req: NextRequest) {
  const { email, name, sector } = await req.json();

  if (!email || !name || !sector) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const subscribers = await getSubscribers();

  if (subscribers.some((s) => s.email === email)) {
    return NextResponse.json(
      { error: "Already subscribed" },
      { status: 409 }
    );
  }

  subscribers.push({
    email,
    name,
    sector,
    subscribedAt: new Date().toISOString(),
  });

  await saveSubscribers(subscribers);

  return NextResponse.json({ success: true });
}
