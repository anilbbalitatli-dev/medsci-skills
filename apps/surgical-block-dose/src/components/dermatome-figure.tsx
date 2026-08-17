import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle, G, Path, Text as SvgText } from "react-native-svg";

import {
  DERMATOME_LABEL_DOTS,
  DERMATOME_LABELS,
  DERMATOME_LEADERS,
  DERMATOME_LEVELS,
  DERMATOME_PATHS,
  DERMATOME_VIEWBOX,
  DermatomeLevel,
  HEAD_PATH,
} from "@/data/dermatome-figure";
import { colors, spacing } from "@/theme";

const ATTRIBUTION =
  "Dermatom şekli: Rick Hansen Institute ISNCSCI UI (Apache-2.0) temel alınarak uyarlanmıştır.";

/**
 * Renders the ISNCSCI dermatome figure, highlighting the given spinal levels.
 * Levels not in the diagram (S2-S5) are ignored here and covered in text.
 */
export function DermatomeFigure({
  levels = [],
  height = 300,
  showLabels = false,
}: {
  levels?: DermatomeLevel[];
  height?: number;
  showLabels?: boolean;
}) {
  const active = new Set(levels);

  return (
    <Svg viewBox={DERMATOME_VIEWBOX} width="100%" height={height}>
      <Path d={HEAD_PATH} fill={colors.chip} stroke={colors.border} strokeWidth={1} />

      {DERMATOME_LEVELS.map((level) => {
        const on = active.has(level);
        const geom = DERMATOME_PATHS[level];
        return (
          <G key={level}>
            {[...geom.left, ...geom.right].map((d, i) => (
              <Path
                key={`${level}-${i}`}
                d={d}
                fill={on ? colors.primary : colors.chip}
                fillOpacity={on ? 0.85 : 1}
                stroke={colors.border}
                strokeWidth={0.8}
              />
            ))}
          </G>
        );
      })}

      {showLabels ? (
        <G>
          {DERMATOME_LEADERS.map((d, i) => (
            <Path key={`ld-${i}`} d={d} fill={colors.textMuted} />
          ))}
          {DERMATOME_LABEL_DOTS.map((c, i) => (
            <Circle key={`dot-${i}`} cx={c.cx} cy={c.cy} r={c.r} fill={colors.textMuted} />
          ))}
          {DERMATOME_LABELS.map((t, i) => (
            <SvgText key={`t-${i}`} x={t.x} y={t.y} fill={colors.text} fontSize={11} fontWeight="600">
              {t.label}
            </SvgText>
          ))}
        </G>
      ) : null}
    </Svg>
  );
}

/** Figure plus the attribution line the Apache-2.0 notice requires. */
export function DermatomeFigureCard({
  levels,
  height,
  showLabels,
  caption,
}: {
  levels?: DermatomeLevel[];
  height?: number;
  showLabels?: boolean;
  caption?: string;
}) {
  return (
    <View style={styles.card}>
      <DermatomeFigure levels={levels} height={height} showLabels={showLabels} />
      {caption ? <Text style={styles.caption}>{caption}</Text> : null}
      <Text style={styles.attribution}>{ATTRIBUTION}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background,
    borderRadius: 10,
    padding: spacing.sm,
    gap: 4,
    marginTop: spacing.xs,
  },
  caption: {
    fontSize: 11.5,
    color: colors.textMuted,
  },
  attribution: {
    fontSize: 10,
    color: colors.textMuted,
    fontStyle: "italic",
  },
});
