import { Stack } from "expo-router";

import { BrachialPlexus } from "@/screens/brachial-plexus";

export default function BrachialPlexusRoute() {
  return (
    <>
      <Stack.Screen options={{ title: "Brakiyal Pleksus", presentation: "modal" }} />
      <BrachialPlexus />
    </>
  );
}
