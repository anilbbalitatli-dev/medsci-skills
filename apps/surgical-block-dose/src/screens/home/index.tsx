import { useMemo, useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { DisclaimerBanner } from "@/components/disclaimer-banner";
import { SurgeryCard } from "@/components/surgery-card";
import { searchSurgeries } from "@/data/surgeries";
import { colors, spacing } from "@/theme";

export function Home() {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState("");
  const results = useMemo(() => searchSurgeries(query), [query]);

  return (
    <FlatList
      data={results}
      keyExtractor={(item) => item.id}
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + spacing.xl }]}
      ListHeaderComponent={
        <View style={styles.headerBlock}>
          <DisclaimerBanner />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Cerrahi ara (ör. diz protezi, sezaryen)"
            placeholderTextColor={colors.textMuted}
            style={styles.search}
            autoCorrect={false}
            clearButtonMode="while-editing"
          />
        </View>
      }
      ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
      renderItem={({ item }) => <SurgeryCard surgery={item} />}
      ListEmptyComponent={
        <Text style={styles.empty}>Eşleşen cerrahi bulunamadı.</Text>
      }
      keyboardShouldPersistTaps="handled"
    />
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.lg,
  },
  headerBlock: {
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  search: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    fontSize: 15,
    color: colors.text,
  },
  empty: {
    textAlign: "center",
    color: colors.textMuted,
    marginTop: spacing.xl,
  },
});
