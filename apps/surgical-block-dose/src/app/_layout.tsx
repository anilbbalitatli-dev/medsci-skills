import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { colors } from "@/theme";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.text,
          headerTitleStyle: { fontWeight: "600" },
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="index" options={{ title: "Cerrahiler" }} />
        <Stack.Screen name="surgery/[id]" options={{ title: "Blok Önerisi" }} />
        <Stack.Screen name="last-info" options={{ title: "LAST Bilgisi", presentation: "modal" }} />
        <Stack.Screen name="dermatome-map" options={{ title: "Dermatom Haritası", presentation: "modal" }} />
      </Stack>
    </SafeAreaProvider>
  );
}
