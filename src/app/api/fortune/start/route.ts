import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { generateFortune } from "@/lib/ai";
import { saveFortune } from "@/lib/store";
import type { SceneId } from "@/lib/fortune";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { scene, description, birthDate, extra } = body;

    if (!scene || !description?.trim()) {
      return NextResponse.json(
        { error: "缺少 scene 或 description" },
        { status: 400 }
      );
    }

    const validScenes: SceneId[] = ["emotion", "career", "low"];
    if (!validScenes.includes(scene)) {
      return NextResponse.json({ error: "无效的 scene" }, { status: 400 });
    }

    const sessionId = uuidv4();
    const content = await generateFortune({
      scene,
      description: description.trim(),
      birthDate: birthDate || undefined,
      extra: extra?.trim() || undefined,
    });

    saveFortune(sessionId, content);

    return NextResponse.json({
      sessionId,
      freeContent: {
        empathy: content.empathy,
        narrative: content.narrative,
        suggestions: content.suggestions,
      },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "解读生成失败，请稍后重试" },
      { status: 500 }
    );
  }
}
