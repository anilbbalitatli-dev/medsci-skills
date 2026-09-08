import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { PlexusDiagramView } from "@/components/plexus-diagram";
import { PLEXUS_DIAGRAMS, PlexusId, diagramForTechnique } from "@/data/plexus-diagrams";
import { makeStyles, radius, spacing, type, useColors } from "@/theme";

/**
 * Yaklaşımları yan yana koyan ekran.
 *
 * Blok kartındaki şema tek bir bloğu anlatır; buradaki, aralarındaki farkı.
 * Bir ekstremitenin bloklarının tamamı aynı zincirin farklı yerlerine iğne
 * koymaktan ibarettir ve seçim çoğunlukla "hangi dallar enjeksiyon noktasının
 * proksimalinde kalıyor" sorusuyla belirlenir.
 */
export function Plexus({ techniqueId }: { techniqueId?: string }) {
  const colors = useColors();
  const styles = useStyles();
  const insets = useSafeAreaInsets();
  // Ders kutusu seçili pleksusla değişir; şema bileşeni kendi seçimini tutuyor,
  // burada yalnızca hangi pleksusun anlatıldığını bilmek yetiyor.
  const [plexusId, setPlexusId] = useState<PlexusId>(
    diagramForTechnique(techniqueId ?? "")?.id ?? "brachial"
  );
  const diagram = PLEXUS_DIAGRAMS[plexusId];

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + spacing.xl }]}
    >
      <Text style={styles.intro}>
        Bir pleksus, kökten uca doğru hep aynı sırayı izler. Blokların hepsi bu zincirin bir
        yerine iğne koyar; kapsamı belirleyen de iğnenin seviyesidir.{" "}
        <Text style={styles.bold}>
          Enjeksiyon noktasının proksimalinde ayrılmış bir dal, ne kadar hacim verilirse verilsin
          kapsanmaz.
        </Text>
      </Text>

      <PlexusDiagramView selectable initialTechniqueId={techniqueId} onPlexusChange={setPlexusId} />

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Şemanın söylediği üç şey</Text>
        {diagram.lessons.map((lesson) => (
          <Text key={lesson.title} style={styles.item}>
            <Text style={styles.bold}>{lesson.title}</Text> {lesson.detail}
          </Text>
        ))}
      </View>

      <Text style={styles.footnote}>
        Şemalar öğretim amaçlı basitleştirmedir: pleksusun ön ekleri (prefiksasyon/postfiksasyon),
        dalların çıkış düzeyleri ve blok yayılımı kişiden kişiye değişir.
      </Text>
    </ScrollView>
  );
}

const useStyles = makeStyles((colors) => ({
  content: { padding: spacing.lg, gap: spacing.md },
  intro: { ...type.body, color: colors.text, lineHeight: 20 },
  bold: { fontWeight: "700", color: colors.text },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.sm,
  },
  cardTitle: { ...type.heading, color: colors.text },
  item: { ...type.bodySm, color: colors.textMuted, lineHeight: 19 },
  footnote: { ...type.caption, color: colors.textFaint, lineHeight: 16, fontStyle: "italic" },
}));
