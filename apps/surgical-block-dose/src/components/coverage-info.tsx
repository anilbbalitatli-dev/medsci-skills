import { StyleSheet, Text, View } from "react-native";

import { DermatomeFigureCard } from "@/components/dermatome-figure";
import { Coverage } from "@/data/types";
import { colors, spacing } from "@/theme";

export function CoverageInfo({ coverage }: { coverage: Coverage }) {
  const levels = coverage.levels ?? [];

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.label}>Dermatom</Text>
        <Text style={styles.value}>{coverage.dermatomes}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Motor blok</Text>
        <Text style={styles.value}>{coverage.motorEffect}</Text>
      </View>
      {levels.length > 0 ? (
        <DermatomeFigureCard
          levels={levels}
          height={260}
          caption={`Boyalı alanlar: ${levels.join(", ")} — yaklaşık duyusal kapsama.`}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    borderRadius: 10,
    padding: spacing.sm,
    gap: 4,
    marginTop: spacing.xs,
  },
  row: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  label: {
    fontSize: 11.5,
    fontWeight: "700",
    color: colors.textMuted,
    width: 72,
  },
  value: {
    fontSize: 12,
    color: colors.text,
    flex: 1,
    lineHeight: 17,
  },
});
