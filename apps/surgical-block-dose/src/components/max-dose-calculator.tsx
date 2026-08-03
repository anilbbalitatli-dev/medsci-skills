import { useMemo, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

import { BlockOption } from "@/data/types";
import { findMaxDose } from "@/data/max-doses";
import { colors, spacing } from "@/theme";
import { maxRecommendedMg } from "@/utils/dose-math";

function uniqueDrugs(blocks: BlockOption[]): string[] {
  const seen = new Set<string>();
  for (const block of blocks) {
    for (const a of block.anesthetics) {
      seen.add(a.drug);
    }
  }
  return Array.from(seen);
}

export function MaxDoseCalculator({ blocks }: { blocks: BlockOption[] }) {
  const [weightInput, setWeightInput] = useState("");
  const weightKg = Number(weightInput.replace(",", "."));
  const isValidWeight = weightInput.length > 0 && Number.isFinite(weightKg) && weightKg > 0;

  const drugs = useMemo(() => uniqueDrugs(blocks), [blocks]);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Ağırlığa Göre Maksimum Doz Sınırı</Text>
      <Text style={styles.subtitle}>
        Genel referans sınırlardır (mg/kg), kurum protokolü ve prospektüsle doğrulanmalıdır.
      </Text>
      <TextInput
        value={weightInput}
        onChangeText={setWeightInput}
        placeholder="Hasta ağırlığı (kg)"
        placeholderTextColor={colors.textMuted}
        keyboardType="decimal-pad"
        style={styles.input}
      />

      {isValidWeight ? (
        <View style={styles.results}>
          {drugs.map((drug) => {
            const maxDose = findMaxDose(drug);
            if (!maxDose) return null;
            const plain = maxRecommendedMg(maxDose, weightKg, false);
            const withEpi = maxDose.withEpiMgPerKg
              ? maxRecommendedMg(maxDose, weightKg, true)
              : undefined;
            return (
              <View key={drug} style={styles.row}>
                <Text style={styles.drug}>{maxDose.drug}</Text>
                <Text style={styles.dose}>
                  Epinefrinsiz maks: ≈{plain.toFixed(0)} mg ({maxDose.plainMgPerKg} mg/kg)
                </Text>
                {withEpi !== undefined ? (
                  <Text style={styles.dose}>
                    Epinefrinli maks: ≈{withEpi.toFixed(0)} mg ({maxDose.withEpiMgPerKg} mg/kg)
                  </Text>
                ) : null}
              </View>
            );
          })}
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
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text,
  },
  subtitle: {
    fontSize: 12,
    color: colors.textMuted,
  },
  input: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    fontSize: 15,
    color: colors.text,
  },
  results: {
    gap: spacing.sm,
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
  dose: {
    fontSize: 12.5,
    color: colors.textMuted,
  },
});
