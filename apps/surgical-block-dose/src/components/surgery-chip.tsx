import { Link } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Surgery } from "@/data/types";
import { makeStyles, spacing, useColors } from "@/theme";

export function SurgeryChip({ surgery }: { surgery: Surgery }) {
  const styles = useStyles();
  return (
    <Link href={{ pathname: "/surgery/[id]", params: { id: surgery.id } }} asChild>
      <Pressable>
        <View style={styles.chip}>
          <Text style={styles.text} numberOfLines={1}>
            {surgery.name}
          </Text>
        </View>
      </Pressable>
    </Link>
  );
}

const useStyles = makeStyles((colors) => ({
  chip: {
    backgroundColor: colors.chip,
    borderRadius: 999,
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    maxWidth: 220,
  },
  pressed: {
    opacity: 0.6,
  },
  text: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.text,
  },
}));
