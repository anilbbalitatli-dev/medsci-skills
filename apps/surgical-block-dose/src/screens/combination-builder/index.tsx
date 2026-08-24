import Ionicons from "@expo/vector-icons/Ionicons";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { CombinationFindings } from "@/components/combination-findings";
import { DermatomeFigureCard } from "@/components/dermatome-figure";
import { DoseMeter, DoseMeterRow } from "@/components/dose-meter";
import { NerveCoverageList } from "@/components/nerve-coverage";
import {
  AGE_BANDS,
  AgeBand,
  computeCombinationDose,
  maxTotalVolumeMl,
  SelectedBlockDose,
} from "@/data/age-dosing";
import { analyzeCombination } from "@/data/combination-analysis";
import { DermatomeLevel, PosteriorLevel } from "@/data/dermatome-figure";
import { TECHNIQUE_NERVES } from "@/data/technique-nerves";
import { TECHNIQUE_REGIONS, TECHNIQUES, Technique } from "@/data/techniques";
import { colors, elevation, numeric, radius, spacing, type } from "@/theme";

const MAX_SELECTION = 3;

/**
 * Head-to-toe ordering for the dermatome attribution list, so segments read in
 * anatomical sequence rather than the order the nerves happen to be stored in.
 */
const LEVEL_ORDER: string[] = [
  ...Array.from({ length: 7 }, (_, i) => `C${i + 2}`),
  ...Array.from({ length: 12 }, (_, i) => `T${i + 1}`),
  ...Array.from({ length: 5 }, (_, i) => `L${i + 1}`),
  ...Array.from({ length: 5 }, (_, i) => `S${i + 1}`),
];

/**
 * Concentrations actually used in paediatric practice, so the "how many mL do
 * I get" figure is quoted against a solution that exists on the shelf.
 */
const PED_VOLUME_REFERENCE = [
  { drug: "Ropivakain", conc: 0.2 },
  { drug: "Bupivakain", conc: 0.25 },
  { drug: "Levobupivakain", conc: 0.25 },
  { drug: "Lidokain", conc: 1 },
] as const;

function VerdictBanner({
  verdict,
  low,
  high,
}: {
  verdict: "ok" | "caution" | "exceeds";
  low: number;
  high: number;
}) {
  const style =
    verdict === "exceeds" ? styles.verdictBad : verdict === "caution" ? styles.verdictWarn : styles.verdictOk;
  const textStyle =
    verdict === "exceeds"
      ? styles.verdictBadText
      : verdict === "caution"
        ? styles.verdictWarnText
        : styles.verdictOkText;
  const title =
    verdict === "exceeds"
      ? "Toplam doz sınırı AŞIYOR"
      : verdict === "caution"
        ? "Sınıra yakın"
        : "Toplam doz sınır içinde";
  const body =
    verdict === "exceeds"
      ? "Seçilen bloklar tipik erişkin hacimleriyle uygulanırsa maksimum doz aşılır. Hacimleri azaltın, konsantrasyonu düşürün veya blok sayısını azaltın."
      : verdict === "caution"
        ? "Doz bütçesinin büyük kısmı kullanılıyor. Ek infiltrasyon veya cerrahi lokal anestezik için pay kalmayabilir."
        : "Tipik hacimlerle toplam doz, yaşa göre düzeltilmiş sınırın altında kalıyor.";

  return (
    <View style={[styles.verdict, style]}>
      <Text style={[styles.verdictTitle, textStyle]}>{title}</Text>
      <Text style={[styles.verdictBody, textStyle]}>{body}</Text>
      <Text style={[styles.verdictBody, textStyle, styles.verdictMath]}>
        Toplam kullanım: sınırın %{Math.round(low * 100)}–{Math.round(high * 100)}'i
      </Text>
      <View style={styles.verdictMeter}>
        <DoseMeter fractionLow={low} fractionHigh={high} />
      </View>
    </View>
  );
}

