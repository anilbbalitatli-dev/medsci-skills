import { StyleSheet, Text, View } from "react-native";

import { CoverageInfo } from "@/components/coverage-info";
import { ReferenceImageList } from "@/components/reference-image";
import { ScoreBadges } from "@/components/score-badges";
import { SonoAnatomyView } from "@/components/sono-anatomy";
import { techniqueForBlock } from "@/data/block-technique";
import { imagesForBlock } from "@/data/reference-images";
import { sonoSpecFor } from "@/data/sono-anatomy";
import { BlockOption } from "@/data/types";
import { colors, elevation, numeric, radius, role, spacing, type } from "@/theme";
import { volumeRangeToMgRange } from "@/utils/dose-math";

export function BlockCard({ block }: { block: BlockOption }) {
  const images = imagesForBlock(block);
  const sonoSpecs = images
    .map((img) => sonoSpecFor(img.key))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));
  const roleStyle = role[block.role];
  const landmarkNote = block.landmarkNote ?? techniqueForBlock(block.id)?.landmark;

  return (
    <View style={styles.card}>
      <View style={[styles.rail, { backgroundColor: roleStyle.rail }]} />

      <View style={styles.body}>
        <View style={styles.headerRow}>
          <Text style={styles.name}>{block.name}</Text>
          <View style={[styles.badge, { backgroundColor: roleStyle.badgeBg }]}>
            <Text style={[styles.badgeText, { color: roleStyle.badgeText }]}>{roleStyle.label}</Text>
          </View>
        </View>
        <Text style={styles.summary}>{block.summary}</Text>

        {/* Doses read as a table: drug on the left, figures right-aligned and
            tabular so volumes and milligrams line up down the column. */}
        <View style={styles.doseTable}>
          {block.anesthetics.map((a) => {
            const [minMg, maxMg] = volumeRangeToMgRange(a.concentrationPercent, a.volumeMlRange);
            return (
              <View key={a.drug} style={styles.doseRow}>
                <View style={styles.doseMain}>
                  <Text style={styles.drug}>{a.drug}</Text>
                  <View style={styles.figures}>
                    <Text style={styles.volume}>
                      {a.volumeMlRange[0]}–{a.volumeMlRange[1]}
                      <Text style={styles.unit}> mL</Text>
                    </Text>
                    <Text style={styles.mg}>
                      {Math.round(minMg)}–{Math.round(maxMg)}
                      <Text style={styles.unit}> mg</Text>
                    </Text>
                  </View>
                </View>
                {a.note ? <Text style={styles.note}>{a.note}</Text> : null}
              </View>
            );
          })}
        </View>

        {/* A block may override the note, but none currently does — the text
            is authored once per technique so the same block reads the same way
            under every operation that lists it. */}
        {landmarkNote ? <Text style={styles.landmark}>{landmarkNote}</Text> : null}

        <CoverageInfo coverage={block.coverage} />

        <ReferenceImageList images={images} />

        {sonoSpecs.map((spec) => (
          <SonoAnatomyView key={spec.title} spec={spec} />
        ))}

        <ScoreBadges score={block.score} />

        {block.contraindications && block.contraindications.length > 0 ? (
          <View style={styles.contraCard}>
            <Text style={styles.contraTitle}>Kontrendikasyonlar</Text>
            {block.contraindications.map((c) => (
              <View key={c} style={styles.contraRow}>
                <View style={styles.contraDot} />
                <Text style={styles.contraItem}>{c}</Text>
              </View>
            ))}
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
    ...elevation.card,
  },
  rail: {
    width: 4,
  },
  body: {
    flex: 1,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: spacing.sm,
  },
  name: {
    ...type.heading,
    color: colors.text,
    flexShrink: 1,
    lineHeight: 20,
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  badgeText: {
    fontSize: 10.5,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  summary: {
    ...type.bodySm,
    color: colors.textMuted,
    lineHeight: 18.5,
  },
  doseTable: {
    gap: 1,
    borderRadius: radius.sm,
    overflow: "hidden",
    marginTop: spacing.xs,
  },
  doseRow: {
    backgroundColor: colors.surfaceAlt,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: 2,
  },
  doseMain: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  drug: {
    ...type.subheading,
    color: colors.text,
    flexShrink: 1,
  },
  figures: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: spacing.md,
  },
  volume: {
    ...type.subheading,
    ...numeric,
    color: colors.text,
  },
  mg: {
    ...type.subheading,
    ...numeric,
    color: colors.primary,
  },
  unit: {
    fontSize: 10.5,
    fontWeight: "600",
    color: colors.textFaint,
  },
  note: {
    ...type.caption,
    color: colors.textMuted,
    fontStyle: "italic",
    lineHeight: 16,
  },
  landmark: {
    ...type.caption,
    color: colors.textMuted,
  },
  contraCard: {
    backgroundColor: colors.dangerBg,
    borderRadius: radius.sm,
    padding: spacing.md,
    gap: 5,
    marginTop: spacing.xs,
  },
  contraTitle: {
    ...type.label,
    color: colors.danger,
  },
  contraRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
  },
  contraDot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.danger,
    marginTop: 7,
  },
  contraItem: {
    ...type.caption,
    color: colors.danger,
    lineHeight: 17,
    flex: 1,
  },
});
