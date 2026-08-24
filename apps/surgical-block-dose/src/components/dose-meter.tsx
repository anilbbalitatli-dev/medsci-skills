import { DimensionValue, StyleSheet, Text, View } from "react-native";

import { colors, numeric, radius, spacing, type } from "@/theme";

/**
 * Dose meter.
 *
 * Blocks are quoted as volume ranges, so the load is a range too — showing a
 * single bar at the top of the range hides how much of the answer is "it
 * depends". This draws the low-to-high span as a band against a fixed scale
 * with the ceiling marked, so a combination that straddles the limit looks
 * different from one that clears it outright.
 *
 * The scale is fixed at 150% rather than fitted to the data, so the ceiling
 * line stays in the same place and two combinations can be compared by eye.
 * Anything past that is clamped and flagged, with the real figure in the text.
 */
const SCALE_MAX = 1.5;
const CEILING_POS = 1 / SCALE_MAX;

function toneFor(fractionHigh: number): string {
  if (fractionHigh >= 1) return colors.danger;
  if (fractionHigh >= 0.75) return colors.warning;
  return colors.primary;
}

export function DoseMeter({
  fractionLow,
  fractionHigh,
  compact = false,
}: {
  fractionLow: number;
  fractionHigh: number;
  compact?: boolean;
}) {
  const tone = toneFor(fractionHigh);
  const overflow = fractionHigh > SCALE_MAX;

  const lo = Math.min(fractionLow, SCALE_MAX) / SCALE_MAX;
  const hi = Math.min(fractionHigh, SCALE_MAX) / SCALE_MAX;
  const left: DimensionValue = `${lo * 100}%`;
  const width: DimensionValue = `${Math.max(hi - lo, 0.015) * 100}%`;
  const ceilingLeft: DimensionValue = `${CEILING_POS * 100}%`;

  return (
    <View style={styles.wrap}>
      <View style={[styles.track, compact && styles.trackCompact]}>
        {/* Zone past the ceiling, so "over" is visible as territory. */}
        <View style={[styles.overZone, { left: ceilingLeft }]} />
        <View style={[styles.band, { left, width, backgroundColor: tone }]} />
        <View style={[styles.ceiling, { left: ceilingLeft }]} />
        {overflow ? (
          <View style={styles.overflowMark}>
            <Text style={styles.overflowText}>»</Text>
          </View>
        ) : null}
      </View>
      {!compact ? (
        <View style={styles.scaleRow}>
          <Text style={styles.scaleTick}>0</Text>
          <Text style={[styles.scaleTick, styles.scaleCeiling]}>sınır %100</Text>
          <Text style={styles.scaleTick}>%150</Text>
        </View>
      ) : null}
    </View>
  );
}

export function DoseMeterRow({
  label,
  detail,
  fractionLow,
  fractionHigh,
}: {
  label: string;
  detail: string;
  fractionLow: number;
  fractionHigh: number;
}) {
  const tone = toneFor(fractionHigh);
  return (
    <View style={styles.row}>
      <View style={styles.rowHeader}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={[styles.rowPct, { color: tone }]}>
          %{Math.round(fractionLow * 100)}–{Math.round(fractionHigh * 100)}
        </Text>
      </View>
      <Text style={styles.rowDetail}>{detail}</Text>
      <DoseMeter fractionLow={fractionLow} fractionHigh={fractionHigh} compact />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 3 },
  track: {
    height: 12,
    borderRadius: radius.pill,
    backgroundColor: colors.chip,
    overflow: "hidden",
    justifyContent: "center",
  },
  trackCompact: { height: 9 },
  overZone: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    backgroundColor: colors.dangerBg,
  },
  band: {
    position: "absolute",
    top: 0,
    bottom: 0,
    borderRadius: radius.pill,
  },
  ceiling: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: colors.text,
    opacity: 0.55,
  },
  overflowMark: {
    position: "absolute",
    right: 3,
    top: 0,
    bottom: 0,
    justifyContent: "center",
  },
  overflowText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "800",
  },
  scaleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  scaleTick: {
    fontSize: 9.5,
    color: colors.textFaint,
    fontWeight: "600",
  },
  scaleCeiling: {
    color: colors.textMuted,
  },
  row: { gap: 4 },
  rowHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    gap: spacing.sm,
  },
  rowLabel: {
    ...type.subheading,
    color: colors.text,
    flexShrink: 1,
  },
  rowPct: {
    ...type.subheading,
    ...numeric,
  },
  rowDetail: {
    ...type.caption,
    ...numeric,
    color: colors.textMuted,
  },
});
