import { Stack } from "expo-router";

import { HeaderInfoButton } from "@/components/header-info-button";
import { Home } from "@/screens/home";

export default function IndexRoute() {
  return (
    <>
      <Stack.Screen options={{ headerRight: () => <HeaderInfoButton /> }} />
      <Home />
    </>
  );
}
