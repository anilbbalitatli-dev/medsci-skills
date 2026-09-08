import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { FirstRunDisclaimer } from "@/components/first-run-disclaimer";
import { makeStyles, useColors, useIsDark } from "@/theme";

export default function RootLayout() {
  const colors = useColors();
  const isDark = useIsDark();
  return (
    <SafeAreaProvider>
      <StatusBar style={isDark ? "light" : "dark"} />
      <FirstRunDisclaimer />
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
        <Stack.Screen name="pediatric-dosing" options={{ title: "Pediatrik Doz", presentation: "modal" }} />
        <Stack.Screen name="mixture" options={{ title: "Karışım Hesaplayıcı", presentation: "modal" }} />
        <Stack.Screen name="combination-builder" options={{ title: "Kombinasyon Oluşturucu" }} />
        <Stack.Screen name="dermatome-blocks" options={{ title: "Dermatoma Göre Blok" }} />
        <Stack.Screen name="legal" options={{ title: "Yasal Bilgi", presentation: "modal" }} />
        <Stack.Screen
          name="oss-licenses"
          options={{ title: "Açık Kaynak Lisansları", presentation: "modal" }}
        />
        <Stack.Screen
          name="anticoagulation"
          options={{ title: "Antikoagülan ve Blok", presentation: "modal" }}
        />
        <Stack.Screen
          name="plexus"
          options={{ title: "Pleksus Şemaları", presentation: "modal" }}
        />
      </Stack>
    </SafeAreaProvider>
  );
}
