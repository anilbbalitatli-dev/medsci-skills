import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Text, View } from "react-native";

import { Finding, FindingSeverity } from "@/data/combination-analysis";
import { Palette, elevation, makeStyles, radius, spacing, type, useColors } from "@/theme";

/**
 * Verdicts on a block combination.
 *
 * The four severities are deliberately not a single red-to-green ramp: "avoid"
 * and "redundant" are different kinds of wrong. An avoidable pair is unsafe or
 * pointless in principle; a redundant one is merely already covered, which is a
 * dose problem rather than a safety one. "Complementary" exists so the screen
 * can confirm a good pairing instead of only ever complaining — a reference
 * that speaks up only to object teaches nothing about what to do instead.
 */
type Tone = { bg: string; border: string; fg: string; icon: keyof typeof Ionicons.glyphMap; label: string };

// Etiket ve ikon temadan bağımsız; yalnızca renkler palete bağlanır.
function tones(colors: Palette): Record<FindingSeverity, Tone> {
  return {
  avoid: {
    bg: colors.dangerBg,
    border: colors.danger,
    fg: colors.danger,
    icon: "close-circle",
    label: "Yapılmamalı",
  },
  redundant: {
    bg: colors.warningBg,
    border: colors.warningBorder,
    fg: colors.warning,
    icon: "copy",
    label: "Gereksiz tekrar",
  },
  caution: {
    bg: colors.surfaceAlt,
    border: colors.borderStrong,
    fg: colors.textMuted,
    icon: "alert-circle",
    label: "Dikkat",
  },
  complementary: {
    bg: colors.primaryMuted,
    border: colors.primary,
    fg: colors.primaryStrong,
    icon: "checkmark-circle",
    label: "Birbirini tamamlıyor",
  },
};
}

export function CombinationFindings({ findings }: { findings: Finding[] }) {
  const colors = useColors();
  const TONES = tones(colors);
  const styles = useStyles();
  if (findings.length === 0) {
    return (
      <View style={styles.empty}>
        <Ionicons name="information-circle-outline" size={17} color={colors.textMuted} />
        <Text style={styles.emptyText}>
          Seçilen bloklar arasında bilinen bir çakışma, tekrar veya sakınca kaydı yok. Bu, kombinasyonun
          bu cerrahi için doğru olduğu anlamına gelmez — yalnızca birbirleriyle çelişmediklerini gösterir.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.list}>
      {findings.map((f) => {
        const tone = TONES[f.severity];
        return (
          <View key={f.id} style={[styles.card, { backgroundColor: tone.bg, borderColor: tone.border }]}>
            <View style={[styles.rail, { backgroundColor: tone.fg }]} />
            <View style={styles.body}>
              <View style={styles.header}>
                <Ionicons name={tone.icon} size={15} color={tone.fg} />
                <Text style={[styles.badge, { color: tone.fg }]}>{tone.label}</Text>
              </View>
              <Text style={[styles.title, { color: tone.fg }]}>{f.title}</Text>
              <Text style={styles.detail}>{f.detail}</Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const useStyles = makeStyles((colors) => ({
  list: { gap: spacing.sm },
  card: {
    flexDirection: "row",
    alignItems: "stretch",
    borderRadius: radius.md,
    borderWidth: 1,
    overflow: "hidden",
    ...elevation.card,
  },
  rail: { width: 4 },
  body: { flex: 1, padding: spacing.md, gap: 3 },
  header: { flexDirection: "row", alignItems: "center", gap: 5 },
  badge: { ...type.label, fontSize: 10 },
  title: { ...type.subheading, lineHeight: 18 },
  detail: { ...type.bodySm, color: colors.text, lineHeight: 18, opacity: 0.85 },
  empty: {
    flexDirection: "row",
    gap: spacing.sm,
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  emptyText: { ...type.caption, color: colors.textMuted, lineHeight: 17, flex: 1 },
}));
