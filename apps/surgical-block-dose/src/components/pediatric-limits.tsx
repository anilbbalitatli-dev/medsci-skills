import Ionicons from "@expo/vector-icons/Ionicons";
import { Link } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import {
  CATEGORY_LABELS,
  PediatricBlockCheck,
} from "@/data/pediatric-dosing";
import { colors, elevation, numeric, radius, spacing, type } from "@/theme";

/**
 * Per-block paediatric ceilings, checked against what the guidelines state.
 *
 * Kept visually distinct from the combination total above it, because the two
 * answer different questions from different authorities: this is what ESRA/ASRA
 * says about one block, that is this app's own rule about several. Blending
 * them would let a house rule borrow a guideline's credibility.
 */
function VerdictTag({ check }: { check: PediatricBlockCheck }) {
  if (check.verdict === "no-guideline") {
    return (
      <View style={[styles.tag, styles.tagNeutral]}>
        <Text style={[styles.tagText, styles.tagNeutralText]}>Kılavuzda yok</Text>
      </View>
    );
  }
  const over = check.verdict === "over";
  return (
    <View style={[styles.tag, over ? styles.tagOver : styles.tagOk]}>
      <Ionicons
        name={over ? "alert-circle" : "checkmark-circle"}
        size={11}
        color={over ? colors.danger : colors.primaryStrong}
      />
      <Text style={[styles.tagText, over ? styles.tagOverText : styles.tagOkText]}>
        {over ? "Sınırı aşıyor" : "Sınır içinde"}
      </Text>
    </View>
  );
}

export function PediatricLimitList({
  checks,
  weightKg,
}: {
  checks: PediatricBlockCheck[];
  weightKg: number;
}) {
  if (checks.length === 0) return null;
  const anyInferred = checks.some((c) => c.basis === "inferred" && c.limit);
  const anyMissing = checks.some((c) => c.verdict === "no-guideline");

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Kılavuz sınırı — blok başına</Text>
        <Text style={styles.weight}>{weightKg} kg</Text>
      </View>
      <Text style={styles.intro}>
        ESRA/ASRA ve SFAR/ADARPEF pediatrik sınırı <Text style={styles.bold}>ilaç başına değil,
        blok tipi başına</Text> verir. Aşağıdaki her satır, o bloğun kendi kategorisindeki sınıra
        göre değerlendirilir.
      </Text>

      {checks.map((c) => (
        <View key={c.techniqueId} style={styles.row}>
          <View style={styles.rowHead}>
            <Text style={styles.blockName} numberOfLines={2}>
              {c.techniqueName}
            </Text>
            <VerdictTag check={c} />
          </View>

          <Text style={styles.category}>
            {CATEGORY_LABELS[c.category]}
            {c.basis === "inferred" && c.limit ? " · benzeşim" : ""}
          </Text>

          <View style={styles.figures}>
            <Text style={styles.figure}>
              Tipik rejim: <Text style={styles.figureNum}>
                {c.mgPerKgLow.toFixed(2)}–{c.mgPerKgHigh.toFixed(2)}
              </Text>{" "}
              mg/kg
            </Text>
            {c.limit && c.ceilingMg !== undefined ? (
              <Text style={styles.figure}>
                Sınır:{" "}
                <Text style={styles.figureNum}>
                  {c.limit.mgPerKgLow !== undefined ? `${c.limit.mgPerKgLow}–` : ""}
                  {c.limit.mgPerKg}
                </Text>{" "}
                mg/kg ={" "}
                <Text style={styles.figureNum}>{c.ceilingMg.toFixed(1)}</Text> mg
              </Text>
            ) : null}
          </View>

          {c.limit ? (
            <Text style={styles.source}>{c.limit.source}</Text>
          ) : (
            <Text style={styles.source}>
              Bu teknik ya da bu ilaç için kılavuzlarda pediatrik mg/kg sınırı verilmiyor.
            </Text>
          )}
        </View>
      ))}

      {anyInferred ? (
        <Text style={styles.footnote}>
          <Text style={styles.bold}>Benzeşim:</Text> kılavuz bu tekniği adıyla saymıyor; aynı sınıftaki
          bloklara verdiği sınır uygulanmıştır. Kılavuzun fasyal plan örnekleri rektus kılıfı, TAP ve
          fasya iliakadır.
        </Text>
      ) : null}
      {anyMissing ? (
        <Text style={styles.footnote}>
          <Text style={styles.bold}>Kılavuzda yok:</Text> lidokain için pediatrik mg/kg sınırı iki
          kılavuzda da bulunmuyor; IVRA ve infiltrasyon teknikleri kapsam dışında.
        </Text>
      ) : null}
      <Text style={styles.footnote}>
        Sınırlar <Text style={styles.bold}>tek teknik</Text> içindir. Birden fazla bloğun toplamı için
        kılavuzlarda sayısal bir tavan yoktur — yukarıdaki toplam doz hesabı bu uygulamanın kendi
        ihtiyatlı kuralıdır.
      </Text>

      <Link href="/pediatric-dosing" asChild>
        {/* Styles live on the inner View: <Link asChild> drops the style prop
            it clones onto the anchor. */}
        <Pressable>
          <View style={styles.link}>
            <Ionicons name="list-outline" size={14} color={colors.primary} />
            <Text style={styles.linkText}>Tüm pediatrik doz tabloları ve kaynaklar</Text>
            <Ionicons name="chevron-forward" size={14} color={colors.primary} />
          </View>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.sm,
    ...elevation.card,
  },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" },
  title: { ...type.subheading, color: colors.text },
  weight: { ...type.caption, ...numeric, color: colors.textMuted, fontWeight: "700" },
  intro: { ...type.caption, color: colors.textMuted, lineHeight: 17 },
  bold: { fontWeight: "700", color: colors.text },
  row: {
    gap: 3,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  rowHead: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  blockName: { ...type.subheading, color: colors.text, flex: 1 },
  category: { fontSize: 10.5, color: colors.textFaint, fontWeight: "600" },
  figures: { gap: 1, marginTop: 2 },
  figure: { ...type.caption, color: colors.textMuted },
  figureNum: { ...numeric, fontWeight: "700", color: colors.text },
  source: { fontSize: 10, color: colors.textFaint, fontStyle: "italic", lineHeight: 14 },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    borderRadius: radius.pill,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  tagText: { fontSize: 10, fontWeight: "700" },
  tagOk: { backgroundColor: colors.primaryMuted },
  tagOkText: { color: colors.primaryStrong },
  tagOver: { backgroundColor: colors.dangerBg },
  tagOverText: { color: colors.danger },
  tagNeutral: { backgroundColor: colors.surfaceAlt },
  tagNeutralText: { color: colors.textMuted },
  footnote: { fontSize: 10.5, color: colors.textMuted, lineHeight: 15, fontStyle: "italic" },
  link: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  linkText: { ...type.caption, color: colors.primary, fontWeight: "700", flex: 1 },
});
