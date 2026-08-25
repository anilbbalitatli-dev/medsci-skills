import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  CATEGORY_LABELS,
  CONFLICTS,
  GAPS,
  INFUSION_CONCENTRATION_NOTE,
  PEDIATRIC_INFUSION,
  PEDIATRIC_SINGLE_SHOT,
  SPINAL_BUPIVACAINE_BY_WEIGHT,
  SPINAL_BUPIVACAINE_SOURCE,
  BlockCategory,
} from "@/data/pediatric-dosing";
import { colors, elevation, numeric, radius, spacing, type } from "@/theme";

/**
 * The paediatric guideline tables, reproduced rather than summarised.
 *
 * The combination builder only needs the single-shot ceilings, so the infusion
 * figures would otherwise have nowhere to live — and a clinician running a
 * catheter who cannot find them here will find them somewhere worse. The
 * conflicts and the gaps get equal billing with the numbers: a table that shows
 * only what the guidelines agree on reads as more settled than the field is.
 */
const CATEGORY_ORDER: BlockCategory[] = [
  "caudal",
  "epidural",
  "spinal",
  "psb-upper",
  "psb-lower",
  "fascial-plane",
];

function formatRange(low: number | undefined, high: number): string {
  return low !== undefined ? `${low}–${high}` : `${high}`;
}

