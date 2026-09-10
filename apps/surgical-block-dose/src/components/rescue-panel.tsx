import Ionicons from "@expo/vector-icons/Ionicons";
import { Link } from "expo-router";
import { useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { RESCUE_REASON_LABEL, rescueFor } from "@/data/rescue";
import { makeStyles, radius, spacing, type, useColors } from "@/theme";

/**
 * "Blok tutmadı, ne ekleyeyim?"
 *
 * Liste elle yazılmaz; kapsama verisinden türetilir (bkz. data/rescue.ts).
 * Sıralama en küçük ek girişimi öne alır: popliteal siyatikten sonra ayağın iç
 * kenarı açıksa cevap safen bloğudur, femoral bloğun tamamı değil.
 */
export function RescuePanel({ techniqueId }: { techniqueId: string }) {
  const colors = useColors();
  const styles = useStyles();
  const options = useMemo(() => rescueFor(techniqueId), [techniqueId]);
  if (options.length === 0) return null;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Ionicons name="bandage-outline" size={14} color={colors.primary} />
        <Text style={styles.title}>Yetersiz kalırsa</Text>
      </View>

      {options.map((option) => (
        <View key={option.technique.id} style={styles.row}>
          {/* Kurtarma bloğunun adı artık bir çıkmaz değil: dozunu ve
              komplikasyonlarını görmek için kendi sayfasına gider. */}
          <Link
            href={{ pathname: "/technique/[id]", params: { id: option.technique.id } }}
            asChild
          >
            <Pressable>
              <View style={styles.rowHead}>
                <Ionicons name="add-circle-outline" size={13} color={colors.primaryStrong} />
                <Text style={styles.techniqueName}>{option.technique.name}</Text>
                <Ionicons name="chevron-forward" size={12} color={colors.primaryStrong} />
              </View>
            </Pressable>
          </Link>
          <Text style={styles.nerves}>{option.nerves.map((n) => n.name).join(", ")}</Text>
          <Text style={styles.reason}>{RESCUE_REASON_LABEL[option.reason]}</Text>
        </View>
      ))}

      <Text style={styles.footnote}>
        Öneriler bu bloğun açık bıraktığı sinirlerden türetilir; ek doz toplam tavana eklenir.
        Nöraksiyel bloğa ya da genel anesteziye geçmek bir tamamlama değil, plan değişikliğidir ve
        listeye girmez.
      </Text>
    </View>
  );
}

const useStyles = makeStyles((colors) => ({
  card: {
    backgroundColor: colors.background,
    borderRadius: radius.sm,
    padding: spacing.md,
    gap: 6,
    marginTop: spacing.xs,
  },
  header: { flexDirection: "row", alignItems: "center", gap: 5 },
  title: { ...type.subheading, color: colors.text },
  row: { gap: 1, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 6 },
  rowHead: { flexDirection: "row", alignItems: "center", gap: 4 },
  techniqueName: { ...type.subheading, fontSize: 12.5, color: colors.primaryStrong, flex: 1 },
  nerves: { ...type.caption, color: colors.text, lineHeight: 16 },
  reason: { fontSize: 10.5, color: colors.textFaint, fontStyle: "italic" },
  footnote: { fontSize: 10, color: colors.textFaint, lineHeight: 14, fontStyle: "italic" },
}));
