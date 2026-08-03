import { StyleSheet, Text, View } from "react-native";

import { TechniqueScore } from "@/data/types";
import { colors, spacing } from "@/theme";

function ScoreDots({ value }: { value: number }) {
  return (
    <View style={styles.dots}>
      {[1, 2, 3, 4, 5].map((n) => (
        <View key={n} style={[styles.dot, n <= value && styles.dotFilled]} />
      ))}
    </View>
  );
}

export function ScoreBadges({ score }: { score: TechniqueScore }) {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.label}>Güvenlik</Text>
        <ScoreDots value={score.safety} />
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Kolaylık</Text>
        <ScoreDots value={score.convenience} />
      </View>
      <Text style={styles.rationale}>{score.rationale}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 4,
    marginTop: spacing.xs,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  label: {
    fontSize: 11.5,
    fontWeight: "600",
    color: colors.textMuted,
    width: 64,
  },
  dots: {
    flexDirection: "row",
    gap: 3,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.border,
  },
  dotFilled: {
    backgroundColor: colors.primary,
  },
  rationale: {
    fontSize: 11.5,
    color: colors.textMuted,
    fontStyle: "italic",
    marginTop: 2,
  },
});
