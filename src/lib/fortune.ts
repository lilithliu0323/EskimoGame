export const SCENES = [
  { id: "emotion", label: "情感困惑", icon: "💕", desc: "感情、关系、放下或等待" },
  { id: "career", label: "事业迷茫", icon: "💼", desc: "工作、成长、方向与选择" },
  { id: "low", label: "人生低谷", icon: "🌙", desc: "提不起劲、意义感、低谷期" },
] as const;

export type SceneId = (typeof SCENES)[number]["id"];

export const SCENE_LABELS: Record<SceneId, string> = {
  emotion: "情感困惑",
  career: "事业迷茫",
  low: "人生低谷",
};

export const SCENE_INTROS: Record<SceneId, string> = {
  emotion:
    "感情的事，最难的不是做决定，而是先被理解。把你的困惑写下来，就像在跟朋友倾诉。",
  career:
    "工作三年还是五年，都会有一段「想动又不敢动」的时候。把你的状态写下来，我们一起来理一理。",
  low: "低谷期不是你的错，只是需要被看见。把你的感受写下来，不用很长，一句就好。",
};

export interface FortuneInput {
  scene: SceneId;
  description: string;
  birthDate?: string;
  extra?: string;
}

export interface FortuneContent {
  empathy: string;
  narrative: string;
  suggestions: string;
}
