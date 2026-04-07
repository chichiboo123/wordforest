import { CURATED_WORDS } from "../data/todayWords";

export function useTodayWord(): string {
  const now = new Date();
  const seed = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
  const index = seed % CURATED_WORDS.length;
  return CURATED_WORDS[index];
}
