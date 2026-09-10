import { useMemo, useState } from "react";
import { FlatList, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Ionicons from "@expo/vector-icons/Ionicons";
import { Link } from "expo-router";
import { Pressable } from "react-native";

import { DisclaimerBanner } from "@/components/disclaimer-banner";
import { SearchRow, SearchRowView, toSearchRows } from "@/components/search-results";
import { SurgeryChip } from "@/components/surgery-chip";
import { MIN_QUERY_LENGTH, searchEverything } from "@/data/search";
import { SURGERIES } from "@/data/surgeries";
import {
  elevation,
  makeStyles,
  radius,
  spacing,
  type,
  useColors,
  useContentStyle,
  useLayout,
} from "@/theme";
import { useFavorites } from "@/utils/favorites";
import { useRecentlyViewed } from "@/utils/recently-viewed";

function bySurgeryIds(ids: string[]) {
  return ids
    .map((id) => SURGERIES.find((s) => s.id === id))
    .filter((s): s is (typeof SURGERIES)[number] => Boolean(s));
}

/** Arama yokken liste yine cerrahi kataloğudur; satır biçimi ortak. */
const CATALOG_ROWS: SearchRow[] = SURGERIES.map((surgery) => ({
  key: `surgery-${surgery.id}`,
  kind: "result",
  result: {
    kind: "surgery",
    id: surgery.id,
    title: surgery.name,
    subtitle: `${surgery.category} — ${surgery.region}`,
    surgery,
  },
}));

/**
 * Ana ekranın kısayolları.
 *
 * Arama sırasında gizlenirler. Kutunun altında bir ekran boyu düğme
 * dururken ilk sonuç görünmüyordu; aramanın işe yaraması için sonucun
 * yazdığın yerin hemen altında çıkması gerekiyor.
 */
function Shortcuts() {
  const colors = useColors();
  const styles = useStyles();
  return (
    <>
      <Link href="/combination-builder" asChild>
        <Pressable>
          <View style={styles.builderButton}>
            <View style={styles.builderIcon}>
              <Ionicons name="git-merge-outline" size={19} color={colors.onPrimary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.builderTitle}>Kombinasyon Oluşturucu</Text>
              <Text style={styles.builderSub}>
                2–3 blok seç · toplam doz, yaşa göre sınır, birleşik dermatom ve motor etki
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.onPrimary} />
          </View>
        </Pressable>
      </Link>
      {/* The reverse of the surgery list: start from the territory rather
          than from the operation. */}
      <Link href="/dermatome-blocks" asChild>
        <Pressable>
          <View style={styles.finderButton}>
            <Ionicons name="body" size={17} color={colors.onPrimary} />
            <View style={{ flex: 1 }}>
              <Text style={styles.finderTitle}>Dermatoma Göre Blok</Text>
              <Text style={styles.finderSub}>
                Kapsanmasını istediğin segmentleri seç · uygun blokları ve taşmayı gör
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={colors.onPrimary} />
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
      {/* Antikoagülan sorusu blok seçilmeden önce sorulur; bu yüzden
          cerrahi listesinden bağımsız bir giriş. */}
      <Link href="/anticoagulation" asChild>
        <Pressable>
          <View style={styles.pedButton}>
            <Ionicons name="water-outline" size={17} color={colors.primary} />
            <Text style={styles.pedButtonText}>Antikoagülan alan hastada blok</Text>
            <Ionicons name="chevron-forward" size={15} color={colors.primary} />
          </View>
        </Pressable>
      </Link>
      {/* Kateter kararı girişimden önce, elde bir blok adı yokken verilir;
          bu yüzden blok kartının içinden değil, buradan da açılır. */}
      <Link href="/catheters" asChild>
        <Pressable>
          <View style={styles.pedButton}>
            <Ionicons name="git-commit-outline" size={17} color={colors.primary} />
            <Text style={styles.pedButtonText}>Kateter, infüzyon ve çözülme</Text>
            <Ionicons name="chevron-forward" size={15} color={colors.primary} />
          </View>
        </Pressable>
      </Link>
      {/* Bir ekstremitenin bloklarının hepsi aynı zincirin farklı yerleri;
          şema tek başına da aranan bir referans. */}
      <Link href="/plexus" asChild>
        <Pressable>
          <View style={styles.pedButton}>
            <Ionicons name="git-network-outline" size={17} color={colors.primary} />
            <Text style={styles.pedButtonText}>Pleksus şemaları (brakiyal · lomber · sakral)</Text>
            <Ionicons name="chevron-forward" size={15} color={colors.primary} />
          </View>
        </Pressable>
      </Link>
    </>
  );
}

