import Ionicons from "@expo/vector-icons/Ionicons";
import { Link } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { getRegionStyle } from "@/data/region-icons";
import { Surgery } from "@/data/types";
import { colors, elevation, radius, spacing, type } from "@/theme";
import { useFavorites } from "@/utils/favorites";

export function SurgeryCard({ surgery }: { surgery: Surgery }) {
  const primaryBlock = surgery.blocks.find((b) => b.role === "primary") ?? surgery.blocks[0];
  const regionStyle = getRegionStyle(surgery.region);
  const [favoriteIds, toggleFavorite] = useFavorites();
  const isFavorite = favoriteIds.includes(surgery.id);

  return (
    <Link href={{ pathname: "/surgery/[id]", params: { id: surgery.id } }} asChild>
      {/* Visual styling lives on this inner View, not on the Pressable:
          expo-router's <Link asChild> drops the style prop it clones onto the
          anchor, so anything styled directly on the Pressable renders bare. */}
      <Pressable style={styles.pressable}>
        <View style={styles.card}>
          {/* Region colour carries down the edge rather than sitting only in a
              chip, so the list groups visually while scrolling. */}
          <View style={[styles.rail, { backgroundColor: regionStyle.color }]} />

          <View style={styles.body}>
          <View style={styles.topRow}>
            <View style={[styles.iconBadge, { backgroundColor: regionStyle.color + "1A" }]}>
              <Ionicons name={regionStyle.icon} size={15} color={regionStyle.color} />
            </View>
            <Text style={[styles.region, { color: regionStyle.color }]} numberOfLines={1}>
              {surgery.region}
            </Text>
            <Pressable
              hitSlop={12}
              onPress={(e) => {
                e.preventDefault();
                toggleFavorite(surgery.id);
              }}
            >
              <Ionicons
                name={isFavorite ? "heart" : "heart-outline"}
                size={19}
                color={isFavorite ? colors.danger : colors.textFaint}
              />
            </Pressable>
          </View>

          <Text style={styles.name}>{surgery.name}</Text>

          {primaryBlock ? (
            <View style={styles.blockRow}>
              <View style={styles.blockDot} />
              <Text style={styles.blockName} numberOfLines={1}>
                {primaryBlock.name}
              </Text>
            </View>
          ) : null}
        </View>

          <Ionicons name="chevron-forward" size={16} color={colors.textFaint} style={styles.chevron} />
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "stretch",
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
    ...elevation.card,
  },
  pressable: {
    borderRadius: radius.lg,
  },
  rail: {
    width: 4,
  },
  body: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingLeft: spacing.md,
    gap: 5,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  iconBadge: {
    width: 24,
    height: 24,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  region: {
    ...type.label,
    flex: 1,
  },
  name: {
    ...type.heading,
    fontSize: 16.5,
    color: colors.text,
    lineHeight: 21,
  },
  blockRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  blockDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.primary,
  },
  blockName: {
    ...type.caption,
    color: colors.textMuted,
    flex: 1,
  },
  chevron: {
    alignSelf: "center",
    marginRight: spacing.md,
    marginLeft: spacing.sm,
  },
});
