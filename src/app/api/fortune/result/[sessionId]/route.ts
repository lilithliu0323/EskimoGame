import { NextRequest, NextResponse } from "next/server";
import { getFortune } from "@/lib/store";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const { sessionId } = await params;
  const entry = getFortune(sessionId);

  if (!entry) {
    return NextResponse.json({ error: "解读不存在或已过期" }, { status: 404 });
  }

  return NextResponse.json({
    content: entry.content,
    isUnlocked: entry.unlocked,
  });
}
