import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { BlockCard } from "@/components/block-card";
import { CombinationCard } from "@/components/combination-card";
import { DisclaimerBanner } from "@/components/disclaimer-banner";
import { MaxDoseCalculator } from "@/components/max-dose-calculator";
import { getRegionStyle } from "@/data/region-icons";
import { Surgery } from "@/data/types";
import { colors, spacing } from "@/theme";
import { useFavorites } from "@/utils/favorites";

export function SurgeryDetail({ surgery }: { surgery: Surgery }) {
  const insets = useSafeAreaInsets();
  const regionStyle = getRegionStyle(surgery.region);
  const [favoriteIds, toggleFavorite] = useFavorites();
  const isFavorite = favoriteIds.includes(surgery.id);

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + spacing.xl }]}
    >
      <View style={styles.titleRow}>
        <View style={{ flex: 1 }}>
          <View style={[styles.regionChip, { backgroundColor: regionStyle.color + "1A" }]}>
            <Ionicons name={regionStyle.icon} size={13} color={regionStyle.color} />
            <Text style={[styles.regionText, { color: regionStyle.color }]}>{surgery.region}</Text>
          </View>
          <Text style={styles.name}>{surgery.name}</Text>
          <Text style={styles.category}>{surgery.category}</Text>
        </View>
        <Pressable hitSlop={10} onPress={() => toggleFavorite(surgery.id)}>
          <Ionicons
            name={isFavorite ? "heart" : "heart-outline"}
            size={26}
            color={isFavorite ? colors.danger : colors.textMuted}
          />
        </Pressable>
      </View>

      <DisclaimerBanner />

      {surgery.clinicalNote ? (
        <View style={styles.noteCard}>
          <Text style={styles.noteText}>{surgery.clinicalNote}</Text>
        </View>
      ) : null}

      <Text style={styles.sectionTitle}>Olası Bloklar (Tekil)</Text>
      <View style={styles.blockList}>
        {surgery.blocks.map((block) => (
          <BlockCard key={block.id} block={block} />
        ))}
      </View>

      {surgery.combinations && surgery.combinations.length > 0 ? (
        <>
          <Text style={styles.sectionTitle}>Kombinasyon Seçenekleri</Text>
          <View style={styles.blockList}>
            {surgery.combinations.map((combo) => (
              <CombinationCard key={combo.id} combination={combo} blocks={surgery.blocks} />
            ))}
          </View>
        </>
      ) : null}

      <MaxDoseCalculator blocks={surgery.blocks} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
  },
  regionChip: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: 999,
    marginBottom: 6,
  },
  regionText: {
    fontSize: 11,
    fontWeight: "600",
  },
  category: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.primary,
    marginTop: 2,
  },
  name: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.text,
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
