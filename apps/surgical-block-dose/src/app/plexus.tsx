import { Stack, useLocalSearchParams } from "expo-router";

import { Plexus } from "@/screens/plexus";

export default function PlexusRoute() {
  // Blok kartındaki bağlantı hangi bloktan gelindiğini taşır; şema o bloğun
  // seviyesi işaretli açılır.
  const { technique } = useLocalSearchParams<{ technique?: string }>();

  return (
    <>
      <Stack.Screen options={{ title: "Pleksus Şemaları", presentation: "modal" }} />
      <Plexus techniqueId={typeof technique === "string" ? technique : undefined} />
    </>
  );
}
