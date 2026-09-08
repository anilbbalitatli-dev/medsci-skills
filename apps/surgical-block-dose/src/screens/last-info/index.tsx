import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { LastDoseCalculator } from "@/components/last-dose-calculator";
import { PatientBar } from "@/components/patient-bar";
import { ABSORPTION_ORDER, ABSORPTION_TIERS } from "@/data/complications";
import {
  LAST_EARLY_SYMPTOMS,
  LAST_LATE_SYMPTOMS,
  LAST_MANAGEMENT,
  LAST_SOURCE_NOTE,
} from "@/data/last";
import { colors, spacing } from "@/theme";

export function LastInfo() {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + spacing.xl }]}
    >
      <View style={styles.alertCard}>
        <Text style={styles.alertTitle}>LAST (Lokal Anestezik Sistemik Toksisitesi)</Text>
        <Text style={styles.alertBody}>
          Hızlı tanınmalı ve hemen müdahale edilmelidir. Aşağıdaki liste bir acil durum
          özetidir; kurumunuzun tam protokolünü ve ASRA'nın güncel kontrol listesini esas alın.
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Erken Belirtiler</Text>
      <View style={styles.list}>
        {LAST_EARLY_SYMPTOMS.map((s) => (
          <Text key={s} style={styles.listItem}>
            •  {s}
          </Text>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Geç / Ağır Belirtiler</Text>
      <View style={styles.list}>
        {LAST_LATE_SYMPTOMS.map((s) => (
          <Text key={s} style={styles.listItem}>
            •  {s}
          </Text>
        ))}
      </View>

      <PatientBar />
      <LastDoseCalculator />

      <Text style={styles.sectionTitle}>Yönetim</Text>
      <View style={styles.steps}>
        {LAST_MANAGEMENT.map((step) => (
          <View key={step.title} style={styles.stepCard}>
            <Text style={styles.stepTitle}>{step.title}</Text>
            <Text style={styles.stepDetail}>{step.detail}</Text>
          </View>
        ))}
      </View>

      {/* Aynı mg, enjekte edildiği yere göre farklı bir plazma tepesi yapar;
          doz tavanı bunu söylemez. */}
      <Text style={styles.sectionTitle}>Emilim hızına göre risk</Text>
      <View style={styles.list}>
        {ABSORPTION_ORDER.map((row) => (
          <View key={row.tier} style={styles.absorptionRow}>
            <Text style={styles.absorptionTier}>{ABSORPTION_TIERS[row.tier].label}</Text>
            <Text style={styles.absorptionExamples}>{row.examples}</Text>
          </View>
        ))}
        <Text style={styles.absorptionNote}>
          Sıralama yukarıdan aşağıya azalır. Tavanın altında kalmak, hızlı emilen bir bölgede tek
          başına güvence değildir.
        </Text>
      </View>

      <Text style={styles.source}>{LAST_SOURCE_NOTE}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  alertCard: {
    backgroundColor: colors.dangerBg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.danger,
    padding: spacing.md,
    gap: spacing.xs,
  },
  alertTitle: {
    color: colors.danger,
    fontWeight: "700",
    fontSize: 15,
  },
  alertBody: {
    color: colors.danger,
    fontSize: 13,
    lineHeight: 19,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text,
    marginTop: spacing.sm,
  },
  list: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.xs,
  },
  listItem: {
    fontSize: 13.5,
    color: colors.text,
    lineHeight: 20,
  },
  steps: {
    gap: spacing.sm,
  },
  stepCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: 4,
  },
  stepTitle: {
    fontSize: 13.5,
    fontWeight: "700",
    color: colors.text,
  },
  stepDetail: {
    fontSize: 13,
    color: colors.textMuted,
    lineHeight: 19,
  },
  absorptionRow: { gap: 1 },
  absorptionTier: { fontSize: 12.5, fontWeight: "700", color: colors.text },
  absorptionExamples: { fontSize: 12, color: colors.textMuted, lineHeight: 17 },
  absorptionNote: { fontSize: 11, color: colors.textFaint, fontStyle: "italic", lineHeight: 15, marginTop: 2 },
  source: {
    fontSize: 11.5,
    color: colors.textMuted,
    marginTop: spacing.sm,
  },
});
