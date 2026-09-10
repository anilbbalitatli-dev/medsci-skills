import { Stack } from "expo-router";

import { CombinationBuilder } from "@/screens/combination-builder";

export default function CombinationBuilderRoute() {
  return (
    <>
      <Stack.Screen options={{ title: "Kombinasyon Oluşturucu" }} />
      <CombinationBuilder />
    </>
  );
}
