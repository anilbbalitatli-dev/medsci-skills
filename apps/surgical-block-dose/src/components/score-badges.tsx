import { StyleSheet, Text, View } from "react-native";

import { TechniqueScore } from "@/data/types";
import { makeStyles, numeric, radius, spacing, type, useColors } from "@/theme";

const SEGMENTS = 5;

/**
 * A segmented meter rather than five dots: the filled span reads as a quantity
 * at a glance, and the value is printed alongside so the scale is never
 * ambiguous. Colour shifts only at the low end, where the caveat matters.
 */
function Meter({ label, value }: { label: string; value: number }) {
  const colors = useColors();
  const styles = useStyles();
  const tone = value <= 2 ? colors.warning : value === 3 ? colors.primaryStrong : colors.primary;

  return (
    <View style={styles.meterRow}>
      <Text style={styles.meterLabel}>{label}</Text>
      <View style={styles.track}>
        {Array.from({ length: SEGMENTS }, (_, i) => (
          <View
            key={i}
            style={[styles.segment, { backgroundColor: i < value ? tone : colors.chip }]}
          />
        ))}
      </View>
      <Text style={[styles.value, { color: tone }]}>
        {value}
        <Text style={styles.outOf}>/5</Text>
      </Text>
    </View>
  );
}

export function ScoreBadges({ score }: { score: TechniqueScore }) {
  const styles = useStyles();
  return (
    <View style={styles.container}>
      <Meter label="Güvenlik" value={score.safety} />
      <Meter label="Kolaylık" value={score.convenience} />
      <Text style={styles.rationale}>{score.rationale}</Text>
    </View>
  );
}

const useStyles = makeStyles((colors) => ({
  container: {
    gap: 6,
    marginTop: spacing.xs,
  },
  meterRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  meterLabel: {
    ...type.label,
    color: colors.textMuted,
    minWidth: 62,
    flexShrink: 1,
  },
  track: {
    flexDirection: "row",
    gap: 3,
    flex: 1,
  },
  segment: {
    flex: 1,
    height: 6,
    borderRadius: radius.pill,
  },
  value: {
    ...type.subheading,
    ...numeric,
    minWidth: 34,
    textAlign: "right",
  },
  outOf: {
    fontSize: 10,
    fontWeight: "600",
    color: colors.textFaint,
  },
  rationale: {
    ...type.caption,
    color: colors.textMuted,
    lineHeight: 16.5,
    marginTop: 1,
  },
}));
