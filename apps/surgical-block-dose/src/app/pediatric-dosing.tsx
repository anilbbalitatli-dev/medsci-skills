import { Stack } from "expo-router";

import { PediatricDosing } from "@/screens/pediatric-dosing";

export default function PediatricDosingRoute() {
  return (
    <>
      <Stack.Screen options={{ title: "Pediatrik Doz", presentation: "modal" }} />
      <PediatricDosing />
    </>
  );
}
