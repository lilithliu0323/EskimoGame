export const SCENES = [
  { id: "emotion", label: "情感困惑", icon: "💕", desc: "感情、关系、放下或等待" },
  { id: "career", label: "事业迷茫", icon: "💼", desc: "工作、成长、方向与选择" },
  { id: "low", label: "人生低谷", icon: "🌙", desc: "提不起劲、意义感、低谷期" },
] as const;

export type SceneId = (typeof SCENES)[number]["id"];

export const FORTUNE_TYPES = [
  { id: "tarot", label: "塔罗牌", icon: "🃏", desc: "抽取牌面，解读当下能量与指引" },
  { id: "bazi", label: "八字", icon: "📿", desc: "生辰八字，五行命理解读" },
  { id: "constellation", label: "星座", icon: "✨", desc: "星盘运势，当下阶段解读" },
  { id: "ziwei", label: "紫薇星数", icon: "🌟", desc: "紫薇斗数，命盘格局分析" },
] as const;

export type FortuneTypeId = (typeof FORTUNE_TYPES)[number]["id"];

export const SCENE_LABELS: Record<SceneId, string> = {
  emotion: "情感困惑",
  career: "事业迷茫",
  low: "人生低谷",
};

export const FORTUNE_TYPE_LABELS: Record<FortuneTypeId, string> = {
  tarot: "塔罗牌",
  bazi: "八字",
  constellation: "星座",
  ziwei: "紫薇星数",
};

export const SCENE_INTROS: Record<SceneId, string> = {
  emotion:
    "感情的事，最难的不是做决定，而是先被理解。把你的困惑写下来，就像在跟朋友倾诉。",
  career:
    "工作三年还是五年，都会有一段「想动又不敢动」的时候。把你的状态写下来，我们一起来理一理。",
  low: "低谷期不是你的错，只是需要被看见。把你的感受写下来，不用很长，一句就好。",
};

export const FORTUNE_TYPE_INTROS: Record<FortuneTypeId, string> = {
  tarot: "塔罗牌通过象征与意象，帮你看见当下的盲点与可能。",
  bazi: "八字从生辰出发，结合五行与十神，解读你当下的能量走向。",
  constellation: "星座运势侧重当下星象，为你提供阶段性的参考视角。",
  ziwei: "紫薇斗数以命盘格局为本，解读当下的运势脉络。",
};

export interface FortuneInput {
  type: FortuneTypeId;
  scene: SceneId;
  description: string;
  birthDate?: string;
  birthTime?: string;
  gender?: "male" | "female";
  extra?: string;
}

export interface FortuneContent {
  empathy: string;
  narrative: string;
  suggestions: string;
}
