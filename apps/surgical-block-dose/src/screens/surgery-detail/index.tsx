import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { BlockCard } from "@/components/block-card";
import { DisclaimerBanner } from "@/components/disclaimer-banner";
import { MaxDoseCalculator } from "@/components/max-dose-calculator";
import { Surgery } from "@/data/types";
import { colors, spacing } from "@/theme";

export function SurgeryDetail({ surgery }: { surgery: Surgery }) {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + spacing.xl }]}
    >
      <Text style={styles.category}>{surgery.category}</Text>
      <Text style={styles.name}>{surgery.name}</Text>

      <DisclaimerBanner />

      {surgery.clinicalNote ? (
        <View style={styles.noteCard}>
          <Text style={styles.noteText}>{surgery.clinicalNote}</Text>
        </View>
      ) : null}

      <Text style={styles.sectionTitle}>Olası Bloklar</Text>
      <View style={styles.blockList}>
        {surgery.blocks.map((block) => (
          <BlockCard key={block.id} block={block} />
        ))}
      </View>

      <MaxDoseCalculator blocks={surgery.blocks} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  category: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.primary,
  },
  name: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.text,
    marginBottom: spacing.xs,
  },
  noteCard: {
    backgroundColor: colors.chip,
    borderRadius: 12,
    padding: spacing.md,
  },
  noteText: {
    fontSize: 13,
    color: colors.textMuted,
    lineHeight: 19,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text,
    marginTop: spacing.sm,
  },
  blockList: {
    gap: spacing.md,
  },
});
