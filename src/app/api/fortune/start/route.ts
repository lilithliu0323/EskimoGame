import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { generateFortune } from "@/lib/ai";
import { saveFortune } from "@/lib/store";
import type { SceneId, FortuneTypeId } from "@/lib/fortune";

const VALID_SCENES: SceneId[] = ["emotion", "career", "low"];
const VALID_TYPES: FortuneTypeId[] = ["tarot", "bazi", "constellation", "ziwei"];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, scene, description, birthDate, birthTime, gender, extra } =
      body;

    if (!type || !scene || !description?.trim()) {
      return NextResponse.json(
        { error: "缺少 type、scene 或 description" },
        { status: 400 }
      );
    }

    if (!VALID_TYPES.includes(type)) {
      return NextResponse.json({ error: "无效的 type" }, { status: 400 });
    }
    if (!VALID_SCENES.includes(scene)) {
      return NextResponse.json({ error: "无效的 scene" }, { status: 400 });
    }

    const sessionId = uuidv4();
    const content = await generateFortune({
      type,
      scene,
      description: description.trim(),
      birthDate: birthDate || undefined,
      birthTime: birthTime || undefined,
      gender: gender || undefined,
      extra: extra?.trim() || undefined,
    });

    saveFortune(sessionId, content);

    return NextResponse.json({
      sessionId,
      content: {
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
