import { Stack } from "expo-router";

import { DermatomeMap } from "@/screens/dermatome-map";

export default function DermatomeMapRoute() {
  return (
    <>
      <Stack.Screen options={{ title: "Dermatom Haritası", presentation: "modal" }} />
      <DermatomeMap />
    </>
  );
}
