import { Stack } from "expo-router";

import { LastInfo } from "@/screens/last-info";

export default function LastInfoRoute() {
  return (
    <>
      <Stack.Screen options={{ title: "LAST Bilgisi", presentation: "modal" }} />
      <LastInfo />
    </>
  );
}
