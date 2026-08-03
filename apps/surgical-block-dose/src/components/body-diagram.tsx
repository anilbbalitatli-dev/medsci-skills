import { StyleSheet, Text, View } from "react-native";
import Svg, { Rect } from "react-native-svg";

import { BodyZone } from "@/data/types";
import { colors, spacing } from "@/theme";

const ZONE_LABEL: Record<BodyZone, string> = {
  "head-neck": "Baş-Boyun",
  shoulder: "Omuz",
  "upper-arm": "Üst Kol",
  "forearm-hand": "Önkol-El",
  chest: "Göğüs Duvarı",
  "abdomen-upper": "Üst Karın",
  "abdomen-lower": "Alt Karın",
  groin: "Kasık",
  "thigh-anterior": "Uyluk Ön",
  "thigh-medial": "Uyluk Medial",
  knee: "Diz",
  "lowerleg-anterior": "Bacak Ön",
  "foot-top": "Ayak Sırtı",
  "upper-back": "Üst Sırt",
  "lower-back": "Bel (Lomber)",
  "thigh-posterior": "Uyluk Arka",
  calf: "Baldır",
  "heel-sole": "Topuk/Taban",
};

// Simplified schematic figure — not anatomically precise, for approximate
// coverage illustration only. Coordinates are in a 100x220 viewBox.
const FRONT_RECTS: { zone: BodyZone; x: number; y: number; w: number; h: number }[] = [
  { zone: "head-neck", x: 35, y: 0, w: 30, h: 18 },
  { zone: "shoulder", x: 8, y: 20, w: 20, h: 16 },
  { zone: "shoulder", x: 72, y: 20, w: 20, h: 16 },
  { zone: "chest", x: 30, y: 20, w: 40, h: 33 },
  { zone: "upper-arm", x: 4, y: 38, w: 15, h: 38 },
  { zone: "upper-arm", x: 81, y: 38, w: 15, h: 38 },
  { zone: "abdomen-upper", x: 30, y: 53, w: 40, h: 24 },
  { zone: "forearm-hand", x: 2, y: 78, w: 15, h: 44 },
  { zone: "forearm-hand", x: 83, y: 78, w: 15, h: 44 },
  { zone: "abdomen-lower", x: 30, y: 77, w: 40, h: 20 },
  { zone: "groin", x: 38, y: 97, w: 24, h: 12 },
  { zone: "thigh-anterior", x: 27, y: 111, w: 20, h: 48 },
  { zone: "thigh-medial", x: 53, y: 111, w: 20, h: 48 },
  { zone: "knee", x: 30, y: 159, w: 40, h: 14 },
  { zone: "lowerleg-anterior", x: 30, y: 173, w: 40, h: 34 },
  { zone: "foot-top", x: 28, y: 207, w: 44, h: 13 },
];

const BACK_RECTS: { zone: BodyZone; x: number; y: number; w: number; h: number }[] = [
  { zone: "head-neck", x: 35, y: 0, w: 30, h: 18 },
  { zone: "upper-back", x: 25, y: 20, w: 50, h: 33 },
  { zone: "lower-back", x: 25, y: 53, w: 50, h: 44 },
  { zone: "thigh-posterior", x: 27, y: 111, w: 46, h: 48 },
  { zone: "knee", x: 30, y: 159, w: 40, h: 14 },
  { zone: "calf", x: 30, y: 173, w: 40, h: 34 },
  { zone: "heel-sole", x: 28, y: 207, w: 44, h: 13 },
];

function Figure({ rects, active, accent }: { rects: typeof FRONT_RECTS; active: Set<BodyZone>; accent: string }) {
  return (
    <Svg viewBox="0 0 100 220" width={90} height={198}>
      {rects.map((r, i) => (
        <Rect
          key={i}
          x={r.x}
          y={r.y}
          width={r.w}
          height={r.h}
          rx={4}
          fill={active.has(r.zone) ? accent : colors.chip}
          stroke={colors.border}
          strokeWidth={1}
        />
      ))}
    </Svg>
  );
}

export function BodyDiagram({
  frontZones = [],
  backZones = [],
}: {
  frontZones?: BodyZone[];
  backZones?: BodyZone[];
}) {
  const front = new Set(frontZones);
  const back = new Set(backZones);
  const allLabels = Array.from(new Set([...frontZones, ...backZones])).map((z) => ZONE_LABEL[z]);

  if (frontZones.length === 0 && backZones.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.figures}>
        {frontZones.length > 0 ? (
          <View style={styles.figureBlock}>
            <Figure rects={FRONT_RECTS} active={front} accent={colors.primary} />
            <Text style={styles.figureLabel}>Ön</Text>
          </View>
        ) : null}
        {backZones.length > 0 ? (
          <View style={styles.figureBlock}>
            <Figure rects={BACK_RECTS} active={back} accent={colors.primary} />
            <Text style={styles.figureLabel}>Arka</Text>
          </View>
        ) : null}
      </View>
      <Text style={styles.legend}>Yaklaşık kapsanan bölge: {allLabels.join(", ")}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: spacing.xs,
    gap: 4,
  },
  figures: {
    flexDirection: "row",
    gap: spacing.lg,
  },
  figureBlock: {
    alignItems: "center",
  },
  figureLabel: {
    fontSize: 10.5,
    color: colors.textMuted,
    marginTop: 2,
  },
  legend: {
    fontSize: 11.5,
    color: colors.textMuted,
  },
});
