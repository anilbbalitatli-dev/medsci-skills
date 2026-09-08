import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Text, View } from "react-native";

import { Link } from "expo-router";
import { Pressable } from "react-native";

import { bleedingRiskFor } from "@/data/anticoagulation";
import { ComplicationSeverity, absorptionFor, complicationsFor } from "@/data/complications";
import { colors, radius, spacing, type } from "@/theme";

/**
 * Bu bloğa özgü riskler.
 *
 * Ortak riskler (LAST, sinir hasarı, enfeksiyon) burada tekrarlanmaz — kırk
 * blok kartında kırk kez aynı üç maddeyi okumak, okumayı bırakmanın en hızlı
 * yoludur. Burada yalnızca kararı değiştirenler var: frenik felç, plevra
 * yakınlığı, düşme riski.
 *
 * Emilim basamağı her blokta gösterilir, çünkü doz tavanı tek başına onu
 * söylemez: tavanın altında kalan bir interkostal blok, aynı mg'ın femoral
 * bloğundan daha yüksek plazma düzeyi yapar.
 */
const SEVERITY: Record<ComplicationSeverity, { color: string; bg: string; icon: keyof typeof Ionicons.glyphMap }> = {
  critical: { color: colors.danger, bg: colors.dangerBg, icon: "alert-circle" },
  notable: { color: colors.warning, bg: colors.warningBg, icon: "warning-outline" },
  nuisance: { color: colors.textMuted, bg: colors.surfaceAlt, icon: "information-circle-outline" },
};

const BLEEDING_BG = {
  high: colors.dangerBg,
  intermediate: colors.warningBg,
  low: colors.primaryMuted,
} as const;
const BLEEDING_FG = {
  high: colors.danger,
  intermediate: colors.warning,
  low: colors.primaryStrong,
} as const;

const TIER_STYLE = {
  highest: { color: colors.danger, bg: colors.dangerBg },
  high: { color: colors.warning, bg: colors.warningBg },
  moderate: { color: colors.textMuted, bg: colors.surfaceAlt },
  low: { color: colors.primaryStrong, bg: colors.primaryMuted },
} as const;

export function ComplicationPanel({ techniqueId }: { techniqueId: string }) {
  const complications = complicationsFor(techniqueId);
  const absorption = absorptionFor(techniqueId);
  const bleeding = bleedingRiskFor(techniqueId);
  if (complications.length === 0 && !absorption && !bleeding) return null;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Ionicons name="shield-outline" size={14} color={colors.warning} />
        <Text style={styles.title}>Bu bloğa özgü riskler</Text>
      </View>

      {absorption ? (
        <View style={[styles.absorption, { backgroundColor: TIER_STYLE[absorption.tier].bg }]}>
          <Text style={[styles.absorptionLabel, { color: TIER_STYLE[absorption.tier].color }]}>
            {absorption.label}
          </Text>
          <Text style={styles.absorptionDetail}>{absorption.detail}</Text>
        </View>
      ) : null}

      {/* Antikoagülan alan hastada ilk soru bloğun hangi grupta olduğudur;
          süreler ayrı ekranda. */}
      {bleeding ? (
        <Link href="/anticoagulation" asChild>
          <Pressable style={({ pressed }) => pressed && { opacity: 0.6 }}>
            <View style={[styles.bleeding, { backgroundColor: BLEEDING_BG[bleeding.tier] }]}>
              <View style={styles.bleedingHead}>
                <Text style={[styles.bleedingLabel, { color: BLEEDING_FG[bleeding.tier] }]}>
                  Kanama riski: {bleeding.label.toLowerCase()}
                </Text>
                <Ionicons name="chevron-forward" size={12} color={BLEEDING_FG[bleeding.tier]} />
              </View>
              <Text style={styles.bleedingWhy}>{bleeding.why}</Text>
            </View>
          </Pressable>
        </Link>
      ) : null}

      {complications.map((c) => {
        const s = SEVERITY[c.severity];
        return (
          <View key={c.title} style={styles.row}>
            <Ionicons name={s.icon} size={13} color={s.color} style={styles.icon} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.rowTitle, { color: s.color }]}>{c.title}</Text>
              <Text style={styles.rowDetail}>{c.detail}</Text>
            </View>
          </View>
        );
      })}

      <Text style={styles.footnote}>
        Her blokta geçerli olan riskler (LAST, sinir hasarı, damar ponksiyonu, enfeksiyon) burada
        tekrarlanmaz; LAST bölümünde topluca yazılıdır.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background,
    borderRadius: radius.sm,
    padding: spacing.md,
    gap: 6,
    marginTop: spacing.xs,
  },
  header: { flexDirection: "row", alignItems: "center", gap: 5 },
  title: { ...type.subheading, color: colors.text },
  absorption: { borderRadius: radius.sm, padding: 8, gap: 2 },
  absorptionLabel: { ...type.caption, fontWeight: "700" },
  absorptionDetail: { fontSize: 11.5, color: colors.textMuted, lineHeight: 16 },
  bleeding: { borderRadius: radius.sm, padding: 8, gap: 2 },
  bleedingHead: { flexDirection: "row", alignItems: "center", gap: 4 },
  bleedingLabel: { ...type.caption, fontWeight: "700", flex: 1 },
  bleedingWhy: { fontSize: 11.5, color: colors.textMuted, lineHeight: 16 },
  row: { flexDirection: "row", gap: 6, alignItems: "flex-start" },
  icon: { marginTop: 2 },
  rowTitle: { ...type.subheading, fontSize: 12.5 },
  rowDetail: { ...type.caption, color: colors.textMuted, lineHeight: 16 },
  footnote: { fontSize: 10, color: colors.textFaint, fontStyle: "italic", lineHeight: 14 },
});
