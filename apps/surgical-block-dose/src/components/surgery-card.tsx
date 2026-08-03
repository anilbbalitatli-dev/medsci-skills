import Ionicons from "@expo/vector-icons/Ionicons";
import { Link } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { getRegionStyle } from "@/data/region-icons";
import { Surgery } from "@/data/types";
import { colors, spacing } from "@/theme";
import { useFavorites } from "@/utils/favorites";

export function SurgeryCard({ surgery }: { surgery: Surgery }) {
  const primaryBlock = surgery.blocks.find((b) => b.role === "primary") ?? surgery.blocks[0];
  const regionStyle = getRegionStyle(surgery.region);
  const [favoriteIds, toggleFavorite] = useFavorites();
  const isFavorite = favoriteIds.includes(surgery.id);

  return (
    <Link href={{ pathname: "/surgery/[id]", params: { id: surgery.id } }} asChild>
      <Pressable style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}>
        <View style={styles.header}>
          <View style={[styles.regionChip, { backgroundColor: regionStyle.color + "1A" }]}>
            <Ionicons name={regionStyle.icon} size={13} color={regionStyle.color} />
            <Text style={[styles.regionText, { color: regionStyle.color }]}>{surgery.region}</Text>
          </View>
          <Pressable
            hitSlop={10}
            onPress={(e) => {
              e.preventDefault();
              toggleFavorite(surgery.id);
            }}
          >
            <Ionicons
              name={isFavorite ? "heart" : "heart-outline"}
              size={20}
              color={isFavorite ? colors.danger : colors.textMuted}
            />
          </Pressable>
        </View>
        <Text style={styles.name}>{surgery.name}</Text>
        {primaryBlock ? (
          <Text style={styles.primaryBlock} numberOfLines={1}>
            Öncelikli blok: {primaryBlock.name}
          </Text>
        ) : null}
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.xs,
  },
  cardPressed: {
    opacity: 0.6,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  regionChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: 999,
  },
  regionText: {
    fontSize: 11,
    fontWeight: "600",
  },
  name: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.text,
  },
  primaryBlock: {
    fontSize: 13,
    color: colors.textMuted,
  },
});
