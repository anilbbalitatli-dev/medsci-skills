import { Link } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors, spacing } from "@/theme";

export function HeaderInfoButton() {
  return (
    <View style={styles.row}>
      <Link href="/dermatome-map" asChild>
        <Pressable hitSlop={8}>
          <View style={[styles.button, styles.mapButton]}>
            <Text style={[styles.text, styles.mapText]}>Harita</Text>
          </View>
        </Pressable>
      </Link>
      {/* The mixture calculator lives in the header rather than on a card
          because it is needed at the moment the syringe is being drawn up,
          whichever screen happens to be open. */}
      <Link href="/mixture" asChild>
        <Pressable hitSlop={8}>
          <View style={[styles.button, styles.mixButton]}>
            <Text style={[styles.text, styles.mixText]}>Karışım</Text>
          </View>
        </Pressable>
      </Link>
      <Link href="/last-info" asChild>
        <Pressable hitSlop={8}>
          <View style={[styles.button, styles.lastButton]}>
            <Text style={[styles.text, styles.lastText]}>LAST</Text>
          </View>
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
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  mapButton: {
    backgroundColor: colors.primaryMuted,
  },
  mixButton: {
    backgroundColor: colors.surfaceAlt,
  },
  lastButton: {
    backgroundColor: colors.dangerBg,
  },
  pressed: {
    opacity: 0.6,
  },
  text: {
    fontWeight: "700",
    fontSize: 11.5,
  },
  mapText: {
    color: colors.primary,
  },
  mixText: {
    color: colors.textMuted,
  },
  lastText: {
    color: colors.danger,
  },
});
