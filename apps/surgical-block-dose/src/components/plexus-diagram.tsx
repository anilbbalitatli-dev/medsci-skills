import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Svg, { Circle, G, Line, Rect, Text as SvgText } from "react-native-svg";

import { closureFor } from "@/data/combination-analysis";
import {
  PLEXUS_DIAGRAMS,
  PLEXUS_ORDER,
  PlexusApproach,
  PlexusDiagram,
  PlexusId,
  PlexusNode,
  approachFor,
  diagramForTechnique,
} from "@/data/plexus-diagrams";
import { TECHNIQUE_NERVES } from "@/data/technique-nerves";
import { Palette, makeStyles, radius, spacing, type, useColors } from "@/theme";

/**
 * Pleksus şeması: hangi blok hangi seviyede çalışır.
 *
 * Renkler `closureFor` çıktısından gelir — şemanın kendi doğruluk kaynağı
 * yoktur. Böylece bir tekniğin hedefleri değiştirilirse şema da onunla birlikte
 * değişir; iki yerde ayrı ayrı bakım gerektiren bir çizim olmaz.
 */
type NodeStatus = "full" | "partial" | "none";
type Closure = Map<string, { status: "full" | "partial"; reliability: "consistent" | "variable" }>;

// Renkler palete bağlı; "dolu / kesikli / boş" ayrımı iki temada da aynı
// anlamı taşısın diye biçim değil yalnızca renk değişiyor.
function statusColors(colors: Palette) {
  return {
    fill: { full: colors.primary, partial: colors.primaryMuted, none: colors.surface },
    stroke: { full: colors.primaryStrong, partial: colors.primary, none: colors.borderStrong },
    innerText: { full: colors.onPrimary, partial: colors.primaryStrong, none: colors.textMuted },
    outerText: { full: colors.primaryStrong, partial: colors.primaryStrong, none: colors.textMuted },
  } as const;
}

function statusOf(node: PlexusNode, closure: Closure): NodeStatus {
  const id = node.nerveId ?? node.statusVia;
  if (!id) return "none";
  const hit = closure.get(id);
  if (!hit) return "none";
  // "Değişken" bir hedef kapanışta tam sayılır — orada niyet kaydediliyor.
  // Resimde ise dolu boyamak fazlasını söyler: fasya iliaka bloğu obturatoru
  // klasik olarak iddia eder ama sıklıkla tutmaz, açıklaması da bunu yazar.
  if (hit.status === "full" && hit.reliability === "variable") return "partial";
  return hit.status;
}

function NodeShape({ node, status }: { node: PlexusNode; status: NodeStatus }) {
  const colors = useColors();
  const palette = statusColors(colors);
  const fill = palette.fill[status];
  const stroke = palette.stroke[status];
  const dashed = status === "partial" ? "3 2" : undefined;

  // Kökler hiçbir zaman dolu boyanmaz. Hiçbir yaklaşım kökü hedeflemiyor —
  // dolu bir kök, iğnenin kendi seviye çizgisinin proksimaline ulaştığını
  // söylerdi ki bu yanlış. Lifleri bloklanan bir yapıya gidiyorsa yalnızca
  // çerçevesi renklenir.
  if (node.shape === "root") {
    const live = status !== "none";
    return (
      <G>
        <Circle
          cx={node.x}
          cy={node.y}
          r={12}
          fill={colors.surface}
          stroke={live ? colors.primary : colors.borderStrong}
          strokeWidth={live ? 2 : 1.2}
        />
        <SvgText
          x={node.x}
          y={node.y + 3.4}
          fontSize={9.5}
          fontWeight="700"
          fill={live ? colors.primaryStrong : colors.textMuted}
          textAnchor="middle"
        >
          {node.label}
        </SvgText>
      </G>
    );
  }

  if (node.shape === "hub") {
    const w = node.width ?? 70;
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
          fill={palette.innerText[status]}
          textAnchor="middle"
        >
          {node.label}
        </SvgText>
      </G>
    );
  }

  // Ara basamaklar ve uç dallar: küçük daire, etiketi dışarıda.
  const pip = node.shape === "pip";
  const r = pip ? 6 : 7;
  // +11: işaretli bloklarda düğümün etrafına halka çiziliyor; etiket 9'da
  // halkanın altına giriyordu.
  const labelY = node.labelBeside ? node.y + 3 : node.labelAbove ? node.y - 13 : node.y + r + 11;
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
        fontSize={pip ? 7.5 : 8.5}
        fontWeight={pip ? "400" : "700"}
        fill={pip ? colors.textFaint : palette.outerText[status]}
        textAnchor={node.anchor ?? "middle"}
      >
        {node.label}
      </SvgText>
    </G>
  );
}

