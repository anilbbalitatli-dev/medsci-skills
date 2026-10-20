import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, View } from "react-native";

import { ThemeMode, makeStyles, useColors, useThemeMode } from "@/theme";

/**
 * Tema düğmesi: sistem → açık → koyu → sistem.
 *
 * Üç durum var çünkü ikisi yetmiyor: cihazı gece moduna alan kullanıcı
 * uygulamanın da geçmesini bekler ("sistem"), ama gündüz salonunda koyu tema
 * isteyen için elle seçim de gerekir. Seçim cihazda saklanır.
 */
const NEXT: Record<ThemeMode, ThemeMode> = {
  system: "light",
  light: "dark",
  dark: "system",
};

const ICON: Record<ThemeMode, keyof typeof Ionicons.glyphMap> = {
  system: "phone-portrait-outline",
  light: "sunny-outline",
  dark: "moon-outline",
};

const LABEL: Record<ThemeMode, string> = {
  system: "Tema: cihaz ayarı",
  light: "Tema: açık",
  dark: "Tema: koyu",
};

export function ThemeToggle() {
  const styles = useStyles();
  const colors = useColors();
  const [mode, setMode] = useThemeMode();

  return (
    <Pressable
      onPress={() => setMode(NEXT[mode])}
      hitSlop={8}
      accessibilityLabel={LABEL[mode]}
      accessibilityRole="button"
    >
      <View style={styles.button}>
        <Ionicons name={ICON[mode]} size={14} color={colors.textMuted} />
      </View>
    </Pressable>
  );
}

const useStyles = makeStyles((colors) => ({
  button: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: 999,
    paddingHorizontal: 7,
    paddingVertical: 5,
  },
}));
