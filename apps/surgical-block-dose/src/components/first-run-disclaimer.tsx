import { Link, usePathname } from "expo-router";
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors, radius, spacing, type } from "@/theme";
import { useStorage } from "@/utils/use-storage";

/**
 * İlk açılışta bir kez gösterilen kullanım koşulu onayı.
 *
 * Anahtar sürüm numarası taşır: koşullar esaslı biçimde değişirse anahtar
 * `-v2` olur ve onay yeniden istenir. Onay yalnızca cihazda tutulur; kim
 * onayladığı hiçbir yere gitmez.
 */
const ACK_KEY = "disclaimer-ack-v1";

const POINTS = [
  "Sağlık profesyonelleri için eğitim ve referans kaynağıdır; klinik karar aracı değildir.",
  "Gösterilen doz sınırları kılavuz değerlerinin ağırlıkla çarpımıdır — hastayı değerlendirmez, komorbidite ve organ yetmezliği düzeltmesi yapmaz.",
  "Blok, ilaç ve doz kararı her zaman hastayı gören sorumlu klinisyene aittir.",
];

export function FirstRunDisclaimer() {
  const insets = useSafeAreaInsets();
  const [acknowledged, setAcknowledged] = useStorage<boolean>(ACK_KEY, false);
  const pathname = usePathname();

  // Yasal ekran açıkken kendini gizler: onay penceresi kök düzeyde çizildiği
  // için, gizlemezse okunmak üzere açılan metnin önünü kapatırdı. Ekrandan
  // çıkılınca pathname değiştiği için onay penceresi kendiliğinden geri gelir.
  if (acknowledged || pathname === "/legal") return null;

  return (
    <Modal visible animationType="fade" transparent onRequestClose={() => undefined}>
      <View style={styles.backdrop}>
        <View style={[styles.sheet, { paddingBottom: insets.bottom + spacing.lg }]}>
          <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
            <Text style={styles.title}>Başlamadan önce</Text>
            {POINTS.map((point) => (
              <View key={point} style={styles.row}>
                <Text style={styles.dot}>•</Text>
                <Text style={styles.body}>{point}</Text>
              </View>
            ))}
            <Text style={styles.note}>
              Uygulama hiçbir veri toplamaz; girdiğiniz ağırlık ve yaş yalnızca cihazınızda
              kalır. Koşulların tamamı, kaynaklar ve görsel lisansları Yasal Bilgi
              bölümündedir.
            </Text>
          </ScrollView>
          <Pressable
            onPress={() => setAcknowledged(true)}
            style={({ pressed }) => [styles.button, pressed && styles.pressed]}
          >
            <Text style={styles.buttonText}>Anladım, devam et</Text>
          </Pressable>
          {/* Onaylamadan da tam metne ulaşılabilmeli: "kabul et"i okumadan
              basmak zorunda bırakmak, onayı anlamsızlaştırır. */}
          <Link href="/legal" asChild>
            <Pressable style={({ pressed }) => pressed && styles.pressed}>
              <Text style={styles.link}>Önce tam metni oku</Text>
            </Pressable>
          </Link>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(10,20,26,0.55)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    gap: spacing.md,
    maxHeight: "85%",
  },
  scroll: {
    gap: spacing.sm,
  },
  title: {
    ...type.title,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  row: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  dot: {
    ...type.body,
    color: colors.textMuted,
    lineHeight: 20,
  },
  body: {
    ...type.body,
    color: colors.text,
    lineHeight: 20,
    flex: 1,
  },
  note: {
    ...type.bodySm,
    color: colors.textMuted,
    lineHeight: 19,
    marginTop: spacing.xs,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: 13,
    alignItems: "center",
  },
  buttonText: {
    ...type.heading,
    color: "#FFFFFF",
  },
  pressed: {
    opacity: 0.75,
  },
  link: {
    ...type.bodySm,
    color: colors.primary,
    fontWeight: "700",
    textAlign: "center",
  },
});
