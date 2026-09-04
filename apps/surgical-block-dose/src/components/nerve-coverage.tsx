import Ionicons from "@expo/vector-icons/Ionicons";
import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { NerveCoverage } from "@/data/combination-analysis";
import { CoverageNode, buildCoverageTree } from "@/data/nerve-tree";
import { NerveModality, rootsLabel } from "@/data/nerves";
import { colors, elevation, numeric, radius, spacing, type } from "@/theme";

const MODALITY: Record<NerveModality, { label: string; color: string }> = {
  sensory: { label: "Duyusal", color: "#3B6EA5" },
  motor: { label: "Motor", color: "#8A5200" },
  mixed: { label: "Karışık", color: "#6B4E9E" },
};

/** Ana sinir satırı bundan sonrası istenince açılır; nöraksiyel blokta çok olur. */
const COLLAPSE_AFTER = 8;

/** Girinti iki basamaktan sonra artmaz; telefonda satır iyice daralıyor. */
const INDENT = 12;
const MAX_INDENT_DEPTH = 2;

function NerveRow({
  entry,
  branchCount,
  open,
  onToggle,
}: {
  entry: NerveCoverage;
  branchCount: number;
  open: boolean;
  onToggle: () => void;
}) {
  const { nerve, status, sources, duplicated } = entry;
  const modality = MODALITY[nerve.modality];
  const roots = rootsLabel(nerve);
  const hasBranches = branchCount > 0;

  const title = (
    <View style={styles.titleLine}>
      <Text style={styles.nerveName}>{nerve.name}</Text>
      {roots ? <Text style={styles.roots}>{roots}</Text> : null}
      {hasBranches ? (
        <View style={styles.branchChip}>
          <Ionicons
            name={open ? "chevron-down" : "chevron-forward"}
            size={11}
            color={colors.primaryStrong}
          />
          <Text style={styles.branchChipText}>{branchCount} dal</Text>
        </View>
      ) : null}
    </View>
  );

  return (
    <View style={[styles.row, duplicated && styles.rowDuplicated]}>
      {duplicated ? <View style={styles.dupRail} /> : null}

      <View style={styles.rowBody}>
        {/* Ana sinir satırı dokunulabilir: dalları onun altında duruyor. */}
        {hasBranches ? (
          <Pressable onPress={onToggle} hitSlop={6} style={({ pressed }) => pressed && styles.pressed}>
            {title}
          </Pressable>
        ) : (
          title
        )}

        <View style={styles.tagLine}>
          <View style={[styles.tag, { backgroundColor: modality.color + "1A" }]}>
            <Text style={[styles.tagText, { color: modality.color }]}>{modality.label}</Text>
          </View>
          {status === "partial" ? (
            <View style={[styles.tag, styles.tagPartial]}>
              <Text style={[styles.tagText, styles.tagPartialText]}>Kısmi</Text>
            </View>
          ) : null}
          {duplicated ? (
            <View style={[styles.tag, styles.tagDup]}>
              <Text style={[styles.tagText, styles.tagDupText]}>
                {sources.filter((s) => !s.incidental).length} blok birden
              </Text>
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

        {sources.map((s) => (
          <View key={s.techniqueId} style={styles.sourceLine}>
            <Ionicons
              name={s.direct ? "radio-button-on" : "git-branch-outline"}
              size={11}
              color={s.incidental ? colors.warning : colors.textFaint}
            />
            <Text style={[styles.sourceText, s.incidental && styles.sourceIncidental]}>
              {s.techniqueName}
              {s.direct ? "" : " · dalı olduğu için"}
              {s.reliability === "variable" ? " · değişken" : ""}
              {s.incidental ? " · istenmeden" : ""}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function NerveBranch({
  node,
  depth,
  openIds,
  onToggle,
}: {
  node: CoverageNode;
  depth: number;
  openIds: Set<string>;
  onToggle: (id: string) => void;
}) {
  const open = openIds.has(node.entry.nerve.id);

  return (
    <View>
      <NerveRow
        entry={node.entry}
        branchCount={node.branchCount}
        open={open}
        onToggle={() => onToggle(node.entry.nerve.id)}
      />
      {open && node.children.length > 0 ? (
        <View
          style={[
            styles.childGroup,
            { marginLeft: INDENT * Math.min(depth + 1, MAX_INDENT_DEPTH) },
          ]}
        >
          {node.children.map((child) => (
            <NerveBranch
              key={child.entry.nerve.id}
              node={child}
              depth={depth + 1}
              openIds={openIds}
              onToggle={onToggle}
            />
          ))}
        </View>
      ) : null}
    </View>
  );
}

export function NerveCoverageList({ coverage }: { coverage: NerveCoverage[] }) {
  const [expanded, setExpanded] = useState(false);
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());
  const tree = useMemo(() => buildCoverageTree(coverage), [coverage]);

  if (coverage.length === 0) {
    return (
      <View style={styles.card}>
        <Text style={styles.empty}>
          Seçilen bloklar adlandırılmış bir siniri hedeflemiyor (yalnızca alan infiltrasyonu).
        </Text>
      </View>
    );
  }

  const toggle = (id: string) =>
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const duplicates = coverage.filter((c) => c.duplicated).length;
  const branches = coverage.length - tree.length;
  const shown = expanded ? tree : tree.slice(0, COLLAPSE_AFTER);
  const hidden = tree.length - shown.length;

  return (
    <View style={styles.card}>
      <View style={styles.summary}>
        <Text style={styles.summaryMain}>
          <Text style={styles.summaryNum}>{coverage.length}</Text> sinir kapsanıyor
        </Text>
        {branches > 0 ? (
          <Text style={styles.summarySub}>
            <Text style={styles.summaryNum}>{tree.length}</Text> ana sinir ·{" "}
            <Text style={styles.summaryNum}>{branches}</Text> dal
          </Text>
        ) : null}
        {duplicates > 0 ? (
          <Text style={styles.summaryDup}>
            <Text style={styles.summaryNum}>{duplicates}</Text> tanesi birden fazla blokla
          </Text>
        ) : null}
      </View>

      <View style={styles.rows}>
        {shown.map((node) => (
          <NerveBranch
            key={node.entry.nerve.id}
            node={node}
            depth={0}
            openIds={openIds}
            onToggle={toggle}
          />
        ))}
      </View>

      {hidden > 0 || expanded ? (
        <Pressable onPress={() => setExpanded((v) => !v)} hitSlop={8}>
          <View style={styles.more}>
            <Text style={styles.moreText}>
              {expanded ? "Listeyi kısalt" : `${hidden} ana sinir daha göster`}
            </Text>
            <Ionicons
              name={expanded ? "chevron-up" : "chevron-down"}
              size={14}
              color={colors.primary}
            />
          </View>
        </Pressable>
      ) : null}

      <Text style={styles.legend}>
        Liste ana sinirlerden oluşur. Yanında dal sayısı yazan bir sinire dokunduğunuzda, o sinir
        bloklandığı için kapsanan dalları altında açılır. Dolu daire bloğun doğrudan hedeflediği
        siniri, çatal işareti dalı olduğu için kapsananı gösterir. "Kısmi", sinirin liflerinin bir
        bölümünün bloke edilmemiş bir kökten gelmeye devam ettiği anlamına gelir.
      </Text>
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
  summary: { flexDirection: "row", flexWrap: "wrap", gap: spacing.md, alignItems: "baseline" },
  summaryMain: { ...type.subheading, color: colors.text },
  summarySub: { ...type.caption, color: colors.textMuted, fontWeight: "700" },
  summaryDup: { ...type.caption, color: colors.warning, fontWeight: "700" },
  summaryNum: { ...numeric },
  rows: { gap: 2 },
  row: {
    flexDirection: "row",
    alignItems: "stretch",
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  rowDuplicated: { backgroundColor: colors.warningBg, borderRadius: radius.sm },
  dupRail: {
    width: 3,
    borderRadius: 2,
    backgroundColor: colors.warningBorder,
    marginRight: spacing.sm,
  },
  // Dalların bağlı olduğu ana sinire ait sol çizgi: girintiyi kaza eseri değil
  // kasıtlı gösterir.
  childGroup: {
    borderLeftWidth: 2,
    borderLeftColor: colors.primaryMuted,
    paddingLeft: spacing.sm,
  },
  rowBody: { flex: 1, gap: 3 },
  titleLine: { flexDirection: "row", alignItems: "center", gap: spacing.sm, flexWrap: "wrap" },
  nerveName: { ...type.subheading, color: colors.text, flexShrink: 1 },
  roots: { ...type.caption, ...numeric, color: colors.textMuted, fontWeight: "700" },
  branchChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    backgroundColor: colors.primaryMuted,
    borderRadius: radius.pill,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  branchChipText: { fontSize: 10, fontWeight: "700", color: colors.primaryStrong, ...numeric },
  pressed: { opacity: 0.6 },
  tagLine: { flexDirection: "row", flexWrap: "wrap", gap: 4 },
  tag: { borderRadius: radius.pill, paddingHorizontal: 7, paddingVertical: 2 },
  tagText: { fontSize: 10, fontWeight: "700" },
  tagPartial: { backgroundColor: colors.surfaceAlt },
  tagPartialText: { color: colors.textMuted },
  tagDup: { backgroundColor: colors.warningBorder },
  tagDupText: { color: colors.warning },
  territory: { ...type.caption, color: colors.textMuted, lineHeight: 16 },
  territoryLabel: { fontWeight: "700", color: colors.text },
  sourceLine: { flexDirection: "row", alignItems: "center", gap: 5 },
  sourceText: { fontSize: 11, color: colors.textFaint },
  sourceIncidental: { color: colors.warning, fontWeight: "600" },
  more: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingVertical: 6,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  moreText: { ...type.caption, color: colors.primary, fontWeight: "700" },
  legend: { fontSize: 10.5, color: colors.textFaint, lineHeight: 15, fontStyle: "italic" },
  empty: { ...type.bodySm, color: colors.textMuted },
});