export function Home() {
  const colors = useColors();
  const styles = useStyles();
  const insets = useSafeAreaInsets();
  const content = useContentStyle("grid");
  const layout = useLayout();
  const [query, setQuery] = useState("");
  const trimmed = query.trim();
  const searching = trimmed.length >= MIN_QUERY_LENGTH;
  const results = useMemo(() => searchEverything(query), [query]);
  const rows = useMemo(
    () => (searching ? toSearchRows(results) : CATALOG_ROWS),
    [searching, results]
  );
  const [favoriteIds] = useFavorites();
  const recentIds = useRecentlyViewed();

  const favorites = useMemo(() => bySurgeryIds(favoriteIds), [favoriteIds]);
  const recents = useMemo(() => bySurgeryIds(recentIds), [recentIds]);
  const showQuickAccess = trimmed.length === 0 && (favorites.length > 0 || recents.length > 0);

  /**
   * Tablette katalog iki sütun, arama sonuçları tek sütun.
   *
   * Arama sonuçları gruplandığı için tek sütunda kalmak zorunda: "Bloklar"
   * başlığı iki sütuna bölünmüş bir ızgarada hangi kartların altına ait
   * olduğunu söyleyemez. Katalogda böyle bir başlık yok, dolayısıyla ızgara
   * anlamı bozmadan iki katı kart gösteriyor.
   *
   * FlatList sütun sayısını canlı değiştiremediği için `key` de değişiyor;
   * liste yeniden kuruluyor ve kaydırma başa dönüyor. Aramaya başlarken zaten
   * istenen davranış bu.
   */
  const columns = searching ? 1 : layout.columns;

  return (
    <FlatList
      key={`cols-${columns}`}
      numColumns={columns}
      columnWrapperStyle={columns > 1 ? styles.columnWrapper : undefined}
      data={rows}
      keyExtractor={(row) => row.key}
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={[styles.content, content, { paddingBottom: insets.bottom + spacing.xl }]}
      ListHeaderComponent={
        <View style={styles.headerBlock}>
          <DisclaimerBanner />
          {/* Arama artık cerrahi adıyla sınırlı değil: blok, sinir, ilaç ve
              dermatom seviyesi de aynı kutudan bulunur. Kullanıcının aklına
              gelen ilk kelime çoğu zaman ameliyatın adı olmuyor.

              Kutu kısayol düğmelerinin üstünde duruyor ve arama sırasında
              düğmeler gizleniyor: aksi hâlde ilk sonucu görmek için bir ekran
              boyu kaydırmak gerekiyordu, ki bu aramayı işe yaramaz yapar. */}
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Ara: cerrahi, blok, sinir, ilaç, dermatom"
            placeholderTextColor={colors.textMuted}
            style={styles.search}
            autoCorrect={false}
            clearButtonMode="while-editing"
            accessibilityLabel="Cerrahi, blok, sinir, ilaç veya dermatom seviyesi ara"
          />
          {trimmed.length > 0 && !searching ? (
            <Text style={styles.searchHint}>Aramak için en az {MIN_QUERY_LENGTH} harf yazın.</Text>
          ) : null}
          {searching ? null : <Shortcuts />}
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
      ItemSeparatorComponent={() => (
        <View style={{ height: searching ? spacing.sm : spacing.md }} />
      )}
      renderItem={({ item }) => (
        // Izgarada hücreler satırı eşit paylaşır; tek sütunda flex gereksiz.
        <View style={columns > 1 ? styles.cell : undefined}>
          <SearchRowView row={item} />
        </View>
      )}
      ListEmptyComponent={
        searching ? (
          <Text style={styles.empty}>
            “{trimmed}” için cerrahi, blok, sinir, ilaç veya dermatom bulunamadı.
          </Text>
        ) : null
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

const useStyles = makeStyles((colors) => ({
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
    color: colors.onPrimary,
  },
  builderSub: {
    ...type.caption,
    fontSize: 11,
    color: colors.onPrimary,
    opacity: 0.82,
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
  finderTitle: { ...type.subheading, color: colors.onPrimary },
  finderSub: {
    ...type.caption,
    fontSize: 11,
    color: colors.onPrimary,
    opacity: 0.82,
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
  columnWrapper: { gap: spacing.md },
  // Izgarada kartlar aynı yüksekliğe gerilmesin diye hizalama üstten.
  cell: { flex: 1, alignSelf: "flex-start" },
  searchHint: {
    ...type.caption,
    color: colors.textFaint,
    marginTop: -spacing.sm,
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
}));
