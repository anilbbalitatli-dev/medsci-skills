import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Svg, { Circle, G, Line, Rect, Text as SvgText } from "react-native-svg";

import { closureFor } from "@/data/combination-analysis";
import {
  PLEXUS_APPROACHES,
  PLEXUS_EDGES,
  PLEXUS_NODES,
  PLEXUS_VIEWBOX,
  PlexusApproach,
  PlexusNode,
  approachFor,
} from "@/data/brachial-plexus-diagram";
import { TECHNIQUE_NERVES } from "@/data/technique-nerves";
import { colors, radius, spacing, type } from "@/theme";

/**
 * Brakiyal pleksus şeması: hangi blok hangi seviyede çalışır.
 *
 * Renkler `closureFor` çıktısından gelir — şemanın kendi doğruluk kaynağı
 * yoktur. Böylece bir tekniğin hedefleri değiştirilirse şema da onunla birlikte
 * değişir; iki yerde ayrı ayrı bakım gerektiren bir çizim olmaz.
 */
type NodeStatus = "full" | "partial" | "none";

const NODE_BY_ID = new Map(PLEXUS_NODES.map((n) => [n.id, n]));

const FILL: Record<NodeStatus, string> = {
  full: colors.primary,
  partial: colors.primaryMuted,
  none: colors.surface,
};
const STROKE: Record<NodeStatus, string> = {
  full: colors.primaryStrong,
  partial: colors.primary,
  none: colors.borderStrong,
};
const INNER_TEXT: Record<NodeStatus, string> = {
  full: "#FFFFFF",
  partial: colors.primaryStrong,
  none: colors.textMuted,
};
const OUTER_TEXT: Record<NodeStatus, string> = {
  full: colors.primaryStrong,
  partial: colors.primaryStrong,
  none: colors.textMuted,
};

function statusOf(node: PlexusNode, closure: Map<string, { status: "full" | "partial" }>): NodeStatus {
  const id = node.nerveId ?? node.statusVia;
  if (!id) return "none";
  const hit = closure.get(id);
  if (!hit) return "none";
  return hit.status;
}

function NodeShape({ node, status }: { node: PlexusNode; status: NodeStatus }) {
  const fill = FILL[status];
  const stroke = STROKE[status];
  const dashed = status === "partial" ? "3 2" : undefined;

  if (node.column === "root") {
    return (
      <G>
        <Circle
          cx={node.x}
          cy={node.y}
          r={12}
          fill={fill}
          stroke={stroke}
          strokeWidth={1.2}
          strokeDasharray={dashed}
        />
        <SvgText
          x={node.x}
          y={node.y + 3.4}
          fontSize={9.5}
          fontWeight="700"
          fill={INNER_TEXT[status]}
          textAnchor="middle"
        >
          {node.label}
        </SvgText>
      </G>
    );
  }

  if (node.column === "trunk" || node.column === "cord") {
    const w = node.column === "cord" ? 72 : 62;
    return (
      <G>
        <Rect
          x={node.x - w / 2}
          y={node.y - 11}
          width={w}
          height={22}
          rx={6}
          fill={fill}
          stroke={stroke}
          strokeWidth={1.2}
          strokeDasharray={dashed}
        />
        <SvgText
          x={node.x}
          y={node.y + 3.4}
          fontSize={9.5}
          fontWeight="700"
          fill={INNER_TEXT[status]}
          textAnchor="middle"
        >
          {node.label}
        </SvgText>
      </G>
    );
  }

  // Divizyon ve uç sinirler: küçük daire, etiketi dışarıda.
  const r = node.column === "division" ? 6 : 7;
  const labelY = node.labelBeside ? node.y + 3 : node.labelAbove ? node.y - 11 : node.y + r + 9;
  // Yan etiket düğümden uzaklaşır; alt/üst etiket düğümle aynı eksende kalır.
  // Yan etiket, tek dalı işaretleyen halkanın (r=13) dışında kalacak kadar
  // uzağa konur; yoksa "Suprascapular" halkanın içine girer.
  const labelX = node.labelBeside
    ? node.anchor === "end"
      ? node.x - r - 10
      : node.x + r + 10
    : node.x;

  return (
    <G>
      <Circle
        cx={node.x}
        cy={node.y}
        r={r}
        fill={fill}
        stroke={stroke}
        strokeWidth={1.2}
        strokeDasharray={dashed}
      />
      <SvgText
        x={labelX}
        y={labelY}
        fontSize={node.column === "division" ? 7.5 : 8.5}
        fontWeight={node.column === "division" ? "400" : "700"}
        fill={node.column === "division" ? colors.textFaint : OUTER_TEXT[status]}
        textAnchor={node.anchor ?? "middle"}
      >
        {node.label}
      </SvgText>
    </G>
  );
}

