import Ionicons from "@expo/vector-icons/Ionicons";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { DermatomeFigureCard } from "@/components/dermatome-figure";
import {
  BlockMatch,
  findBlocks,
  findPairs,
  LEVEL_PRESETS,
  PairMatch,
  SELECTABLE_LEVELS,
  sortLevels,
} from "@/data/block-finder";
import { DermatomeLevel, PosteriorLevel } from "@/data/dermatome-figure";
import { colors, elevation, numeric, radius, spacing, type } from "@/theme";

/**
 * The app's other direction: pick the territory, get the blocks.
 *
 * Segments can be chosen either by tapping the body or from the chip row. The
 * chips are not a fallback for the figure being broken — some segments are a
 * few pixels tall on a phone, and a reference tool should not require precision
 * aiming. Presets exist because the real question is almost never "L3 and L4",
 * it is "the knee".
 */
function LevelPills({ levels, tone }: { levels: string[]; tone: "ok" | "missing" | "extra" }) {
  if (levels.length === 0) return null;
  const style =
    tone === "ok" ? styles.pillOk : tone === "missing" ? styles.pillMissing : styles.pillExtra;
  const textStyle =
    tone === "ok"
      ? styles.pillOkText
      : tone === "missing"
        ? styles.pillMissingText
        : styles.pillExtraText;
  return (
    <View style={styles.pillRow}>
      {levels.map((l) => (
        <View key={l} style={[styles.pill, style]}>
          <Text style={[styles.pillText, textStyle]}>{l}</Text>
        </View>
      ))}
    </View>
  );
}

function OvershootNote({ overshoot }: { overshoot: string[] }) {
  if (overshoot.length === 0) {
    return <Text style={styles.exactNote}>Seçimin dışına taşmıyor.</Text>;
  }
  const heavy = overshoot.length >= 6;
  return (
    <View style={styles.overshootBlock}>
      <Text style={[styles.overshootLabel, heavy && styles.overshootLabelHeavy]}>
        {heavy ? "Geniş taşma" : "Taşma"} · {overshoot.length} segment
      </Text>
      <LevelPills levels={overshoot} tone="extra" />
      {heavy ? (
        <Text style={styles.overshootWarn}>
          İstenenden çok daha geniş bir alanı bloke eder. Kapsama yeterli olsa da gereğinden fazla
          motor blok, hemodinamik etki ve doz yükü getirir.
        </Text>
      ) : null}
    </View>
  );
}

function MatchCard({ match }: { match: BlockMatch }) {
  const { technique, covered, missing, overshoot, complete } = match;
  return (
    <View style={[styles.card, complete && styles.cardComplete]}>
      <View style={[styles.rail, complete ? styles.railComplete : styles.railPartial]} />
      <View style={styles.cardBody}>
        <View style={styles.cardHead}>
          <Text style={styles.blockName}>{technique.name}</Text>
          <View style={[styles.badge, complete ? styles.badgeComplete : styles.badgePartial]}>
            <Text style={[styles.badgeText, complete ? styles.badgeCompleteText : styles.badgePartialText]}>
              {complete ? "Tam kapsıyor" : `${covered.length}/${covered.length + missing.length}`}
            </Text>
          </View>
        </View>
        <Text style={styles.region}>{technique.region}</Text>

        <Text style={styles.sub}>Karşılanan</Text>
        <LevelPills levels={covered} tone="ok" />
        {missing.length > 0 ? (
          <>
            <Text style={styles.sub}>Karşılanmayan</Text>
            <LevelPills levels={missing} tone="missing" />
          </>
        ) : null}

        <OvershootNote overshoot={overshoot} />

        <Text style={styles.regimen}>
          {technique.typical.drug} %{technique.typical.concentrationPercent} ·{" "}
          <Text style={styles.regimenNum}>
            {technique.typical.volumeMlRange[0]}–{technique.typical.volumeMlRange[1]} mL
          </Text>
        </Text>
        <Text style={styles.motor}>{technique.coverage.motorEffect}</Text>
      </View>
    </View>
  );
}

