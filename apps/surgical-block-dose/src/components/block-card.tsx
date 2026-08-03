import { StyleSheet, Text, View } from "react-native";

import { ScoreBadges } from "@/components/score-badges";
import { BlockOption } from "@/data/types";
import { colors, spacing } from "@/theme";
import { volumeRangeToMgRange } from "@/utils/dose-math";

const ROLE_LABEL: Record<BlockOption["role"], string> = {
  primary: "Öncelikli",
  alternative: "Alternatif",
  adjunct: "Ek (Adjuvan)",
};

export function BlockCard({ block }: { block: BlockOption }) {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.name}>{block.name}</Text>
        <View style={[styles.badge, block.role === "primary" && styles.badgePrimary]}>
          <Text style={[styles.badgeText, block.role === "primary" && styles.badgeTextPrimary]}>
            {ROLE_LABEL[block.role]}
          </Text>
        </View>
      </View>
      <Text style={styles.summary}>{block.summary}</Text>

      <View style={styles.table}>
        {block.anesthetics.map((a) => {
          const [minMg, maxMg] = volumeRangeToMgRange(a.concentrationPercent, a.volumeMlRange);
          return (
            <View key={a.drug} style={styles.row}>
              <Text style={styles.drug}>{a.drug}</Text>
              <Text style={styles.volume}>
                {a.volumeMlRange[0]}–{a.volumeMlRange[1]} mL · ≈{Math.round(minMg)}–{Math.round(maxMg)} mg
              </Text>
              {a.note ? <Text style={styles.note}>{a.note}</Text> : null}
            </View>
          );
        })}
      </View>

      {block.landmarkNote ? <Text style={styles.landmark}>{block.landmarkNote}</Text> : null}

      <ScoreBadges score={block.score} />

      {block.contraindications && block.contraindications.length > 0 ? (
        <View style={styles.contraCard}>
          <Text style={styles.contraTitle}>Kontrendikasyonlar</Text>
          {block.contraindications.map((c) => (
            <Text key={c} style={styles.contraItem}>
              •  {c}
            </Text>
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: spacing.sm,
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
    flexShrink: 1,
  },
  badge: {
    backgroundColor: colors.chip,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: 999,
  },
  badgePrimary: {
    backgroundColor: colors.primaryMuted,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.textMuted,
  },
  badgeTextPrimary: {
    color: colors.primary,
  },
  summary: {
    fontSize: 13.5,
    color: colors.textMuted,
    lineHeight: 19,
  },
  table: {
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  row: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: spacing.sm,
    gap: 2,
  },
  drug: {
    fontSize: 13.5,
    fontWeight: "600",
    color: colors.text,
  },
  volume: {
    fontSize: 12.5,
    color: colors.textMuted,
  },
  note: {
    fontSize: 12,
    color: colors.textMuted,
    fontStyle: "italic",
  },
  landmark: {
    fontSize: 12,
    color: colors.textMuted,
  },
  contraCard: {
    backgroundColor: colors.dangerBg,
    borderRadius: 8,
    padding: spacing.sm,
    gap: 2,
    marginTop: spacing.xs,
  },
  contraTitle: {
    fontSize: 11.5,
    fontWeight: "700",
    color: colors.danger,
  },
  contraItem: {
    fontSize: 12,
    color: colors.danger,
    lineHeight: 17,
  },
});
