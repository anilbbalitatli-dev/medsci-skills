import Ionicons from "@expo/vector-icons/Ionicons";
import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";

import { analyzeCombination } from "@/data/combination-analysis";
import { NerveModality, rootsLabel } from "@/data/nerves";
import { TECHNIQUE_NERVES } from "@/data/technique-nerves";
import { techniqueById } from "@/data/techniques";
import { colors, numeric, radius, spacing, type } from "@/theme";

/**
 * Which nerves this one block reaches, and the segments each of them carries.
 *
 * The block card already showed a lumped dermatome range and a sentence of
 * motor prose. That is enough to recognise a block but not enough to reason
 * about one — it cannot say *why* the range is what it is, or which part of it
 * survives when the block is incomplete. This is the same nerve-by-nerve
 * breakdown the combination builder produces, narrowed to a single technique.
 *
 * It matters most for the blocks with no ultrasound schematic to look at: for
 * those, this is the anatomy panel.
 */
const MODALITY: Record<NerveModality, { label: string; color: string }> = {
  sensory: { label: "Duyusal", color: "#3B6EA5" },
  motor: { label: "Motor", color: "#8A5200" },
  mixed: { label: "Karışık", color: "#6B4E9E" },
};

export function TechniqueNervesPanel({ techniqueId }: { techniqueId: string }) {
  const technique = techniqueById(techniqueId);
  const map = TECHNIQUE_NERVES[techniqueId];
  const analysis = useMemo(() => analyzeCombination([techniqueId]), [techniqueId]);
  if (!technique || !map) return null;

  const landmarkOnly = technique.guidance === "landmark";
  const targeted = new Set(map.targets.map((t) => t.nerve));

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Ionicons name="git-network-outline" size={14} color={colors.primary} />
        <Text style={styles.title}>Bloklanan sinirler</Text>
        {map.segments ? <Text style={styles.segments}>{map.segments}</Text> : null}
      </View>

      {landmarkOnly ? (
        <Text style={styles.guidanceNote}>
          Bu blok yüzey anatomisi ile uygulanır; çizilebilecek bir ultrason kesiti yoktur. Aşağıdaki
          döküm, iğnenin nereye konduğunu değil{" "}
          <Text style={styles.bold}>neyin bloklandığını</Text> gösterir.
        </Text>
      ) : null}

      {analysis.coverage.length === 0 ? (
        <Text style={styles.fieldNote}>
          Adlandırılmış bir siniri hedeflemez — uç dallara alan infiltrasyonu yapılır. Kapsama,
          enjekte edilen alanla sınırlıdır ve segmental değildir.
        </Text>
      ) : (
        <View style={styles.rows}>
          {analysis.coverage.map((c) => {
            const modality = MODALITY[c.nerve.modality];
            const roots = rootsLabel(c.nerve);
            const direct = targeted.has(c.nerve.id);
            const incidental = c.sources.some((s) => s.incidental);
            const variable = c.sources.some((s) => s.reliability === "variable");
            return (
              <View
                key={c.nerve.id}
                style={[styles.row, incidental && styles.rowIncidental]}
              >
                <View style={styles.rowHead}>
                  <Text style={styles.nerveName}>{c.nerve.name}</Text>
                  {roots ? <Text style={styles.roots}>{roots}</Text> : null}
                </View>

                <View style={styles.tags}>
                  <View style={[styles.tag, { backgroundColor: modality.color + "1A" }]}>
                    <Text style={[styles.tagText, { color: modality.color }]}>{modality.label}</Text>
                  </View>
                  {!direct ? (
                    <View style={[styles.tag, styles.tagNeutral]}>
                      <Text style={[styles.tagText, styles.tagNeutralText]}>dalı olduğu için</Text>
                    </View>
                  ) : null}
                  {c.status === "partial" ? (
                    <View style={[styles.tag, styles.tagNeutral]}>
                      <Text style={[styles.tagText, styles.tagNeutralText]}>kısmi</Text>
                    </View>
                  ) : null}
                  {variable && !incidental ? (
                    <View style={[styles.tag, styles.tagNeutral]}>
                      <Text style={[styles.tagText, styles.tagNeutralText]}>değişken</Text>
                    </View>
                  ) : null}
                  {incidental ? (
                    <View style={[styles.tag, styles.tagWarn]}>
                      <Text style={[styles.tagText, styles.tagWarnText]}>istenmeden</Text>
                    </View>
                  ) : null}
                </View>

                {c.nerve.sensory ? (
                  <Text style={styles.territory}>
                    <Text style={styles.territoryLabel}>Duyu: </Text>
                    {c.nerve.sensory}
                  </Text>
                ) : null}
                {c.nerve.motor ? (
                  <Text style={styles.territory}>
                    <Text style={styles.territoryLabel}>Motor: </Text>
                    {c.nerve.motor}
                  </Text>
                ) : null}
                {c.nerve.levels && c.nerve.levels.length > 0 ? (
                  <View style={styles.levelRow}>
                    {c.nerve.levels.map((l) => (
                      <View key={l} style={styles.levelPill}>
                        <Text style={styles.levelText}>{l}</Text>
                      </View>
                    ))}
                  </View>
                ) : null}
              </View>
            );
          })}
        </View>
      )}

      {map.commonlyMissed && map.commonlyMissed.length > 0 ? (
        <Text style={styles.missedNote}>
          Bu yaklaşımın sık kaçırdığı yapılar yukarıda <Text style={styles.bold}>kısmi</Text> olarak
          işaretlenmiştir.
        </Text>
      ) : null}
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
  header: { flexDirection: "row", alignItems: "center", gap: 5, flexWrap: "wrap" },
  title: { ...type.subheading, color: colors.text },
  segments: { ...type.caption, ...numeric, color: colors.primary, fontWeight: "700" },
  guidanceNote: { ...type.caption, color: colors.textMuted, lineHeight: 16, fontStyle: "italic" },
  fieldNote: { ...type.caption, color: colors.textMuted, lineHeight: 16 },
  bold: { fontWeight: "700", color: colors.text },
  rows: { gap: 2 },
  row: { gap: 3, paddingTop: 6, borderTopWidth: 1, borderTopColor: colors.border },
  rowIncidental: { backgroundColor: colors.warningBg, borderRadius: radius.sm, paddingHorizontal: 6 },
  rowHead: { flexDirection: "row", alignItems: "baseline", gap: spacing.sm },
  nerveName: { ...type.subheading, fontSize: 12.5, color: colors.text, flexShrink: 1 },
  roots: { ...type.caption, ...numeric, color: colors.textMuted, fontWeight: "700" },
  tags: { flexDirection: "row", flexWrap: "wrap", gap: 4 },
  tag: { borderRadius: radius.pill, paddingHorizontal: 6, paddingVertical: 1 },
  tagText: { fontSize: 9.5, fontWeight: "700" },
  tagNeutral: { backgroundColor: colors.surfaceAlt },
  tagNeutralText: { color: colors.textMuted },
  tagWarn: { backgroundColor: colors.warningBorder },
  tagWarnText: { color: colors.warning },
  territory: { ...type.caption, color: colors.textMuted, lineHeight: 16 },
  territoryLabel: { fontWeight: "700", color: colors.text },
  levelRow: { flexDirection: "row", flexWrap: "wrap", gap: 3, marginTop: 1 },
  levelPill: {
    backgroundColor: colors.primaryMuted,
    borderRadius: radius.sm,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  levelText: { ...numeric, fontSize: 10, fontWeight: "700", color: colors.primaryStrong },
  missedNote: { fontSize: 10.5, color: colors.textFaint, fontStyle: "italic", lineHeight: 15 },
});
