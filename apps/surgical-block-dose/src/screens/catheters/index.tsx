import Ionicons from "@expo/vector-icons/Ionicons";
import { Link } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { DisclaimerBanner } from "@/components/disclaimer-banner";
import { PatientBar } from "@/components/patient-bar";
import {
  ACCUMULATION_NOTE,
  ACCUMULATION_SOURCE,
  CATHETER_REGIMENS,
  CATHETER_ROUTES,
  CatheterRegimen,
  CONCENTRATION_EVIDENCE,
  DOSE_REDUCTION_NOTE,
  INFUSION_CONCENTRATION_RATIONALE,
  NO_ADULT_CEILING_NOTE,
  NO_ADULT_CEILING_SOURCE,
  PEDIATRIC_INFUSION_REDIRECT,
  Source,
  allSources,
  infusionLoad,
} from "@/data/infusion";
import { techniqueById } from "@/data/techniques";
import { makeStyles, numeric, radius, spacing, type, useColors, useContentStyle } from "@/theme";
import { usePatient } from "@/utils/patient";

/**
 * Kateterler tek ekranda.
 *
 * Blok kartındaki panel "bu bloğa kateter konur mu" sorusunu yanıtlıyor;
 * burada sorulan tersi: "kateter koyacağım, hangi bloğa?".
 *
 * Ekranın bir önceki hâlinde "erişkin sürekli infüzyon üst sınırları" diye
 * kaynaksız bir tablo ve ona göre yüzde veren bir hesaplayıcı vardı. İkisi de
 * kaldırıldı: maksimum doz literatürü, kesin mg/kg sayıları vermenin bilimsel
 * gerekçesi olmadığını söylüyor. Hesaplayıcı artık yalnızca mL/sa'i mg'a
 * çeviriyor — bu aritmetiktir, iddia değil.
 */
export function Catheters() {
  const colors = useColors();
  const styles = useStyles();
  const insets = useSafeAreaInsets();
  const content = useContentStyle();
  const [patient] = usePatient();

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={[styles.content, content, { paddingBottom: insets.bottom + spacing.xl }]}
    >
      <DisclaimerBanner />

      <Text style={styles.intro}>
        Aşağıdaki rejimlerin her biri yayımlanmış bir çalışmadan gelir ve kaynağı kartın
        altında yazar. Kaynağı bulunamayan bloklar bu listeden çıkarıldı; bir blok burada
        yoksa ona kateter konmaz demek değil, gösterebileceğimiz yayımlanmış bir rejim yok
        demektir.
      </Text>
      <Text style={styles.rationale}>{INFUSION_CONCENTRATION_RATIONALE}</Text>

      <PatientBar />

      {CATHETER_ROUTES.map((route) => {
        const rows = CATHETER_REGIMENS.filter((r) => r.route === route.id);
        if (rows.length === 0) return null;
        return (
          <View key={route.id} style={styles.section}>
            <Text style={styles.sectionTitle} accessibilityRole="header">
              {route.label}
            </Text>
            {rows.map((r) => (
              <RegimenCard key={r.techniqueId} regimen={r} />
            ))}
          </View>
        );
      })}

      <Text style={styles.sectionTitle} accessibilityRole="header">
        İnfüzyon hızı → mg
      </Text>
      <InfusionCalculator />

      <Text style={styles.sectionTitle} accessibilityRole="header">
        Konsantrasyon mu, hacim mi, toplam doz mu?
      </Text>
      <View style={styles.evidenceCard}>
        {CONCENTRATION_EVIDENCE.map((e) => (
          <View key={e.claim} style={styles.evidenceRow}>
            <Text style={styles.evidenceClaim}>{e.claim}</Text>
            {e.sources.map((s) => (
              <SourceLine key={s.doi} source={s} />
            ))}
          </View>
        ))}
      </View>

      {/* Uydurma tavan tablosunun yerini, tavanın neden olmadığını söyleyen
          kaynak aldı. Boş bırakmak, kullanıcının başka yerden bir sayı
          uydurmasına davetiye olurdu. */}
      <View style={styles.limitCard}>
        <Text style={styles.limitTitle}>Erişkinde mg/kg/saat tavanı</Text>
        <Text style={styles.limitBody}>{NO_ADULT_CEILING_NOTE}</Text>
        <SourceLine source={NO_ADULT_CEILING_SOURCE} />
        <Text style={styles.limitBody}>{DOSE_REDUCTION_NOTE}</Text>
        <SourceLine source={NO_ADULT_CEILING_SOURCE} />
        {patient.band.pediatric ? (
          <View style={styles.pedRedirect}>
            <Ionicons name="alert-circle-outline" size={14} color={colors.warning} />
            <Text style={styles.pedRedirectText}>{PEDIATRIC_INFUSION_REDIRECT}</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.limitCard}>
        <Text style={styles.limitTitle}>Birikim</Text>
        <Text style={styles.limitBody}>{ACCUMULATION_NOTE}</Text>
        <SourceLine source={ACCUMULATION_SOURCE} />
      </View>

      <SourceList />
    </ScrollView>
  );
}

