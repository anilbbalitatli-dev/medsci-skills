import { Link } from "expo-router";
import { Pressable, StyleSheet, Text } from "react-native";

import { colors } from "@/theme";

export function HeaderInfoButton() {
  return (
    <Link href="/last-info" asChild>
      <Pressable hitSlop={8} style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
        <Text style={styles.text}>LAST</Text>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: colors.dangerBg,
  },
  pressed: {
    opacity: 0.6,
  },
  text: {
    color: colors.danger,
    fontWeight: "700",
    fontSize: 12,
  },
});
