import { Stack, useLocalSearchParams } from "expo-router";

import { DermatomeBlocks } from "@/screens/dermatome-blocks";

export default function DermatomeBlocksRoute() {
  // Aramadan "L3" ile gelindiğinde ekran o segment seçili açılır; kullanıcının
  // aradığı seviyeyi bir de listeden bulması gerekmesin.
  const { levels } = useLocalSearchParams<{ levels?: string }>();
  const initial = typeof levels === "string" ? levels.split(",").filter(Boolean) : undefined;

  return (
    <>
      <Stack.Screen options={{ title: "Dermatoma Göre Blok" }} />
      <DermatomeBlocks initialLevels={initial} />
    </>
  );
}
