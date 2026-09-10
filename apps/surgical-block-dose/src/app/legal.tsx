import { Stack } from "expo-router";

import { Legal } from "@/screens/legal";

export default function LegalRoute() {
  return (
    <>
      <Stack.Screen options={{ title: "Yasal Bilgi", presentation: "modal" }} />
      <Legal />
    </>
  );
}
