import Ionicons from "@expo/vector-icons/Ionicons";

type IoniconName = keyof typeof Ionicons.glyphMap;

interface RegionStyle {
  icon: IoniconName;
  color: string;
}

const REGION_STYLES: Record<string, RegionStyle> = {
  "Alt Ekstremite": { icon: "walk-outline", color: "#0E6E55" },
  "Üst Ekstremite": { icon: "hand-left-outline", color: "#1D5FBF" },
  Toraks: { icon: "fitness-outline", color: "#7A4FBF" },
  "Baş-Boyun": { icon: "person-outline", color: "#0E8A8A" },
  "Kadın Doğum": { icon: "female-outline", color: "#C23B7A" },
  "Genel Cerrahi": { icon: "bandage-outline", color: "#B5731A" },
  Vasküler: { icon: "pulse-outline", color: "#B3261E" },
  Omurga: { icon: "body-outline", color: "#6B4A2E" },
};

const DEFAULT_STYLE: RegionStyle = { icon: "medkit-outline", color: "#5B6570" };

export function getRegionStyle(region: string): RegionStyle {
  return REGION_STYLES[region] ?? DEFAULT_STYLE;
}
