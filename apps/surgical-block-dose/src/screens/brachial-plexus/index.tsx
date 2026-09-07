import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { BrachialPlexusDiagram } from "@/components/brachial-plexus-diagram";
import { colors, radius, spacing, type } from "@/theme";

/**
 * Yaklaşımları yan yana koyan ekran.
 *
 * Blok kartındaki şema tek bir bloğu anlatır; buradaki, aralarındaki farkı.
 * Üst ekstremite bloklarının tamamı aynı zincirin farklı yerlerine iğne
 * koymaktan ibarettir ve seçim çoğunlukla "hangi dallar enjeksiyon noktasının
 * proksimalinde kalıyor" sorusuyla belirlenir.
 */
export function BrachialPlexus() {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + spacing.xl }]}
    >
      <Text style={styles.intro}>
        Brakiyal pleksus kökten uca doğru aynı sırayı izler:{" "}
        <Text style={styles.bold}>kök → trunkus → divizyon → kord → uç sinir</Text>. Üst ekstremite
        bloklarının hepsi bu zincirin bir yerine iğne koyar; kapsamı belirleyen de iğnenin
        seviyesidir. Enjeksiyon noktasının proksimalinde ayrılmış bir dal, ne kadar hacim verilirse
        verilsin kapsanmaz.
      </Text>

      <BrachialPlexusDiagram selectable />

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Şemanın söylediği üç şey</Text>
        <Text style={styles.item}>
          <Text style={styles.bold}>İnterskalen ulnar tarafı açık bırakır.</Text> İğne kök/üst
          trunkus düzeyindedir; alt trunkus (C8–T1) çoğu zaman korunur. Omuz için doğru, el için
          değil.
        </Text>
        <Text style={styles.item}>
          <Text style={styles.bold}>Suprascapular sinir trunkustan ayrılır.</Text> Kordların
          proksimalinde olduğu için infraklaviküler blok onu kaçırır — omuz kapsülünün büyük
          bölümü açık kalır.
        </Text>
        <Text style={styles.item}>
          <Text style={styles.bold}>Aksiller blok uç sinir düzeyindedir.</Text> Muskülokutanöz
          sinir korakobrakiyalis içinde ayrı seyrettiği için ayrı enjeksiyon ister; omuz ve
          aksilla hiç kapsanmaz.
        </Text>
      </View>

      <Text style={styles.footnote}>
        Şema öğretim amaçlı bir basitleştirmedir: pleksusun ön ekleri (prefiksasyon/postfiksasyon),
        dalların çıkış düzeyleri ve blok yayılımı kişiden kişiye değişir.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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
});
