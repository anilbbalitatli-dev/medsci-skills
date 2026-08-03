import { StyleSheet, Text, View } from "react-native";

import { ScoreBadges } from "@/components/score-badges";
import { BlockCombination, BlockOption } from "@/data/types";
import { colors, spacing } from "@/theme";

export function CombinationCard({ combination, blocks }: { combination: BlockCombination; blocks: BlockOption[] }) {
  const blockNames = combination.blockIds
    .map((id) => blocks.find((b) => b.id === id)?.name)
    .filter((n): n is string => Boolean(n));

  return (
    <View style={styles.card}>
      <Text style={styles.name}>{combination.name}</Text>
      {blockNames.length > 0 ? <Text style={styles.blocks}>{blockNames.join(" + ")}</Text> : null}
      <Text style={styles.summary}>{combination.summary}</Text>
      <ScoreBadges score={combination.score} />
      {combination.doseWarning ? <Text style={styles.warning}>⚠ {combination.doseWarning}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.primaryMuted,
    padding: spacing.lg,
    gap: 4,
  },
  name: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text,
  },
  blocks: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.primary,
  },
  summary: {
    fontSize: 13,
    color: colors.textMuted,
    lineHeight: 19,
  },
  warning: {
    fontSize: 12,
    color: colors.warning,
    marginTop: spacing.xs,
  },
});
