import { StyleSheet, Text, View } from "react-native";
import Svg, { ClipPath, Defs, Ellipse, Path, Rect } from "react-native-svg";

import { BodyZone } from "@/data/types";
import { colors, spacing } from "@/theme";

export const ZONE_LABEL: Record<BodyZone, string> = {
  "head-neck": "Baş-Boyun (C2–C4)",
  shoulder: "Omuz (C5)",
  "upper-arm": "Üst Kol",
  "forearm-hand": "Önkol-El (C6–C8)",
  "chest-upper": "Üst Göğüs (T2–T3)",
  "chest-lower": "Alt Göğüs / Meme Hattı (T4–T6)",
  "abdomen-upper": "Üst Karın (T7–T9)",
  "abdomen-mid": "Göbek Hizası (T10)",
  "abdomen-lower": "Alt Karın (T11–T12)",
  groin: "Kasık (L1)",
  "thigh-anterior": "Uyluk Ön (L2–L3)",
  "thigh-medial": "Uyluk Medial (L3–L4)",
  knee: "Diz (L3–L4)",
  "lowerleg-anterior": "Bacak Ön (L4–L5)",
  "foot-top": "Ayak Sırtı (L5)",
  "upper-back": "Üst Sırt (T2–T9)",
  "lower-back": "Bel / Lomber (T10–L2)",
  "thigh-posterior": "Uyluk Arka (S1–S2)",
  calf: "Baldır (S1)",
  "heel-sole": "Topuk/Taban (S1)",
};

const ALL_ZONES = Object.keys(ZONE_LABEL) as BodyZone[];

// Distinct hues so a full reference legend can show every zone at once.
const ZONE_COLOR: Record<BodyZone, string> = {
  "head-neck": "#8E7CC3",
  shoulder: "#4F86C6",
  "upper-arm": "#3AA6A6",
  "forearm-hand": "#3AA65C",
  "chest-upper": "#8FB93A",
  "chest-lower": "#D4B93A",
  "abdomen-upper": "#D98A3A",
  "abdomen-mid": "#D9603A",
  "abdomen-lower": "#C7433F",
  groin: "#B23A6B",
  "thigh-anterior": "#8A3AA6",
  "thigh-medial": "#5C3AA6",
  knee: "#3A4FA6",
  "lowerleg-anterior": "#3A86A6",
  "foot-top": "#3AA687",
  "upper-back": "#7AA63A",
  "lower-back": "#A6923A",
  "thigh-posterior": "#A65C3A",
  calf: "#A63A5C",
  "heel-sole": "#7A3AA6",
};

// Simplified schematic silhouette — not anatomically precise, for approximate
// coverage illustration only. Coordinates are in a 100x220 viewBox. The body
// outline is used as a clip path so the colored zone bands get soft, rounded
// edges instead of looking like stacked boxes.
const SILHOUETTE = (
  <>
    <Ellipse cx={50} cy={12} rx={13} ry={14} />
    <Path d="M24,26 Q24,22 29,22 L71,22 Q76,22 76,26 L70,98 Q68,104 62,104 L38,104 Q32,104 30,98 Z" />
    <Rect x={4} y={24} width={17} height={98} rx={8.5} />
    <Rect x={79} y={24} width={17} height={98} rx={8.5} />
    <Rect x={26} y={98} width={22} height={64} rx={11} />
    <Rect x={52} y={98} width={22} height={64} rx={11} />
    <Rect x={28} y={156} width={44} height={20} rx={9} />
    <Rect x={31} y={172} width={38} height={40} rx={13} />
    <Ellipse cx={50} cy={214} rx={23} ry={9} />
  </>
);

type Band = { zone: BodyZone; x: number; y: number; w: number; h: number };

