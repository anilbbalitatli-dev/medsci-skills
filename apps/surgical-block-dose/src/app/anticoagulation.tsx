import { Stack } from "expo-router";

import { Anticoagulation } from "@/screens/anticoagulation";

export default function AnticoagulationRoute() {
  return (
    <>
      <Stack.Screen options={{ title: "Antikoagülan ve Blok", presentation: "modal" }} />
      <Anticoagulation />
    </>
  );
}
