import { Link } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Surgery } from "@/data/types";
import { colors, spacing } from "@/theme";

export function SurgeryCard({ surgery }: { surgery: Surgery }) {
  const primaryBlock = surgery.blocks.find((b) => b.role === "primary") ?? surgery.blocks[0];

  return (
    <Link href={{ pathname: "/surgery/[id]", params: { id: surgery.id } }} asChild>
      <Pressable style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}>
        <View style={styles.header}>
          <Text style={styles.category}>{surgery.category}</Text>
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
  },
  category: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.primary,
    backgroundColor: colors.primaryMuted,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: 6,
    overflow: "hidden",
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
