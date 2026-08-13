import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { FullDermatomeMap } from "@/components/body-diagram";
import { colors, spacing } from "@/theme";

export function DermatomeMap() {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + spacing.xl }]}
    >
      <View style={styles.noteCard}>
        <Text style={styles.noteText}>
          Bu, orijinal olarak çizilmiş şematik bir referans haritasıdır — gerçek bir tıbbi
          atlas/görsel değildir ve kesin anatomik sınırları göstermez. Her blok kartındaki
          "Dermatom" ve "Motor blok" metinleri, buradaki bölgelerle eşleşecek şekilde
          hazırlanmıştır.
        </Text>
      </View>
      <FullDermatomeMap />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.lg,
    gap: spacing.md,
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
});
