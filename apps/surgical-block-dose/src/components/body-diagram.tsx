import { StyleSheet, Text, View } from "react-native";
import Svg, { ClipPath, Defs, Ellipse, Path, Rect } from "react-native-svg";

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

const FRONT_BANDS: { zone: BodyZone; x: number; y: number; w: number; h: number }[] = [
  { zone: "head-neck", x: 20, y: 0, w: 60, h: 22 },
  { zone: "shoulder", x: 0, y: 22, w: 100, h: 10 },
  { zone: "chest", x: 20, y: 22, w: 60, h: 30 },
  { zone: "upper-arm", x: 0, y: 32, w: 100, h: 34 },
  { zone: "abdomen-upper", x: 20, y: 52, w: 60, h: 22 },
  { zone: "forearm-hand", x: 0, y: 66, w: 100, h: 56 },
  { zone: "abdomen-lower", x: 20, y: 74, w: 60, h: 22 },
  { zone: "groin", x: 20, y: 96, w: 60, h: 10 },
  { zone: "thigh-anterior", x: 0, y: 98, w: 50, h: 58 },
  { zone: "thigh-medial", x: 50, y: 98, w: 50, h: 58 },
  { zone: "knee", x: 0, y: 156, w: 100, h: 20 },
  { zone: "lowerleg-anterior", x: 0, y: 176, w: 100, h: 36 },
  { zone: "foot-top", x: 0, y: 205, w: 100, h: 15 },
];

const BACK_BANDS: { zone: BodyZone; x: number; y: number; w: number; h: number }[] = [
  { zone: "head-neck", x: 20, y: 0, w: 60, h: 22 },
  { zone: "upper-back", x: 0, y: 22, w: 100, h: 40 },
  { zone: "lower-back", x: 0, y: 62, w: 100, h: 36 },
  { zone: "thigh-posterior", x: 0, y: 98, w: 100, h: 58 },
  { zone: "knee", x: 0, y: 156, w: 100, h: 20 },
  { zone: "calf", x: 0, y: 176, w: 100, h: 36 },
  { zone: "heel-sole", x: 0, y: 205, w: 100, h: 15 },
];

function Figure({ bands, active, accent }: { bands: typeof FRONT_BANDS; active: Set<BodyZone>; accent: string }) {
  return (
    <Svg viewBox="0 0 100 220" width={82} height={180}>
      <Defs>
        <ClipPath id="body-clip">{SILHOUETTE}</ClipPath>
      </Defs>
      <Rect x={0} y={0} width={100} height={220} clipPath="url(#body-clip)" fill={colors.chip} />
      {bands
        .filter((b) => active.has(b.zone))
        .map((b, i) => (
          <Rect key={i} x={b.x} y={b.y} width={b.w} height={b.h} clipPath="url(#body-clip)" fill={accent} opacity={0.88} />
        ))}
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
            <Figure bands={FRONT_BANDS} active={front} accent={colors.primary} />
            <Text style={styles.figureLabel}>Ön</Text>
          </View>
        ) : null}
        {backZones.length > 0 ? (
          <View style={styles.figureBlock}>
            <Figure bands={BACK_BANDS} active={back} accent={colors.primary} />
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