export const FRONT_BANDS: Band[] = [
  { zone: "head-neck", x: 20, y: 0, w: 60, h: 22 },
  { zone: "shoulder", x: 0, y: 22, w: 100, h: 10 },
  { zone: "chest-upper", x: 20, y: 22, w: 60, h: 14 },
  { zone: "chest-lower", x: 20, y: 36, w: 60, h: 16 },
  { zone: "upper-arm", x: 0, y: 32, w: 100, h: 34 },
  { zone: "abdomen-upper", x: 20, y: 52, w: 60, h: 14 },
  { zone: "forearm-hand", x: 0, y: 66, w: 100, h: 56 },
  { zone: "abdomen-mid", x: 20, y: 66, w: 60, h: 8 },
  { zone: "abdomen-lower", x: 20, y: 74, w: 60, h: 14 },
  { zone: "groin", x: 20, y: 88, w: 60, h: 10 },
  { zone: "thigh-anterior", x: 0, y: 98, w: 50, h: 58 },
  { zone: "thigh-medial", x: 50, y: 98, w: 50, h: 58 },
  { zone: "knee", x: 0, y: 156, w: 100, h: 20 },
  { zone: "lowerleg-anterior", x: 0, y: 176, w: 100, h: 36 },
  { zone: "foot-top", x: 0, y: 205, w: 100, h: 15 },
];

export const BACK_BANDS: Band[] = [
  { zone: "head-neck", x: 20, y: 0, w: 60, h: 22 },
  { zone: "upper-back", x: 0, y: 22, w: 100, h: 40 },
  { zone: "lower-back", x: 0, y: 62, w: 100, h: 36 },
  { zone: "thigh-posterior", x: 0, y: 98, w: 100, h: 58 },
  { zone: "knee", x: 0, y: 156, w: 100, h: 20 },
  { zone: "calf", x: 0, y: 176, w: 100, h: 36 },
  { zone: "heel-sole", x: 0, y: 205, w: 100, h: 15 },
];

function Figure({
  bands,
  fill,
}: {
  bands: Band[];
  fill: (zone: BodyZone) => string | null;
}) {
  return (
    <Svg viewBox="0 0 100 220" width={92} height={202}>
      <Defs>
        <ClipPath id="body-clip">{SILHOUETTE}</ClipPath>
      </Defs>
      <Rect x={0} y={0} width={100} height={220} clipPath="url(#body-clip)" fill={colors.chip} />
      {bands.map((b, i) => {
        const color = fill(b.zone);
        if (!color) return null;
        return <Rect key={i} x={b.x} y={b.y} width={b.w} height={b.h} clipPath="url(#body-clip)" fill={color} opacity={0.9} />;
      })}
      <Rect
        x={0.75}
        y={0.75}
        width={98.5}
        height={218.5}
        clipPath="url(#body-clip)"
        fill="none"
        stroke={colors.border}
        strokeWidth={1.5}
      />
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
            <Figure bands={FRONT_BANDS} fill={(z) => (front.has(z) ? colors.primary : null)} />
            <Text style={styles.figureLabel}>Ön</Text>
          </View>
        ) : null}
        {backZones.length > 0 ? (
          <View style={styles.figureBlock}>
            <Figure bands={BACK_BANDS} fill={(z) => (back.has(z) ? colors.primary : null)} />
            <Text style={styles.figureLabel}>Arka</Text>
          </View>
        ) : null}
      </View>
      <Text style={styles.legend}>Yaklaşık kapsanan bölge: {allLabels.join(", ")}</Text>
    </View>
  );
}

/** Full reference chart — every zone shown at once in a distinct color, with a legend. */
export function FullDermatomeMap() {
  return (
    <View style={styles.container}>
      <View style={styles.figures}>
        <View style={styles.figureBlock}>
          <Figure bands={FRONT_BANDS} fill={(z) => ZONE_COLOR[z]} />
          <Text style={styles.figureLabel}>Ön</Text>
        </View>
        <View style={styles.figureBlock}>
          <Figure bands={BACK_BANDS} fill={(z) => ZONE_COLOR[z]} />
          <Text style={styles.figureLabel}>Arka</Text>
        </View>
      </View>
      <View style={styles.legendGrid}>
        {ALL_ZONES.map((z) => (
          <View key={z} style={styles.legendRow}>
            <View style={[styles.legendSwatch, { backgroundColor: ZONE_COLOR[z] }]} />
            <Text style={styles.legendText}>{ZONE_LABEL[z]}</Text>
          </View>
        ))}
      </View>
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
  legendGrid: {
    marginTop: spacing.md,
    gap: 6,
  },
  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  legendSwatch: {
    width: 14,
    height: 14,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 13,
    color: colors.text,
  },
});
