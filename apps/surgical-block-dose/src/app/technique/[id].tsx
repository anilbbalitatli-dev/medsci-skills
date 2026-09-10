import { Stack, useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

import { HeaderInfoButton } from "@/components/header-info-button";
import { techniqueById } from "@/data/techniques";
import { TechniqueDetail } from "@/screens/technique-detail";
import { makeStyles, spacing } from "@/theme";

export default function TechniqueDetailRoute() {
  const styles = useStyles();
  const { id } = useLocalSearchParams<{ id: string }>();
  const technique = typeof id === "string" ? techniqueById(id) : undefined;

  if (!technique) {
    return (
      <>
        <Stack.Screen options={{ title: "Blok" }} />
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>Blok bulunamadı.</Text>
        </View>
      </>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{ title: technique.name, headerRight: () => <HeaderInfoButton /> }}
      />
      <TechniqueDetail techniqueId={technique.id} />
    </>
  );
}

const useStyles = makeStyles((colors) => ({
  notFound: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl,
    backgroundColor: colors.background,
  },
  notFoundText: { color: colors.textMuted },
}));
