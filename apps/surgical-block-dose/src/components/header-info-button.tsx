import { Link } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors, spacing } from "@/theme";

export function HeaderInfoButton() {
  return (
    <View style={styles.row}>
      <Link href="/dermatome-map" asChild>
        <Pressable hitSlop={8} style={({ pressed }) => [styles.button, styles.mapButton, pressed && styles.pressed]}>
          <Text style={[styles.text, styles.mapText]}>Harita</Text>
        </Pressable>
      </Link>
      <Link href="/last-info" asChild>
        <Pressable hitSlop={8} style={({ pressed }) => [styles.button, styles.lastButton, pressed && styles.pressed]}>
          <Text style={[styles.text, styles.lastText]}>LAST</Text>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: spacing.xs,
  },
  button: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  mapButton: {
    backgroundColor: colors.primaryMuted,
  },
  lastButton: {
    backgroundColor: colors.dangerBg,
  },
  pressed: {
    opacity: 0.6,
  },
  text: {
    fontWeight: "700",
    fontSize: 12,
  },
  mapText: {
    color: colors.primary,
  },
  lastText: {
    color: colors.danger,
  },
});
