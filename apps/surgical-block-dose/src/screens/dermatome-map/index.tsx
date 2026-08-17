import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { FullDermatomeMap } from "@/components/body-diagram";
import { ReferenceImageView } from "@/components/reference-image";
import { getReferenceImage } from "@/data/block-images";
import { ANATOMY } from "@/data/reference-images";
import { colors, spacing } from "@/theme";

export function DermatomeMap() {
  const insets = useSafeAreaInsets();
  const plates = [ANATOMY.dermatomeAnterior, ANATOMY.dermatomePosterior];
  const hasPlates = plates.some((p) => getReferenceImage(p.key));

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + spacing.xl }]}
    >
      <Text style={styles.sectionTitle}>Anatomik Plakalar</Text>
      <View style={styles.plates}>
        {plates.map((plate) => (
          <ReferenceImageView key={plate.key} data={plate} />
        ))}
      </View>

      <Text style={styles.sectionTitle}>{hasPlates ? "Şematik Özet" : "Şematik Harita"}</Text>
      <View style={styles.noteCard}>
        <Text style={styles.noteText}>
          Aşağıdaki harita orijinal olarak çizilmiş şematik bir referanstır — gerçek bir tıbbi
          atlas görseli değildir ve kesin anatomik sınırları göstermez. Her blok kartındaki
          "Dermatom" ve "Motor blok" metinleri buradaki bölgelerle eşleşecek şekilde
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
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text,
  },
  plates: {
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
