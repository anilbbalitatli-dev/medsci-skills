import "expo-sqlite/localStorage/install";

type Listener = () => void;
const listeners = new Map<string, Set<Listener>>();

// useSyncExternalStore requires getSnapshot to return a referentially stable
// value when nothing changed. JSON.parse allocates a new object every call,
// so we cache the parsed value per key and only re-parse when the raw
// underlying string actually changes — otherwise React re-renders forever.
const cache = new Map<string, { raw: string | null; value: unknown }>();

export const storage = {
  get<T>(key: string, defaultValue: T): T {
    const raw = localStorage.getItem(key);
    const cached = cache.get(key);
    if (cached && cached.raw === raw) {
      return cached.value as T;
    }
    const value = raw !== null ? (JSON.parse(raw) as T) : defaultValue;
    cache.set(key, { raw, value });
    return value;
  },

  set<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
    listeners.get(key)?.forEach((fn) => fn());
  },

  subscribe(key: string, listener: Listener): () => void {
    if (!listeners.has(key)) listeners.set(key, new Set());
    listeners.get(key)!.add(listener);
    return () => listeners.get(key)?.delete(listener);
  },
};
