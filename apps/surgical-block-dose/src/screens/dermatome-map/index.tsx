import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { DermatomeFigureCard } from "@/components/dermatome-figure";
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
      <View style={styles.noteCard}>
        <Text style={styles.noteText}>
          ISNCSCI (spinal kord yaralanması sınıflandırması) dermatom şeması. Blok kartlarındaki
          şekiller de bu haritanın aynısıdır; orada yalnızca ilgili segmentler boyalıdır. Arka
          figür, lumbosakral segmentleri kapsayan bloklarda otomatik olarak görünür. Dermatom
          sınırları kişiden kişiye değişir ve komşu segmentlerle örtüşür.
        </Text>
      </View>

      <DermatomeFigureCard
        height={440}
        showLabels
        alwaysShowPosterior
        caption="Ön figür C2–S1; arka figür alt ekstremite ve perine (L2–S5)."
      />

      {hasPlates ? (
        <>
          <Text style={styles.sectionTitle}>Ek Anatomik Plakalar</Text>
          <View style={styles.plates}>
            {plates.map((plate) => (
              <ReferenceImageView key={plate.key} data={plate} />
            ))}
          </View>
        </>
      ) : null}
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
