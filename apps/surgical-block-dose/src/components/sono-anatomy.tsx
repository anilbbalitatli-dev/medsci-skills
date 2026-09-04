import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Ellipse, G, Line, Path, Polygon, Rect, Text as SvgText } from "react-native-svg";

import { SonoShape, SonoSpec, Tissue } from "@/data/sono-anatomy";
import { colors, spacing } from "@/theme";

const SCREEN_BG = "#0E1418";

const TISSUE_STYLE: Record<Tissue, { fill: string; stroke: string; width: number; dash?: string }> = {
  artery: { fill: "#B5322C", stroke: "#F0736A", width: 1.5 },
  vein: { fill: "#2B4E8C", stroke: "#6D97D8", width: 1.5 },
  nerve: { fill: "#C8960C", stroke: "#FFD966", width: 1.5 },
  muscle: { fill: "#3C4A42", stroke: "#7C9184", width: 1 },
  muscleDeep: { fill: "#2E3A34", stroke: "#63776B", width: 1 },
  bone: { fill: "#E6E6DC", stroke: "#FFFFFF", width: 2 },
  shadow: { fill: "#05080A", stroke: "none", width: 0 },
  fascia: { fill: "none", stroke: "#D8CFA8", width: 1.8 },
  pleura: { fill: "none", stroke: "#F2ECC8", width: 2.2 },
  target: { fill: "none", stroke: "#5CE0A8", width: 2, dash: "6 4" },
};

const LEGEND_DOT: Partial<Record<Tissue, string>> = {
  artery: "#F0736A",
  vein: "#6D97D8",
  nerve: "#FFD966",
  muscle: "#7C9184",
  muscleDeep: "#63776B",
  bone: "#FFFFFF",
  fascia: "#D8CFA8",
  pleura: "#F2ECC8",
  target: "#5CE0A8",
};

function markerFor(shape: SonoShape): [number, number] | null {
  if (shape.marker) return shape.marker;
  if (shape.ellipse) return [shape.ellipse.cx, shape.ellipse.cy];
  return null;
}

function needleHead(from: [number, number], to: [number, number]): string {
  const [fx, fy] = from;
  const [tx, ty] = to;
  const angle = Math.atan2(ty - fy, tx - fx);
  const size = 7;
  const spread = 0.42;
  const p1 = [tx, ty];
  const p2 = [tx - size * Math.cos(angle - spread), ty - size * Math.sin(angle - spread)];
  const p3 = [tx - size * Math.cos(angle + spread), ty - size * Math.sin(angle + spread)];
  return [p1, p2, p3].map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
}

export function SonoAnatomyView({ spec }: { spec: SonoSpec }) {
  const labelled = spec.shapes.filter((s) => s.label);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{spec.title}</Text>
      <Text style={styles.meta}>{spec.probe}</Text>

      <View style={styles.screenWrap}>
        <Svg viewBox="0 0 320 200" width="100%" height={200}>
          <Rect x={0} y={0} width={320} height={200} fill={SCREEN_BG} />

          {spec.shapes.map((shape, i) => {
            const style = TISSUE_STYLE[shape.tissue];
            if (shape.ellipse) {
              const { cx, cy, rx, ry } = shape.ellipse;
              return (
                <Ellipse
                  key={i}
                  cx={cx}
                  cy={cy}
                  rx={rx}
                  ry={ry}
                  fill={style.fill}
                  stroke={style.stroke}
                  strokeWidth={style.width}
                />
              );
            }
            if (shape.path) {
              return (
                <Path
                  key={i}
                  d={shape.path}
                  fill={style.fill}
                  stroke={style.stroke}
                  strokeWidth={style.width}
                  strokeDasharray={style.dash}
                  strokeLinecap="round"
                />
              );
            }
            return null;
          })}

          {spec.needle ? (
            <G>
              <Line
                x1={spec.needle.from[0]}
                y1={spec.needle.from[1]}
                x2={spec.needle.to[0]}
                y2={spec.needle.to[1]}
                stroke="#FFFFFF"
                strokeWidth={2.4}
                strokeLinecap="round"
              />
              <Polygon points={needleHead(spec.needle.from, spec.needle.to)} fill="#FFFFFF" />
            </G>
          ) : null}

          {labelled.map((shape, i) => {
            const pos = markerFor(shape);
            if (!pos) return null;
            return (
              <G key={`m${i}`}>
                <Circle cx={pos[0]} cy={pos[1]} r={9} fill="#0B0F12" stroke="#FFFFFF" strokeWidth={1.4} />
                <SvgText
                  x={pos[0]}
                  y={pos[1] + 4}
                  fill="#FFFFFF"
                  fontSize={11}
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  {String(i + 1)}
                </SvgText>
              </G>
            );
          })}
        </Svg>
        <Text style={styles.orientation}>{spec.orientation}</Text>
      </View>

      <View style={styles.legend}>
        {labelled.map((shape, i) => (
          <View key={`l${i}`} style={styles.legendRow}>
            <View style={styles.legendNum}>
              <Text style={styles.legendNumText}>{i + 1}</Text>
            </View>
            <View style={[styles.legendDot, { backgroundColor: LEGEND_DOT[shape.tissue] ?? "#999" }]} />
            <Text style={styles.legendText}>{shape.label}</Text>
          </View>
        ))}
        {spec.needle ? (
          <View style={styles.legendRow}>
            <View style={[styles.legendNum, styles.legendNumNeedle]}>
              <Text style={styles.legendNumText}>↘</Text>
            </View>
            <View style={[styles.legendDot, { backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: colors.border }]} />
            <Text style={styles.legendText}>{spec.needle.label}</Text>
          </View>
        ) : null}
      </View>

      {spec.note ? <Text style={styles.note}>{spec.note}</Text> : null}

      <Text style={styles.disclaimer}>
        Şematik çizim — gerçek ultrason görüntüsü değildir. Yapıların yeri ve oranları
        yaklaşıktır; hasta anatomisi ve prob açısına göre değişir.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    borderRadius: 10,
    padding: spacing.sm,
    gap: 4,
    marginTop: spacing.xs,
  },
  title: {
    fontSize: 12.5,
    fontWeight: "700",
    color: colors.text,
  },
  meta: {
    fontSize: 11,
    color: colors.textMuted,
  },
  screenWrap: {
    marginTop: 2,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: SCREEN_BG,
  },
  orientation: {
    fontSize: 10,
    color: "rgba(255,255,255,0.6)",
    textAlign: "center",
    paddingBottom: 5,
  },
  legend: {
    marginTop: 4,
    gap: 3,
  },
  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  legendNum: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.text,
    alignItems: "center",
    justifyContent: "center",
  },
  legendNumNeedle: {
    backgroundColor: colors.textMuted,
  },
  legendNumText: {
    color: "#FFFFFF",
    fontSize: 9.5,
    fontWeight: "700",
  },
  legendDot: {
    width: 9,
    height: 9,
    borderRadius: 2,
  },
  legendText: {
    fontSize: 11.5,
    color: colors.text,
    flex: 1,
  },
  note: {
    fontSize: 11.5,
    color: colors.textMuted,
    lineHeight: 16,
    marginTop: 4,
  },
  disclaimer: {
    fontSize: 10.5,
    color: colors.textMuted,
    fontStyle: "italic",
    marginTop: 2,
  },
});
