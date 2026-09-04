import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle, G, Path, Text as SvgText } from "react-native-svg";

import {
  DERMATOME_LABEL_DOTS,
  DERMATOME_LABELS,
  DERMATOME_LEADERS,
  DERMATOME_LEVELS,
  DERMATOME_PATHS,
  DERMATOME_POSTERIOR_PATHS,
  DERMATOME_POSTERIOR_VIEWBOX,
  DERMATOME_VIEWBOX,
  DermatomeLevel,
  HEAD_PATH,
  POSTERIOR_EXTRAS,
  POSTERIOR_LABEL_DOTS,
  POSTERIOR_LABELS,
  POSTERIOR_LEVELS,
  PosteriorLevel,
} from "@/data/dermatome-figure";
import { colors, spacing } from "@/theme";

const ATTRIBUTION =
  "Dermatom şekilleri: Rick Hansen Institute ISNCSCI UI (Apache-2.0) temel alınarak uyarlanmıştır.";

/** Levels the posterior figure can show; anything else only appears anteriorly. */
const POSTERIOR_SET = new Set<string>(POSTERIOR_LEVELS);

/** Passed down so a segment only becomes interactive when a handler exists. */
type LevelPress = ((level: string) => void) | undefined;

function AnteriorFigure({
  active,
  height,
  showLabels,
  onLevelPress,
}: {
  active: Set<string>;
  height: number;
  showLabels: boolean;
  onLevelPress: LevelPress;
}) {
  return (
    <Svg viewBox={DERMATOME_VIEWBOX} width="100%" height={height}>
      <Path d={HEAD_PATH} fill={colors.chip} stroke={colors.border} strokeWidth={1} />
      {DERMATOME_LEVELS.map((level) => {
        const on = active.has(level);
        const geom = DERMATOME_PATHS[level];
        return (
          <G key={level}>
            {[...geom.left, ...geom.right].map((d, i) => (
              <Path
                key={`${level}-${i}`}
                d={d}
                fill={on ? colors.primary : colors.chip}
                fillOpacity={on ? 0.85 : 1}
                stroke={on ? colors.primaryStrong : colors.border}
                strokeWidth={on ? 1.4 : 0.8}
                onPress={onLevelPress ? () => onLevelPress(level) : undefined}
              />
            ))}
          </G>
        );
      })}
      {showLabels ? (
        <G>
          {DERMATOME_LEADERS.map((d, i) => (
            <Path key={`ld-${i}`} d={d} fill={colors.textMuted} />
          ))}
          {DERMATOME_LABEL_DOTS.map((c, i) => (
            <Circle key={`dot-${i}`} cx={c.cx} cy={c.cy} r={c.r} fill={colors.textMuted} />
          ))}
          {DERMATOME_LABELS.map((t, i) => (
            <SvgText key={`t-${i}`} x={t.x} y={t.y} fill={colors.text} fontSize={11} fontWeight="600">
              {t.label}
            </SvgText>
          ))}
        </G>
      ) : null}
    </Svg>
  );
}

function PosteriorFigure({
  active,
  height,
  showLabels,
  onLevelPress,
}: {
  active: Set<string>;
  height: number;
  showLabels: boolean;
  onLevelPress: LevelPress;
}) {
  return (
    <Svg viewBox={DERMATOME_POSTERIOR_VIEWBOX} width="100%" height={height}>
      {POSTERIOR_EXTRAS.map((d, i) => (
        <Path key={`x-${i}`} d={d} fill={colors.chip} stroke={colors.border} strokeWidth={0.8} />
      ))}
      {POSTERIOR_LEVELS.map((level) => {
        const on = active.has(level);
        return (
          <G key={level}>
            {DERMATOME_POSTERIOR_PATHS[level].map((d, i) => (
              <Path
                key={`${level}-${i}`}
                d={d}
                fill={on ? colors.primary : colors.chip}
                fillOpacity={on ? 0.85 : 1}
                stroke={on ? colors.primaryStrong : colors.border}
                strokeWidth={on ? 1.4 : 0.8}
                onPress={onLevelPress ? () => onLevelPress(level) : undefined}
              />
            ))}
          </G>
        );
      })}
      {showLabels ? (
        <G>
          {POSTERIOR_LABEL_DOTS.map((c, i) => (
            <Circle key={`pdot-${i}`} cx={c.cx} cy={c.cy} r={c.r} fill={colors.textMuted} />
          ))}
          {POSTERIOR_LABELS.map((t, i) => (
            <SvgText key={`pt-${i}`} x={t.x} y={t.y} fill={colors.text} fontSize={7} fontWeight="600">
              {t.label}
            </SvgText>
          ))}
        </G>
      ) : null}
    </Svg>
  );
}

/**
 * Anterior figure, plus the posterior lower-body figure whenever the covered
 * levels actually appear there (lumbosacral). Purely cervical/thoracic blocks
 * get the anterior view only, since the posterior figure has no such segments.
 */
export function DermatomeFigureCard({
  levels = [],
  height = 260,
  showLabels = false,
  caption,
  alwaysShowPosterior = false,
  onLevelPress,
}: {
  levels?: (DermatomeLevel | PosteriorLevel)[];
  height?: number;
  showLabels?: boolean;
  caption?: string;
  alwaysShowPosterior?: boolean;
  /**
   * Makes segments tappable. Omitted by the read-only callers, which keeps the
   * figure inert everywhere it is illustrating a result rather than taking one.
   */
  onLevelPress?: (level: string) => void;
}) {
  const active = new Set<string>(levels);
  // While picking, the posterior view has to stay put: it holds L2–S3, and
  // hiding it the moment the selection has no such level would make those
  // segments unreachable.
  const posteriorRelevant =
    alwaysShowPosterior || Boolean(onLevelPress) || levels.some((l) => POSTERIOR_SET.has(l));

  return (
    <View style={styles.card}>
      <View style={styles.figures}>
        <View style={styles.figureBlock}>
          <AnteriorFigure
            active={active}
            height={height}
            showLabels={showLabels}
            onLevelPress={onLevelPress}
          />
          <Text style={styles.figureLabel}>Ön</Text>
        </View>
        {posteriorRelevant ? (
          <View style={styles.figureBlock}>
            <PosteriorFigure
              active={active}
              height={height}
              showLabels={showLabels}
              onLevelPress={onLevelPress}
            />
            <Text style={styles.figureLabel}>Arka (alt ekstremite / perine)</Text>
          </View>
        ) : null}
      </View>
      {caption ? <Text style={styles.caption}>{caption}</Text> : null}
      <Text style={styles.attribution}>{ATTRIBUTION}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background,
    borderRadius: 10,
    padding: spacing.sm,
    gap: 4,
    marginTop: spacing.xs,
  },
  figures: {
    flexDirection: "row",
    gap: spacing.md,
    alignItems: "flex-start",
  },
  figureBlock: {
    flex: 1,
    alignItems: "center",
  },
  figureLabel: {
    fontSize: 10.5,
    color: colors.textMuted,
    marginTop: 2,
    textAlign: "center",
  },
  caption: {
    fontSize: 11.5,
    color: colors.textMuted,
  },
  attribution: {
    fontSize: 10,
    color: colors.textMuted,
    fontStyle: "italic",
  },
});
