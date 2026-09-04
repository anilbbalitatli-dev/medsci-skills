import { Stack } from "expo-router";

import { DermatomeBlocks } from "@/screens/dermatome-blocks";

export default function DermatomeBlocksRoute() {
  return (
    <>
      <Stack.Screen options={{ title: "Dermatoma Göre Blok" }} />
      <DermatomeBlocks />
    </>
  );
}
