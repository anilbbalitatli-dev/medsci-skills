import { Stack } from "expo-router";

import { MixtureCalculator } from "@/screens/mixture";

export default function MixtureRoute() {
  return (
    <>
      <Stack.Screen options={{ title: "Karışım Hesaplayıcı", presentation: "modal" }} />
      <MixtureCalculator />
    </>
  );
}
