import Ionicons from "@expo/vector-icons/Ionicons";
import { Link } from "expo-router";
import { Pressable, Text, View } from "react-native";

import { SurgeryCard } from "@/components/surgery-card";
import type {
  DrugResult,
  LevelResult,
  NerveResult,
  SearchResult,
  SearchResults,
  TechniqueResult,
} from "@/data/search";
import { makeStyles, radius, spacing, type, useColors } from "@/theme";

/**
 * Arama sonuçlarının çizimi.
 *
 * Sonuçlar tek bir sıralı listeye değil, türüne göre başlıklı kümelere
 * konur. Sebebi görsel değil: bir sinir sonucuyla bir cerrahi sonucu aynı
 * soruya cevap vermez. "Safen" yazan kişi bir cerrahi aramıyordur, sinirin
 * hangi blokla tutulduğunu arıyordur — o yüzden sinir satırı kendi başına bir
 * hedef değil, bloklara açılan bir kapıdır.
 *
 * Her küme en fazla birkaç satır gösterir. Arama kutusu bir katalog dökümü
 * değil, ilk isabeti bulma aracıdır; onlarca satır listelemek doğru sonucu
 * bulmayı kolaylaştırmaz.
 */

/** Ekranın FlatList'ine verilebilecek düz satır listesi. */
export type SearchRow =
  | { key: string; kind: "header"; title: string }
  | { key: string; kind: "result"; result: SearchResult };

const GROUPS: { field: keyof Omit<SearchResults, "total">; title: string }[] = [
  { field: "surgeries", title: "Cerrahiler" },
  { field: "techniques", title: "Bloklar" },
  { field: "nerves", title: "Sinirler" },
  { field: "levels", title: "Dermatom seviyeleri" },
  { field: "drugs", title: "Lokal anestezikler" },
];

export function toSearchRows(results: SearchResults): SearchRow[] {
  const rows: SearchRow[] = [];
  for (const { field, title } of GROUPS) {
    const items = results[field];
    if (items.length === 0) continue;
    rows.push({ key: `h-${field}`, title, kind: "header" });
    for (const result of items) {
      rows.push({ key: `${result.kind}-${result.id}`, kind: "result", result });
    }
  }
  return rows;
}

export function SearchRowView({ row }: { row: SearchRow }) {
  const styles = useStyles();
  if (row.kind === "header") {
    // Grup başlıkları ekran okuyucuda gezinme noktası olur; rol verilmezse
    // sonuçlar tek bir uzun liste gibi okunur.
    return (
      <Text style={styles.groupTitle} accessibilityRole="header">
        {row.title}
      </Text>
    );
  }
  const { result } = row;
  switch (result.kind) {
    case "surgery":
      return <SurgeryCard surgery={result.surgery} />;
    case "technique":
      return <TechniqueRow result={result} />;
    case "nerve":
      return <NerveRow result={result} />;
    case "level":
      return <LevelRow result={result} />;
    case "drug":
      return <DrugRow result={result} />;
  }
}

function TechniqueRow({ result }: { result: TechniqueResult }) {
  const colors = useColors();
  const styles = useStyles();
  return (
    <Link
      href={{ pathname: "/technique/[id]", params: { id: result.technique.id } }}
      asChild
    >
      <Pressable
        accessibilityRole="link"
        accessibilityLabel={`${result.title}. ${result.subtitle}.`}
      >
        <View style={styles.row}>
          <View style={styles.iconBadge}>
            <Ionicons name="medkit-outline" size={15} color={colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.rowTitle}>{result.title}</Text>
            <Text style={styles.rowSub}>{result.subtitle}</Text>
          </View>
          <Ionicons name="chevron-forward" size={15} color={colors.textFaint} />
        </View>
      </Pressable>
    </Link>
  );
}

/**
 * Sinir satırı kendisi bir sayfaya gitmez.
 *
 * Uygulamada "sinir sayfası" yok, çünkü sinirin tek başına söyleyeceği şey
 * kökleri ve alanıdır — asıl cevap onu hangi bloğun tuttuğudur. Bu yüzden
 * satırın altında blok düğmeleri var: en dar bloktan başlayarak, çünkü bir
 * siniri tutmak için tüm ekstremiteyi bloklamak gerekmez.
 */
