import { storage } from "@/utils/storage";
import { useStorage } from "@/utils/use-storage";

const RECENT_KEY = "recentlyViewed";
const MAX_RECENT = 5;

export function recordRecentlyViewed(id: string): void {
  const current = storage.get<string[]>(RECENT_KEY, []);
  const next = [id, ...current.filter((x) => x !== id)].slice(0, MAX_RECENT);
  storage.set(RECENT_KEY, next);
}

export function useRecentlyViewed(): string[] {
  const [ids] = useStorage<string[]>(RECENT_KEY, []);
  return ids;
}