function Diagram({
  closure,
  approach,
}: {
  closure: Map<string, { status: "full" | "partial" }>;
  approach?: PlexusApproach;
}) {
  const statuses = new Map(PLEXUS_NODES.map((n) => [n.id, statusOf(n, closure)]));

  return (
    <View style={styles.canvas}>
      <Svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${PLEXUS_VIEWBOX.width} ${PLEXUS_VIEWBOX.height}`}
      >
        {/* Bağlantılar önce çizilir; düğümler üstlerine oturur. */}
        {PLEXUS_EDGES.map((edge) => {
          const from = NODE_BY_ID.get(edge.from)!;
          const to = NODE_BY_ID.get(edge.to)!;
          const live =
            statuses.get(edge.from) !== "none" && statuses.get(edge.to) !== "none";
          return (
            <Line
              key={`${edge.from}-${edge.to}`}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke={live ? colors.primary : colors.border}
              strokeWidth={live ? 1.6 : 1}
              opacity={live ? 0.55 : 1}
            />
          );
        })}

        {/* Seviye çizgileri: iğnenin pleksusun neresinde olduğu. */}
        {PLEXUS_APPROACHES.filter((a) => a.y !== undefined).map((a) => {
          const active = approach?.techniqueId === a.techniqueId;
          return (
            <G key={a.techniqueId}>
              <Line
                x1={6}
                y1={a.y}
                x2={PLEXUS_VIEWBOX.width - 6}
                y2={a.y}
                stroke={active ? colors.primary : colors.borderStrong}
                strokeWidth={active ? 1.6 : 0.8}
                strokeDasharray={active ? undefined : "4 4"}
              />
              <SvgText
                x={8}
                y={(a.y ?? 0) - 4}
                fontSize={8.5}
                fontWeight="700"
                fill={active ? colors.primary : colors.textFaint}
              >
                {a.label}
              </SvgText>
            </G>
          );
        })}

        {PLEXUS_NODES.map((node) => (
          <NodeShape key={node.id} node={node} status={statuses.get(node.id)!} />
        ))}

        {/* Tek bir dalı hedefleyen bloklarda seviye çizgisi yerine halka. */}
        {approach?.markNode ? (
          <Circle
            cx={NODE_BY_ID.get(approach.markNode)!.x}
            cy={NODE_BY_ID.get(approach.markNode)!.y}
            r={13}
            fill="none"
            stroke={colors.primary}
            strokeWidth={1.6}
          />
        ) : null}
      </Svg>
    </View>
  );
}

export function BrachialPlexusDiagram({
  techniqueId,
  selectable = false,
}: {
  /** Sabit bir blok için şema (blok kartı). */
  techniqueId?: string;
  /** Yaklaşımlar arasında geçiş yapılabilsin (karşılaştırma ekranı). */
  selectable?: boolean;
}) {
  const [picked, setPicked] = useState<string | undefined>(techniqueId);
  const active = selectable ? picked : techniqueId;
  const closure = useMemo(
    () => (active ? closureFor(active) : new Map()),
    [active]
  ) as Map<string, { status: "full" | "partial" }>;
  const approach = active ? approachFor(active) : undefined;
  const segments = active ? TECHNIQUE_NERVES[active]?.segments : undefined;

  return (
    <View style={styles.wrapper}>
      {selectable ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipRow}
        >
          {PLEXUS_APPROACHES.map((a) => {
            const on = picked === a.techniqueId;
            return (
              <Pressable
                key={a.techniqueId}
                onPress={() => setPicked(on ? undefined : a.techniqueId)}
                hitSlop={4}
              >
                <View style={[styles.chip, on && styles.chipOn]}>
                  <Text style={[styles.chipText, on && styles.chipTextOn]}>{a.label}</Text>
                </View>
              </Pressable>
            );
          })}
        </ScrollView>
      ) : null}

      <Diagram closure={closure} approach={approach} />

      {approach ? (
        <View style={styles.captionBlock}>
          <Text style={styles.captionTitle}>
            {approach.label}
            {segments ? <Text style={styles.captionSegments}>{`  ${segments}`}</Text> : null}
          </Text>
          <Text style={styles.caption}>{approach.caption}</Text>
        </View>
      ) : (
        <Text style={styles.caption}>
          Bir yaklaşım seçin: iğnenin pleksusun neresinde olduğu ve o noktadan sonra hangi
          yapıların bloklandığı işaretlensin.
        </Text>
      )}

      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.swatch, { backgroundColor: colors.primary }]} />
          <Text style={styles.legendText}>Bloke</Text>
        </View>
        <View style={styles.legendItem}>
          <View
            style={[
              styles.swatch,
              { backgroundColor: colors.primaryMuted, borderColor: colors.primary, borderWidth: 1 },
            ]}
          />
          <Text style={styles.legendText}>Kısmi</Text>
        </View>
        <View style={styles.legendItem}>
          <View
            style={[
              styles.swatch,
              { backgroundColor: colors.surface, borderColor: colors.borderStrong, borderWidth: 1 },
            ]}
          />
          <Text style={styles.legendText}>Kapsanmıyor</Text>
        </View>
      </View>
      <Text style={styles.note}>
        Renk, bloğun ulaştığı yapıları gösterir. Kökler besledikleri trunkus bloklandığında
        renklenir; kord düzeyindeki bir blokta renksiz kalırlar, çünkü iğne o düzeyin
        distalindedir. Kesikli çizgiler yaklaşımların çalıştığı seviyelerdir.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: spacing.sm },
  canvas: {
    width: "100%",
    aspectRatio: PLEXUS_VIEWBOX.width / PLEXUS_VIEWBOX.height,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipRow: { gap: 6, paddingVertical: 2 },
  chip: {
    backgroundColor: colors.chip,
    borderRadius: radius.pill,
    paddingHorizontal: 11,
    paddingVertical: 6,
  },
  chipOn: { backgroundColor: colors.primary },
  chipText: { ...type.caption, fontWeight: "700", color: colors.textMuted },
  chipTextOn: { color: "#FFFFFF" },
  captionBlock: { gap: 2 },
  captionTitle: { ...type.subheading, color: colors.text },
  captionSegments: { ...type.caption, color: colors.primary, fontWeight: "700" },
  caption: { ...type.caption, color: colors.textMuted, lineHeight: 16 },
  legend: { flexDirection: "row", flexWrap: "wrap", gap: spacing.md },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 5 },
  swatch: { width: 11, height: 11, borderRadius: 3 },
  legendText: { fontSize: 10.5, color: colors.textMuted, fontWeight: "700" },
  note: { fontSize: 10, color: colors.textFaint, lineHeight: 14, fontStyle: "italic" },
});