function SourceLine({ source }: { source: Source }) {
  const styles = useStyles();
  return (
    <Text style={styles.source}>
      {source.citation} · doi:{source.doi}
    </Text>
  );
}

/** Ekrandaki bütün kaynaklar tek yerde; PubMed üzerinden doğrulanmıştır. */
function SourceList() {
  const styles = useStyles();
  const sources = useMemo(() => allSources(), []);
  return (
    <View style={styles.sourceCard}>
      <Text style={styles.sourceTitle} accessibilityRole="header">
        Bu ekrandaki kaynaklar ({sources.length})
      </Text>
      {sources.map((s, i) => (
        <Text key={s.doi} style={styles.sourceItem}>
          {i + 1}. {s.citation} · doi:{s.doi}
        </Text>
      ))}
      <Text style={styles.sourceFine}>
        Künyeler PubMed kayıtlarından alınmıştır. Rejimler ilgili çalışmaların kendi hasta
        gruplarında kullandığı dozlardır; kurumunuzun protokolünün yerine geçmez.
      </Text>
    </View>
  );
}

function RegimenCard({ regimen }: { regimen: CatheterRegimen }) {
  const colors = useColors();
  const styles = useStyles();
  const technique = techniqueById(regimen.techniqueId);
  if (!technique) return null;

  const basal = regimen.basalMlPerHour;

  return (
    <View style={styles.card}>
      <Link href={{ pathname: "/technique/[id]", params: { id: technique.id } }} asChild>
        <Pressable accessibilityRole="link" accessibilityLabel={`${technique.name} sayfası`}>
          <View style={styles.cardHead}>
            <Text style={styles.cardName}>{technique.name}</Text>
            <Ionicons name="chevron-forward" size={14} color={colors.textFaint} />
          </View>
        </Pressable>
      </Link>
      <View style={styles.figures}>
        {basal ? (
          <Figure
            label={regimen.perSide ? "Bazal / taraf" : "Bazal"}
            value={basal[0] === basal[1] ? `${basal[0]}` : `${basal[0]}–${basal[1]}`}
            unit="mL/sa"
          />
        ) : null}
        <Figure label="Konsantrasyon" value={`%${regimen.concentrationPercent}`} unit="" />
        {regimen.intermittentBolus ? (
          <Figure
            label="Aralıklı bolus"
            value={`${regimen.intermittentBolus.ml}`}
            unit={`mL / ${regimen.intermittentBolus.everyHours} sa`}
          />
        ) : null}
        {regimen.bolusMl !== undefined ? (
          <Figure label="Hasta bolusu" value={`${regimen.bolusMl}`} unit="mL" />
        ) : null}
        {regimen.lockoutMin !== undefined ? (
          <Figure label="Kilit" value={`${regimen.lockoutMin}`} unit="dk" />
        ) : null}
      </View>
      <Text style={styles.cardNote}>{regimen.note}</Text>
      {regimen.sources.map((s) => (
        <SourceLine key={s.doi} source={s} />
      ))}
    </View>
  );
}

function Figure({ label, value, unit }: { label: string; value: string; unit: string }) {
  const styles = useStyles();
  return (
    <View style={styles.figure}>
      <Text style={styles.figureLabel}>{label}</Text>
      <Text style={styles.figureValue}>
        {value}
        {unit ? <Text style={styles.figureUnit}> {unit}</Text> : null}
      </Text>
    </View>
  );
}

const DEFAULT_RATE = "8";
const DEFAULT_CONC = "0.2";

/**
 * mL/sa → mg/sa → mg/kg/sa.
 *
 * Hiçbir sınırla karşılaştırmıyor, çünkü karşılaştırılacak yayımlanmış bir
 * sınır yok. Yaptığı tek şey, klinikte ayarlanan sayıyı (mL/sa) toksisiteyi
 * belirleyen birime (mg) çevirmek — böylece konsantrasyonu iki katına
 * çıkarmanın ne demek olduğu görünür oluyor.
 */
