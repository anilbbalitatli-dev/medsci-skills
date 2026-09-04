import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";

import { HeaderInfoButton } from "@/components/header-info-button";
import { SURGERIES } from "@/data/surgeries";
import { SurgeryDetail } from "@/screens/surgery-detail";
import { colors, spacing } from "@/theme";
import { recordRecentlyViewed } from "@/utils/recently-viewed";

export default function SurgeryDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const surgery = SURGERIES.find((s) => s.id === id);

  useEffect(() => {
    if (surgery) recordRecentlyViewed(surgery.id);
  }, [surgery]);

  if (!surgery) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>Cerrahi bulunamadı.</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: surgery.name, headerRight: () => <HeaderInfoButton /> }} />
      <SurgeryDetail surgery={surgery} />
    </>
  );
}

const styles = StyleSheet.create({
  notFound: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl,
    backgroundColor: colors.background,
  },
  notFoundText: {
    color: colors.textMuted,
  },
});
