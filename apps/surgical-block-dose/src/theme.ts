import { StyleSheet, TextStyle, useColorScheme } from "react-native";

import { useStorage } from "@/utils/use-storage";

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

export interface Palette {
  background: string;
  surface: string;
  surfaceAlt: string;
  chip: string;
  border: string;
  borderStrong: string;
  text: string;
  textMuted: string;
  textFaint: string;
  primary: string;
  /** Vurgu renginin üstüne gelen metin/ikon rengi. */
  onPrimary: string;
  primaryStrong: string;
  primaryMuted: string;
  warning: string;
  warningBg: string;
  warningBorder: string;
  danger: string;
  dangerBg: string;
  dangerBorder: string;
  imaging: string;
}

export const LIGHT: Palette = {
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
  onPrimary: "#FFFFFF",
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
};

/**
 * Gece paleti.
 *
 * Uygulama çoğunlukla loş bir salonda, tek elle ve aceleyle okunuyor; beyaz
 * zemin orada göz kamaştırır. Karartma, açık paletin tersine çevrilmesi değil:
 * zeminler tam siyah değil (OLED'de metin titremesin diye), vurgu rengi
 * koyu zeminde yeterli kontrastı tutturmak için açıldı, uyarı ve tehlike
 * renkleri ise "dikkat" anlamını koruyacak kadar doygun bırakıldı.
 *
 * Ultrason yüzeyi (`imaging`) iki palette de aynı: gerçek görüntü zaten siyah
 * zemindedir ve temaya göre değişmesi anlamsız olurdu.
 */
export const DARK: Palette = {
  background: "#0E1417",
  surface: "#171F23",
  surfaceAlt: "#1F292E",
  chip: "#243036",

  border: "#2A363C",
  borderStrong: "#3D4C54",

  text: "#E9EEF1",
  textMuted: "#9CAAB3",
  textFaint: "#6E7C85",

  // Koyu zeminde okunur olsun diye vurgu açıldı; üstüne gelen metin de bu
  // yüzden beyaz değil koyu — beyaz, açık yeşilin üstünde okunmuyor.
  primary: "#3FBF95",
  onPrimary: "#07120E",
  primaryStrong: "#7FD9BC",
  primaryMuted: "#16332B",

  warning: "#E5B168",
  warningBg: "#2E2519",
  warningBorder: "#5C4A2A",
  danger: "#F08C82",
  dangerBg: "#331C1A",
  dangerBorder: "#6B3A35",

  imaging: "#0E1418",
};

export type ThemeMode = "system" | "light" | "dark";

const THEME_KEY = "theme-mode";

export function useThemeMode(): [ThemeMode, (mode: ThemeMode) => void] {
  return useStorage<ThemeMode>(THEME_KEY, "system");
}

/**
 * Yürürlükteki palet.
 *
 * Varsayılan "system": cihaz gece moduna geçtiğinde uygulama da geçer. Elle
 * seçim bunu geçersiz kılar ve cihazda saklanır.
 */
export function useColors(): Palette {
  const [mode] = useThemeMode();
  const scheme = useColorScheme();
  if (mode === "system") return scheme === "dark" ? DARK : LIGHT;
  return mode === "dark" ? DARK : LIGHT;
}

/**
 * Palete bağlı stil sayfası.
 *
 * `StyleSheet.create` çağrıldığı anda renkleri dondurur; bu yüzden stiller
 * modül düzeyinde bir kez değil, palet başına bir kez üretilir. İki palet
 * olduğu için önbellek en fazla iki giriş tutar — her render'da yeniden
 * yaratmak, stil kimliğini değiştirip gereksiz yeniden çizime yol açardı.
 */
/** Koyu tema yürürlükte mi — durum çubuğu gibi paletin dışındaki yerler için. */
export function useIsDark(): boolean {
  return useColors() === DARK;
}

export function makeStyles<T extends StyleSheet.NamedStyles<T> | StyleSheet.NamedStyles<any>>(
  factory: (colors: Palette) => T & StyleSheet.NamedStyles<any>
) {
  const cache = new Map<Palette, T>();
  return function useStyles(): T {
    const palette = useColors();
    let styles = cache.get(palette);
    if (!styles) {
      styles = StyleSheet.create(factory(palette));
      cache.set(palette, styles);
    }
    return styles;
  };
}

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
export function roleStyles(colors: Palette) {
  return {
    primary: {
      rail: colors.primary,
      badgeBg: colors.primary,
      badgeText: colors.onPrimary,
      label: "Öncelikli",
    },
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
}