function NerveRow({ result }: { result: NerveResult }) {
  const styles = useStyles();
  const colors = useColors();
  return (
    <View style={styles.row}>
      <View style={styles.iconBadge}>
        <Ionicons name="git-branch-outline" size={15} color={colors.primary} />
      </View>
      <View style={{ flex: 1, gap: 6 }}>
        <View>
          <Text style={styles.rowTitle}>{result.title}</Text>
          {result.subtitle ? (
            <Text style={styles.rowSub} numberOfLines={2}>
              {result.subtitle}
            </Text>
          ) : null}
        </View>
        {result.techniques.length > 0 ? (
          <>
            <Text style={styles.chipLabel}>Tam bloklayan teknikler</Text>
            <View style={styles.chipRow}>
              {result.techniques.map((t) => (
                <Link key={t.id} href={{ pathname: "/technique/[id]", params: { id: t.id } }} asChild>
                  <Pressable
                    accessibilityRole="link"
                    accessibilityLabel={`${t.name} — ${result.title} için tam blok`}
                  >
                    <View style={styles.chip}>
                      <Text style={styles.chipText}>{t.name}</Text>
                    </View>
                  </Pressable>
                </Link>
              ))}
            </View>
          </>
        ) : (
          <Text style={styles.chipLabel}>
            Katalogdaki hiçbir teknik bu siniri tek başına tam bloklamıyor.
          </Text>
        )}
      </View>
    </View>
  );
}

function LevelRow({ result }: { result: LevelResult }) {
  const colors = useColors();
  const styles = useStyles();
  return (
    <Link href={{ pathname: "/dermatome-blocks", params: { levels: result.level } }} asChild>
      <Pressable
        accessibilityRole="link"
        accessibilityLabel={`${result.title} segmentini kapsayan blokları göster`}
      >
        <View style={styles.row}>
          <View style={styles.iconBadge}>
            <Ionicons name="body-outline" size={15} color={colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.rowTitle}>{result.title}</Text>
            <Text style={styles.rowSub}>{result.subtitle}</Text>
          </View>
          <Ionicons name="chevron-forward" size={15} color={colors.textFaint} />
        </View>
      </Pressable>
    </Link>
  );
}

/**
 * İlaç satırı da bir yere gitmez: cevabın kendisi satırın içinde.
 *
 * Tavan hasta ağırlığına bağlı olduğu için burada mg/kg olarak, mutlak sınırla
 * birlikte verilir; ağırlıkla çarpımı zaten blok kartlarında yapılıyor.
 */
function DrugRow({ result }: { result: DrugResult }) {
  const colors = useColors();
  const styles = useStyles();
  const { drug, ceiling } = result;
  const strengths = [
    drug.analgesia ? `analjezi %${drug.analgesia}` : undefined,
    drug.surgical ? `cerrahi %${drug.surgical}` : undefined,
  ].filter(Boolean);
  return (
    <View style={styles.row}>
      <View style={styles.iconBadge}>
        <Ionicons name="flask-outline" size={15} color={colors.primary} />
      </View>
      <View style={{ flex: 1, gap: 3 }}>
        <Text style={styles.rowTitle}>{result.title}</Text>
        <Text style={styles.rowSub}>{result.subtitle}</Text>
        {strengths.length > 0 ? (
          <Text style={styles.rowSub}>Tipik konsantrasyon · {strengths.join(" · ")}</Text>
        ) : null}
        {ceiling ? (
          <Text style={styles.rowFine}>
            Tavan {ceiling.plainMgPerKg} mg/kg (en çok {ceiling.plainMaxMg} mg)
            {ceiling.withEpiMgPerKg
              ? ` · adrenalinli ${ceiling.withEpiMgPerKg} mg/kg (en çok ${ceiling.withEpiMaxMg} mg)`
              : ""}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

const useStyles = makeStyles((colors) => ({
  groupTitle: {
    ...type.label,
    color: colors.textFaint,
    marginTop: spacing.sm,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 11,
  },
  iconBadge: {
    width: 26,
    height: 26,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primaryMuted,
  },
  rowTitle: { ...type.subheading, color: colors.text },
  rowSub: { ...type.caption, color: colors.textMuted, lineHeight: 16 },
  rowFine: { ...type.caption, color: colors.textFaint, lineHeight: 16 },
  chipLabel: { ...type.caption, color: colors.textFaint },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  chip: {
    backgroundColor: colors.primaryMuted,
    borderRadius: radius.sm,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  chipText: { ...type.caption, color: colors.primaryStrong, fontWeight: "600" },
}));
