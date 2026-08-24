import { TextStyle } from "react-native";

/**
 * Design tokens.
 *
 * The app is a reference consulted in a hurry, often one-handed and sometimes
 * in a dim room, so the visual system is built around scanning rather than
 * reading: strong weight contrast, numerals treated as data, and role encoded
 * in form (a rail, a badge) as well as colour.
 *
 * Neutrals carry a slight cool bias so they sit with the accent instead of
 * looking like undecided grey. Semantic colours (warning, danger) are kept
 * separate from the accent so "attention" never reads as "brand".
 */

export const colors = {
  // Grounds
  background: "#F5F7F9",
  surface: "#FFFFFF",
  surfaceAlt: "#EFF2F5",
  chip: "#E9EDF1",

  // Lines
  border: "#E0E5EA",
  borderStrong: "#C7D0D8",

  // Text
  text: "#101519",
  textMuted: "#586470",
  textFaint: "#8B959F",

  // Accent
  primary: "#0F7A5F",
  primaryStrong: "#0A5A45",
  primaryMuted: "#E2F1EC",

  // Semantic — deliberately not the accent hue
  warning: "#8A5200",
  warningBg: "#FDF3E4",
  warningBorder: "#EFC98B",
  danger: "#B3261E",
  dangerBg: "#FCEBEA",
  dangerBorder: "#EEB2AD",

  // Imaging surfaces (ultrasound panels)
  imaging: "#0E1418",
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  pill: 999,
} as const;

/**
 * Type scale. Sizes step deliberately rather than drifting by half-points, and
 * weight does most of the hierarchy work so the scale can stay compact enough
 * for a phone.
 */
export const type = {
  title: { fontSize: 21, fontWeight: "800", letterSpacing: -0.3 },
  heading: { fontSize: 15.5, fontWeight: "700" },
  subheading: { fontSize: 13.5, fontWeight: "700" },
  body: { fontSize: 13.5, fontWeight: "400" },
  bodySm: { fontSize: 12.5, fontWeight: "400" },
  label: { fontSize: 11, fontWeight: "700", letterSpacing: 0.6, textTransform: "uppercase" },
  caption: { fontSize: 11.5, fontWeight: "400" },
} satisfies Record<string, TextStyle>;

/** Numerals line up in columns wherever doses are compared. */
export const numeric: TextStyle = { fontVariant: ["tabular-nums"] };

export const elevation = {
  card: {
    shadowColor: "#0B1A24",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  raised: {
    shadowColor: "#0B1A24",
    shadowOpacity: 0.09,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
} as const;

/**
 * Role encoding for block cards. Primary gets the accent and a solid rail;
 * alternative stays neutral; adjunct is tinted but visibly secondary — so the
 * three read apart at a glance without relying on the badge text.
 */
export const role = {
  primary: { rail: colors.primary, badgeBg: colors.primary, badgeText: "#FFFFFF", label: "Öncelikli" },
  alternative: {
    rail: colors.borderStrong,
    badgeBg: colors.surfaceAlt,
    badgeText: colors.textMuted,
    label: "Alternatif",
  },
  adjunct: {
    rail: "#8FBFB0",
    badgeBg: colors.primaryMuted,
    badgeText: colors.primaryStrong,
    label: "Ek (Adjuvan)",
  },
} as const;
