import { useStorage } from "@/utils/use-storage";

const FAVORITES_KEY = "favorites";

export function useFavorites(): [string[], (id: string) => void] {
  const [ids, setIds] = useStorage<string[]>(FAVORITES_KEY, []);

  const toggle = (id: string) => {
    setIds(ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]);
  };

  return [ids, toggle];
}
