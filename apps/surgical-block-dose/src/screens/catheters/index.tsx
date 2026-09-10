import Ionicons from "@expo/vector-icons/Ionicons";
import { Link } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { DisclaimerBanner } from "@/components/disclaimer-banner";
import { PatientBar } from "@/components/patient-bar";
import {
  ADULT_INFUSION_LIMITS,
  CATHETER_REGIMENS,
  CATHETER_ROUTES,
  CatheterRegimen,
  INFUSION_ACCUMULATION_NOTE,
  INFUSION_CONCENTRATION_RATIONALE,
  PEDIATRIC_INFUSION_REDIRECT,
  infusionLoad,
} from "@/data/infusion";
import { techniqueById } from "@/data/techniques";
import { makeStyles, numeric, radius, spacing, type, useColors } from "@/theme";
import { usePatient, weightLabel } from "@/utils/patient";

/**
 * Kateterler tek ekranda.
 *
 * Blok kartındaki panel "bu bloğa kateter konur mu" sorusunu yanıtlıyor;
 * burada sorulan tersi: "kateter koyacağım, hangi bloğa?". Karar çoğu zaman
 * girişimden önce, hasta henüz ameliyathaneye girmeden verilir ve o anda
 * elde bir blok adı yoktur.
 *
 * Ekranın altındaki hesaplayıcı, mL/sa ile mg/kg/sa arasındaki çevrimi
 * yapıyor. Klinikte ayarlanan sayı mL/sa'tir, sınır ise mg/kg/saat cinsinden
 * yayımlanır; ikisini kafadan çevirmek gerektiği için sınırın nerede olduğu
 * pratikte hiç bakılmayan bir şeye dönüşüyor.
 */
export function Catheters() {
  const colors = useColors();
  const styles = useStyles();
  const insets = useSafeAreaInsets();
  const [patient] = usePatient();

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + spacing.xl }]}
    >
      <DisclaimerBanner />

      <Text style={styles.intro}>
        Sürekli kateter için yaygın rejimler. Uluslararası kabul görmüş tek bir doz tablosu
        yoktur; aşağıdakiler yaygın öğretim aralıklarıdır ve kurumdan kuruma değişir.
      </Text>
      <Text style={styles.rationale}>{INFUSION_CONCENTRATION_RATIONALE}</Text>

      <PatientBar />

      {CATHETER_ROUTES.map((route) => {
        const rows = CATHETER_REGIMENS.filter((r) => r.route === route.id);
        if (rows.length === 0) return null;
        return (
          <View key={route.id} style={styles.section}>
            <Text style={styles.sectionTitle}>{route.label}</Text>
            {rows.map((r) => (
              <RegimenCard key={r.techniqueId} regimen={r} />
            ))}
          </View>
        );
      })}

      <Text style={styles.sectionTitle}>İnfüzyon hızı hesaplayıcı</Text>
      <InfusionCalculator />

      <View style={styles.limitCard}>
        <Text style={styles.limitTitle}>Erişkin sürekli infüzyon üst sınırları</Text>
        {ADULT_INFUSION_LIMITS.map((l) => (
          <View key={l.drug} style={styles.limitRow}>
            <Text style={styles.limitDrug}>{l.drug}</Text>
            <Text style={styles.limitValue}>{l.mgPerKgPerHour} mg/kg/sa</Text>
            <Text style={styles.limitNote}>{l.note}</Text>
          </View>
        ))}
        <Text style={styles.limitFine}>
          Tek atım mg/kg tavanı bir bolusun tepe düzeyi içindir ve infüzyonu yönetmez; bu iki sayı
          birbirinin yerine kullanılamaz.
        </Text>
        {patient.band.pediatric ? (
          <View style={styles.pedRedirect}>
            <Ionicons name="alert-circle-outline" size={14} color={colors.warning} />
            <Text style={styles.pedRedirectText}>{PEDIATRIC_INFUSION_REDIRECT}</Text>
          </View>
        ) : null}
      </View>

      <Text style={styles.accumulation}>{INFUSION_ACCUMULATION_NOTE}</Text>
    </ScrollView>
  );
}