function Canvas({
  diagram,
  closure,
  approach,
}: {
  diagram: PlexusDiagram;
  closure: Closure;
  approach?: PlexusApproach;
}) {
  const colors = useColors();
  const styles = useStyles();
  const byId = useMemo(
    () => new Map(diagram.nodes.map((n) => [n.id, n])),
    [diagram]
  );
  const statuses = new Map(diagram.nodes.map((n) => [n.id, statusOf(n, closure)]));

  return (
    <View style={[styles.canvas, { aspectRatio: diagram.viewBox.width / diagram.viewBox.height }]}>
      <Svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${diagram.viewBox.width} ${diagram.viewBox.height}`}
      >
        {/* Bağlantılar önce çizilir; düğümler üstlerine oturur. */}
        {diagram.edges.map((edge) => {
          const from = byId.get(edge.from)!;
          const to = byId.get(edge.to)!;
          const live = statuses.get(edge.from) !== "none" && statuses.get(edge.to) !== "none";
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
        {diagram.approaches
          .filter((a) => a.y !== undefined)
          .map((a) => {
            const active = approach?.techniqueId === a.techniqueId;
            return (
              <G key={a.techniqueId}>
                <Line
                  x1={6}
                  y1={a.y}
                  x2={diagram.viewBox.width - 6}
                  y2={a.y}
                  stroke={active ? colors.primary : colors.borderStrong}
                  strokeWidth={active ? 1.6 : 0.8}
                  strokeDasharray={active ? undefined : "4 4"}
                />
                <SvgText
                  x={8}
                  y={(a.y ?? 0) - 6}
                  fontSize={8.5}
                  fontWeight="700"
                  fill={active ? colors.primary : colors.textFaint}
                >
                  {a.label}
                </SvgText>
              </G>
            );
          })}

        {diagram.nodes.map((node) => (
          <NodeShape key={node.id} node={node} status={statuses.get(node.id)!} />
        ))}

        {/* Tek tek yapıları hedefleyen bloklarda seviye çizgisi yerine halka. */}
        {(approach?.markNodes ?? []).map((id) => {
          const node = byId.get(id);
          if (!node) return null;
          return (
            <Circle
              key={`mark-${id}`}
              cx={node.x}
              cy={node.y}
              r={12}
              fill="none"
              stroke={colors.primary}
              strokeWidth={1.6}
            />
          );
        })}
      </Svg>
    </View>
  );
}

export function PlexusDiagramView({
  techniqueId,
  plexusId,
  selectable = false,
  onPlexusChange,
}: {
  /** Sabit bir blok için şema (blok kartı). */
  techniqueId?: string;
  /** Başlangıçta gösterilecek pleksus; yalnızca `selectable` ile anlamlı. */
  plexusId?: PlexusId;
  /** Pleksuslar ve yaklaşımlar arasında geçiş yapılabilsin. */
  selectable?: boolean;
  /** Sekme değişince haber verir; ekranın ders kutusu buna bağlı. */
  onPlexusChange?: (id: PlexusId) => void;
}) {
  const colors = useColors();
  const styles = useStyles();
  const fixed = techniqueId ? diagramForTechnique(techniqueId) : undefined;
  const [pickedPlexus, setPickedPlexus] = useState<PlexusId>(
    plexusId ?? fixed?.id ?? "brachial"
  );
  const [pickedApproach, setPickedApproach] = useState<string | undefined>(techniqueId);

  const diagram = fixed ?? PLEXUS_DIAGRAMS[pickedPlexus];
  const active = selectable ? pickedApproach : techniqueId;
  const closure = useMemo(
    () => (active ? (closureFor(active) as Closure) : (new Map() as Closure)),
    [active]
  );
  const approach = active ? approachFor(diagram, active) : undefined;
  const segments = active ? TECHNIQUE_NERVES[active]?.segments : undefined;

  return (
    <View style={styles.wrapper}>
      {selectable ? (
        <>
          <View style={styles.plexusRow}>
            {PLEXUS_ORDER.map((id) => {
              const on = pickedPlexus === id;
              return (
                <Pressable
                  key={id}
                  style={styles.plexusTabWrap}
                  onPress={() => {
                    setPickedPlexus(id);
                    // Yaklaşım seçimi şemaya özgüdür; pleksus değişince
                    // taşınamaz.
                    setPickedApproach(undefined);
                    onPlexusChange?.(id);
                  }}
                >
                  <View style={[styles.plexusTab, on && styles.plexusTabOn]}>
                    <Text style={[styles.plexusTabText, on && styles.plexusTabTextOn]}>
                      {PLEXUS_DIAGRAMS[id].label}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
          <Text style={styles.summary}>{diagram.summary}</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipRow}
          >
            {diagram.approaches.map((a) => {
              const on = pickedApproach === a.techniqueId;
              return (
                <Pressable
                  key={a.techniqueId}
                  onPress={() => setPickedApproach(on ? undefined : a.techniqueId)}
                  hitSlop={4}
                >
                  <View style={[styles.chip, on && styles.chipOn]}>
                    <Text style={[styles.chipText, on && styles.chipTextOn]}>{a.label}</Text>
                  </View>
                </Pressable>
              );
            })}
          </ScrollView>
        </>
      ) : null}

      <Canvas diagram={diagram} closure={closure} approach={approach} />

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
        Dolu renk, bloğun ulaştığı yapıdır; kesikli kenar, liflerinin bir bölümü bloklanmamış
        bir kökten gelmeye devam eden yapıdır. Kökler dolu boyanmaz — hiçbir yaklaşım kökü
        hedeflemez; lifleri bloklanan bir yapıya gidiyorsa yalnızca çerçeveleri renklenir.
        Yatay kesikli çizgiler yaklaşımların çalıştığı seviyelerdir.
      </Text>
    </View>
  );
}

const useStyles = makeStyles((colors) => ({
  wrapper: { gap: spacing.sm },
  canvas: {
    width: "100%",
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  plexusRow: {
    flexDirection: "row",
    gap: 4,
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.md,
    padding: 3,
  },
  plexusTabWrap: { flex: 1 },
  plexusTab: {
    paddingVertical: 7,
    borderRadius: radius.sm,
    alignItems: "center",
  },
  plexusTabOn: { backgroundColor: colors.surface },
  plexusTabText: { ...type.subheading, color: colors.textMuted },
  plexusTabTextOn: { color: colors.primaryStrong },
  summary: { ...type.caption, color: colors.textMuted, lineHeight: 16 },
  chipRow: { gap: 6, paddingVertical: 2 },
  chip: {
    backgroundColor: colors.chip,
    borderRadius: radius.pill,
    paddingHorizontal: 11,
    paddingVertical: 6,
  },
  chipOn: { backgroundColor: colors.primary },
  chipText: { ...type.caption, fontWeight: "700", color: colors.textMuted },
  chipTextOn: { color: colors.onPrimary },
  captionBlock: { gap: 2 },
  captionTitle: { ...type.subheading, color: colors.text },
  captionSegments: { ...type.caption, color: colors.primary, fontWeight: "700" },
  caption: { ...type.caption, color: colors.textMuted, lineHeight: 16 },
  legend: { flexDirection: "row", flexWrap: "wrap", gap: spacing.md },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 5 },
  swatch: { width: 11, height: 11, borderRadius: 3 },
  legendText: { fontSize: 10.5, color: colors.textMuted, fontWeight: "700" },
  note: { fontSize: 10, color: colors.textFaint, lineHeight: 14, fontStyle: "italic" },
}));