export function PediatricDosing() {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + spacing.xl }]}
    >
      <View style={styles.intro}>
        <Text style={styles.introText}>
          Pediatrik lokal anestezik sınırları <Text style={styles.bold}>ilaç başına değil, blok tipi
          başına</Text> verilir. Ropivakain kaudalde 2, epiduralde 1.7, intratekalde 0.5, fasyal planda
          0.75 mg/kg'dır — tek bir ilaç için dört ayrı sayı. Aşağıdaki tablolar kılavuz metnindeki
          değerleri olduğu gibi aktarır.
        </Text>
      </View>

      {/* ---- Tek doz ---- */}
      <Text style={styles.sectionTitle}>Tek doz (single shot)</Text>
      {CATEGORY_ORDER.map((cat) => {
        const rows = PEDIATRIC_SINGLE_SHOT.filter((l) => l.category === cat);
        if (rows.length === 0) return null;
        return (
          <View key={cat} style={styles.card}>
            <Text style={styles.cardTitle}>{CATEGORY_LABELS[cat]}</Text>
            {rows.map((l) => (
              <View key={`${l.category}-${l.drug}`} style={styles.row}>
                <Text style={styles.drug}>{l.drug}</Text>
                <Text style={styles.value}>
                  {formatRange(l.mgPerKgLow, l.mgPerKg)} <Text style={styles.unit}>mg/kg</Text>
                </Text>
              </View>
            ))}
            {rows.map((l) =>
              l.note ? (
                <Text key={`${l.drug}-note`} style={styles.note}>
                  {l.drug}: {l.note}
                </Text>
              ) : null
            )}
            <Text style={styles.source}>{rows[0].source}</Text>
          </View>
        );
      })}

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Spinal bupivakain %0.5 — ağırlığa göre</Text>
        {SPINAL_BUPIVACAINE_BY_WEIGHT.map((b) => (
          <View key={b.label} style={styles.row}>
            <Text style={styles.drug}>{b.label}</Text>
            <Text style={styles.value}>
              {b.mgPerKg} <Text style={styles.unit}>mg/kg</Text>
            </Text>
          </View>
        ))}
        <Text style={styles.source}>{SPINAL_BUPIVACAINE_SOURCE}</Text>
        <Text style={styles.note}>
          Bu tablo iki kılavuzda da aynıdır — pediatrik dozlamada nadir görülen tam mutabakat.
        </Text>
      </View>

      {/* ---- İnfüzyon ---- */}
      <Text style={styles.sectionTitle}>Sürekli infüzyon</Text>
      <Text style={styles.sectionNote}>
        Bu uygulamanın kombinasyon hesabı yalnızca tek doz içindir; aşağıdaki değerler hesaba
        katılmaz, referans olarak verilir.
      </Text>
      {(["epidural", "perineural"] as const).map((route) => (
        <View key={route} style={styles.card}>
          <Text style={styles.cardTitle}>
            {route === "epidural" ? "Epidural" : "Perinöral (periferik kateter)"}
          </Text>
          {PEDIATRIC_INFUSION.filter((i) => i.route === route).map((i, idx) => (
            <View key={`${i.drug}-${i.ageLabel}-${idx}`} style={styles.infusionRow}>
              <View style={styles.infusionHead}>
                <Text style={styles.drug}>{i.drug}</Text>
                <Text style={styles.value}>
                  {i.mgPerKgPerHour} <Text style={styles.unit}>mg/kg/sa</Text>
                </Text>
              </View>
              <Text style={styles.ageLabel}>{i.ageLabel}</Text>
              <Text style={styles.source}>{i.source}</Text>
            </View>
          ))}
        </View>
      ))}
      <View style={styles.card}>
        <Text style={styles.note}>{INFUSION_CONCENTRATION_NOTE}</Text>
      </View>

      {/* ---- Çelişkiler ---- */}
      <Text style={styles.sectionTitle}>İki kılavuzun ayrıldığı noktalar</Text>
      <View style={styles.card}>
        <Text style={styles.sectionNote}>
          Bunlar çözülmeden gösterilir. Birini sessizce seçmek, açık olan bir soruyu kapalı
          göstermek olurdu.
        </Text>
        {CONFLICTS.map((c) => (
          <View key={c.topic} style={styles.conflict}>
            <Text style={styles.conflictTopic}>{c.topic}</Text>
            <View style={styles.conflictSide}>
              <Text style={styles.conflictTag}>ESRA/ASRA</Text>
              <Text style={styles.conflictText}>{c.a}</Text>
            </View>
            <View style={styles.conflictSide}>
              <Text style={styles.conflictTag}>SFAR/ADARPEF</Text>
              <Text style={styles.conflictText}>{c.b}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* ---- Boşluklar ---- */}
      <Text style={styles.sectionTitle}>Kılavuzların cevaplamadığı sorular</Text>
      {GAPS.map((g) => (
        <View key={g.topic} style={styles.gapCard}>
          <Text style={styles.gapTopic}>{g.topic}</Text>
          <Text style={styles.gapText}>{g.detail}</Text>
        </View>
      ))}

      {/* ---- Kaynaklar ---- */}
      <Text style={styles.sectionTitle}>Kaynaklar</Text>
      <View style={styles.card}>
        <Text style={styles.ref}>
          <Text style={styles.bold}>ESRA/ASRA 2018.</Text> Suresh S, Ecoffey C, Bosenberg A, Lonnqvist
          PA, de Oliveira GS Jr, de Leon Casasola O, de Andrés J, Ivani G. ESRA/ASRA Recommendations
          on Local Anesthetics and Adjuvants Dosage in Pediatric Regional Anesthesia. Reg Anesth Pain
          Med. 2018;43(2):211-216. doi:10.1097/AAP.0000000000000702
        </Text>
        <Text style={styles.ref}>
          <Text style={styles.bold}>SFAR/ADARPEF.</Text> Recommandations Formalisées d'Experts —
          Anesthésie loco-régionale en pédiatrie, Soru 1, bölüm 1-4. Elde edilen PDF'te yayın yılı ve
          sayfa numarası yer almadığı için atıflar bölüm numarasıyla verilmiştir; metnin dayandığı
          literatür 2008–2009'dur.
        </Text>
        <Text style={styles.ref}>
          <Text style={styles.bold}>Bilinen itiraz.</Text> Tsui BCH, Boretsky K, Berde C. Maximum
          Recommended Dosage of Ropivacaine and Bupivacaine for Pediatric Regional Anesthesia. Reg
          Anesth Pain Med. 2018;43(8):895-896 (PMID 30339619) — ESRA/ASRA maksimumlarına itiraz eden
          yayımlanmış bir mektuptur. Tam metni okunmamıştır ve buradaki hiçbir sayı ondan gelmez.
        </Text>
      </View>

      <Text style={styles.disclaimer}>
        Tablolar kılavuz metninden aktarılmıştır ancak bu uygulama bir klinik karar aracı değildir.
        Gerçek hastada kurum protokolü, güncel kılavuz metni ve ilaç prospektüsü esastır.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, gap: spacing.md },
  intro: { backgroundColor: colors.primaryMuted, borderRadius: radius.md, padding: spacing.md },
  introText: { ...type.bodySm, color: colors.primaryStrong, lineHeight: 19 },
  bold: { fontWeight: "700" },
  sectionTitle: { ...type.heading, color: colors.text, marginTop: spacing.sm },
  sectionNote: { ...type.caption, color: colors.textMuted, lineHeight: 17 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: 6,
    ...elevation.card,
  },
  cardTitle: { ...type.subheading, color: colors.text },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    gap: spacing.sm,
  },
  drug: { ...type.bodySm, color: colors.text, flex: 1 },
  value: { ...type.subheading, ...numeric, color: colors.primary },
  unit: { ...type.caption, fontWeight: "400", color: colors.textMuted },
  infusionRow: { gap: 1, paddingTop: 6, borderTopWidth: 1, borderTopColor: colors.border },
  infusionHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    gap: spacing.sm,
  },
  ageLabel: { ...type.caption, color: colors.textMuted, fontWeight: "700" },
  note: { ...type.caption, color: colors.textMuted, lineHeight: 16 },
  source: { fontSize: 10, color: colors.textFaint, fontStyle: "italic", lineHeight: 14 },
  conflict: { gap: 3, paddingTop: spacing.sm, borderTopWidth: 1, borderTopColor: colors.border },
  conflictTopic: { ...type.subheading, color: colors.text },
  conflictSide: { flexDirection: "row", gap: spacing.sm, alignItems: "flex-start" },
  conflictTag: {
    fontSize: 9.5,
    fontWeight: "800",
    color: colors.textFaint,
    width: 86,
    paddingTop: 2,
  },
  conflictText: { ...type.caption, color: colors.textMuted, flex: 1, lineHeight: 16 },
  gapCard: {
    backgroundColor: colors.warningBg,
    borderColor: colors.warningBorder,
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: 3,
  },
  gapTopic: { ...type.subheading, color: colors.warning },
  gapText: { ...type.caption, color: colors.warning, lineHeight: 17 },
  ref: { fontSize: 11, color: colors.textMuted, lineHeight: 16 },
  disclaimer: {
    fontSize: 11,
    color: colors.textMuted,
    fontStyle: "italic",
    lineHeight: 16,
    marginTop: spacing.sm,
  },
});
