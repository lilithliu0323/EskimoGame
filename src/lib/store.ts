import type { FortuneContent } from "./fortune";

const store = new Map<string, { content: FortuneContent; unlocked: boolean }>();

export function saveFortune(sessionId: string, content: FortuneContent): void {
  store.set(sessionId, { content, unlocked: false });
}

export function getFortune(sessionId: string): { content: FortuneContent; unlocked: boolean } | null {
  return store.get(sessionId) ?? null;
}

export function unlockFortune(sessionId: string): boolean {
  const entry = store.get(sessionId);
  if (!entry) return false;
  store.set(sessionId, { ...entry, unlocked: true });
  return true;
}
