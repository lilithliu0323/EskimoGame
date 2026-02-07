import type { FortuneContent } from "./fortune";

const store = new Map<string, FortuneContent>();

export function saveFortune(sessionId: string, content: FortuneContent): void {
  store.set(sessionId, content);
}

export function getFortune(sessionId: string): FortuneContent | null {
  return store.get(sessionId) ?? null;
}
