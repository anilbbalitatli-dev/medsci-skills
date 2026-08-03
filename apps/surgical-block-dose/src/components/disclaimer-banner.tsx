import { StyleSheet, Text, View } from "react-native";

import { colors, spacing } from "@/theme";

export function DisclaimerBanner() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Yalnızca eğitim/referans amaçlıdır</Text>
      <Text style={styles.body}>
        Bu uygulama klinik karar verme aracı değildir; hasta bazında blok ve doz seçimini
        değiştirmez. Verilen bloklar ve doz aralıkları genel öğretim referanslarına
        dayanır. Gerçek hastada uygulama öncesi güncel kılavuzlar, kurum protokolü ve
        ilaç prospektüsü ile doğrulayın; karar her zaman sorumlu klinisyene aittir.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.warningBg,
    borderColor: colors.warningBorder,
    borderWidth: 1,
    borderRadius: 12,
    padding: spacing.md,
    gap: spacing.xs,
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
});
