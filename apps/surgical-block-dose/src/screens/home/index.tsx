import { useMemo, useState } from "react";
import { FlatList, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { DisclaimerBanner } from "@/components/disclaimer-banner";
import { SurgeryCard } from "@/components/surgery-card";
import { SurgeryChip } from "@/components/surgery-chip";
import { SURGERIES, searchSurgeries } from "@/data/surgeries";
import { colors, spacing } from "@/theme";
import { useFavorites } from "@/utils/favorites";
import { useRecentlyViewed } from "@/utils/recently-viewed";

function bySurgeryIds(ids: string[]) {
  return ids
    .map((id) => SURGERIES.find((s) => s.id === id))
    .filter((s): s is (typeof SURGERIES)[number] => Boolean(s));
}

export function Home() {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState("");
  const results = useMemo(() => searchSurgeries(query), [query]);
  const [favoriteIds] = useFavorites();
  const recentIds = useRecentlyViewed();

  const favorites = useMemo(() => bySurgeryIds(favoriteIds), [favoriteIds]);
  const recents = useMemo(() => bySurgeryIds(recentIds), [recentIds]);
  const showQuickAccess = query.trim().length === 0 && (favorites.length > 0 || recents.length > 0);

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
          {showQuickAccess ? (
            <View style={styles.quickAccess}>
              {favorites.length > 0 ? (
                <View style={styles.quickSection}>
                  <Text style={styles.quickTitle}>Favoriler</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
                    {favorites.map((s) => (
                      <SurgeryChip key={s.id} surgery={s} />
                    ))}
                  </ScrollView>
                </View>
              ) : null}
              {recents.length > 0 ? (
                <View style={styles.quickSection}>
                  <Text style={styles.quickTitle}>Son Bakılanlar</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
                    {recents.map((s) => (
                      <SurgeryChip key={s.id} surgery={s} />
                    ))}
                  </ScrollView>
                </View>
              ) : null}
            </View>
          ) : null}
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
  quickAccess: {
    gap: spacing.sm,
  },
  quickSection: {
    gap: 6,
  },
  quickTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  chipRow: {
    gap: spacing.sm,
  },
  empty: {
    textAlign: "center",
    color: colors.textMuted,
    marginTop: spacing.xl,
  },
});