function RegimenCard({ regimen }: { regimen: CatheterRegimen }) {
  const colors = useColors();
  const styles = useStyles();
  const technique = techniqueById(regimen.techniqueId);
  if (!technique) return null;

  return (
    <Link
      href={{ pathname: "/technique/[id]", params: { id: technique.id } }}
      asChild
    >
      <Pressable>
        <View style={styles.card}>
          <View style={styles.cardHead}>
            <Text style={styles.cardName}>{technique.name}</Text>
            <Ionicons name="chevron-forward" size={14} color={colors.textFaint} />
          </View>
          <View style={styles.figures}>
            <Figure label="Bazal" value={`${regimen.basalMlPerHour[0]}–${regimen.basalMlPerHour[1]}`} unit="mL/sa" />
            <Figure label="Konsantrasyon" value={`%${regimen.concentrationPercent}`} unit="" />
            {regimen.bolusMl !== undefined ? (
              <Figure label="Bolus" value={`${regimen.bolusMl}`} unit="mL" />
            ) : null}
            {regimen.lockoutMin !== undefined ? (
              <Figure label="Kilit" value={`${regimen.lockoutMin}`} unit="dk" />
            ) : null}
          </View>
          <Text style={styles.cardNote}>{regimen.note}</Text>
        </View>
      </Pressable>
    </Link>
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
 * Hız ve konsantrasyon ayrı ayrı girilir, çünkü klinikte değiştirilen de bu
 * ikisidir: aynı mg yükü hem "%0.2 ile 8 mL/sa" hem de "%0.1 ile 16 mL/sa"
 * ile elde edilir ve fasya planı bloklarında ikincisi daha iyi yayılır.
 */
function InfusionCalculator() {
  const colors = useColors();
  const styles = useStyles();
  const [patient] = usePatient();
  const [rate, setRate] = useState(DEFAULT_RATE);
  const [conc, setConc] = useState(DEFAULT_CONC);
  const [drug, setDrug] = useState(ADULT_INFUSION_LIMITS[0].drug);

  const mlPerHour = Number(rate.replace(",", "."));
  const concentration = Number(conc.replace(",", "."));
  const valid =
    Number.isFinite(mlPerHour) && mlPerHour > 0 && Number.isFinite(concentration) && concentration > 0;

  const load = useMemo(
    () =>
      valid
        ? infusionLoad(
            mlPerHour,
            concentration,
            drug,
            patient.hasWeight ? patient.weightKg : undefined
          )
        : undefined,
    [valid, mlPerHour, concentration, drug, patient.hasWeight, patient.weightKg]
  );

  const over = load?.fraction !== undefined && load.fraction > 1;
  const near = load?.fraction !== undefined && load.fraction > 0.75 && !over;

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

      <View style={styles.drugRow}>
        {ADULT_INFUSION_LIMITS.map((l) => {
          const on = l.drug === drug;
          return (
            <Pressable
              key={l.drug}
              onPress={() => setDrug(l.drug)}
              accessibilityRole="radio"
              accessibilityState={{ selected: on }}
            >
              <View style={[styles.drugChip, on && styles.drugChipOn]}>
                <Text style={[styles.drugChipText, on && styles.drugChipTextOn]}>{l.drug}</Text>
              </View>
            </Pressable>
          );
        })}
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
              tone={over ? "over" : near ? "near" : undefined}
            />
          </View>
          {load.fraction !== undefined && load.limit ? (
            <Text style={[styles.verdict, over && styles.verdictOver, near && styles.verdictNear]}>
              {over
                ? `Erişkin sınırı ${load.limit.mgPerKgPerHour} mg/kg/sa aşılıyor — kullanılan oran %${Math.round(load.fraction * 100)}. Hızı düşürün ya da daha seyreltik solüsyon kullanın.`
                : near
                  ? `Erişkin sınırına göre %${Math.round(load.fraction * 100)}. Karaciğer/böbrek yetmezliği ya da 48 saati aşan infüzyon planlanıyorsa daha aşağıda kalın.`
                  : `Erişkin sınırına göre %${Math.round(load.fraction * 100)} — ${weightLabel(patient)} üzerinden.`}
            </Text>
          ) : (
            <Text style={styles.verdict}>
              mg/kg karşılığı için hasta ağırlığı gerekir; yukarıdaki hasta çubuğundan girin.
            </Text>
          )}
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

function Result({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "over" | "near";
}) {
  const styles = useStyles();
  return (
    <View style={styles.result}>
      <Text style={styles.resultLabel}>{label}</Text>
      <Text
        style={[
          styles.resultValue,
          tone === "over" && styles.resultOver,
          tone === "near" && styles.resultNear,
        ]}
      >
        {value}
      </Text>
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
  drugRow: { flexDirection: "row", flexWrap: "wrap", gap: 5 },
  drugChip: {
    backgroundColor: colors.chip,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
  },
  drugChipOn: { backgroundColor: colors.primary },
  drugChipText: { fontSize: 12, color: colors.text },
  drugChipTextOn: { color: colors.onPrimary, fontWeight: "700" },
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
  resultOver: { color: colors.danger },
  resultNear: { color: colors.warning },
  verdict: { ...type.caption, color: colors.textMuted, lineHeight: 16 },
  verdictNear: { color: colors.warning },
  verdictOver: { color: colors.danger, fontWeight: "700" },
  calcWarn: { ...type.caption, color: colors.warning, lineHeight: 16 },

  limitCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: 6,
  },
  limitTitle: { ...type.subheading, color: colors.text },
  limitRow: { gap: 1, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 6 },
  limitDrug: { ...type.bodySm, fontWeight: "700", color: colors.text },
  limitValue: { ...type.subheading, ...numeric, color: colors.primaryStrong },
  limitNote: { ...type.caption, color: colors.textMuted, lineHeight: 16 },
  limitFine: { fontSize: 10, color: colors.textFaint, lineHeight: 14, fontStyle: "italic" },
  pedRedirect: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 5,
    backgroundColor: colors.warningBg,
    borderRadius: radius.sm,
    padding: spacing.sm,
  },
  pedRedirectText: { ...type.caption, color: colors.text, lineHeight: 16, flex: 1 },
  accumulation: { ...type.caption, color: colors.textMuted, lineHeight: 17 },
}));