function InfusionCalculator() {
  const styles = useStyles();
  const [patient] = usePatient();
  const [rate, setRate] = useState(DEFAULT_RATE);
  const [conc, setConc] = useState(DEFAULT_CONC);

  const mlPerHour = Number(rate.replace(",", "."));
  const concentration = Number(conc.replace(",", "."));
  const valid =
    Number.isFinite(mlPerHour) &&
    mlPerHour > 0 &&
    Number.isFinite(concentration) &&
    concentration > 0;

  const load = useMemo(
    () =>
      valid
        ? infusionLoad(
            mlPerHour,
            concentration,
            patient.hasWeight ? patient.weightKg : undefined
          )
        : undefined,
    [valid, mlPerHour, concentration, patient.hasWeight, patient.weightKg]
  );

  return (
    <View style={styles.calc}>
      <View style={styles.calcRow}>
        <View style={styles.calcField}>
          <Text style={styles.calcLabel}>Hız</Text>
          <TextInput
            value={rate}
            onChangeText={setRate}
            keyboardType="decimal-pad"
            style={styles.calcInput}
            accessibilityLabel="İnfüzyon hızı, mililitre bölü saat"
          />
          <Text style={styles.calcUnit}>mL/sa</Text>
        </View>
        <View style={styles.calcField}>
          <Text style={styles.calcLabel}>Konsantrasyon</Text>
          <TextInput
            value={conc}
            onChangeText={setConc}
            keyboardType="decimal-pad"
            style={styles.calcInput}
            accessibilityLabel="Konsantrasyon, yüzde"
          />
          <Text style={styles.calcUnit}>%</Text>
        </View>
      </View>

      {load ? (
        <>
          <View style={styles.resultRow}>
            <Result label="Saatlik" value={`${Math.round(load.mgPerHour)} mg`} />
            <Result label="24 saatte" value={`${Math.round(load.mgPer24h)} mg`} />
            <Result
              label="mg/kg/sa"
              value={
                load.mgPerKgPerHour !== undefined
                  ? load.mgPerKgPerHour.toFixed(2)
                  : "kilo girin"
              }
            />
          </View>
          <Text style={styles.verdict}>
            Bu sayılar yalnızca birim çevrimidir. Karşılaştırılacak yayımlanmış bir
            erişkin mg/kg/saat tavanı yoktur — aşağıya bakın.
          </Text>
        </>
      ) : (
        <Text style={styles.verdict}>Hız ve konsantrasyon girin.</Text>
      )}

      {patient.band.pediatric ? (
        <Text style={styles.calcWarn}>{PEDIATRIC_INFUSION_REDIRECT}</Text>
      ) : null}
    </View>
  );
}

function Result({ label, value }: { label: string; value: string }) {
  const styles = useStyles();
  return (
    <View style={styles.result}>
      <Text style={styles.resultLabel}>{label}</Text>
      <Text style={styles.resultValue}>{value}</Text>
    </View>
  );
}

const useStyles = makeStyles((colors) => ({
  content: { padding: spacing.lg, gap: spacing.md },
  intro: { ...type.bodySm, color: colors.text, lineHeight: 19 },
  rationale: { ...type.caption, color: colors.textMuted, lineHeight: 16 },
  section: { gap: spacing.sm },
  sectionTitle: { ...type.heading, color: colors.text, marginTop: spacing.sm },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: 6,
  },
  cardHead: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  cardName: { ...type.subheading, color: colors.text, flex: 1 },
  figures: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  figure: {
    backgroundColor: colors.background,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
    minWidth: 74,
  },
  figureLabel: { fontSize: 9.5, color: colors.textFaint, textTransform: "uppercase" },
  figureValue: { ...type.subheading, ...numeric, color: colors.text },
  figureUnit: { ...type.caption, fontWeight: "400", color: colors.textFaint },
  cardNote: { ...type.caption, color: colors.textMuted, lineHeight: 16 },
  source: { fontSize: 9.5, color: colors.textFaint, lineHeight: 13 },

  calc: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.sm,
  },
  calcRow: { flexDirection: "row", gap: spacing.sm },
  calcField: { flex: 1, minWidth: 0, gap: 3 },
  calcLabel: { ...type.label, color: colors.textFaint },
  calcInput: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    fontSize: 15,
    color: colors.text,
  },
  calcUnit: { ...type.caption, color: colors.textFaint },
  resultRow: { flexDirection: "row", gap: spacing.sm },
  result: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    gap: 1,
  },
  resultLabel: { fontSize: 9.5, color: colors.textFaint, textTransform: "uppercase" },
  resultValue: { ...type.subheading, ...numeric, color: colors.text },
  verdict: { ...type.caption, color: colors.textMuted, lineHeight: 16 },
  calcWarn: { ...type.caption, color: colors.warning, lineHeight: 16 },

  evidenceCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.sm,
  },
  evidenceRow: { gap: 3 },
  evidenceClaim: { ...type.caption, color: colors.text, lineHeight: 17 },

  limitCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: 6,
  },
  limitTitle: { ...type.subheading, color: colors.text },
  limitBody: { ...type.caption, color: colors.textMuted, lineHeight: 17 },
  pedRedirect: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 5,
    backgroundColor: colors.warningBg,
    borderRadius: radius.sm,
    padding: spacing.sm,
  },
  pedRedirectText: { ...type.caption, color: colors.text, lineHeight: 16, flex: 1 },

  sourceCard: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: 5,
    marginTop: spacing.sm,
  },
  sourceTitle: { ...type.label, color: colors.textMuted },
  sourceItem: { fontSize: 10, color: colors.textMuted, lineHeight: 14 },
  sourceFine: {
    fontSize: 10,
    color: colors.textFaint,
    lineHeight: 14,
    fontStyle: "italic",
    marginTop: 3,
  },
}));
