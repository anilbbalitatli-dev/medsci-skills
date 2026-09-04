import Ionicons from "@expo/vector-icons/Ionicons";
import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { NerveCoverage, analyzeCombination } from "@/data/combination-analysis";
import { CoverageNode, buildCoverageTree } from "@/data/nerve-tree";
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

/** Girinti iki basamaktan sonra artmaz; kart zaten dar. */
const INDENT = 10;
const MAX_INDENT_DEPTH = 2;

function PanelRow({
  entry,
  targeted,
  branchCount,
  open,
  onToggle,
}: {
  entry: NerveCoverage;
  targeted: Set<string>;
  branchCount: number;
  open: boolean;
  onToggle: () => void;
}) {
  const { nerve, status, sources } = entry;
  const modality = MODALITY[nerve.modality];
  const roots = rootsLabel(nerve);
  const direct = targeted.has(nerve.id);
  const incidental = sources.some((s) => s.incidental);
  const variable = sources.some((s) => s.reliability === "variable");

  const head = (
    <View style={styles.rowHead}>
      <Text style={styles.nerveName}>{nerve.name}</Text>
      {roots ? <Text style={styles.roots}>{roots}</Text> : null}
      {branchCount > 0 ? (
        <View style={styles.branchChip}>
          <Ionicons
            name={open ? "chevron-down" : "chevron-forward"}
            size={10}
            color={colors.primaryStrong}
          />
          <Text style={styles.branchChipText}>{branchCount} dal</Text>
        </View>
      ) : null}
    </View>
  );

  return (
    <View style={[styles.row, incidental && styles.rowIncidental]}>
      {/* Ana siniri bloklamak dallarını da blokluyor; dallar burada, o sinirin
          altında duruyor ve satıra dokununca açılıyor. */}
      {branchCount > 0 ? (
        <Pressable onPress={onToggle} hitSlop={6} style={({ pressed }) => pressed && styles.pressed}>
          {head}
        </Pressable>
      ) : (
        head
      )}

      <View style={styles.tags}>
        <View style={[styles.tag, { backgroundColor: modality.color + "1A" }]}>
          <Text style={[styles.tagText, { color: modality.color }]}>{modality.label}</Text>
        </View>
        {!direct ? (
          <View style={[styles.tag, styles.tagNeutral]}>
            <Text style={[styles.tagText, styles.tagNeutralText]}>dalı olduğu için</Text>
          </View>
        ) : null}
        {status === "partial" ? (
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

      {nerve.sensory ? (
        <Text style={styles.territory}>
          <Text style={styles.territoryLabel}>Duyu: </Text>
          {nerve.sensory}
        </Text>
      ) : null}
      {nerve.motor ? (
        <Text style={styles.territory}>
          <Text style={styles.territoryLabel}>Motor: </Text>
          {nerve.motor}
        </Text>
      ) : null}
      {nerve.levels && nerve.levels.length > 0 ? (
        <View style={styles.levelRow}>
          {nerve.levels.map((l) => (
            <View key={l} style={styles.levelPill}>
              <Text style={styles.levelText}>{l}</Text>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
}

function PanelBranch({
  node,
  depth,
  targeted,
  openIds,
  onToggle,
}: {
  node: CoverageNode;
  depth: number;
  targeted: Set<string>;
  openIds: Set<string>;
  onToggle: (id: string) => void;
}) {
  const open = openIds.has(node.entry.nerve.id);
  return (
    <View>
      <PanelRow
        entry={node.entry}
        targeted={targeted}
        branchCount={node.branchCount}
        open={open}
        onToggle={() => onToggle(node.entry.nerve.id)}
      />
      {open && node.children.length > 0 ? (
        <View
          style={[styles.childGroup, { marginLeft: INDENT * Math.min(depth + 1, MAX_INDENT_DEPTH) }]}
        >
          {node.children.map((child) => (
            <PanelBranch
              key={child.entry.nerve.id}
              node={child}
              depth={depth + 1}
              targeted={targeted}
              openIds={openIds}
              onToggle={onToggle}
            />
          ))}
        </View>
      ) : null}
    </View>
  );
}

export function TechniqueNervesPanel({ techniqueId }: { techniqueId: string }) {
  const technique = techniqueById(techniqueId);
  const map = TECHNIQUE_NERVES[techniqueId];
  const analysis = useMemo(() => analyzeCombination([techniqueId]), [techniqueId]);
  const tree = useMemo(() => buildCoverageTree(analysis.coverage), [analysis]);
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());
  if (!technique || !map) return null;

  const landmarkOnly = technique.guidance === "landmark";
  const targeted = new Set(map.targets.map((t) => t.nerve));
  const branches = analysis.coverage.length - tree.length;
  const toggle = (id: string) =>
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

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
        <>
          <View style={styles.rows}>
            {tree.map((node) => (
              <PanelBranch
                key={node.entry.nerve.id}
                node={node}
                depth={0}
                targeted={targeted}
                openIds={openIds}
                onToggle={toggle}
              />
            ))}
          </View>
          {/* İpucu, işe yaradığı anda kayboluyor: bir dal açıldıysa artık
              anlatmaya gerek yok. */}
          {branches > 0 && openIds.size === 0 ? (
            <Text style={styles.branchHint}>
              Dal sayısı yazan sinire dokunun: o sinir bloklandığı için kapsanan{" "}
              <Text style={styles.bold}>{branches} dal</Text> altında açılır.
            </Text>
          ) : null}
        </>
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
  rowHead: { flexDirection: "row", alignItems: "center", gap: spacing.sm, flexWrap: "wrap" },
  childGroup: {
    borderLeftWidth: 2,
    borderLeftColor: colors.primaryMuted,
    paddingLeft: spacing.sm,
  },
  branchChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    backgroundColor: colors.primaryMuted,
    borderRadius: radius.pill,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  branchChipText: { fontSize: 9.5, fontWeight: "700", color: colors.primaryStrong, ...numeric },
  branchHint: { fontSize: 10.5, color: colors.textFaint, lineHeight: 15, fontStyle: "italic" },
  pressed: { opacity: 0.6 },
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
