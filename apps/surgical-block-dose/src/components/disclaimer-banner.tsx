import Ionicons from "@expo/vector-icons/Ionicons";
import { Link } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors, spacing } from "@/theme";

/**
 * Kısa uyarı, tam metnin kapısıdır.
 *
 * Eskiden burada dört cümlelik bir paragraf vardı; her ekranın başındaki dört
 * cümle üçüncü açılışta okunmaz hale gelir. Şimdi banner tek cümlede ne
 * olduğunu söylüyor, kapsamın tamamı (sınırlar, kaynaklar, gizlilik, görsel
 * lisansları) dokununca açılan yasal ekranda duruyor.
 */
export function DisclaimerBanner() {
  return (
    <Link href="/legal" asChild>
      <Pressable style={({ pressed }) => pressed && styles.pressed}>
        <View style={styles.container}>
          <View style={styles.textBlock}>
            <Text style={styles.title}>Yalnızca eğitim/referans amaçlıdır</Text>
            <Text style={styles.body}>
              Klinik karar aracı değildir. Doz aralıkları kılavuzlardan alınmış tipik
              değerlerdir; hastaya uygulamadan önce güncel kılavuz, kurum protokolü ve
              prospektüs ile doğrulayın.
            </Text>
            <Text style={styles.more}>Kullanım koşulları, sınırlar, kaynaklar ve gizlilik</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color={colors.warning} />
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.warningBg,
    borderColor: colors.warningBorder,
    borderWidth: 1,
    borderRadius: 12,
    padding: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  textBlock: {
    flex: 1,
    gap: spacing.xs,
  },
  pressed: {
    opacity: 0.75,
  },
  title: {
    color: colors.warning,
    fontWeight: "700",
    fontSize: 13,
  },
  body: {
    color: colors.warning,
    fontSize: 12.5,
    lineHeight: 18,
  },
  more: {
    color: colors.warning,
    fontSize: 11.5,
    fontWeight: "700",
    textDecorationLine: "underline",
  },
});
