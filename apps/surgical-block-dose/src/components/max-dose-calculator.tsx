import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";

import { ceilingMg } from "@/data/age-dosing";
import { findMaxDose } from "@/data/max-doses";
import { BlockOption, DrugMaxDose } from "@/data/types";
import { colors, numeric, radius, spacing, type } from "@/theme";
import { usePatient } from "@/utils/patient";

/**
 * The drugs in play, one row each.
 *
 * Catalogue names carry the concentration ("Ropivakain %0.2", "Ropivakain
 * %0.5"), so de-duplicating the raw strings leaves several entries that all
 * resolve to the same ceiling and render as identical repeated rows. A maximum
 * is a property of the drug, not of the dilution, so the de-duplication has to
 * happen after the lookup.
 */
function uniqueMaxDoses(blocks: BlockOption[]): DrugMaxDose[] {
  const byDrug = new Map<string, DrugMaxDose>();
  for (const block of blocks) {
    for (const a of block.anesthetics) {
      const maxDose = findMaxDose(a.drug);
      if (maxDose) byDrug.set(maxDose.drug, maxDose);
    }
  }
  return Array.from(byDrug.values());
}

/**
 * Ceilings for the drugs this surgery's blocks use, for the patient set in the
 * bar above.
 *
 * This used to hold its own weight field and no age band at all, which meant it
 * answered a paediatric question with adult limits — the exact figure the rest
 * of the app now warns against. It reads the shared patient instead, so one
 * weight drives every screen and the age adjustment cannot be skipped by
 * arriving here first.
 */
export function MaxDoseCalculator({ blocks }: { blocks: BlockOption[] }) {
  const [patient] = usePatient();
  const maxDoses = useMemo(() => uniqueMaxDoses(blocks), [blocks]);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Ağırlığa Göre Maksimum Doz Sınırı</Text>
      <Text style={styles.subtitle}>
        Genel referans sınırlardır (mg/kg), kurum protokolü ve prospektüsle doğrulanmalıdır.
      </Text>

      {!patient.hasWeight ? (
        <Text style={styles.hint}>
          Hesaplama için yukarıdaki hasta çubuğuna ağırlık girin.
        </Text>
      ) : (
        <View style={styles.results}>
          {maxDoses.map((maxDose) => {
            const plain = ceilingMg(maxDose, patient.weightKg, patient.band, false);
            const withEpi = maxDose.withEpiMgPerKg
              ? ceilingMg(maxDose, patient.weightKg, patient.band, true)
              : undefined;
            return (
              <View key={maxDose.drug} style={styles.row}>
                <Text style={styles.drug}>{maxDose.drug}</Text>
                <Text style={styles.dose}>
                  Epinefrinsiz maks:{" "}
                  <Text style={styles.doseNum}>≈{plain.toFixed(0)} mg</Text> ({maxDose.plainMgPerKg}{" "}
                  mg/kg)
                </Text>
                {withEpi !== undefined ? (
                  <Text style={styles.dose}>
                    Epinefrinli maks:{" "}
                    <Text style={styles.doseNum}>≈{withEpi.toFixed(0)} mg</Text> (
                    {maxDose.withEpiMgPerKg} mg/kg)
                  </Text>
                ) : null}
              </View>
            );
          })}

          {patient.band.modifier !== 1 ? (
            <Text style={styles.bandNote}>
              {patient.band.label} için mg/kg sınırı ×{patient.band.modifier} ölçeklendi. Bu katsayı
              kılavuz değil, uygulamanın ihtiyatlı kuralıdır.
            </Text>
          ) : null}

          {patient.band.pediatric ? (
            <Text style={styles.pedNote}>
              Pediatrik hastada kılavuzlar sınırı ilaç başına değil{" "}
              <Text style={styles.bold}>blok tipi başına</Text> koyar; yukarıdaki tek sayı bunun
              yerine geçmez. Blok bazında kaynaklı sınırlar için Kombinasyon Oluşturucu'yu veya
              Pediatrik Doz ekranını kullanın.
            </Text>
          ) : null}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  title: { ...type.heading, color: colors.text },
  subtitle: { ...type.caption, color: colors.textMuted },
  hint: { ...type.bodySm, color: colors.textMuted },
  results: { gap: spacing.sm, marginTop: spacing.xs },
  row: {
    backgroundColor: colors.background,
    borderRadius: radius.sm,
    padding: spacing.sm,
    gap: 2,
  },
  drug: { ...type.subheading, color: colors.text },
  dose: { ...type.bodySm, fontSize: 12.5, color: colors.textMuted },
  doseNum: { ...numeric, fontWeight: "700", color: colors.text },
  bold: { fontWeight: "700" },
  bandNote: { ...type.caption, color: colors.warning, lineHeight: 16 },
  pedNote: { ...type.caption, color: colors.warning, lineHeight: 16 },
});