export function CombinationBuilder() {
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState<string[]>([]);
  const [weightInput, setWeightInput] = useState("");
  const [bandId, setBandId] = useState("adolescent-adult");
  const [withEpi, setWithEpi] = useState(false);

  const band: AgeBand = AGE_BANDS.find((b) => b.id === bandId) ?? AGE_BANDS[4];
  const weightKg = Number(weightInput.replace(",", "."));
  const hasWeight = weightInput.length > 0 && Number.isFinite(weightKg) && weightKg > 0;

  const chosen: Technique[] = useMemo(
    () => selected.map((id) => TECHNIQUES.find((t) => t.id === id)).filter((t): t is Technique => Boolean(t)),
    [selected]
  );

  const toggle = (id: string) => {
    setSelected((cur) =>
      cur.includes(id) ? cur.filter((x) => x !== id) : cur.length >= MAX_SELECTION ? cur : [...cur, id]
    );
  };

  const doseInput: SelectedBlockDose[] = chosen.map((t) => {
    const sides = t.bilateralByDefault ? 2 : 1;
    return {
      drug: t.typical.drug,
      concentrationPercent: t.typical.concentrationPercent,
      volumeMlLow: t.typical.volumeMlRange[0] * sides,
      volumeMlHigh: t.typical.volumeMlRange[1] * sides,
    };
  });

  const dose = hasWeight ? computeCombinationDose(doseInput, weightKg, band, withEpi) : null;

  const analysis = useMemo(() => analyzeCombination(selected), [selected]);

  /**
   * Segments come from both sources on purpose. The curated per-technique
   * coverage is quoted as a level range and stays authoritative for the figure;
   * the nerve graph adds segments that belong to individual branches. Using
   * only the nerve graph would narrow plane blocks incorrectly, since their
   * generic thoracic target carries no level of its own.
   */
  const levels = useMemo(() => {
    const set = new Set<string>();
    for (const t of chosen) for (const l of t.coverage.levels ?? []) set.add(l);
    for (const c of analysis.coverage) for (const l of c.nerve.levels ?? []) set.add(l);
    return Array.from(set) as (DermatomeLevel | PosteriorLevel)[];
  }, [chosen, analysis]);

  /**
   * Dose-related caveats from the catalogue, plus the anatomical caveats from
   * the nerve map — what a technique reaches, and what it pointedly does not.
   */
  const techniqueNotes = useMemo(
    () =>
      chosen
        .map((t) => ({
          id: t.id,
          name: t.name,
          notes: [t.note, TECHNIQUE_NERVES[t.id]?.note].filter((n): n is string => Boolean(n)),
        }))
        .filter((entry) => entry.notes.length > 0),
    [chosen]
  );

  /** Motor and mixed nerves in the closure — what will actually stop working. */
  const motorNerves = useMemo(
    () => analysis.coverage.filter((c) => Boolean(c.nerve.motor)),
    [analysis]
  );

  /** Which nerve accounts for each highlighted segment. */
  const levelAttribution = useMemo(() => {
    const map = new Map<string, string[]>();
    for (const c of analysis.coverage) {
      for (const level of c.nerve.levels ?? []) {
        const names = map.get(level) ?? [];
        if (!names.includes(c.nerve.name)) names.push(c.nerve.name);
        map.set(level, names);
      }
    }
    return Array.from(map.entries()).sort(
      (a, b) => LEVEL_ORDER.indexOf(a[0]) - LEVEL_ORDER.indexOf(b[0])
    );
  }, [analysis]);

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + spacing.xl }]}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.intro}>
        <Text style={styles.introText}>
          İstediğiniz 2–3 bloğu seçin; hangi sinirlerin tek tek kapsandığı, blokların birbirini tekrar
          edip etmediği, toplam lokal anestezik yükü ve beklenen motor etkiler birlikte hesaplansın.
          Bir bloğun sinirleri diğerinin içinde kalıyorsa{" "}
          <Text style={styles.bold}>kapsama genişlemez, yalnızca doz artar</Text>.
        </Text>
      </View>

      {/* ---- Hasta ---- */}
      <Text style={styles.sectionTitle}>1. Hasta</Text>
      <View style={styles.card}>
        <TextInput
          value={weightInput}
          onChangeText={setWeightInput}
          placeholder="Ağırlık (kg)"
          placeholderTextColor={colors.textMuted}
          keyboardType="decimal-pad"
          style={styles.input}
        />
        <Text style={styles.fieldLabel}>Yaş grubu</Text>
        <View style={styles.chipWrap}>
          {AGE_BANDS.map((b) => {
            const on = b.id === bandId;
            return (
              <Pressable
                key={b.id}
                onPress={() => setBandId(b.id)}
                style={[styles.chip, on && styles.chipOn]}
              >
                <Text style={[styles.chipText, on && styles.chipTextOn]}>{b.label}</Text>
              </Pressable>
            );
          })}
        </View>
        <Text style={styles.rationale}>{band.rationale}</Text>
        {band.modifier !== 1 ? (
          <Text style={styles.modifierNote}>
            Bu yaş grubunda mg/kg sınırı ×{band.modifier} uygulanır.
          </Text>
        ) : null}

        <Pressable onPress={() => setWithEpi((v) => !v)} style={styles.toggleRow}>
          <Ionicons
            name={withEpi ? "checkbox" : "square-outline"}
            size={20}
            color={withEpi ? colors.primary : colors.textMuted}
          />
          <Text style={styles.toggleText}>Solüsyon epinefrin içeriyor</Text>
        </Pressable>
      </View>

      {/* ---- Blok seçimi ---- */}
      <Text style={styles.sectionTitle}>
        2. Bloklar ({selected.length}/{MAX_SELECTION})
      </Text>
      {TECHNIQUE_REGIONS.map((region) => (
        <View key={region} style={styles.regionBlock}>
          <Text style={styles.regionTitle}>{region}</Text>
          <View style={styles.chipWrap}>
            {TECHNIQUES.filter((t) => t.region === region).map((t) => {
              const on = selected.includes(t.id);
              const full = !on && selected.length >= MAX_SELECTION;
              return (
                <Pressable
                  key={t.id}
                  onPress={() => toggle(t.id)}
                  disabled={full}
                  style={[styles.chip, on && styles.chipOn, full && styles.chipDisabled]}
                >
                  <Text style={[styles.chipText, on && styles.chipTextOn, full && styles.chipTextDisabled]}>
                    {t.name}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      ))}

      {chosen.length === 0 ? (
        <Text style={styles.empty}>Hesaplamayı görmek için en az bir blok seçin.</Text>
      ) : null}

      {/* ---- Sonuç ---- */}
      {chosen.length > 0 ? (
        <>
          {/* Verdicts come before the arithmetic: finding out that a block is
              redundant should change the selection, and there is no point
              costing a combination you are about to alter. */}
          <Text style={styles.sectionTitle}>3. Kombinasyon Değerlendirmesi</Text>
          <CombinationFindings findings={analysis.findings} />

          <Text style={styles.sectionTitle}>4. Toplam Doz</Text>

          {!hasWeight ? (
            <View style={styles.card}>
              <Text style={styles.hint}>Doz hesabı için ağırlık girin.</Text>
            </View>
          ) : null}

          {dose ? (
            <>
              <VerdictBanner
                verdict={dose.verdict}
                low={dose.totalFractionLow}
                high={dose.totalFractionHigh}
              />

              <View style={styles.card}>
                {chosen.map((t) => {
                  const sides = t.bilateralByDefault ? 2 : 1;
                  const mgPerMl = t.typical.concentrationPercent * 10;
                  const lo = t.typical.volumeMlRange[0] * sides * mgPerMl;
                  const hi = t.typical.volumeMlRange[1] * sides * mgPerMl;
                  return (
                    <View key={t.id} style={styles.row}>
                      <Text style={styles.rowName}>
                        {t.name}
                        {sides === 2 ? " (iki taraflı)" : ""}
                      </Text>
                      <Text style={styles.rowDose}>
                        {t.typical.drug} %{t.typical.concentrationPercent} ·{" "}
                        {t.typical.volumeMlRange[0] * sides}–{t.typical.volumeMlRange[1] * sides} mL ·{" "}
                        ≈{Math.round(lo)}–{Math.round(hi)} mg
                      </Text>
                    </View>
                  );
                })}
              </View>

              <View style={styles.card}>
                <Text style={styles.cardTitle}>İlaç bazında yük</Text>
                {dose.loads.map((l) => (
                  <DoseMeterRow
                    key={l.drug}
                    label={l.maxDose.drug}
                    detail={`≈${Math.round(l.mgLow)}–${Math.round(l.mgHigh)} mg  ·  sınır ${Math.round(l.ceiling)} mg`}
                    fractionLow={l.fractionLow}
                    fractionHigh={l.fractionHigh}
                  />
                ))}
                {dose.loads.length > 1 ? (
                  <Text style={styles.additiveNote}>
                    Farklı lokal anestezikler karıştırıldığında toksisite toplanır: her ilacın kendi
                    sınırına oranı toplanarak değerlendirilir, ayrı ayrı değil.
                  </Text>
                ) : null}
                {dose.unknownDrugs.length > 0 ? (
                  <Text style={styles.unknownNote}>
                    Sınır tanımlı olmayan ilaç(lar): {dose.unknownDrugs.join(", ")} — bunlar toplama dahil
                    edilmedi, ayrıca değerlendirin.
                  </Text>
                ) : null}
              </View>

              {band.pediatric ? (
                <View style={styles.pedCard}>
                  <Text style={styles.pedTitle}>Pediatrik uyarı</Text>
                  <Text style={styles.pedBody}>
                    Yukarıdaki hacimler <Text style={styles.bold}>erişkin</Text> değerleridir ve çocukta
                    doğrudan kullanılamaz; pediatrik hacimler mL/kg üzerinden ölçeklenir. Bu ağırlıkta
                    kullanılabilecek toplam hacim sınırı:
                  </Text>
                  {PED_VOLUME_REFERENCE.map(({ drug: d, conc }) => {
                    const v = maxTotalVolumeMl(d, conc, weightKg, band, withEpi);
                    if (v === null) return null;
                    return (
                      <Text key={d} style={styles.pedRow}>
                        • {d} %{conc}: en fazla ≈{v.toFixed(1)} mL (tüm bloklar toplamı)
                      </Text>
                    );
                  })}
                </View>
              ) : null}
            </>
          ) : null}

          {/* ---- Kapsama ---- */}
          <Text style={styles.sectionTitle}>5. Sinir Sinir Kapsama</Text>
          <NerveCoverageList coverage={analysis.coverage} />

          <Text style={styles.sectionTitle}>6. Dermatom Kapsaması</Text>
          {levels.length > 0 ? (
            <>
              <DermatomeFigureCard
                levels={levels}
                height={300}
                caption={`Birleşik dermatom kapsaması: ${levels.join(", ")}`}
              />
              {levelAttribution.length > 0 ? (
                <View style={styles.card}>
                  <Text style={styles.cardTitle}>Hangi segment hangi sinirden</Text>
                  {levelAttribution.map(([level, names]) => (
                    <View key={level} style={styles.attrRow}>
                      <Text style={styles.attrLevel}>{level}</Text>
                      <Text style={styles.attrNames}>{names.join(", ")}</Text>
                    </View>
                  ))}
                  <Text style={styles.additiveNote}>
                    Şekildeki bazı segmentler, tek tek dermatom düzeyi tanımlanmayan plan bloklarından
                    gelir; bunlar yukarıdaki listede yer almaz.
                  </Text>
                </View>
              ) : null}
            </>
          ) : (
            <View style={styles.card}>
              <Text style={styles.hint}>
                Seçilen blokların hiçbiri segmental dermatom kapsamı tanımlamıyor (yalnızca lokal
                infiltrasyon).
              </Text>
            </View>
          )}

          <Text style={styles.sectionTitle}>7. Beklenen Motor Etkiler</Text>
          <View style={styles.card}>
            {/* Named motor nerves first — this is the precise answer to "what
                will stop working". The per-technique prose stays underneath
                because it carries the degree, which a nerve list cannot. */}
            {motorNerves.length > 0 ? (
              <>
                <Text style={styles.cardTitle}>Etkilenen motor sinirler</Text>
                {motorNerves.map((c) => (
                  <View key={c.nerve.id} style={styles.row}>
                    <Text style={styles.rowName}>
                      {c.nerve.name}
                      {c.status === "partial" ? " (kısmi)" : ""}
                    </Text>
                    <Text style={styles.rowDose}>{c.nerve.motor}</Text>
                  </View>
                ))}
              </>
            ) : (
              <Text style={styles.hint}>
                Seçilen bloklar adlandırılmış bir motor siniri hedeflemiyor; belirgin kas gücü kaybı
                beklenmez.
              </Text>
            )}

            <Text style={[styles.cardTitle, styles.blockTitleSpacing]}>Blok bazında beklenen etki</Text>
            {chosen.map((t) => (
              <View key={t.id} style={styles.row}>
                <Text style={styles.rowName}>{t.name}</Text>
                <Text style={styles.rowDose}>{t.coverage.motorEffect}</Text>
              </View>
            ))}
            <Text style={styles.additiveNote}>
              Motor etkiler birbirini tamamlar: kuadriseps zayıflatan bir bloğa ayak bileği motor bloğu
              eklenirse hasta hiç yük veremez. Mobilizasyon ve düşme riski planlanırken hepsi birlikte
              değerlendirilmelidir.
            </Text>
          </View>

          {techniqueNotes.length > 0 ? (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Teknik notları</Text>
              {techniqueNotes.map(({ id, name, notes }) =>
                notes.map((note, i) => (
                  <Text key={`${id}-${i}`} style={styles.noteRow}>
                    • <Text style={styles.bold}>{name}:</Text> {note}
                  </Text>
                ))
              )}
            </View>
          ) : null}
        </>
      ) : null}

      <Text style={styles.disclaimer}>
        Hesaplama, kataloğdaki tipik erişkin rejimleri ve genel mg/kg sınırları üzerinden yapılır. Yaş
        düzeltmeleri ihtiyatlı öğretim değerleridir, doğrulanmış bir formül değildir. Gerçek hastada
        kurum protokolü, prospektüs ve klinik değerlendirme esastır.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, gap: spacing.md },
  intro: { backgroundColor: colors.chip, borderRadius: 12, padding: spacing.md },
  introText: { fontSize: 13, color: colors.textMuted, lineHeight: 19 },
  bold: { fontWeight: "700", color: colors.text },
  sectionTitle: { fontSize: 15, fontWeight: "700", color: colors.text, marginTop: spacing.sm },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.sm,
  },
  cardTitle: { fontSize: 13.5, fontWeight: "700", color: colors.text },
  input: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: spacing.md,
    paddingVertical: 9,
    fontSize: 15,
    color: colors.text,
  },
  fieldLabel: { fontSize: 12, fontWeight: "700", color: colors.textMuted },
  chipWrap: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  chip: {
    backgroundColor: colors.chip,
    borderRadius: 999,
    paddingHorizontal: spacing.md,
    paddingVertical: 7,
  },
  chipOn: { backgroundColor: colors.primary },
  chipDisabled: { opacity: 0.4 },
  chipText: { fontSize: 12.5, color: colors.text },
  chipTextOn: { color: "#FFFFFF", fontWeight: "700" },
  chipTextDisabled: { color: colors.textMuted },
  rationale: { fontSize: 11.5, color: colors.textMuted, lineHeight: 17 },
  modifierNote: { fontSize: 12, fontWeight: "700", color: colors.warning },
  toggleRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm, marginTop: 2 },
  toggleText: { fontSize: 13, color: colors.text },
  regionBlock: { gap: 6 },
  regionTitle: {
    fontSize: 11.5,
    fontWeight: "700",
    color: colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  empty: { fontSize: 13, color: colors.textMuted, textAlign: "center", marginTop: spacing.sm },
  hint: { fontSize: 13, color: colors.textMuted },
  verdict: { borderRadius: 12, borderWidth: 1, padding: spacing.md, gap: 3 },
  verdictOk: { backgroundColor: colors.primaryMuted, borderColor: colors.primary },
  verdictWarn: { backgroundColor: colors.warningBg, borderColor: colors.warningBorder },
  verdictBad: { backgroundColor: colors.dangerBg, borderColor: colors.danger },
  verdictTitle: { fontSize: 14, fontWeight: "800" },
  verdictBody: { fontSize: 12.5, lineHeight: 18 },
  verdictMath: { fontWeight: "700", marginTop: 2 },
  verdictOkText: { color: colors.primary },
  verdictWarnText: { color: colors.warning },
  verdictBadText: { color: colors.danger },
  row: { gap: 3 },
  rowName: { fontSize: 13, fontWeight: "600", color: colors.text },
  rowDose: { fontSize: 12, color: colors.textMuted, lineHeight: 17 },
  blockTitleSpacing: { marginTop: spacing.sm },
  attrRow: { flexDirection: "row", alignItems: "baseline", gap: spacing.sm },
  attrLevel: {
    ...type.caption,
    ...numeric,
    fontWeight: "800",
    color: colors.primary,
    width: 34,
  },
  attrNames: { ...type.caption, color: colors.textMuted, flex: 1, lineHeight: 17 },
  verdictMeter: { marginTop: spacing.sm },
  additiveNote: { fontSize: 11.5, color: colors.textMuted, fontStyle: "italic", lineHeight: 17 },
  unknownNote: { fontSize: 11.5, color: colors.warning, lineHeight: 17 },
  pedCard: {
    backgroundColor: colors.warningBg,
    borderColor: colors.warningBorder,
    borderWidth: 1,
    borderRadius: 12,
    padding: spacing.md,
    gap: 4,
  },
  pedTitle: { fontSize: 13.5, fontWeight: "800", color: colors.warning },
  pedBody: { fontSize: 12.5, color: colors.warning, lineHeight: 18 },
  pedRow: { fontSize: 12.5, color: colors.warning, fontWeight: "600" },
  noteRow: { fontSize: 12, color: colors.textMuted, lineHeight: 17 },
  disclaimer: {
    fontSize: 11,
    color: colors.textMuted,
    fontStyle: "italic",
    lineHeight: 16,
    marginTop: spacing.sm,
  },
});
