import { Stack } from "expo-router";

import { Catheters } from "@/screens/catheters";

export default function CathetersRoute() {
  return (
    <>
      <Stack.Screen options={{ title: "Kateter ve İnfüzyon" }} />
      <Catheters />
    </>
  );
}
