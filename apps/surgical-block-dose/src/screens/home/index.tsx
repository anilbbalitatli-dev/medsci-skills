import { useMemo, useState } from "react";
import { FlatList, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Ionicons from "@expo/vector-icons/Ionicons";
import { Link } from "expo-router";
import { Pressable } from "react-native";

import { DisclaimerBanner } from "@/components/disclaimer-banner";
import { SurgeryCard } from "@/components/surgery-card";
import { SurgeryChip } from "@/components/surgery-chip";
import { SURGERIES, searchSurgeries } from "@/data/surgeries";
import { colors, elevation, radius, spacing, type } from "@/theme";
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
          <Link href="/combination-builder" asChild>
            <Pressable>
              <View style={styles.builderButton}>
                <View style={styles.builderIcon}>
                  <Ionicons name="git-merge-outline" size={19} color="#FFFFFF" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.builderTitle}>Kombinasyon Oluşturucu</Text>
                  <Text style={styles.builderSub}>
                    2–3 blok seç · toplam doz, yaşa göre sınır, birleşik dermatom ve motor etki
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.85)" />
              </View>
            </Pressable>
          </Link>
          {/* The reverse of the surgery list: start from the territory rather
              than from the operation. */}
          <Link href="/dermatome-blocks" asChild>
            <Pressable>
              <View style={styles.finderButton}>
                <Ionicons name="body" size={17} color="#FFFFFF" />
                <View style={{ flex: 1 }}>
                  <Text style={styles.finderTitle}>Dermatoma Göre Blok</Text>
                  <Text style={styles.finderSub}>
                    Kapsanmasını istediğin segmentleri seç · uygun blokları ve taşmayı gör
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="rgba(255,255,255,0.85)" />
              </View>
            </Pressable>
          </Link>
          {/* Reachable without building a combination first: the paediatric
              tables are a lookup people come to the app for on their own. */}
          <Link href="/pediatric-dosing" asChild>
            <Pressable>
              <View style={styles.pedButton}>
                <Ionicons name="body-outline" size={17} color={colors.primary} />
                <Text style={styles.pedButtonText}>Pediatrik doz tabloları</Text>
                <Ionicons name="chevron-forward" size={15} color={colors.primary} />
              </View>
            </Pressable>
          </Link>
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
      ListFooterComponent={
        <Link href="/legal" asChild>
          <Pressable style={({ pressed }) => pressed && { opacity: 0.6 }}>
            <Text style={styles.legalLink}>Yasal bilgi · kaynaklar · gizlilik</Text>
          </Pressable>
        </Link>
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
  builderButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    ...elevation.raised,
  },
  builderIcon: {
    width: 34,
    height: 34,
    borderRadius: radius.md,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },
  builderTitle: {
    ...type.heading,
    color: "#FFFFFF",
  },
  builderSub: {
    ...type.caption,
    fontSize: 11,
    color: "rgba(255,255,255,0.82)",
    marginTop: 1,
    lineHeight: 15,
  },
  finderButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    backgroundColor: colors.primaryStrong,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 11,
  },
  finderTitle: { ...type.subheading, color: "#FFFFFF" },
  finderSub: {
    ...type.caption,
    fontSize: 11,
    color: "rgba(255,255,255,0.82)",
    marginTop: 1,
    lineHeight: 15,
  },
  pedButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.primaryMuted,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
  },
  pedButtonText: { ...type.subheading, color: colors.primaryStrong, flex: 1 },
  search: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 11,
    fontSize: 15,
    color: colors.text,
    ...elevation.card,
  },
  quickAccess: {
    gap: spacing.sm,
  },
  quickSection: {
    gap: 6,
  },
  quickTitle: {
    ...type.label,
    color: colors.textFaint,
  },
  chipRow: {
    gap: spacing.sm,
  },
  legalLink: {
    ...type.caption,
    color: colors.textMuted,
    textAlign: "center",
    textDecorationLine: "underline",
    marginTop: spacing.lg,
  },
  empty: {
    ...type.body,
    textAlign: "center",
    color: colors.textMuted,
    marginTop: spacing.xl,
  },
});
