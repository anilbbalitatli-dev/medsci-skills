import { Stack } from "expo-router";

import { Plexus } from "@/screens/plexus";

export default function PlexusRoute() {
  return (
    <>
      <Stack.Screen options={{ title: "Pleksus Şemaları", presentation: "modal" }} />
      <Plexus />
    </>
  );
}