function PairCard({ pair }: { pair: PairMatch }) {
  const [a, b] = pair.techniques;
  const endorsed = pair.findings.find((f) => f.severity === "complementary");
  const caution = pair.findings.find((f) => f.severity === "caution");
  return (
    <View style={[styles.card, pair.complete && styles.cardComplete]}>
      <View style={[styles.rail, pair.complete ? styles.railComplete : styles.railPartial]} />
      <View style={styles.cardBody}>
        <View style={styles.cardHead}>
          <Text style={styles.blockName}>
            {a.name} + {b.name}
          </Text>
          <View style={[styles.badge, pair.complete ? styles.badgeComplete : styles.badgePartial]}>
            <Text
              style={[
                styles.badgeText,
                pair.complete ? styles.badgeCompleteText : styles.badgePartialText,
              ]}
            >
              {pair.complete ? "Tam kapsıyor" : `%${Math.round(pair.coverage * 100)}`}
            </Text>
          </View>
        </View>

        <Text style={styles.sub}>Karşılanan</Text>
        <LevelPills levels={pair.covered} tone="ok" />
        {pair.missing.length > 0 ? (
          <>
            <Text style={styles.sub}>Karşılanmayan</Text>
            <LevelPills levels={pair.missing} tone="missing" />
          </>
        ) : null}

        <OvershootNote overshoot={pair.overshoot} />

        {endorsed ? (
          <View style={styles.findingOk}>
            <Ionicons name="checkmark-circle" size={13} color={colors.primaryStrong} />
            <Text style={styles.findingOkText}>{endorsed.title}</Text>
          </View>
        ) : null}
        {caution ? (
          <View style={styles.findingWarn}>
            <Ionicons name="alert-circle" size={13} color={colors.warning} />
            <Text style={styles.findingWarnText}>{caution.title}</Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}

export function DermatomeBlocks() {
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (level: string) =>
    setSelected((cur) =>
      cur.includes(level) ? cur.filter((l) => l !== level) : sortLevels([...cur, level])
    );

  const applyPreset = (levels: string[]) =>
    setSelected((cur) => {
      const same = cur.length === levels.length && levels.every((l) => cur.includes(l));
      return same ? [] : sortLevels(levels);
    });

  const matches = useMemo(() => findBlocks(selected), [selected]);
  const pairs = useMemo(() => findPairs(selected), [selected]);

  const complete = matches.filter((m) => m.complete);
  const partial = matches.filter((m) => !m.complete);

  /**
   * Pairs are offered unless a single block already does the job *tidily*.
   *
   * Testing this against a knee selection showed why "is there any complete
   * match" is the wrong test: spinal anaesthesia completes almost every
   * lower-body request while overshooting by seven segments, and using it as
   * proof that no combination is needed hid the adductor canal plus sciatic
   * answer entirely. A complete match only settles the question if it is also
   * close to the target.
   */
  const TIDY_OVERSHOOT = 2;
  const showPairs =
    !complete.some((m) => m.overshoot.length <= TIDY_OVERSHOOT) && pairs.length > 0;

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + spacing.xl }]}
    >
      <View style={styles.intro}>
        <Text style={styles.introText}>
          Kapsanmasını istediğiniz dermatomları şekil üzerinden veya listeden seçin; o segmentlere
          ulaşan bloklar listelensin. <Text style={styles.bold}>Taşma</Text> sütunu, bloğun istemediğiniz
          hangi segmentleri de bloke edeceğini gösterir — asıl seçim kriteri çoğu zaman budur.
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Hazır bölgeler</Text>
      <View style={styles.chipWrap}>
        {LEVEL_PRESETS.map((p) => {
          const on =
            selected.length === p.levels.length && p.levels.every((l) => selected.includes(l));
          return (
            <Pressable key={p.id} onPress={() => applyPreset(p.levels)}>
              <View style={[styles.chip, on && styles.chipOn]}>
                <Text style={[styles.chipText, on && styles.chipTextOn]}>{p.label}</Text>
              </View>
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.sectionTitle}>Segmentler</Text>
      <DermatomeFigureCard
        levels={selected as (DermatomeLevel | PosteriorLevel)[]}
        height={300}
        onLevelPress={toggle}
        caption="Şekil üzerinde bir bölgeye dokunarak seçebilirsiniz."
      />

      <View style={styles.chipWrap}>
        {SELECTABLE_LEVELS.map((l) => {
          const on = selected.includes(l);
          return (
            <Pressable key={l} onPress={() => toggle(l)}>
              <View style={[styles.levelChip, on && styles.chipOn]}>
                <Text style={[styles.levelChipText, on && styles.chipTextOn]}>{l}</Text>
              </View>
            </Pressable>
          );
        })}
      </View>

      {selected.length > 0 ? (
        <Pressable onPress={() => setSelected([])} hitSlop={8}>
          <View style={styles.clearRow}>
            <Ionicons name="close-circle-outline" size={15} color={colors.textMuted} />
            <Text style={styles.clearText}>
              Seçimi temizle ({selected.length} segment: {selected.join(", ")})
            </Text>
          </View>
        </Pressable>
      ) : (
        <Text style={styles.empty}>Sonuçları görmek için en az bir segment seçin.</Text>
      )}

      {selected.length > 0 ? (
        <>
          <Text style={styles.sectionTitle}>
            Tam kapsayan bloklar {complete.length > 0 ? `(${complete.length})` : ""}
          </Text>
          {complete.length > 0 ? (
            complete.map((m) => <MatchCard key={m.technique.id} match={m} />)
          ) : (
            <View style={styles.noneCard}>
              <Text style={styles.noneText}>
                Tek bir blok bu segmentlerin tamamını kapsamıyor. Aşağıdaki ikili kombinasyonlara veya
                kısmi kapsayan bloklara bakın.
              </Text>
            </View>
          )}

          {showPairs ? (
            <>
              <Text style={styles.sectionTitle}>İkili kombinasyonlar</Text>
              <Text style={styles.sectionNote}>
                Gereksiz tekrar veya sakıncalı olarak işaretlenen çiftler bu listeye alınmaz.
              </Text>
              {pairs.map((p) => (
                <PairCard key={p.techniques.map((t) => t.id).join("+")} pair={p} />
              ))}
            </>
          ) : null}

          {partial.length > 0 ? (
            <>
              <Text style={styles.sectionTitle}>Kısmen kapsayan bloklar</Text>
              {partial.slice(0, 8).map((m) => (
                <MatchCard key={m.technique.id} match={m} />
              ))}
            </>
          ) : null}
        </>
      ) : null}

      <Text style={styles.disclaimer}>
        Eşleşme, kataloğun blok başına yaklaşık dermatom aralıklarına dayanır. Gerçek yayılım hastadan
        hastaya, hacme ve teknik uygulamaya göre değişir; buradaki liste cerrahi endikasyonu,
        kontrendikasyonları veya hasta faktörlerini değerlendirmez.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, gap: spacing.md },
  intro: { backgroundColor: colors.chip, borderRadius: radius.md, padding: spacing.md },
  introText: { ...type.bodySm, color: colors.textMuted, lineHeight: 19 },
  bold: { fontWeight: "700", color: colors.text },
  sectionTitle: { ...type.heading, color: colors.text, marginTop: spacing.sm },
  sectionNote: { ...type.caption, color: colors.textMuted, lineHeight: 16 },
  chipWrap: { flexDirection: "row", flexWrap: "wrap", gap: 5 },
  chip: {
    backgroundColor: colors.chip,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 7,
  },
  chipOn: { backgroundColor: colors.primary },
  chipText: { fontSize: 12.5, color: colors.text },
  chipTextOn: { color: "#FFFFFF", fontWeight: "700" },
  levelChip: {
    backgroundColor: colors.chip,
    borderRadius: radius.sm,
    paddingHorizontal: 9,
    paddingVertical: 6,
    minWidth: 38,
    alignItems: "center",
  },
  levelChipText: { ...numeric, fontSize: 12, fontWeight: "700", color: colors.text },
  clearRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  clearText: { ...type.caption, color: colors.textMuted, flex: 1 },
  empty: { ...type.bodySm, color: colors.textMuted, textAlign: "center", marginTop: spacing.sm },
  card: {
    flexDirection: "row",
    alignItems: "stretch",
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
    ...elevation.card,
  },
  cardComplete: { borderColor: colors.primary },
  rail: { width: 4 },
  railComplete: { backgroundColor: colors.primary },
  railPartial: { backgroundColor: colors.borderStrong },
  cardBody: { flex: 1, padding: spacing.md, gap: 4 },
  cardHead: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  blockName: { ...type.subheading, color: colors.text, flex: 1 },
  region: { fontSize: 10.5, color: colors.textFaint, fontWeight: "600" },
  badge: { borderRadius: radius.pill, paddingHorizontal: 8, paddingVertical: 2 },
  badgeText: { fontSize: 10, fontWeight: "700" },
  badgeComplete: { backgroundColor: colors.primary },
  badgeCompleteText: { color: "#FFFFFF" },
  badgePartial: { backgroundColor: colors.surfaceAlt },
  badgePartialText: { color: colors.textMuted },
  sub: { ...type.label, fontSize: 9.5, color: colors.textFaint, marginTop: 3 },
  pillRow: { flexDirection: "row", flexWrap: "wrap", gap: 3 },
  pill: { borderRadius: radius.sm, paddingHorizontal: 6, paddingVertical: 2 },
  pillText: { ...numeric, fontSize: 10.5, fontWeight: "700" },
  pillOk: { backgroundColor: colors.primaryMuted },
  pillOkText: { color: colors.primaryStrong },
  pillMissing: { backgroundColor: colors.dangerBg },
  pillMissingText: { color: colors.danger },
  pillExtra: { backgroundColor: colors.surfaceAlt },
  pillExtraText: { color: colors.textMuted },
  overshootBlock: { gap: 3, marginTop: 4 },
  overshootLabel: { ...type.label, fontSize: 9.5, color: colors.textFaint },
  overshootLabelHeavy: { color: colors.warning },
  overshootWarn: { ...type.caption, color: colors.warning, lineHeight: 16 },
  exactNote: { ...type.caption, color: colors.primaryStrong, marginTop: 4 },
  regimen: { ...type.caption, color: colors.textMuted, marginTop: 4 },
  regimenNum: { ...numeric, fontWeight: "700", color: colors.text },
  motor: { ...type.caption, color: colors.textMuted, lineHeight: 16 },
  findingOk: { flexDirection: "row", alignItems: "center", gap: 5, marginTop: 4 },
  findingOkText: { ...type.caption, color: colors.primaryStrong, fontWeight: "700", flex: 1 },
  findingWarn: { flexDirection: "row", alignItems: "center", gap: 5, marginTop: 4 },
  findingWarnText: { ...type.caption, color: colors.warning, fontWeight: "700", flex: 1 },
  noneCard: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  noneText: { ...type.bodySm, color: colors.textMuted, lineHeight: 18 },
  disclaimer: {
    fontSize: 11,
    color: colors.textMuted,
    fontStyle: "italic",
    lineHeight: 16,
    marginTop: spacing.sm,
  },
});
