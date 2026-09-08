import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Text, View } from "react-native";

import {
  FIXED_DOSE_THRESHOLD_KG,
  LIPID_RULES,
  RESUSCITATION_NOTES,
  lipidPlan,
} from "@/data/last-dosing";
import { colors, numeric, radius, spacing, type } from "@/theme";
import { usePatient } from "@/utils/patient";

/**
 * Kiloya göre lipid emülsiyonu dozları.
 *
 * Hasta çubuğu uygulamanın geri kalanıyla ortak olduğu için, doz sayfasında
 * ağırlık girildiyse burada da hazır bekler — krizde ikinci kez veri girmek
 * gerekmez.
 */
export function LastDoseCalculator() {
  const [patient] = usePatient();
  const plan = patient.hasWeight ? lipidPlan(patient.weightKg) : undefined;

  return (
    <View style={styles.card}>
      <View style={styles.head}>
        <Ionicons name="water-outline" size={15} color={colors.danger} />
        <Text style={styles.title}>%20 Lipid Emülsiyonu</Text>
        {patient.hasWeight ? (
          <Text style={styles.weight}>{patient.weightInput} kg</Text>
        ) : null}
      </View>

      {plan ? (
        <>
          <View style={styles.steps}>
            {plan.steps.map((step, index) => (
              <View key={step.label} style={styles.step}>
                <View style={styles.stepIndex}>
                  <Text style={styles.stepIndexText}>{index + 1}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <View style={styles.stepHead}>
                    <Text style={styles.stepLabel}>{step.label}</Text>
                    <Text style={styles.stepValue}>{step.value}</Text>
                  </View>
                  <Text style={styles.stepDetail}>{step.detail}</Text>
                </View>
              </View>
            ))}
          </View>
          <Text style={styles.ceiling}>
            İlk 30 dakikada toplam tavan:{" "}
            <Text style={styles.ceilingValue}>{Math.round(plan.ceilingMl)} mL</Text> (12 mL/kg)
          </Text>
          <Text style={styles.rule}>
            {plan.rule === "fixed"
              ? `${FIXED_DOSE_THRESHOLD_KG} kg ve üzerinde kontrol listesi sabit hacim verir; bölünmüş hesap yapılmaz.`
              : `${FIXED_DOSE_THRESHOLD_KG} kg altında dozlar mL/kg üzerinden hesaplanır.`}
          </Text>
        </>
      ) : (
        <Text style={styles.empty}>
          Doz hesabı için hasta ağırlığını girin. Ağırlıksız kural:{" "}
          <Text style={styles.bold}>1,5 mL/kg bolus</Text>, ardından{" "}
          <Text style={styles.bold}>0,25 mL/kg/dk infüzyon</Text>; 70 kg üstünde 100 mL bolus ve
          15–20 dakikada 200–250 mL.
        </Text>
      )}

      <View style={styles.rules}>
        {LIPID_RULES.map((rule) => (
          <Text key={rule} style={styles.ruleItem}>
            •  {rule}
          </Text>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Resüsitasyonun farkları</Text>
      <View style={styles.notes}>
        {RESUSCITATION_NOTES.map((note) => (
          <View key={note.title} style={[styles.note, note.avoid && styles.noteAvoid]}>
            <Ionicons
              name={note.avoid ? "close-circle" : "information-circle-outline"}
              size={13}
              color={note.avoid ? colors.danger : colors.textMuted}
            />
            <View style={{ flex: 1 }}>
              <Text style={[styles.noteTitle, note.avoid && styles.noteTitleAvoid]}>
                {note.title}
              </Text>
              <Text style={styles.noteDetail}>
                {patient.hasWeight && note.weightAware
                  ? note.weightAware(patient.weightKg)
                  : note.detail}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.dangerBorder,
    padding: spacing.md,
    gap: spacing.sm,
  },
  head: { flexDirection: "row", alignItems: "center", gap: 6 },
  title: { ...type.heading, color: colors.danger, flex: 1 },
  weight: { ...type.caption, ...numeric, color: colors.textMuted, fontWeight: "700" },
  steps: { gap: 6 },
  step: { flexDirection: "row", gap: spacing.sm, alignItems: "flex-start" },
  stepIndex: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.dangerBg,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
  },
  stepIndexText: { fontSize: 10, fontWeight: "800", color: colors.danger },
  stepHead: { flexDirection: "row", alignItems: "baseline", gap: spacing.sm, flexWrap: "wrap" },
  stepLabel: { ...type.subheading, color: colors.text },
  stepValue: { ...type.subheading, ...numeric, color: colors.danger },
  stepDetail: { ...type.caption, color: colors.textMuted, lineHeight: 16 },
  ceiling: { ...type.bodySm, color: colors.text },
  ceilingValue: { ...numeric, fontWeight: "700", color: colors.danger },
  rule: { ...type.caption, color: colors.textFaint, fontStyle: "italic" },
  empty: { ...type.bodySm, color: colors.textMuted, lineHeight: 19 },
  bold: { fontWeight: "700", color: colors.text },
  rules: { gap: 3, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: spacing.sm },
  ruleItem: { ...type.caption, color: colors.textMuted, lineHeight: 16 },
  sectionTitle: { ...type.subheading, color: colors.text, marginTop: 2 },
  notes: { gap: 6 },
  note: { flexDirection: "row", gap: 6, alignItems: "flex-start" },
  noteAvoid: {
    backgroundColor: colors.dangerBg,
    borderRadius: radius.sm,
    padding: 6,
    marginHorizontal: -6,
  },
  noteTitle: { ...type.subheading, fontSize: 12.5, color: colors.text },
  noteTitleAvoid: { color: colors.danger },
  noteDetail: { ...type.caption, color: colors.textMuted, lineHeight: 16 },
});
