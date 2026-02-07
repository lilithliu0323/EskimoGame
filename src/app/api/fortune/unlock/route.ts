import { NextRequest, NextResponse } from "next/server";
import { unlockFortune, getFortune } from "@/lib/store";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId } = body;

    if (!sessionId) {
      return NextResponse.json({ error: "缺少 sessionId" }, { status: 400 });
    }

    const success = unlockFortune(sessionId);
    if (!success) {
      return NextResponse.json({ error: "解读不存在或已过期" }, { status: 404 });
    }

    const entry = getFortune(sessionId);
    return NextResponse.json({
      fullContent: entry?.content,
      isUnlocked: true,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "解锁失败，请稍后重试" },
      { status: 500 }
    );
  }
}
