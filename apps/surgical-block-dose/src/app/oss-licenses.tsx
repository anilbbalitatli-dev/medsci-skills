import { Stack } from "expo-router";

import { OssLicenses } from "@/screens/oss-licenses";

export default function OssLicensesRoute() {
  return (
    <>
      <Stack.Screen options={{ title: "Açık Kaynak Lisansları", presentation: "modal" }} />
      <OssLicenses />
    </>
  );
}
